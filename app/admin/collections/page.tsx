import Link from "next/link";
import { connectDb } from "@/lib/db/connect";
import { CollectionModel, ProductModel } from "@/lib/db/models";
import { saveCollection } from "@/lib/actions/admin-catalog";
import { ProductOrderField } from "@/components/admin/ProductOrderField";

export default async function AdminCollections({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  await connectDb();
  const { slug } = await searchParams;
  const [collections, products] = await Promise.all([
    CollectionModel.find().sort({ name: 1 }).lean(),
    ProductModel.find({ isActive: true }).select("slug name").lean(),
  ]);
  const current = collections.find((entry) => entry.slug === slug);

  return (
    <>
      <header className="admin-head">
        <h1>Collections</h1>
        {current && (
          <Link href="/admin/collections" className="admin-btn">
            New collection
          </Link>
        )}
      </header>
      <div className="admin-split">
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Slug</th>
                <th scope="col" className="num">Products</th>
              </tr>
            </thead>
            <tbody>
              {collections.length === 0 ? (
                <tr>
                  <td colSpan={3} className="admin-empty">No collections yet.</td>
                </tr>
              ) : (
                collections.map((collection) => (
                  <tr key={collection.slug}>
                    <td>
                      <Link
                        href={`/admin/collections?slug=${collection.slug}`}
                        className="admin-link"
                        aria-current={collection.slug === slug ? "true" : undefined}
                      >
                        {collection.name}
                      </Link>
                    </td>
                    <td className="admin-muted">{collection.slug}</td>
                    <td className="num">{collection.productOrder?.length ?? 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <form action={saveCollection} className="admin-card admin-form">
          <h2>{current ? `Edit ${current.name}` : "New collection"}</h2>
          <input type="hidden" name="existingSlug" value={current?.slug ?? ""} />
          <div className="admin-form-row">
            <label className="admin-field">
              <span>Name</span>
              <input name="name" required defaultValue={current?.name ?? ""} />
            </label>
            <label className="admin-field">
              <span>Slug</span>
              <input name="slug" defaultValue={current?.slug ?? ""} />
            </label>
          </div>
          <label className="admin-field">
            <span>Description</span>
            <textarea name="description" rows={3} defaultValue={current?.description ?? ""} />
          </label>
          <label className="admin-field">
            <span>Tags</span>
            <input name="tags" defaultValue={(current?.tags ?? []).join(", ")} />
            <small>Comma separated</small>
          </label>
          <div className="admin-field">
            <span>Product order</span>
            <ProductOrderField
              name="productOrder"
              slugs={current?.productOrder ?? []}
              labels={Object.fromEntries(products.map((product) => [product.slug, product.name]))}
            />
          </div>
          <div>
            <button className="admin-btn admin-btn-primary" type="submit">
              Save collection
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
