"use server";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { isValidObjectId } from "mongoose";
import Razorpay from "razorpay";
import { connectDb } from "@/lib/db/connect";
import { CouponModel, OrderModel, SettingsModel, UserModel } from "@/lib/db/models";
import { getSessionUser, roleFromMetadata, type SessionUser } from "@/lib/auth/roles";
import { quoteCart, type CartLineInput } from "@/lib/commerce/quote";
import {
  checkoutDetailsSchema,
  fieldErrors,
  type CheckoutDetailsInput,
} from "@/lib/commerce/checkout-schema";

/**
 * Order placement for guests and signed-in customers — see
 * commerce/cart-checkout. A session is optional: when present the order is
 * linked to it; either way the order gets a secret token, and the customer is
 * sent to /order/[id]?t=<token>.
 */

export type PlaceOrderResult =
  | { ok: false; error: string; fieldErrors?: Record<string, string> }
  | { ok: true; method: "cod"; confirmUrl: string }
  | {
      ok: true;
      method: "razorpay";
      confirmUrl: string;
      orderId: string;
      razorpayOrderId: string;
      amount: number;
      key: string;
      email: string | null;
    };

function razorpay() {
  const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) return null;
  return new Razorpay({ key_id, key_secret });
}

async function upsertUser(user: SessionUser) {
  await connectDb();
  await UserModel.findOneAndUpdate(
    { clerkUserId: user.id },
    {
      $set: {
        clerkUserId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName ?? undefined,
        role: roleFromMetadata(user.publicMetadata),
      },
    },
    { upsert: true },
  );
}

export async function placeOrder(input: {
  method: "razorpay" | "cod";
  lines: CartLineInput[];
  details: CheckoutDetailsInput;
  couponCode?: string;
}): Promise<PlaceOrderResult> {
  const parsed = checkoutDetailsSchema.safeParse(input.details);
  if (!parsed.success) {
    return { ok: false, error: "Check the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };
  }
  const details = parsed.data;
  const cod = input.method === "cod";
  if (!cod && input.method !== "razorpay") return { ok: false, error: "Choose how to pay." };

  await connectDb();
  if (cod) {
    // Same default as the quote: COD is on unless settings switch it off.
    const settings = await SettingsModel.findOne({ key: "store" }).lean();
    if (settings?.codEnabled === false) return { ok: false, error: "Cash on delivery is not offered." };
  }
  const client = cod ? null : razorpay();
  if (!cod && (!client || !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)) {
    return { ok: false, error: "Online payment is not set up yet." };
  }

  const user = await getSessionUser();
  if (user) await upsertUser(user);

  const quote = await quoteCart(input.lines, {
    couponCode: input.couponCode,
    pincode: details.receiver.pincode,
    clerkUserId: user?.id,
  });
  if (quote.unservedPincode) {
    return {
      ok: false,
      error: "We don't deliver to this pincode yet.",
      fieldErrors: { "receiver.pincode": "We don't deliver to this pincode yet." },
    };
  }
  if (!quote.ok) return { ok: false, error: quote.error ?? "Could not price the order." };
  if (!quote.deliveryAreaName) return { ok: false, error: "This pincode is not in a served delivery area." };

  const accessToken = randomBytes(24).toString("base64url");
  const status = cod ? "paid" : "pending_payment";
  const order = await OrderModel.create({
    clerkUserId: user?.id,
    email: user?.primaryEmailAddress?.emailAddress,
    accessToken,
    lines: [...quote.lines],
    pricing: {
      subtotal: quote.subtotal,
      discount: quote.discount,
      shipping: quote.shipping,
      total: quote.total,
      currency: "INR",
      couponCode: quote.couponCode,
      shippingWaived: quote.shippingWaived,
    },
    billing: details.billing,
    shippingAddress: {
      name: details.receiver.name,
      phone: details.receiver.phone,
      line1: details.receiver.address,
      pincode: details.receiver.pincode,
    },
    giftMessage: details.giftMessage || undefined,
    deliveryAreaName: quote.deliveryAreaName,
    payment: cod
      ? { method: "cod", status: "pending_collection" }
      : { method: "razorpay", status: "created" },
    status,
    timeline: [{ status, at: new Date() }],
  });
  const orderId = String(order._id);
  const confirmUrl = `/order/${orderId}?t=${accessToken}`;

  if (cod) {
    if (quote.couponCode) {
      await CouponModel.updateOne({ code: quote.couponCode }, { $inc: { usedCount: 1 } });
    }
    return { ok: true, method: "cod", confirmUrl };
  }

  try {
    const rzpOrder = await client!.orders.create({
      amount: quote.total,
      currency: "INR",
      receipt: orderId,
      notes: { orderId },
    });
    order.payment.razorpayOrderId = rzpOrder.id;
    await order.save();
    return {
      ok: true,
      method: "razorpay",
      confirmUrl,
      orderId,
      razorpayOrderId: rzpOrder.id,
      amount: quote.total,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      email: user?.primaryEmailAddress?.emailAddress ?? null,
    };
  } catch {
    // ponytail: the pending order stays for admin to see; cleanup of
    // abandoned pending_payment orders is out of scope (design.md risks).
    return { ok: false, error: "Could not start the payment. Try again." };
  }
}

function validCheckoutSignature(orderId: string, paymentId: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const expected = createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Browser confirmation after Razorpay's handler. Needs no session: the HMAC
 * proves the payment belongs to this Razorpay order, and the order must carry
 * that Razorpay order id. The payment-captured webhook stays the source of
 * truth for `paid`; this never downgrades a status the webhook already set.
 */
export async function markRazorpayVerified(input: {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  if (!validCheckoutSignature(input.razorpayOrderId, input.razorpayPaymentId, input.razorpaySignature)) {
    return { ok: false as const, error: "Payment signature did not match." };
  }
  if (!isValidObjectId(input.orderId)) return { ok: false as const, error: "Order not found." };
  await connectDb();
  const order = await OrderModel.findOne({
    _id: input.orderId,
    "payment.razorpayOrderId": input.razorpayOrderId,
  });
  if (!order || order.payment.method !== "razorpay") return { ok: false as const, error: "Order not found." };
  if (order.payment.status === "created") {
    order.payment.razorpayPaymentId = input.razorpayPaymentId;
    order.payment.status = "authorized";
    await order.save();
  }
  return { ok: true as const };
}
