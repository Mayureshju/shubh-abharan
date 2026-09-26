import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db/connect";
import { CouponModel, OrderModel, ProcessedEventModel } from "@/lib/db/models";

function validSignature(raw: string, signature: string, secret: string): boolean {
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook secret missing" }, { status: 500 });
  const raw = Buffer.from(await request.arrayBuffer()).toString("utf8");
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  if (!validSignature(raw, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(raw) as {
    event?: string;
    payload?: { payment?: { entity?: { id?: string; order_id?: string; amount?: number } } };
  };
  const eventId = request.headers.get("x-razorpay-event-id") ?? event.payload?.payment?.entity?.id;
  if (!eventId) return NextResponse.json({ ok: true });

  await connectDb();
  const seen = await ProcessedEventModel.findOne({ eventId });
  if (seen) return NextResponse.json({ ok: true });

  if (event.event === "payment.captured") {
    const payment = event.payload?.payment?.entity;
    if (payment?.order_id) {
      const order = await OrderModel.findOne({ "payment.razorpayOrderId": payment.order_id });
      if (order && order.status === "pending_payment") {
        if (payment.amount != null && payment.amount !== order.pricing.total) {
          return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
        }
        order.status = "paid";
        order.payment.status = "captured";
        order.payment.razorpayPaymentId = payment.id;
        order.timeline.push({ status: "paid", at: new Date() });
        await order.save();
        if (order.pricing.couponCode) {
          await CouponModel.updateOne({ code: order.pricing.couponCode }, { $inc: { usedCount: 1 } });
        }
      }
    }
  }

  await ProcessedEventModel.create({ provider: "razorpay", eventId });
  return NextResponse.json({ ok: true });
}
