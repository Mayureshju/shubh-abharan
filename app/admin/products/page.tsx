import Link from "next/link";
import { connectDb } from "@/lib/db/connect";
import { CategoryModel, ProductModel, TagModel } from "@/lib/db/models";
import { formatMoney } from "@/lib/catalog/money";
import { StatusPill } from "@/components/admin/StatusPill";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default async function AdminProducts({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; status?: string; tag?: string }>;
}) {
  await connectDb();
  const { q = "", category = "", status = "", tag = "" } = await searchParams;

  const filter: Record<string, unknown> = {};
  if (q.trim()) {
    const pattern = new RegExp(escapeRegex(q.trim()), "i");
    filter.$or = [{ name: pattern }, { slug: pattern }, { materialLine: pattern }];
  }
  if (category) filter.categorySlug = category;
  if (tag) filter.tags = tag;
  if (status === "active") filter.isActive = { $ne: false };
  if (status === "hidden") filter.isActive = false;

  const [products, total, categories, tags] = await Promise.all([
    ProductModel.find(filter).sort({ updatedAt: -1 }).lean(),
    ProductModel.estimatedDocumentCount(),
    CategoryModel.find().sort({ name: 1 }).select("slug name").lean(),
    TagModel.find().sort({ name: 1 }).select("slug name").lean(),
  ]);
  const categoryName = new Map(categories.map((entry) => [entry.slug, entry.name]));
  const filtered = Boolean(q || category || status || tag);

  return (
    <>
      <header className="admin-head">
        <div>
          <h1>Products</h1>
          <p className="admin-sub">
            {filtered ? `${products.length} of ${total} products` : `${total} products`}
          </p>
        </div>
        <Link href="/admin/products/new" className="admin-btn admin-btn-primary">
          + New product
        </Link>
      </header>

      <form method="get" className="admin-card admin-filters" role="search">
        <input type="search" name="q" defaultValue={q} placeholder="Search by name, slug or material" aria-label="Search products" />
        <select name="category" defaultValue={category} aria-label="Category">
          <option value="">All categories</option>
          {categories.map((entry) => (
            <option key={entry.slug} value={entry.slug}>
              {entry.name}
            </option>
          ))}
        </select>
        <select name="tag" defaultValue={tag} aria-label="Tag">
          <option value="">All tags</option>
          {tags.map((entry) => (
            <option key={entry.slug} value={entry.slug}>
              {entry.name}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={status} aria-label="Status">
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="hidden">Hidden</option>
        </select>
        <button type="submit" className="admin-btn admin-btn-primary">
          Filter
        </button>
        {filtered && (
          <Link href="/admin/products" className="admin-link">
            Clear
          </Link>
        )}
      </form>

      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col" style={{ width: 64 }}>
                <span className="sr-only">Image</span>
              </th>
              <th scope="col">Product</th>
              <th scope="col">Category</th>
              <th scope="col">Stock</th>
              <th scope="col">Status</th>
              <th scope="col" className="num">Price</th>
              <th scope="col" className="num">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="admin-empty">
                  {filtered ? "No products match these filters." : "No products yet."}
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const image = product.images.find((entry) => entry.src);
                const prices = product.variants
                  .map((variant) => variant.salePrice?.amount ?? variant.price?.amount)
                  .filter((amount): amount is number => amount != null);
                const low = prices.length ? Math.min(...prices) : null;
                const high = prices.length ? Math.max(...prices) : null;
                const inStock = product.variants.filter((variant) => variant.availability !== "sold-out").length;
                const active = product.isActive !== false;
                return (
                  <tr key={product.slug}>
                    <td>
                      <div className="table-thumb">
                        {image?.src ? (
                          // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail
                          <img src={image.src} alt="" loading="lazy" />
                        ) : (
                          <span aria-hidden="true">—</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <Link href={`/admin/products/${product.slug}`} className="admin-link">
                        {product.name}
                      </Link>
                      <div className="admin-muted table-sub">
                        {product.isSize ? `${product.variants.length} sizes` : product.slug}
                      </div>
                    </td>
                    <td>{categoryName.get(product.categorySlug) ?? product.categorySlug}</td>
                    <td>
                      {inStock === 0 ? (
                        <StatusPill status="cancelled" label="Sold out" />
                      ) : product.isSize && inStock < product.variants.length ? (
                        <StatusPill status="pending_payment" label={`${inStock}/${product.variants.length} sizes`} />
                      ) : (
                        <StatusPill status="paid" label="In stock" />
                      )}
                    </td>
                    <td>
                      <StatusPill status={active ? "active" : "hidden"} label={active ? "Active" : "Hidden"} />
                    </td>
                    <td className="num">
                      {low == null
                        ? "—"
                        : low === high
                          ? formatMoney({ amount: low, currency: "INR" })
                          : `${formatMoney({ amount: low, currency: "INR" })} – ${formatMoney({ amount: high!, currency: "INR" })}`}
                    </td>
                    <td className="num">
                      <div className="row-actions">
                        <Link href={`/admin/products/${product.slug}`} className="admin-btn admin-btn-sm">
                          Edit
                        </Link>
                        <DeleteProductButton slug={product.slug} name={product.name} />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
