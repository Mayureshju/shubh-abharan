import Link from "next/link";
import { connectDb } from "@/lib/db/connect";
import { OrderModel } from "@/lib/db/models";
import { requireCustomer } from "@/lib/auth/roles";
import { formatMoney } from "@/lib/catalog/money";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const user = await requireCustomer();
  await connectDb();
  const orders = await OrderModel.find({ clerkUserId: user.id }).sort({ createdAt: -1 }).lean();

  return (
    <section className="page-gutter py-tight">
      <p className="text-caption uppercase tracking-[0.22em] text-accent">Account</p>
      <h1 className="mt-3 text-title">Orders</h1>
      {orders.length === 0 ? (
        <p className="mt-tight text-body text-muted">No orders yet.</p>
      ) : (
        <ul className="mt-tight divide-y divide-line">
          {orders.map((order) => (
            <li key={String(order._id)} className="py-6">
              <Link href={`/account/orders/${String(order._id)}`} className="hover:underline">
                <p className="text-body">
                  {formatMoney({ amount: order.pricing.total, currency: "INR" })} · {order.status}
                </p>
                <p className="mt-1 text-caption uppercase text-muted">
                  {order.lines.length} {order.lines.length === 1 ? "piece" : "pieces"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
