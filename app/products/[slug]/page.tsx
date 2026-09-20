import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Plate } from "@/components/editorial/Plate";
import { ProductCard } from "@/components/product/ProductCard";
import { buttonClass } from "@/components/ui/buttonClass";
import { ArrowIcon } from "@/components/ui/icons";
import { resolve } from "@/lib/brand";
import {
  formatMoney,
  getProduct,
  hasPriceRange,
  listProducts,
  lowestPrice,
  relatedProducts,
  toProductCardProduct,
} from "@/lib/catalog";

export async function generateStaticParams() {
  const products = await listProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  return { title: product?.name ?? "Piece" };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const price = formatMoney(lowestPrice(product));
  const displayPrice = hasPriceRange(product) ? `From ${price}` : price;
  const all = await listProducts();
  const related = relatedProducts(product, all, 4);

  return (
    <article className="page-gutter py-tight">
      <div className="md:grid md:grid-cols-12 md:gap-12 lg:gap-16">
        <div className="md:col-span-7">
          <div className="grid gap-3">
            {product.images.map((image, index) => (
              <Plate
                key={`${image.role}-${index}`}
                {...image}
                sizes="(min-width: 768px) 55vw, 100vw"
                priority={index === 0}
              />
            ))}
          </div>
        </div>

        <div className="mt-tight md:col-span-5 md:mt-0 md:sticky md:top-24 md:self-start">
          <p className="text-caption uppercase tracking-[0.22em] text-gold">{product.category}</p>
          <h1 className="mt-3 text-title">{product.name}</h1>
          <p className="mt-4 text-body">{displayPrice}</p>
          <p className="mt-2 text-caption uppercase text-muted">
            {resolve(product.materialLine, "material line")}
          </p>
          <p className="mt-tight max-w-measure text-body text-muted">
            {resolve(product.description, "description")}
          </p>
          {product.care ? (
            <p className="mt-4 max-w-measure text-caption text-muted">{product.care}</p>
          ) : null}
          <p className="mt-tight">
            <Link href="/cart" className={buttonClass("primary")}>
              Add to bag
              <ArrowIcon />
            </Link>
          </p>
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
