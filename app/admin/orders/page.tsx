import Link from "next/link";
import { connectDb } from "@/lib/db/connect";
import { OrderModel } from "@/lib/db/models";
import { ORDER_NEXT } from "@/lib/commerce/order-status";
import { OrdersTable } from "@/components/admin/OrdersTable";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default async function AdminOrders({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; from?: string; to?: string }>;
}) {
  await connectDb();
  const { q = "", status = "", from = "", to = "" } = await searchParams;

  const filter: Record<string, unknown> = {};
  if (status && status in ORDER_NEXT) filter.status = status;
  if (from || to) {
    filter.createdAt = {
      ...(from ? { $gte: new Date(from) } : {}),
      ...(to ? { $lte: new Date(`${to}T23:59:59.999`) } : {}),
    };
  }
  const term = q.trim().replace(/^#/, "");
  if (term) {
    const pattern = new RegExp(escapeRegex(term), "i");
    filter.$or = [
      { email: pattern },
      { "shippingAddress.name": pattern },
      { "shippingAddress.phone": pattern },
      // Order numbers are the last six characters of the id.
      { $expr: { $regexMatch: { input: { $toString: "$_id" }, regex: `${escapeRegex(term)}$`, options: "i" } } },
    ];
  }

  const orders = await OrderModel.find(filter).sort({ createdAt: -1 }).limit(100).lean();
  return (
    <>
      <header className="admin-head">
        <div>
          <h1>Orders</h1>
          <p className="admin-sub">Manage and track customer orders</p>
        </div>
      </header>
      <form method="get" className="admin-card admin-filters" role="search">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by order #, email, name or phone"
          aria-label="Search orders"
        />
        <select name="status" defaultValue={status} aria-label="Status">
          <option value="">All statuses</option>
          {Object.keys(ORDER_NEXT).map((value) => (
            <option key={value} value={value}>
              {value.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <input type="date" name="from" defaultValue={from} aria-label="From date" />
        <span className="admin-muted">to</span>
        <input type="date" name="to" defaultValue={to} aria-label="To date" />
        <button type="submit" className="admin-btn admin-btn-primary">
          Filter
        </button>
        {(q || status || from || to) && (
          <Link href="/admin/orders" className="admin-link">
            Clear
          </Link>
        )}
      </form>
      <OrdersTable orders={orders} />
    </>
  );
}
