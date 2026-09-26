import type { Metadata } from "next";
import Link from "next/link";
import { FilterSheet } from "@/components/shop/FilterSheet";
import { ProductListing } from "@/components/shop/ProductListing";
import { ShopFilters } from "@/components/shop/ShopFilters";
import {
  parseShopSearch,
  shopHasFilters,
  shopQueryKey,
  toListCriteria,
} from "@/components/shop/query";
import { buttonClass } from "@/components/ui/buttonClass";
import { categoryLabel, listCategories, listProducts, listTags } from "@/lib/catalog";

export async function generateMetadata({
  searchParams,
}: PageProps<"/shop">): Promise<Metadata> {
  const query = parseShopSearch(await searchParams);
  const categories = await listCategories();
  const match = categories.find((entry) => entry.slug === query.category);
  if (match) {
    return {
      title: match.seoTitle ?? categoryLabel(match.slug, match.name),
      description: match.seoDescription ?? undefined,
    };
  }
  if (query.category) return { title: categoryLabel(query.category) };
  if (query.tag) {
    const tag = (await listTags()).find((entry) => entry.slug === query.tag);
    if (tag) return { title: tag.seoTitle ?? tag.name, description: tag.seoDescription ?? undefined };
  }
  return { title: "Shop" };
}

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const query = parseShopSearch(await searchParams);
  const categories = await listCategories();
  const products = await listProducts(toListCriteria(query));
  const tags = await listTags();
  const match = categories.find((entry) => entry.slug === query.category);
  const heading = query.category ? categoryLabel(query.category, match?.name) : "All pieces";
  const countLabel = `${products.length} ${products.length === 1 ? "piece" : "pieces"}`;
  const filtered = shopHasFilters(query);
  const filterCategories = categories.map((entry) => ({ slug: entry.slug, name: entry.name }));

  return (
    <section className="page-gutter py-tight">
      <p className="text-caption uppercase tracking-[0.22em] text-accent">Shop</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <h1 className="text-title">{heading}</h1>
        <FilterSheet query={query} categories={filterCategories} tags={tags} />
      </div>
      <p className="mt-4 text-caption uppercase text-muted">{countLabel}</p>

      <div className="mt-tight md:grid md:grid-cols-12 md:gap-12 lg:gap-16">
        <aside className="hidden md:col-span-3 md:block">
          <ShopFilters
            key={shopQueryKey(query)}
            query={query}
            idPrefix="desktop"
            categories={filterCategories}
            tags={tags}
          />
        </aside>

        <div className="md:col-span-9">
          {products.length > 0 ? (
            <ProductListing products={products} />
          ) : (
            <p className="text-body text-muted">
              {filtered ? "No pieces match these filters." : "No pieces listed yet."}{" "}
              {filtered ? (
                <Link href="/shop" className={buttonClass("inline")}>
                  Clear filters
                </Link>
              ) : null}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
