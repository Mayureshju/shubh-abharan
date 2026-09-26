/**
 * Mongo-backed catalog reads. Callers keep awaiting the same function names.
 */

import "server-only";
import { connectDb } from "@/lib/db/connect";
import { CollectionModel, PriceRuleModel, ProductModel, CategoryModel, TagModel, type PriceRuleDoc } from "@/lib/db/models";
import { mapCollection, mapProduct } from "./mapDoc";
import { brand, isSupplied } from "../brand";
import type { Collection, Product, ProductId } from "./types";
import type { HikeRule } from "@/lib/pricing/resolve";
import { CATEGORY_ORDER } from "./labels";
import type { ListCriteria, SortOrder } from "./criteria";

export type { ListCriteria, SortOrder } from "./criteria";

export interface CollectionWithProducts {
  readonly collection: Collection;
  readonly products: readonly Product[];
}

export type CategoryRecord = {
  readonly slug: string;
  readonly name: string;
  readonly tags: readonly string[];
  readonly productOrder: readonly string[];
  readonly seoTitle: string | null;
  readonly seoDescription: string | null;
};

export type TagRecord = {
  readonly slug: string;
  readonly name: string;
  readonly seoTitle: string | null;
  readonly seoDescription: string | null;
};

function toHikeRule(doc: PriceRuleDoc): HikeRule {
  return {
    type: doc.type as HikeRule["type"],
    value: doc.value,
    startsAt: doc.startsAt,
    endsAt: doc.endsAt,
    isActive: doc.isActive,
    scope: doc.scope as HikeRule["scope"],
    categorySlugs: doc.categorySlugs ?? [],
    productSlugs: doc.productSlugs ?? [],
    excludeOnSale: doc.excludeOnSale,
  };
}

async function activeRules(): Promise<HikeRule[]> {
  const now = new Date();
  const docs = await PriceRuleModel.find({ isActive: true, startsAt: { $lte: now }, endsAt: { $gte: now } }).lean();
  return docs.map((doc) => toHikeRule(doc as PriceRuleDoc));
}

function payableAmount(product: Product): number | null {
  return product.quote?.payable?.amount ?? null;
}

export async function listCategories(): Promise<readonly CategoryRecord[]> {
  await connectDb();
  const docs = await CategoryModel.find({ isActive: true }).lean();
  return [...docs]
    .sort((a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a.slug);
      const ib = CATEGORY_ORDER.indexOf(b.slug);
      const ra = ia === -1 ? Number.MAX_SAFE_INTEGER : ia;
      const rb = ib === -1 ? Number.MAX_SAFE_INTEGER : ib;
      if (ra !== rb) return ra - rb;
      return a.name.localeCompare(b.name);
    })
    .map((doc) => ({
      slug: doc.slug,
      name: doc.name,
      tags: doc.tags ?? [],
      productOrder: doc.productOrder ?? [],
      seoTitle: doc.seoTitle ?? null,
      seoDescription: doc.seoDescription ?? null,
    }));
}

