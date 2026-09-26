import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDb } from "@/lib/db/connect";
import { CategoryModel, CollectionModel, ProductModel, TagModel } from "@/lib/db/models";
import { saveProduct } from "@/lib/actions/admin-catalog";
import { ImageFields } from "@/components/admin/ImageFields";
import { PricingFields } from "@/components/admin/PricingFields";
import { SeoFields } from "@/components/admin/SeoFields";
import { SaveButton } from "@/components/admin/SaveButton";
import { StatusPill } from "@/components/admin/StatusPill";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

const rupees = (value?: { amount: number } | null) => (value?.amount != null ? String(value.amount / 100) : "");

export default async function ProductEditor({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  await connectDb();
  const { slug } = await params;
  const { error, saved } = await searchParams;
  const [categories, collections, tags, product] = await Promise.all([
    CategoryModel.find().sort({ name: 1 }).lean(),
    CollectionModel.find().sort({ name: 1 }).lean(),
    TagModel.find().sort({ name: 1 }).lean(),
    slug && slug !== "new" ? ProductModel.findOne({ slug }).lean() : Promise.resolve(null),
  ]);
  if (slug && slug !== "new" && !product) notFound();

  const first = product?.variants[0];
  const productTags = new Set(product?.tags ?? []);
  const productCollections = new Set(product?.collections ?? []);
  const active = product ? product.isActive !== false : true;

  return (
    <form action={saveProduct} className="product-editor">
      <input type="hidden" name="existingSlug" value={product?.slug ?? ""} />

      <div className="editor-bar">
        <div className="editor-title">
          <Link href="/admin/products" className="icon-btn" aria-label="Back to products" title="Back to products">
            ←
          </Link>
          <h1>{product ? product.name : "New product"}</h1>
          {product && <StatusPill status={active ? "active" : "hidden"} label={active ? "Active" : "Hidden"} />}
        </div>
        <div className="admin-actions">
          {product && (
            <Link href={`/products/${product.slug}`} className="admin-btn" target="_blank" rel="noreferrer">
              View on store ↗
            </Link>
          )}
          {product && <DeleteProductButton slug={product.slug} name={product.name} redirectTo="/admin/products" />}
          <Link href="/admin/products" className="admin-btn">
            Discard
          </Link>
          <SaveButton label={product ? "Save changes" : "Create product"} />
        </div>
      </div>

      {error && (
        <p className="admin-alert" data-tone="red" role="alert">
          {error}
        </p>
      )}
      {saved && !error && (
        <p className="admin-alert" data-tone="green" role="status">
          Product saved.
        </p>
      )}

      <div className="editor-grid">
        <div className="editor-col">
          <section className="admin-card admin-form" aria-labelledby="sec-details">
            <h2 id="sec-details">Details</h2>
            <label className="admin-field">
              <span>Product name</span>
              <input name="name" required defaultValue={product?.name ?? ""} placeholder="e.g. Kundan Choker Set" />
            </label>
            <label className="admin-field">
              <span>URL slug</span>
              <span className="prefix-input">
                <span aria-hidden="true">/products/</span>
                <input name="slug" defaultValue={product?.slug ?? ""} pattern="[a-z0-9-]*" placeholder="generated-from-name" />
              </span>
              <small>Lowercase letters, numbers and dashes. Leave empty to generate from the name.</small>
            </label>
            <label className="admin-field">
              <span>Material</span>
              <input name="materialLine" defaultValue={product?.materialLine ?? ""} placeholder="e.g. 22k gold, kundan, freshwater pearls" />
            </label>
            <label className="admin-field">
              <span>Description</span>
              <textarea name="description" rows={6} defaultValue={product?.description ?? ""} placeholder="What it is, how it's made, how it wears." />
            </label>
            <label className="admin-field">
              <span>Care instructions</span>
              <textarea name="care" rows={3} defaultValue={product?.care ?? ""} placeholder="e.g. Store in the pouch provided. Keep away from perfume and water." />
            </label>
          </section>

          <section className="admin-card admin-form" aria-labelledby="sec-media">
            <div className="card-head">
              <h2 id="sec-media">Photos</h2>
              <small className="admin-muted">Drag cards to reorder</small>
            </div>
            <ImageFields
              images={(product?.images ?? [])
                .filter((image) => image.src)
                .map((image) => ({ src: image.src ?? "", alt: image.alt ?? "", role: image.role ?? "macro" }))}
            />
          </section>

          <section className="admin-card admin-form" aria-labelledby="sec-pricing">
            <h2 id="sec-pricing">Pricing &amp; stock</h2>
            <PricingFields
              isSize={Boolean(product?.isSize)}
              single={{ price: rupees(first?.price), sale: rupees(first?.salePrice), stock: first?.availability ?? "available" }}
              sizes={
                product?.isSize
                  ? product.variants.map((variant) => ({
                      size: String((variant.options as { size?: string } | undefined)?.size ?? ""),
                      price: rupees(variant.price),
                      sale: rupees(variant.salePrice),
                      stock: variant.availability,
                    }))
                  : []
              }
            />
          </section>
        </div>

        <aside className="editor-col editor-side">
          <section className="admin-card admin-form" aria-labelledby="sec-status">
            <h2 id="sec-status">Status</h2>
            <label className="switch">
              <input name="isActive" type="checkbox" role="switch" defaultChecked={active} />
              <span className="switch-track" aria-hidden="true" />
              <span>
                <strong>Visible on store</strong>
                <small className="admin-muted">Turn off to hide without deleting</small>
              </span>
            </label>
            <label className="switch">
              <input name="isNew" type="checkbox" role="switch" defaultChecked={product?.newArrival} />
              <span className="switch-track" aria-hidden="true" />
              <span>
                <strong>New arrival</strong>
              </span>
            </label>
            <label className="switch">
              <input name="isFeatured" type="checkbox" role="switch" defaultChecked={product?.isFeatured} />
              <span className="switch-track" aria-hidden="true" />
              <span>
                <strong>Featured</strong>
              </span>
            </label>
          </section>

          <section className="admin-card admin-form" aria-labelledby="sec-org">
            <h2 id="sec-org">Organisation</h2>
            <label className="admin-field">
              <span>Category</span>
              <select name="categorySlug" required defaultValue={product?.categorySlug ?? ""}>
                <option value="" disabled>
                  Choose a category
                </option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <fieldset className="chips">
              <legend>Tags</legend>
              {tags.map((tag) => (
                <label key={tag.slug} className="chip">
                  <input type="checkbox" name="tags" value={tag.slug} defaultChecked={productTags.has(tag.slug)} />
                  {tag.name}
                </label>
              ))}
              <Link href="/admin/tags" className="chip chip-add">
                + New tag
              </Link>
            </fieldset>
            <fieldset className="chips">
              <legend>Collections</legend>
              {collections.map((collection) => (
                <label key={collection.slug} className="chip">
                  <input type="checkbox" name="collections" value={collection.slug} defaultChecked={productCollections.has(collection.slug)} />
                  {collection.name}
                </label>
              ))}
              {collections.length === 0 && <span className="admin-muted">No collections yet</span>}
            </fieldset>
          </section>

          <section className="admin-card admin-form" aria-labelledby="sec-seo">
            <h2 id="sec-seo">Search engine listing</h2>
            <SeoFields
              title={product?.seoTitle ?? ""}
              description={product?.seoDescription ?? ""}
              fallbackTitle={product?.name ?? ""}
              fallbackDescription={product?.description ?? ""}
              path={`/products/${product?.slug ?? "…"}`}
            />
          </section>
        </aside>
      </div>
    </form>
  );
}
