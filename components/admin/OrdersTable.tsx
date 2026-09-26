import Link from "next/link";
import type { OrderDoc } from "@/lib/db/models";
import { formatMoney } from "@/lib/catalog/money";
import { StatusPill } from "./StatusPill";

type OrderRow = OrderDoc & { createdAt?: Date };

export function orderNumber(id: unknown) {
  return `#${String(id).slice(-6).toUpperCase()}`;
}

export function OrdersTable({ orders }: { orders: OrderRow[] }) {
  return (
    <div className="admin-table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">Order</th>
            <th scope="col">Customer</th>
            <th scope="col">Date</th>
            <th scope="col" className="num">Items</th>
            <th scope="col" className="num">Total</th>
            <th scope="col">Payment</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={7} className="admin-empty">No orders found.</td>
            </tr>
          ) : (
            orders.map((order) => {
              const id = String(order._id);
              const items = order.lines.reduce((sum, line) => sum + line.quantity, 0);
              return (
                <tr key={id}>
                  <td>
                    <Link href={`/admin/orders/${id}`} className="admin-link">
                      {orderNumber(id)}
                    </Link>
                  </td>
                  <td>{order.shippingAddress?.name ?? order.email ?? "—"}</td>
                  <td className="admin-muted">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                      : "—"}
                  </td>
                  <td className="num">{items}</td>
                  <td className="num">
                    <strong>{formatMoney({ amount: order.pricing.total, currency: "INR" })}</strong>
                  </td>
                  <td>
                    <StatusPill
                      status={order.payment.status}
                      label={`${order.payment.method === "cod" ? "COD" : "Online"} · ${order.payment.status.replaceAll("_", " ")}`}
                    />
                  </td>
                  <td>
                    <StatusPill status={order.status} />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
