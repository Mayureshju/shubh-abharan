/**
 * Presentation labels for catalog closed unions.
 *
 * The unions live in types.ts; this module is the one place a surface reads a
 * human label for them, so shop, footer and overlay cannot drift in spelling.
 */

import type { Availability, Category } from "./types";
import type { SortOrder } from "./criteria";

export const CATEGORY_LABELS: Record<string, string> = {
  ring: "Rings",
  necklace: "Necklaces",
  pendant: "Pendants",
  earring: "Earrings",
  bracelet: "Bracelets",
  set: "Sets",
};

/** Seeded shop facet order. Live categories from Mongo append after these. */
export const CATEGORY_ORDER: readonly Category[] = [
  "necklace",
  "ring",
  "bracelet",
  "earring",
  "pendant",
  "set",
];

export function categoryLabel(slug: string, name?: string): string {
  if (name) return name;
  return CATEGORY_LABELS[slug] ?? slug.replace(/-/g, " ");
}

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  available: "Available",
  "made-to-order": "Made to order",
  "sold-out": "Sold out",
  unavailable: "Unavailable",
};

export const AVAILABILITY_ORDER: readonly Availability[] = [
  "available",
  "made-to-order",
  "sold-out",
  "unavailable",
];

export const SORT_LABELS: Record<SortOrder, string> = {
  display: "Listed order",
  "price-asc": "Price, low to high",
  "price-desc": "Price, high to low",
};

export const SORT_ORDER: readonly SortOrder[] = ["display", "price-asc", "price-desc"];
