import { notFound } from "next/navigation";
import { connectDb } from "@/lib/db/connect";
import { OrderModel } from "@/lib/db/models";
import { requireCustomer } from "@/lib/auth/roles";
import { formatMoney } from "@/lib/catalog/money";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: PageProps<"/account/orders/[id]">) {
  const user = await requireCustomer();
  const { id } = await params;
  await connectDb();
  const order = await OrderModel.findOne({ _id: id, clerkUserId: user.id }).lean();
  if (!order) notFound();

  return (
    <article className="page-gutter py-tight">
      <p className="text-caption uppercase tracking-[0.22em] text-accent">{order.status}</p>
      <h1 className="mt-3 text-title">Order</h1>
      <ul className="mt-tight divide-y divide-line">
        {order.lines.map((line) => (
          <li key={line.variantId} className="py-5">
            <p className="text-body">{line.name}</p>
            {line.sizeLabel ? (
              <p className="text-caption uppercase text-muted">Size {line.sizeLabel}</p>
            ) : null}
            <p className="text-caption">
              {line.quantity} × {formatMoney({ amount: line.unitPayable.amount, currency: "INR" })}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-tight text-body">
        Total {formatMoney({ amount: order.pricing.total, currency: "INR" })}
      </p>
    </article>
  );
}
