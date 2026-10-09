import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidObjectId } from "mongoose";
import { orderNumber } from "@/components/admin/OrdersTable";
import { Plate } from "@/components/editorial/Plate";
import { buttonClass } from "@/components/ui/buttonClass";
import { formatMoney } from "@/lib/catalog/money";
import { connectDb } from "@/lib/db/connect";
import { OrderModel, type OrderDoc } from "@/lib/db/models";

/**
 * Order confirmation, reached by the order id and its secret token — the only
 * way a guest sees their order (commerce/cart-checkout). A wrong or missing
 * token is a 404 that reveals nothing. Not indexed, and the address is never
 * sent on as a referrer.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your order",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

const inr = (amount: number) => formatMoney({ amount, currency: "INR" });

/** What the customer needs to know about paying, from the order's own record. */
function paymentNote(order: OrderDoc): string {
  const total = inr(order.pricing.total);
  if (order.status === "cancelled") return "This order was cancelled.";
  if (order.status === "refunded") return `${total} was refunded.`;
  if (order.payment.method === "cod") return `Pay ${total} in cash when it is delivered.`;
  if (order.payment.status === "captured" || order.payment.status === "authorized") {
    return `Payment of ${total} received.`;
  }
  return `We are waiting for the payment of ${total} to be confirmed.`;
}

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: PageProps<"/order/[id]">) {
  const { id } = await params;
  const { t } = await searchParams;
  const token = typeof t === "string" ? t : null;
  if (!token || !isValidObjectId(id)) notFound();

  await connectDb();
  const order = (await OrderModel.findOne({ _id: id, accessToken: token }).lean()) as OrderDoc | null;
  if (!order) notFound();

  const receiver = order.shippingAddress;
  const billing = order.billing;

  return (
    <article className="page-gutter py-tight">
      <p className="text-caption uppercase tracking-[0.22em] text-accent">
        Order {orderNumber(order._id)}
      </p>
      <h1 className="mt-3 text-title">Thank you{billing?.name ? `, ${billing.name.split(" ")[0]}` : ""}.</h1>
      <p className="mt-4 max-w-measure text-body">{paymentNote(order)}</p>
      {order.clerkUserId ? (
        <p className="mt-2 text-body text-muted">
          It is also in{" "}
          <Link href="/account/orders" className={buttonClass("inline")}>
            your orders
          </Link>
          .
        </p>
      ) : (
        <p className="mt-2 text-body text-muted">Keep this page&apos;s link to see your order again.</p>
      )}

      <div className="mt-tight grid gap-tight md:grid-cols-12">
        <section className="md:col-span-7" aria-labelledby="order-items">
          <h2 id="order-items" className="text-caption uppercase tracking-[0.22em] text-accent">
            Items
          </h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {order.lines.map((line) => (
              <li key={line.variantId} className="grid grid-cols-[4rem_1fr_auto] items-center gap-4 py-4">
                <div className="relative aspect-square overflow-hidden bg-[color-mix(in_oklab,var(--surface-fg)_4%,var(--surface-bg))]">
                  {line.imageSrc ? (
                    <Plate role="macro" aspect="1/1" src={line.imageSrc} decorative cover sizes="64px" />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <Link href={`/products/${line.slug}`} className="text-body underline-offset-4 hover:underline">
                    {line.name}
                  </Link>
                  <p className="text-caption uppercase text-muted">
                    {line.sizeLabel ? `Size ${line.sizeLabel} · ` : ""}Qty {line.quantity}
                  </p>
                </div>
                <p className="text-caption">{inr(line.unitPayable.amount * line.quantity)}</p>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2 text-body">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{inr(order.pricing.subtotal)}</dd>
            </div>
            {order.pricing.discount > 0 ? (
              <div className="flex justify-between">
                <dt>Discount{order.pricing.couponCode ? ` (${order.pricing.couponCode})` : ""}</dt>
                <dd>−{inr(order.pricing.discount)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd>{order.pricing.shippingWaived || order.pricing.shipping === 0 ? "Free" : inr(order.pricing.shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3">
              <dt>Total</dt>
              <dd>{inr(order.pricing.total)}</dd>
            </div>
            <div className="flex justify-between text-muted">
              <dt>Payment</dt>
              <dd>{order.payment.method === "cod" ? "Cash on delivery" : "Online, via Razorpay"}</dd>
            </div>
          </dl>
        </section>

        <div className="grid content-start gap-tight md:col-span-5">
          <section aria-labelledby="order-receiver">
            <h2 id="order-receiver" className="text-caption uppercase tracking-[0.22em] text-accent">
              Delivering to
            </h2>
            <address className="mt-3 whitespace-pre-line text-body not-italic">
              {[receiver?.name, receiver?.line1, receiver?.line2, receiver?.city, receiver?.state]
                .filter(Boolean)
                .join("\n")}
              {"\n"}
              {receiver?.pincode}
              {order.deliveryAreaName ? ` · ${order.deliveryAreaName}` : ""}
            </address>
            {receiver?.phone ? <p className="mt-1 text-body text-muted">+91 {receiver.phone}</p> : null}
          </section>

          {order.giftMessage ? (
            <section aria-labelledby="order-gift">
              <h2 id="order-gift" className="text-caption uppercase tracking-[0.22em] text-accent">
                Gift message
              </h2>
              <p className="mt-3 max-w-measure whitespace-pre-line text-body">{order.giftMessage}</p>
            </section>
          ) : null}

          {billing?.name ? (
            <section aria-labelledby="order-billing">
              <h2 id="order-billing" className="text-caption uppercase tracking-[0.22em] text-accent">
                Billed to
              </h2>
              <address className="mt-3 whitespace-pre-line text-body not-italic">
                {[billing.name, billing.address].filter(Boolean).join("\n")}
              </address>
              {billing.phone ? <p className="mt-1 text-body text-muted">+91 {billing.phone}</p> : null}
            </section>
          ) : null}
        </div>
      </div>

      <p className="mt-normal">
        <Link href="/shop" className={buttonClass("quiet")}>
          Continue shopping
        </Link>
      </p>
    </article>
  );
}
