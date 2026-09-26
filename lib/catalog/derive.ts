/**
 * Pure derivations from a product to what a surface renders.
 *
 * Separate from repository.ts on purpose: these do not change when the data
 * source moves, so an API swap rewrites the repository and leaves this alone.
 *
 * Nothing here is authored beside the product — a formatted price, a resolved
 * material line and a chosen image are all derived on demand. Storing any of
 * them as data is how two surfaces start disagreeing.
 */

import { resolve } from "../brand";
import { formatMoney, lowestPrice } from "./money";
import type { PlateRole } from "@/components/editorial/Plate";
import type { Product, ProductCardProduct, ProductImage } from "./types";

/**
 * The image carrying the requested role, or the product's primary image.
 *
 * The fallback is what satisfies the design system's "falls back to a defined
 * alternate role" rule, and the non-empty `images` tuple is what makes it
 * total — there is no null branch for a caller to mishandle.
 */
export function imageForRole(product: Product, role: PlateRole): ProductImage {
  return product.images.find((image) => image.role === role) ?? product.images[0];
}

/**
 * The one path from a Product to a product card.
 *
 * `role` is the layout's choice, not the product's — it is what lets a single
 * listing vary its cards, per the design system's product-card requirement.
 *
 * Note what is absent: no label, badge, rating, discount or scarcity value is
 * derived here, because ProductCardProduct has nowhere to put one. Labels stay
 * on the product detail page.
 */
export function toProductCardProduct(
  product: Product,
  role: PlateRole = "macro",
): ProductCardProduct {
  const payable = lowestPrice(product);
  const compare = product.quote?.compare ?? null;
  return {
    slug: product.slug,
    name: product.name,
    price: formatMoney(payable),
    comparePrice:
      compare && payable && compare.amount > payable.amount ? formatMoney(compare) : undefined,
    materialLine: resolve(product.materialLine, "material line"),
    image: imageForRole(product, role),
  };
}

/**
 * Explicit list if the product declares one, else products sharing a
 * collection, else products sharing a category.
 *
 * Deliberately not a similarity score: there is no behavioural data to score
 * with, and a hand-tuned weight table is invented editorial judgement.
 *
 * An empty result means the calling surface omits its related section rather
 * than rendering an empty one.
 */
export function relatedProducts(
  product: Product,
  all: readonly Product[],
  limit = 4,
): readonly Product[] {
  if (product.relatedSlugs !== undefined && product.relatedSlugs.length > 0) {
    // Declared order is honoured exactly, and is not capped.
    return product.relatedSlugs
      .map((slug) => all.find((candidate) => candidate.slug === slug))
      .filter((candidate): candidate is Product => candidate !== undefined);
  }

  const others = all.filter((candidate) => candidate.slug !== product.slug);

  const sharingCollection = others.filter((candidate) =>
    candidate.collections.some((slug) => product.collections.includes(slug)),
  );

  const pool =
    sharingCollection.length > 0
      ? sharingCollection
      : others.filter((candidate) => candidate.category === product.category);

  return pool.slice(0, limit);
}