/** Tags that at least one active product carries, named from their Tag record. */
export async function listTags(): Promise<readonly TagRecord[]> {
  await connectDb();
  const [used, docs] = await Promise.all([
    ProductModel.distinct("tags", { isActive: true }),
    TagModel.find().lean(),
  ]);
  const bySlug = new Map(docs.map((doc) => [doc.slug, doc]));
  return used
    .filter((slug): slug is string => Boolean(slug) && bySlug.get(slug)?.isActive !== false)
    .map((slug) => {
      const doc = bySlug.get(slug);
      return {
        slug,
        name: doc?.name ?? slug,
        seoTitle: doc?.seoTitle ?? null,
        seoDescription: doc?.seoDescription ?? null,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getProduct(slug: string): Promise<Product | null> {
  await connectDb();
  const [doc, rules] = await Promise.all([
    ProductModel.findOne({ slug, isActive: true }).lean(),
    activeRules(),
  ]);
  if (!doc) return null;
  return mapProduct(doc, rules);
}

export async function getProductById(id: ProductId): Promise<Product | null> {
  await connectDb();
  const [doc, rules] = await Promise.all([
    ProductModel.findOne({ key: id, isActive: true }).lean(),
    activeRules(),
  ]);
  if (!doc) return null;
  return mapProduct(doc, rules);
}

export async function getProductsByIds(ids: readonly ProductId[]): Promise<readonly Product[]> {
  if (ids.length === 0) return [];
  await connectDb();
  const [docs, rules] = await Promise.all([
    ProductModel.find({ key: { $in: [...ids] }, isActive: true }).lean(),
    activeRules(),
  ]);
  const mapped = docs.map((doc) => mapProduct(doc, rules));
  return ids
    .map((id) => mapped.find((product) => product.id === id))
    .filter((product): product is Product => product !== undefined);
}

export async function getProductsBySlugs(slugs: readonly string[]): Promise<readonly Product[]> {
  if (slugs.length === 0) return [];
  await connectDb();
  const [docs, rules] = await Promise.all([
    ProductModel.find({ slug: { $in: [...slugs] }, isActive: true }).lean(),
    activeRules(),
  ]);
  const mapped = docs.map((doc) => mapProduct(doc, rules));
  return slugs
    .map((slug) => mapped.find((product) => product.slug === slug))
    .filter((product): product is Product => product !== undefined);
}

export async function getCollection(slug: string): Promise<CollectionWithProducts | null> {
  await connectDb();
  const doc = await CollectionModel.findOne({ slug, isActive: true }).lean();
  if (!doc) return null;
  const collection = mapCollection(doc);
  const products = await getProductsBySlugs(collection.productSlugs);
  return { collection, products };
}

export async function listCollections(): Promise<readonly Collection[]> {
  await connectDb();
  const docs = await CollectionModel.find({ isActive: true }).sort({ name: 1 }).lean();
  return docs.map(mapCollection);
}

export async function listProducts(criteria: ListCriteria = {}): Promise<readonly Product[]> {
  await connectDb();
  const filter: Record<string, unknown> = { isActive: true };
  if (criteria.category) filter.categorySlug = criteria.category;
  if (criteria.collection) filter.collections = criteria.collection;
  if (criteria.occasion) filter.occasions = criteria.occasion;
  if (criteria.tag) filter.tags = criteria.tag;
  if (criteria.isNew) filter.newArrival = true;
  if (criteria.isFeatured) filter.isFeatured = true;

  const [docs, rules, category] = await Promise.all([
    ProductModel.find(filter).lean(),
    activeRules(),
    criteria.category ? CategoryModel.findOne({ slug: criteria.category }).lean() : Promise.resolve(null),
  ]);

  let products = docs.map((doc) => mapProduct(doc, rules)).filter((product) => matches(product, criteria));

  const order = criteria.sort ?? "display";
  if (order === "display") {
    const declared = category?.productOrder ?? [];
    if (declared.length > 0) {
      const rank = new Map(declared.map((slug, index) => [slug, index]));
      products = [...products].sort((a, b) => {
        const ia = rank.get(a.slug) ?? Number.MAX_SAFE_INTEGER;
        const ib = rank.get(b.slug) ?? Number.MAX_SAFE_INTEGER;
        return ia - ib;
      });
    }
    return products;
  }

  const direction = order === "price-asc" ? 1 : -1;
  return [...products].sort((a, b) => {
    const priceA = payableAmount(a);
    const priceB = payableAmount(b);
    if (priceA === null && priceB === null) return 0;
    if (priceA === null) return 1;
    if (priceB === null) return -1;
    return (priceA - priceB) * direction;
  });
}

export async function search(query: string): Promise<readonly Product[]> {
  const needle = query.trim().toLowerCase();
  if (needle === "") return [];
  const products = await listProducts();
  return products.filter((product) => haystack(product).some((value) => value.includes(needle)));
}

function haystack(product: Product): string[] {
  const values = [product.name, product.category, ...(product.tags ?? [])];
  for (const slug of product.occasions ?? []) {
    const occasion = brand.occasions.find((entry) => entry.slug === slug);
    if (occasion !== undefined) values.push(occasion.name);
  }
  if (isSupplied(product.materialLine)) values.push(product.materialLine);
  if (isSupplied(product.description)) values.push(product.description);
  for (const attribute of product.attributes ?? []) values.push(attribute.value);
  return values.map((value) => value.toLowerCase());
}

function matches(product: Product, criteria: ListCriteria): boolean {
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
    const amount = payableAmount(product);
    if (amount === null) return false;
    if (criteria.minPrice !== undefined && amount < criteria.minPrice) return false;
    if (criteria.maxPrice !== undefined && amount > criteria.maxPrice) return false;
  }
  return true;
}
