import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { brand, resolve } from "@/lib/brand";
import { listProducts, toProductCardProduct } from "@/lib/catalog";

export function generateStaticParams() {
  return brand.occasions.map((occasion) => ({ slug: occasion.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/occasions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const occasion = brand.occasions.find((entry) => entry.slug === slug);
  return { title: occasion?.name ?? "Occasion" };
}

export default async function OccasionPage({ params }: PageProps<"/occasions/[slug]">) {
  const { slug } = await params;
  const occasion = brand.occasions.find((entry) => entry.slug === slug);
  if (!occasion) notFound();

  const products = await listProducts({ occasion: occasion.slug });

  return (
    <section className="page-gutter py-tight">
      <p className="text-caption uppercase tracking-[0.22em] text-accent">Shop by occasion</p>
      <h1 className="mt-3 text-title">{occasion.name}</h1>
      <p className="mt-4 max-w-measure text-body text-muted">
        {resolve(occasion.description, "occasion description")}
      </p>

      {products.length > 0 ? (
        <div className="rail mt-tight [--rail-columns:3]">
          {products.map((product) => (
            <ProductCard
              key={product.slug}
              product={toProductCardProduct(product)}
              sizes="(min-width: 768px) 33vw, 72vw"
            />
          ))}
        </div>
      ) : (
        <p className="mt-tight text-body text-muted">No pieces listed for this occasion yet.</p>
      )}
    </section>
  );
}
