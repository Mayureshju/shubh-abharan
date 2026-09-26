import { notFound } from "next/navigation";
import { connectDb } from "@/lib/db/connect";
import { OrderModel } from "@/lib/db/models";
import { setOrderStatus } from "@/lib/actions/admin-orders";
import { nextStatuses } from "@/lib/commerce/order-status";
import { formatMoney } from "@/lib/catalog/money";
import { StatusPill } from "@/components/admin/StatusPill";
import { orderNumber } from "@/components/admin/OrdersTable";

const inr = (amount: number) => formatMoney({ amount, currency: "INR" });

export default async function AdminOrderDetail({
  params,
}: PageProps<"/admin/orders/[id]">) {
  await connectDb();
  const { id } = await params;
  const order = await OrderModel.findById(id).lean();
  if (!order) notFound();

  async function update(formData: FormData) {
    "use server";
    await setOrderStatus(id, String(formData.get("status")));
  }

  const address = order.shippingAddress;
  const next = nextStatuses(order.status);

  return (
    <>
      <header className="admin-head">
        <div>
          <h1>
            Order {orderNumber(order._id)} <StatusPill status={order.status} />
          </h1>
          <p className="admin-sub">
            {order.createdAt ? new Date(order.createdAt).toLocaleString("en-IN") : ""}
          </p>
        </div>
        {next.length > 0 && (
          <form action={update} className="admin-actions">
            {next.map((status) => (
              <button
                key={status}
                name="status"
                value={status}
                className={status === "cancelled" || status === "refunded" ? "admin-btn" : "admin-btn admin-btn-primary"}
              >
                Mark {status.replaceAll("_", " ")}
              </button>
            ))}
          </form>
        )}
      </header>

      <div className="admin-split">
        <div>
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Item</th>
                  <th scope="col" className="num">Qty</th>
                  <th scope="col" className="num">Unit price</th>
                  <th scope="col" className="num">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.lines.map((line) => (
                  <tr key={line.variantId}>
                    <td>{line.name}</td>
                    <td className="num">{line.quantity}</td>
                    <td className="num">{inr(line.unitPayable.amount)}</td>
                    <td className="num">{inr(line.unitPayable.amount * line.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <dl className="admin-card admin-summary">
            <dt>Subtotal</dt>
            <dd>{inr(order.pricing.subtotal)}</dd>
            {order.pricing.discount > 0 && (
              <>
                <dt>Discount{order.pricing.couponCode ? ` (${order.pricing.couponCode})` : ""}</dt>
                <dd>−{inr(order.pricing.discount)}</dd>
              </>
            )}
            <dt>Shipping</dt>
            <dd>{order.pricing.shippingWaived ? "Free" : inr(order.pricing.shipping)}</dd>
            <dt>
              <strong>Total</strong>
            </dt>
            <dd>
              <strong>{inr(order.pricing.total)}</strong>
            </dd>
          </dl>
        </div>
        <div>
          <section className="admin-card">
            <h2>Customer</h2>
            <p>{address?.name ?? "—"}</p>
            {order.email && <p className="admin-muted">{order.email}</p>}
            {address?.phone && <p className="admin-muted">{address.phone}</p>}
          </section>
          <section className="admin-card">
            <h2>Shipping address</h2>
            <address style={{ fontStyle: "normal" }}>
              {[address?.line1, address?.line2, address?.city, address?.state, address?.pincode]
                .filter(Boolean)
                .join(", ")}
            </address>
            {order.deliveryAreaName && <p className="admin-muted">Area: {order.deliveryAreaName}</p>}
          </section>
          <section className="admin-card">
            <h2>Payment</h2>
            <p>
              {order.payment.method === "cod" ? "Cash on delivery" : "Razorpay"}{" "}
              <StatusPill status={order.payment.status} />
            </p>
            {order.payment.razorpayPaymentId && (
              <p className="admin-muted">{order.payment.razorpayPaymentId}</p>
            )}
          </section>
          {order.timeline.length > 0 && (
            <section className="admin-card">
              <h2>Timeline</h2>
              <ol className="admin-timeline">
                {order.timeline.map((entry, index) => (
                  <li key={index}>
                    <StatusPill status={entry.status ?? ""} />{" "}
                    <span className="admin-muted">
                      {entry.at ? new Date(entry.at).toLocaleString("en-IN") : ""}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
