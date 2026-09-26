"use server";

import { revalidatePath } from "next/cache";
import { connectDb } from "@/lib/db/connect";
import { OrderModel } from "@/lib/db/models";
import { requireAdmin } from "@/lib/auth/roles";
import { ORDER_NEXT } from "@/lib/commerce/order-status";

export async function setOrderStatus(orderId: string, status: string) {
  await requireAdmin();
  await connectDb();
  const order = await OrderModel.findById(orderId);
  if (!order) return { ok: false, error: "Order not found." };
  const allowed = ORDER_NEXT[order.status] ?? [];
  if (!allowed.includes(status)) return { ok: false, error: "That status change is not allowed." };
  order.status = status;
  order.timeline.push({ status, at: new Date() });
  await order.save();
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/reports");
  return { ok: true };
}
