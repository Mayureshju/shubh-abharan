import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToBag } from "@/components/product/AddToBag";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { resolve } from "@/lib/brand";
import {
  categoryLabel,
  formatMoney,
  getProduct,
  hasPriceRange,
  listProducts,
  lowestPrice,
  relatedProducts,
  toProductCardProduct,
} from "@/lib/catalog";
import type { ProductLabel } from "@/lib/catalog/types";

const LABEL_TEXT: Record<ProductLabel, string> = {
  "made-to-order": "Made to order",
  "one-of-a-kind": "One of a kind",
  hallmarked: "Hallmarked",
  "limited-run": "Limited run",
};

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

  const price = formatMoney(lowestPrice(product));
  const compare = product.quote?.compare;
  const displayPrice = hasPriceRange(product) ? `From ${price}` : price;
  const all = await listProducts();
  const related = relatedProducts(product, all, 4);
  const attributes = product.attributes ?? [];
  const labels = product.labels ?? [];
  const hasDetails = attributes.length > 0 || labels.length > 0 || Boolean(product.care);

  return (
    <article className="page-gutter py-tight">
      <div className="md:grid md:grid-cols-12 md:gap-12 lg:gap-16">
        <div className="md:col-span-7">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        <div className="mt-tight md:col-span-5 md:mt-0 md:sticky md:top-24 md:self-start">
          <p className="text-caption uppercase tracking-[0.22em] text-accent">
            {categoryLabel(product.category)}
          </p>
          <h1 className="mt-3 text-title">{product.name}</h1>
          <p className="mt-4 text-body">
            {compare && lowestPrice(product) && compare.amount > lowestPrice(product)!.amount ? (
              <>
                <span className="mr-3 text-muted line-through">{formatMoney(compare)}</span>
                {displayPrice}
              </>
            ) : (
              displayPrice
            )}
          </p>
          <p className="mt-2 text-caption uppercase text-muted">
            {resolve(product.materialLine, "material line")}
          </p>

          <AddToBag
            product={{
              id: product.id,
              isSize: Boolean(product.isSize),
              sizes: product.sizes ?? [],
              sizeValues: product.options.find((option) => option.axis === "size")?.values ?? [],
              displayPrice,
              variants: product.variants.map((variant) => {
                const payable = variant.payablePrice ?? variant.price;
                return {
                  id: variant.id,
                  size: variant.options.size ?? null,
                  availability: variant.availability,
                  price: payable ? formatMoney(payable) : null,
                };
              }),
            }}
          />

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
