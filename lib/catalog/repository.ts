/**
 * The only way the storefront reaches catalog data.
 *
 * Every function is async even though the fixtures behind them are not. That
 * one keyword is what makes replacing local data with a commerce API a rewrite
 * of this file rather than a rewrite of every caller: no signature and no
 * control flow changes. Server components await it naturally.
 *
 * Components must not import anything under `data/` directly.
 */

import { products } from "./data/products";
import { collections } from "./data/collections";
import { lowestPrice } from "./money";
import { isSupplied } from "../brand";
import type {
  Availability,
  Category,
  Collection,
  Product,
  ProductId,
  VariantAxis,
} from "./types";

export type SortOrder = "display" | "price-asc" | "price-desc";

export interface ListCriteria {
  readonly category?: Category;
  /** Collection slug. */
  readonly collection?: string;
  readonly option?: { readonly axis: VariantAxis; readonly value: string };
  readonly availability?: Availability;
  /** Inclusive bounds, in minor units, against the product's lowest variant price. */
  readonly minPrice?: number;
  readonly maxPrice?: number;
  /** Defaults to the catalog's declared display order. */
  readonly sort?: SortOrder;
}

export interface CollectionWithProducts {
  readonly collection: Collection;
  readonly products: readonly Product[];
}

/** Null rather than a throw, so a caller renders a not-found response. */
export async function getProduct(slug: string): Promise<Product | null> {
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getProductsByIds(ids: readonly ProductId[]): Promise<readonly Product[]> {
  return ids
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => product !== undefined);
}

export async function getCollection(slug: string): Promise<CollectionWithProducts | null> {
  const collection = collections.find((entry) => entry.slug === slug);
  if (collection === undefined) return null;

  return {
    collection,
    products: collection.productSlugs
      .map((productSlug) => products.find((product) => product.slug === productSlug))
      .filter((product): product is Product => product !== undefined),
  };
}

export async function listProducts(criteria: ListCriteria = {}): Promise<readonly Product[]> {
  const filtered = products.filter((product) => matches(product, criteria));
  return sortProducts(filtered, criteria.sort ?? "display");
}

/**
 * Case-insensitive, partial-word, over supplied values only.
 *
 * Placeholder text is never a hit: a product whose material line is unsupplied
 * renders "[MATERIAL LINE]" but is not findable by searching for it.
 *
 * ponytail: linear substring scan over the whole catalog. Swap for the commerce
 * API's search endpoint, or an index, when the catalog outgrows a few hundred
 * pieces — at this size it is imperceptible and an index is a dependency.
 */
export async function search(query: string): Promise<readonly Product[]> {
  const needle = query.trim().toLowerCase();
  if (needle === "") return [];

  return products.filter((product) =>
    haystack(product).some((value) => value.includes(needle)),
  );
}

/* -------------------------------------------------------------------------- */

function haystack(product: Product): string[] {
  const values = [product.name, product.category];

  for (const slug of product.collections) {
    const collection = collections.find((entry) => entry.slug === slug);
    if (collection !== undefined) values.push(collection.name);
  }

  if (isSupplied(product.materialLine)) values.push(product.materialLine);
  if (isSupplied(product.description)) values.push(product.description);
  for (const attribute of product.attributes ?? []) values.push(attribute.value);

  return values.map((value) => value.toLowerCase());
}

function matches(product: Product, criteria: ListCriteria): boolean {
  if (criteria.category !== undefined && product.category !== criteria.category) return false;

  if (criteria.collection !== undefined && !product.collections.includes(criteria.collection)) {
    return false;
  }

  if (criteria.option !== undefined) {
    const { axis, value } = criteria.option;
    if (!product.variants.some((variant) => variant.options[axis] === value)) return false;
  }

  if (criteria.availability !== undefined) {
    if (!product.variants.some((variant) => variant.availability === criteria.availability)) {
      return false;
    }
  }

  if (criteria.minPrice !== undefined || criteria.maxPrice !== undefined) {
    const price = lowestPrice(product);
    // An unsupplied price is not zero and not free — it cannot satisfy a bound.
    if (price === null) return false;
    if (criteria.minPrice !== undefined && price.amount < criteria.minPrice) return false;
    if (criteria.maxPrice !== undefined && price.amount > criteria.maxPrice) return false;
  }

  return true;
}

/**
 * Products with no supplied price sort last in display order, in both
 * directions. Treating null as zero would put every unpriced piece at the head
 * of a cheapest-first listing.
 */
function sortProducts(list: readonly Product[], order: SortOrder): readonly Product[] {
  if (order === "display") return list;

  const direction = order === "price-asc" ? 1 : -1;

  return [...list].sort((a, b) => {
    const priceA = lowestPrice(a);
    const priceB = lowestPrice(b);

    if (priceA === null && priceB === null) return 0; // Array.prototype.sort is stable.
    if (priceA === null) return 1;
    if (priceB === null) return -1;

    return (priceA.amount - priceB.amount) * direction;
  });
}
