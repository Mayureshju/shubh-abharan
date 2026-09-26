import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListing } from "@/components/shop/ProductListing";
import { resolve } from "@/lib/brand";
import { getCollection } from "@/lib/catalog";

export async function generateMetadata({
  params,
}: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getCollection(slug);
  return { title: entry?.collection.name ?? "Collection" };
}

export default async function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const entry = await getCollection(slug);
  if (!entry) notFound();

  const { collection, products } = entry;

  return (
    <section className="page-gutter py-tight">
      <p className="text-caption uppercase tracking-[0.22em] text-accent">Collection</p>
      <h1 className="mt-3 text-title">{collection.name}</h1>
      <p className="mt-4 max-w-measure text-body text-muted">
        {resolve(collection.description, "collection description")}
      </p>

      {products.length > 0 ? (
        <div className="mt-tight">
          <ProductListing products={products} />
        </div>
      ) : (
        <p className="mt-tight text-body text-muted">No pieces listed for this collection yet.</p>
      )}
    </section>
  );
}
