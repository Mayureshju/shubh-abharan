import type { Metadata } from "next";
import Link from "next/link";
import { FilterBar } from "@/components/shop/FilterBar";
import { FilterSheet } from "@/components/shop/FilterSheet";
import { shopFilterMenus } from "@/components/shop/filters";
import { PAGE_SIZE } from "@/components/shop/pages";
import { Pagination } from "@/components/shop/Pagination";
import { ProductListing } from "@/components/shop/ProductListing";
import { parseShopSearch, shopHasFilters, toListCriteria } from "@/components/shop/query";
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
  const pageCount = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const page = Math.min(query.page ?? 1, pageCount);
  const pageProducts = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const filtered = shopHasFilters(query);
  const menus = shopFilterMenus(query, categories, tags);

  return (
    <section className="page-gutter py-tight">
      <p className="text-caption uppercase tracking-[0.22em] text-accent">Shop</p>
      <h1 className="mt-3 text-title">{heading}</h1>
      {/* Below 1024px the filter bar carries the count. */}
      <p className="mt-4 hidden text-caption uppercase text-muted lg:block">{countLabel}</p>

      <FilterSheet menus={menus} countLabel={countLabel} />
      <FilterBar
        menus={menus}
        start={(page - 1) * PAGE_SIZE + 1}
        end={(page - 1) * PAGE_SIZE + pageProducts.length}
        total={products.length}
      />

      <div className="mt-tight">
        {products.length > 0 ? (
          <>
            <ProductListing products={pageProducts} />
            <Pagination query={query} page={page} pageCount={pageCount} />
          </>
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
    </section>
  );
}
