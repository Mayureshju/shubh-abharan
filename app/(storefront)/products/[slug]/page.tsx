import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { PDP_COLUMNS, buyable, type AddonOption } from "@/components/product/purchase";
import { brand, isSupplied, resolve } from "@/lib/brand";
import {
  categoryLabel,
  getProduct,
  listAddons,
  listCategories,
  listProducts,
  relatedProducts,
  toProductCardProduct,
} from "@/lib/catalog";
import type { Product, ProductLabel } from "@/lib/catalog/types";

const LABEL_TEXT: Record<ProductLabel, string> = {
  "made-to-order": "Made to order",
  "one-of-a-kind": "One of a kind",
  hallmarked: "Hallmarked",
  "limited-run": "Limited run",
};

/** Policy facts beside the purchase, in the business's own words — or not at all. */
const POLICY_FACTS = [
  { key: "hallmarking", label: "Hallmarking" },
  { key: "returns", label: "Returns" },
  { key: "shipping", label: "Shipping" },
] as const;

/** Each add-on's first buyable, priced variant; add-ons without one are left out. */
function addonOptions(addons: readonly Product[], current: Product): AddonOption[] {
  if (current.isAddon || !current.variants.some((variant) => buyable(variant.availability))) return [];
  return addons.flatMap((addon) => {
    if (addon.id === current.id) return [];
    for (const variant of addon.variants) {
      const price = variant.payablePrice ?? variant.price;
      if (price && buyable(variant.availability)) {
        return [{ productId: addon.id, variantId: variant.id, name: addon.name, price, image: addon.images[0] }];
      }
    }
    return [];
  });
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Piece" };
  const description = product.seoDescription ?? product.description ?? undefined;
  const image = product.images.find((entry) => entry.src)?.src;
  return {
    title: product.seoTitle ?? product.name,
    description,
    openGraph: {
      title: product.seoTitle ?? product.name,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [all, addons, categories] = await Promise.all([listProducts(), listAddons(), listCategories()]);
  const related = relatedProducts(product, all, 4);
  const attributes = product.attributes ?? [];
  const labels = product.labels ?? [];
  const hasDetails = attributes.length > 0 || labels.length > 0 || Boolean(product.care);
  const typeName = categoryLabel(
    product.category,
    categories.find((entry) => entry.slug === product.category)?.name,
  );
  const policies = POLICY_FACTS.flatMap(({ key, label }) => {
    const value = brand.policies[key];
    return isSupplied(value) ? [{ label, value }] : [];
  });

  return (
    <article className="page-gutter pt-6 pb-tight md:pt-8">
      <nav aria-label="Breadcrumb">
        <ol className="flex min-w-0 items-center gap-2 whitespace-nowrap text-caption uppercase tracking-[0.12em] text-muted">
          <li className="shrink-0">
            <Link href="/" className="inline-flex min-h-6 items-center hover:text-on-surface hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="shrink-0">
            <Link
              href={`/shop?category=${product.category}`}
              className="inline-flex min-h-6 items-center hover:text-on-surface hover:underline"
            >
              {typeName}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="min-w-0 truncate text-on-surface">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className={`mt-4 md:mt-6 ${PDP_COLUMNS}`}>
        <div className="md:sticky md:top-24 md:self-start">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        <div className="mt-tight md:mt-0">
          <ProductPurchase
            product={{
              id: product.id,
              name: product.name,
              materialLine: resolve(product.materialLine, "material line"),
              isSize: Boolean(product.isSize),
              sizes:
                (product.sizes ?? []).length > 0
                  ? (product.sizes ?? [])
                  : (product.options.find((option) => option.axis === "size")?.values ?? []),
              variants: product.variants.map((variant) => {
                const price = variant.payablePrice ?? variant.price;
                return {
                  id: variant.id,
                  size: variant.options.size ?? null,
                  availability: variant.availability,
                  price,
                  compare: variant.comparePrice ?? null,
                };
              }),
            }}
            addons={addonOptions(addons, product)}
          />

          {policies.length > 0 ? (
            <dl className="mt-6 grid gap-3 border-t border-line pt-4">
              {policies.map((policy) => (
                <div key={policy.label}>
                  <dt className="text-caption uppercase tracking-[0.22em] text-accent">{policy.label}</dt>
                  <dd className="mt-1 max-w-measure text-body">{policy.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          <p className="mt-tight max-w-measure text-body text-muted">
            {resolve(product.description, "description")}
          </p>

          {hasDetails ? (
            <details className="mt-6 border-t border-line pt-4">
              <summary className="flex min-h-11 cursor-pointer items-center text-caption uppercase tracking-[0.22em] text-accent">
                Details and care
              </summary>
              {attributes.length > 0 ? (
                <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-body">
                  {attributes.map((attribute) => (
                    <div key={attribute.label} className="contents">
                      <dt className="text-muted">{attribute.label}</dt>
                      <dd>{attribute.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {labels.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-caption uppercase text-muted">
                  {labels.map((label) => (
                    <li key={label}>{LABEL_TEXT[label]}</li>
                  ))}
                </ul>
              ) : null}
              {product.care ? (
                <p className="mt-3 max-w-measure text-caption text-muted">{product.care}</p>
              ) : null}
            </details>
          ) : null}
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-normal">
          <h2 className="text-title">Worn with</h2>
          <div className="rail mt-tight [--rail-columns:4]">
            {related.map((item) => (
              <ProductCard
                key={item.slug}
                product={toProductCardProduct(item)}
                sizes="(min-width: 768px) 25vw, 46vw"
              />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
