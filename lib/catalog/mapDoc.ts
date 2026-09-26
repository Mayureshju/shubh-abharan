import { asProductId, asVariantId } from "./types";
import type {
  Availability,
  Collection,
  Money,
  Product,
  ProductImage,
  ProductImages,
  ProductOption,
  ProductVariant,
  VariantAxis,
} from "./types";
import { resolveVariantPrice, type HikeRule } from "@/lib/pricing/resolve";
import type { CollectionDoc, ProductDoc } from "@/lib/db/models";

function money(value: { amount: number; currency: string } | null | undefined): Money | null {
  if (value == null) return null;
  return { amount: value.amount, currency: value.currency as Money["currency"] };
}

function asImages(images: ProductDoc["images"]): ProductImages {
  const mapped: ProductImage[] = images.map((image) => ({
    role: image.role as ProductImage["role"],
    src: image.src ?? undefined,
    alt: image.alt,
    aspect: image.aspect,
    crop: image.crop ?? undefined,
    position: image.position ?? undefined,
    dimension: image.dimension ?? undefined,
  })) as ProductImage[];
  if (mapped.length === 0) {
    mapped.push({
      role: "macro",
      aspect: "1/1",
      alt: "Product photograph pending",
    });
  }
  return mapped as unknown as ProductImages;
}

function asOptions(options: ProductDoc["options"], isSize: boolean, sizes: string[]): ProductOption[] {
  const list: ProductOption[] = options.map((option) => ({
    axis: option.axis as VariantAxis,
    values: option.values,
  }));
  if (isSize && !list.some((option) => option.axis === "size") && sizes.length > 0) {
    list.unshift({ axis: "size", values: sizes });
  }
  return list;
}

function asVariants(
  doc: ProductDoc,
  rules: readonly HikeRule[],
  at: Date,
): [ProductVariant, ...ProductVariant[]] {
  const mapped: ProductVariant[] = doc.variants.map((variant) => {
    const list = money(variant.price);
    const sale = money(variant.salePrice);
    const resolved = resolveVariantPrice(list, sale, rules, doc.slug, doc.categorySlug, at);
    return {
      id: asVariantId(variant.key),
      options: (variant.options ?? {}) as ProductVariant["options"],
      price: list,
      salePrice: sale,
      payablePrice: resolved.payable,
      comparePrice: resolved.compare,
      availability: variant.availability as Availability,
      sku: variant.sku ?? undefined,
    };
  });
  if (mapped.length === 0) {
    mapped.push({
      id: asVariantId(`${doc.key}-default`),
      options: {},
      price: null,
      availability: "unavailable",
    });
  }
  return mapped as [ProductVariant, ...ProductVariant[]];
}

export function mapProduct(doc: ProductDoc, rules: readonly HikeRule[] = [], at = new Date()): Product {
  const variants = asVariants(doc, rules, at);
  let payable: Money | null = null;
  let compare: Money | null = null;
  for (const variant of variants) {
    const amount = variant.payablePrice ?? variant.price;
    if (amount == null) continue;
    if (payable == null || amount.amount < payable.amount) {
      payable = amount;
      compare = variant.comparePrice ?? null;
    }
  }

  return {
    id: asProductId(doc.key),
    slug: doc.slug,
    name: doc.name,
    category: doc.categorySlug,
    tags: doc.tags ?? [],
    isNew: Boolean(doc.newArrival),
    isFeatured: Boolean(doc.isFeatured),
    isSize: Boolean(doc.isSize),
    sizes: doc.sizes ?? [],
    options: asOptions(doc.options ?? [], Boolean(doc.isSize), doc.sizes ?? []),
    variants,
    images: asImages(doc.images),
    collections: doc.collections ?? [],
    occasions: doc.occasions ?? [],
    materialLine: doc.materialLine ?? null,
    description: doc.description ?? null,
    care: doc.care ?? null,
    seoTitle: doc.seoTitle ?? null,
    seoDescription: doc.seoDescription ?? null,
    attributes: doc.attributes?.map((row) => ({ label: row.label ?? "", value: row.value ?? "" })),
    labels: doc.labels as Product["labels"],
    relatedSlugs: doc.relatedSlugs ?? [],
    componentSlugs: doc.componentSlugs ?? [],
    quote: { payable, compare },
  };
}

export function mapCollection(doc: CollectionDoc): Collection {
  return {
    slug: doc.slug,
    name: doc.name,
    description: doc.description ?? null,
    productSlugs: doc.productOrder ?? [],
    tags: doc.tags ?? [],
  };
}
