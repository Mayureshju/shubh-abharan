import Link from "next/link";
import { connectDb } from "@/lib/db/connect";
import { CategoryModel, ProductModel, TagModel } from "@/lib/db/models";
import { saveCategory } from "@/lib/actions/admin-catalog";
import { ProductOrderField } from "@/components/admin/ProductOrderField";

export default async function AdminCategories({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  await connectDb();
  const { slug } = await searchParams;
  const [categories, products, tags] = await Promise.all([
    CategoryModel.find().sort({ name: 1 }).lean(),
    ProductModel.find({ isActive: true }).select("slug name categorySlug").lean(),
    TagModel.find().sort({ name: 1 }).lean(),
  ]);

  const current = categories.find((entry) => entry.slug === slug);
  const categoryTags = new Set(current?.tags ?? []);

  return (
    <>
      <header className="admin-head">
        <h1>Categories</h1>
        {current && (
          <Link href="/admin/categories" className="admin-btn">
            New category
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
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="admin-empty">No categories yet.</td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.slug}>
                    <td>
                      <Link
                        href={`/admin/categories?slug=${category.slug}`}
                        className="admin-link"
                        aria-current={category.slug === slug ? "true" : undefined}
                      >
                        {category.name}
                      </Link>
                    </td>
                    <td className="admin-muted">{category.slug}</td>
                    <td className="num">
                      {products.filter((product) => product.categorySlug === category.slug).length}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <form action={saveCategory} className="admin-card admin-form" key={current?.slug ?? "new"}>
          <h2>{current ? `Edit ${current.name}` : "New category"}</h2>
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
          <fieldset className="admin-checklist">
            <legend>Tags</legend>
            {tags.length === 0 && <span className="admin-muted">No tags yet.</span>}
            {tags.map((tag) => (
              <label key={tag.slug} className="admin-check">
                <input type="checkbox" name="tags" value={tag.slug} defaultChecked={categoryTags.has(tag.slug)} />
                {tag.name}
              </label>
            ))}
          </fieldset>
          <label className="admin-field">
            <span>SEO title</span>
            <input name="seoTitle" defaultValue={current?.seoTitle ?? ""} maxLength={70} />
            <small>Used on /shop?category={current?.slug ?? "…"}. Keep it under 60 characters.</small>
          </label>
          <label className="admin-field">
            <span>SEO description</span>
            <textarea name="seoDescription" rows={3} defaultValue={current?.seoDescription ?? ""} maxLength={200} />
            <small>Keep it under 160 characters.</small>
          </label>
          <div className="admin-field">
            <span>Product order</span>
            <ProductOrderField
              name="productOrder"
              slugs={(current?.productOrder?.length
                ? current.productOrder
                : products.filter((product) => product.categorySlug === current?.slug).map((product) => product.slug)
              ).filter((slug) => products.some((product) => product.slug === slug))}
              labels={Object.fromEntries(products.map((product) => [product.slug, product.name]))}
            />
          </div>
          <div>
            <button className="admin-btn admin-btn-primary" type="submit">
              Save category
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
