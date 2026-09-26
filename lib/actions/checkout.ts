"use server";

import { createHmac, timingSafeEqual } from "node:crypto";
import Razorpay from "razorpay";
import { connectDb } from "@/lib/db/connect";
import { CouponModel, OrderModel, SettingsModel, UserModel } from "@/lib/db/models";
import { requireCustomer, roleFromMetadata, type SessionUser } from "@/lib/auth/roles";
import { quoteCart, type CartLineInput } from "@/lib/commerce/quote";
import { toPlain } from "@/lib/plain";

export type AddressInput = {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
};

function razorpay() {
  const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) return null;
  return new Razorpay({ key_id, key_secret });
}

function addressError(address: AddressInput): string | null {
  if (!address.name.trim()) return "Enter a name.";
  if (!address.phone.trim()) return "Enter a phone number.";
  if (!address.line1.trim()) return "Enter an address.";
  if (!address.city.trim()) return "Enter a city.";
  if (!address.state.trim()) return "Enter a state.";
  if (!address.pincode.trim()) return "Enter a pincode.";
  return null;
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

export async function placeRazorpayOrder(input: {
  lines: CartLineInput[];
  address: AddressInput;
  couponCode?: string;
}) {
  const invalid = addressError(input.address);
  if (invalid) return { ok: false as const, error: invalid };
  const user = await requireCustomer();
  await upsertUser(user);
  const quote = await quoteCart(input.lines, {
    couponCode: input.couponCode,
    pincode: input.address.pincode,
    clerkUserId: user.id,
  });
  if (!quote.ok) return { ok: false as const, error: quote.error ?? "Quote failed." };
  if (!quote.deliveryAreaName) {
    return { ok: false as const, error: "This pincode is not in a served delivery area." };
  }
  const client = razorpay();
  if (!client || !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
    return { ok: false as const, error: "Razorpay keys are not configured." };
  }

  const order = await OrderModel.create({
    clerkUserId: user.id,
    email: user.primaryEmailAddress?.emailAddress,
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
    shippingAddress: input.address,
    deliveryAreaName: quote.deliveryAreaName,
    payment: { method: "razorpay", status: "created" },
    status: "pending_payment",
    timeline: [{ status: "pending_payment", at: new Date() }],
  });

  const rzpOrder = await client.orders.create({
    amount: quote.total,
    currency: "INR",
    receipt: String(order._id),
    notes: { orderId: String(order._id) },
  });

  order.payment.razorpayOrderId = rzpOrder.id;
  await order.save();

  return toPlain({
    ok: true as const,
    orderId: String(order._id),
    razorpayOrderId: rzpOrder.id,
    amount: quote.total,
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    name: user.fullName ?? "Order",
    email: user.primaryEmailAddress?.emailAddress ?? null,
  });
}

export async function placeCodOrder(input: {
  lines: CartLineInput[];
  address: AddressInput;
  couponCode?: string;
}) {
  const invalid = addressError(input.address);
  if (invalid) return { ok: false as const, error: invalid };
  const user = await requireCustomer();
  await upsertUser(user);
  await connectDb();
  const settings = await SettingsModel.findOne({ key: "store" }).lean();
  if (!settings?.codEnabled) return { ok: false as const, error: "Cash on delivery is not offered." };

  const quote = await quoteCart(input.lines, {
    couponCode: input.couponCode,
    pincode: input.address.pincode,
    clerkUserId: user.id,
  });
  if (!quote.ok) return { ok: false as const, error: quote.error ?? "Quote failed." };
  if (!quote.deliveryAreaName) {
    return { ok: false as const, error: "This pincode is not in a served delivery area." };
  }

  const order = await OrderModel.create({
    clerkUserId: user.id,
    email: user.primaryEmailAddress?.emailAddress,
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
    shippingAddress: input.address,
    deliveryAreaName: quote.deliveryAreaName,
    payment: { method: "cod", status: "pending_collection" },
    status: "paid",
    timeline: [{ status: "paid", at: new Date() }],
  });

  if (quote.couponCode) {
    await CouponModel.updateOne({ code: quote.couponCode }, { $inc: { usedCount: 1 } });
  }

  return toPlain({ ok: true as const, orderId: String(order._id) });
}

function validCheckoutSignature(orderId: string, paymentId: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const expected = createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function markRazorpayVerified(input: {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const user = await requireCustomer();
  if (!validCheckoutSignature(input.razorpayOrderId, input.razorpayPaymentId, input.razorpaySignature)) {
    return { ok: false as const, error: "Payment signature did not match." };
  }
  await connectDb();
  const order = await OrderModel.findOne({ _id: input.orderId, clerkUserId: user.id });
  if (!order || order.payment.method !== "razorpay") return { ok: false as const, error: "Order not found." };
  if (order.payment.razorpayOrderId !== input.razorpayOrderId) {
    return { ok: false as const, error: "Order mismatch." };
  }
  order.payment.razorpayPaymentId = input.razorpayPaymentId;
  order.payment.status = "authorized";
  await order.save();
  return { ok: true as const };
}
