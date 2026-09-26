import { connectDb } from "@/lib/db/connect";
import { OrderModel } from "@/lib/db/models";
import { formatMoney } from "@/lib/catalog/money";
import { StatusPill } from "@/components/admin/StatusPill";

const COUNTED = ["paid", "packing", "shipped", "delivered"];

export default async function AdminReports({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  await connectDb();
  const { from, to } = await searchParams;
  const start = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = to ? new Date(to) : new Date();
  const range = { createdAt: { $gte: start, $lte: end } };
  const match = {
    status: { $in: COUNTED },
    ...range,
  };

  const [summary] = await OrderModel.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        gmv: { $sum: "$pricing.total" },
        count: { $sum: 1 },
        shipping: { $sum: "$pricing.shipping" },
        waived: { $sum: { $cond: ["$pricing.shippingWaived", 1, 0] } },
        razorpay: { $sum: { $cond: [{ $eq: ["$payment.method", "razorpay"] }, 1, 0] } },
        cod: { $sum: { $cond: [{ $eq: ["$payment.method", "cod"] }, 1, 0] } },
      },
    },
  ]);

  const series = await OrderModel.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        gmv: { $sum: "$pricing.total" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const mix = await OrderModel.aggregate([
    { $match: range },
    { $group: { _id: "$status", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const top = await OrderModel.aggregate([
    { $match: match },
    { $unwind: "$lines" },
    {
      $group: {
        _id: "$lines.slug",
        name: { $first: "$lines.name" },
        qty: { $sum: "$lines.quantity" },
        revenue: { $sum: { $multiply: ["$lines.unitPayable.amount", "$lines.quantity"] } },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 8 },
  ]);

  const coupons = await OrderModel.aggregate([
    { $match: { ...match, "pricing.couponCode": { $nin: [null, ""] } } },
    {
      $group: {
        _id: "$pricing.couponCode",
        count: { $sum: 1 },
        discount: { $sum: "$pricing.discount" },
      },
    },
    { $sort: { count: -1 } },
  ]);

  const gmv = summary?.gmv ?? 0;
  const count = summary?.count ?? 0;
  const aov = count > 0 ? Math.round(gmv / count) : 0;

  const inr = (amount: number) => formatMoney({ amount, currency: "INR" });

  return (
    <>
      <header className="admin-head">
        <div>
          <h1>Reports</h1>
          <p className="admin-sub">Paid, packing, shipped and delivered orders in the selected range</p>
        </div>
      </header>
      <form className="admin-card admin-filters" method="get">
        <label className="admin-check">
          From <input type="date" name="from" defaultValue={start.toISOString().slice(0, 10)} />
        </label>
        <label className="admin-check">
          To <input type="date" name="to" defaultValue={end.toISOString().slice(0, 10)} />
        </label>
        <button type="submit" className="admin-btn admin-btn-primary">
          Apply
        </button>
      </form>
      <dl className="admin-stats">
        <div className="admin-card">
          <dt>Revenue (GMV)</dt>
          <dd>{inr(gmv)}</dd>
        </div>
        <div className="admin-card">
          <dt>Orders</dt>
          <dd>{count}</dd>
        </div>
        <div className="admin-card">
          <dt>Average order value</dt>
          <dd>{inr(aov)}</dd>
        </div>
        <div className="admin-card">
          <dt>Shipping collected</dt>
          <dd>{inr(summary?.shipping ?? 0)}</dd>
        </div>
        <div className="admin-card">
          <dt>Free delivery orders</dt>
          <dd>{summary?.waived ?? 0}</dd>
        </div>
        <div className="admin-card">
          <dt>Razorpay / COD</dt>
          <dd>
            {summary?.razorpay ?? 0} / {summary?.cod ?? 0}
          </dd>
        </div>
      </dl>
      <div className="admin-split admin-split-even">
        <ReportTable
          title="Paid orders by day"
          head={["Day", "Orders", "Revenue"]}
          rows={series.map((row) => [row._id, row.count, inr(row.gmv)])}
        />
        <ReportTable
          title="Status mix"
          head={["Status", "Orders"]}
          rows={mix.map((row) => [<StatusPill key={row._id} status={row._id} />, row.count])}
        />
        <ReportTable
          title="Top products"
          head={["Product", "Qty", "Revenue"]}
          rows={top.map((row) => [row.name, row.qty, inr(row.revenue)])}
        />
        <ReportTable
          title="Coupons"
          head={["Code", "Uses", "Discount"]}
          rows={coupons.map((row) => [row._id, row.count, `−${inr(row.discount)}`])}
        />
      </div>
    </>
  );
}

function ReportTable({
  title,
  head,
  rows,
}: {
  title: string;
  head: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <section>
      <h2>{title}</h2>
      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              {head.map((label, index) => (
                <th key={label} scope="col" className={index > 0 ? "num" : undefined}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={head.length} className="admin-empty">No data for this range.</td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, index) => (
                    <td key={index} className={index > 0 ? "num" : undefined}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
