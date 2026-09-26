import Link from "next/link";
import { connectDb } from "@/lib/db/connect";
import { OrderModel, ProductModel } from "@/lib/db/models";
import { OrdersTable } from "@/components/admin/OrdersTable";

const TO_FULFIL = ["paid", "packing"];

export default async function AdminHome() {
  await connectDb();
  const [products, orders, toFulfil, recent] = await Promise.all([
    ProductModel.countDocuments({ isActive: true }),
    OrderModel.countDocuments(),
    OrderModel.countDocuments({ status: { $in: TO_FULFIL } }),
    OrderModel.find().sort({ createdAt: -1 }).limit(8).lean(),
  ]);
  return (
    <>
      <header className="admin-head">
        <h1>Overview</h1>
        <Link href="/admin/products/new" className="admin-btn admin-btn-primary">
          New product
        </Link>
      </header>
      <dl className="admin-stats">
        <div className="admin-card">
          <dt>Active products</dt>
          <dd>{products}</dd>
        </div>
        <div className="admin-card">
          <dt>Total orders</dt>
          <dd>{orders}</dd>
        </div>
        <div className="admin-card">
          <dt>To fulfil</dt>
          <dd>{toFulfil}</dd>
        </div>
      </dl>
      <h2>Recent orders</h2>
      <OrdersTable orders={recent} />
    </>
  );
}
