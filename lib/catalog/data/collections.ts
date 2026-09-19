/**
 * Collections come from the brand record — they are the primary navigation
 * axis and their names, slugs and descriptions are brand-owned.
 *
 * `brand.collections` is empty until the business supplies it (see
 * BRAND-INPUTS.md — Collections). While it is empty there are no collections,
 * so no product declares a membership and collection pages have nothing to
 * render. That is the honest state, not a gap to fill with invented names:
 * writing fixture collections into lib/brand.ts would put non-brand values
 * through the one boundary that exists to keep them out.
 *
 * This module adds exactly one thing the brand record does not carry —
 * presentation order within a collection.
 */

// Explicit .ts specifiers: scripts/check-catalog.mjs loads this module directly
// under Node's type stripping, and Node's ESM resolver requires the extension.
import { brand } from "../../brand.ts";
import type { Collection } from "../types.ts";

/**
 * Collection slug -> product slugs, in the order that collection presents them.
 * A collection absent from this map presents no products.
 */
const PRODUCT_ORDER: Readonly<Record<string, readonly string[]>> = {
  "modern-classics": [
    "floral-kundan-collar",
    "emerald-drop-kundan-necklace",
    "chandbali-earrings",
    "stacked-emerald-rings",
    "emerald-silk-bridal-set",
  ],
};

export const collections: readonly Collection[] = brand.collections.map((collection) => ({
  slug: collection.slug,
  name: collection.name,
  description: collection.description,
  productSlugs: PRODUCT_ORDER[collection.slug] ?? [],
}));
