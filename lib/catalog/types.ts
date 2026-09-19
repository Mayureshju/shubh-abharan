/**
 * The canonical shape of everything the storefront sells.
 *
 * This module is the sole owner of product shape. No component, page or route
 * handler declares a product field of its own — a surface needing a value that
 * is not here gets it added here, which requires amending
 * specs/catalog/product-model first.
 *
 * Two rules govern what may exist in this file:
 *
 *   1. There is no field for a rating, review, review count, testimonial,
 *      compare-at price, discount, sale flag, stock count, countdown or
 *      bestseller marker. Their absence is the enforcement — a surface cannot
 *      render what the type does not carry. `scripts/check-catalog.mjs` fails
 *      the build if one is reintroduced.
 *
 *   2. Values owned by the business are nullable and resolve through
 *      `lib/brand.ts`. Structural values — identity, category, axes, image
 *      roles, availability — are required, because they are facts about the
 *      model rather than claims about the product.
 */

import type { PlateProps } from "@/components/editorial/Plate";
import type { BrandField } from "@/lib/brand";

/* -------------------------------------------------------------------------- */
/* Identity                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Identifiers are opaque and stable; slugs are public and may change.
 *
 * Cart lines and wishlist entries store identifiers, never slugs — this
 * project's only persistence is the visitor's browser, which has no migration
 * path, so a slug rename must not invalidate a saved selection.
 *
 * The brands are erased at runtime. They exist so that passing a ProductId
 * where a VariantId belongs is a compile error rather than a silent lookup
 * miss; both are strings and are easy to transpose.
 */
export type ProductId = string & { readonly __brand: "ProductId" };
export type VariantId = string & { readonly __brand: "VariantId" };

/** Authoring helpers. The only sanctioned way to mint an id in fixture data. */
export const asProductId = (value: string): ProductId => value as ProductId;
export const asVariantId = (value: string): VariantId => value as VariantId;

/* -------------------------------------------------------------------------- */
/* Money                                                                       */
/* -------------------------------------------------------------------------- */

export type CurrencyCode = "GBP" | "EUR" | "USD";

/**
 * Integer minor units, never a float and never a preformatted string.
 *
 * Floats cannot sum a cart exactly; strings cannot be summed, sorted or
 * compared, and bake a locale into data. Formatting happens once, at the edge,
 * in `money.ts`.
 *
 * The currency travels with the amount rather than sitting in global config —
 * one field, and it is the difference between adding a second currency later
 * by editing data versus editing every price site.
 */
export interface Money {
  /** Integer, in the currency's minor unit. 4250 = £42.50. */
  readonly amount: number;
  readonly currency: CurrencyCode;
}

/* -------------------------------------------------------------------------- */
/* Classification                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Closed by design. Category is the type filter on the shop surface; it is
 * never top-level navigation, which is collection-led.
 */
export type Category = "ring" | "necklace" | "pendant" | "earring" | "bracelet" | "set";

/**
 * A named editorial grouping, sourced from the brand record. Membership is
 * independent of category: a collection may hold pieces of any type.
 */
export interface Collection {
  readonly slug: string;
  readonly name: string;
  readonly description: BrandField;
  /** Product slugs, in the order the collection presents them. */
  readonly productSlugs: readonly string[];
}

/* -------------------------------------------------------------------------- */
/* Variants                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Closed union rather than an open string: a filter UI would otherwise have to
 * discover axes at runtime, and two products could disagree on spelling.
 * Adding a fifth axis is a one-line edit plus whatever the compiler then flags
 * as non-exhaustive — that flagging is the point.
 */
export type VariantAxis = "size" | "length" | "finish" | "metal";

export interface ProductOption {
  readonly axis: VariantAxis;
  /** Ordered — presentation order for selectors. Ring sizes are not alphabetical. */
  readonly values: readonly string[];
}

/** One purchasable configuration. The unit added to the cart. */
export interface ProductVariant {
  readonly id: VariantId;
  /** One entry per axis the product declares. */
  readonly options: Readonly<Partial<Record<VariantAxis, string>>>;
  /** Null until the business supplies it. Price is carried here because configuration affects cost. */
  readonly price: Money | null;
  /**
   * Required and non-nullable, deliberately. An absent availability has no safe
   * default: `available` is an invented inventory claim and `unavailable`
   * silently empties the shop. The author has to state it.
   *
   * There is no quantity, threshold or restock date, so scarcity messaging is
   * unrepresentable.
   */
  readonly availability: Availability;
  readonly sku?: string;
}

export type Availability = "available" | "made-to-order" | "sold-out" | "unavailable";

/* -------------------------------------------------------------------------- */
/* Descriptive data                                                            */
/* -------------------------------------------------------------------------- */

/** A supplied row of the product specification table. Never generated from other fields. */
export interface ProductAttribute {
  readonly label: string;
  readonly value: string;
}

/**
 * Manufacturing facts, not marketing badges.
 *
 * Closed union: "Sale", "Only 2 left" and "Bestseller" cannot be expressed.
 * Labels do not render on the product card — design-system/core-components
 * forbids badge affordances there, and that requirement is unmodified. They
 * surface on the product detail page only.
 */
export type ProductLabel = "made-to-order" | "one-of-a-kind" | "hallmarked" | "limited-run";

/* -------------------------------------------------------------------------- */
/* Images                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * The design system's image contract, narrowed to require alt text.
 *
 * Reusing `PlateProps` means the scale-requires-dimension and
 * alt-or-decorative unions are inherited rather than restated, and a
 * ProductImage spreads straight into `<Plate {...image} />` with no adapter.
 * Intersecting `alt` excludes the decorative branch: a product image always
 * describes a product.
 */
export type ProductImage = PlateProps & { readonly alt: string };

/**
 * Order is the ordering. `images[0]` is primary, `images[1]` secondary, the
 * whole list is the gallery. There is deliberately no primaryImageId field,
 * because a separate pointer can disagree with the array and an index cannot.
 *
 * The non-empty tuple makes "a product has at least one image" a compile-time
 * guarantee, which is what lets `imageForRole` fall back without a null check.
 */
export type ProductImages = readonly [ProductImage, ...ProductImage[]];

/* -------------------------------------------------------------------------- */
/* Product                                                                     */
/* -------------------------------------------------------------------------- */

export interface Product {
  /* Structural — required, because a storefront cannot be built without them. */
  readonly id: ProductId;
  readonly slug: string;
  readonly name: string;
  readonly category: Category;
  /** The axes this product offers. Empty when it offers no choice. */
  readonly options: readonly ProductOption[];
  readonly variants: readonly [ProductVariant, ...ProductVariant[]];
  readonly images: ProductImages;
  /** Collection slugs. Empty is valid — the piece is still reachable by shop and search. */
  readonly collections: readonly string[];

  /* Brand-owned — null until the business supplies it. Never defaulted. */
  readonly materialLine: BrandField;
  readonly description: BrandField;
  readonly care: BrandField;

  /* Optional. Absence is the default. */
  readonly attributes?: readonly ProductAttribute[];
  readonly labels?: readonly ProductLabel[];
  /** Explicit related products, in declared order. Overrides derivation. */
  readonly relatedSlugs?: readonly string[];
  /** For the `set` category: the products that compose it. */
  readonly componentSlugs?: readonly string[];
}

/* -------------------------------------------------------------------------- */
/* Customer selections                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Reference shapes only — no name, price, image or material is copied in.
 * Display values resolve from the catalog at render time, so a data change is
 * reflected without migrating anything the visitor has stored.
 *
 * Storage, reducers and persistence belong to a later change.
 */
export interface CartLine {
  readonly variantId: VariantId;
  readonly quantity: number;
}

export interface WishlistEntry {
  readonly productId: ProductId;
  /** Present only where the customer made a selection. */
  readonly variantId?: VariantId;
}

/* -------------------------------------------------------------------------- */
/* Presentation contract                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Moved here from components/product/ProductCard.tsx so the catalog owns every
 * product shape. The card re-exports it, so its own imports are unchanged.
 *
 * `Product` is deliberately *not* assignable to this: price here is already
 * formatted and materialLine is already resolved, and the card cannot know
 * which image role the layout wants. `toProductCardProduct` in derive.ts is
 * the one path between them.
 *
 * Keeping the card's prop this narrow is what makes "no badge, rating,
 * discount or scarcity affordance exists" a guarantee of the type system
 * rather than a rule of review.
 */
export type CardImage =
  | {
      role: "scale";
      /** Required for the scale role — it exists to communicate true size. */
      dimension: string;
      src?: string;
      alt: string;
      aspect: string;
      crop?: string;
    }
  | {
      role: Exclude<PlateProps["role"], "scale">;
      dimension?: string;
      src?: string;
      alt: string;
      aspect: string;
      crop?: string;
    };

export interface ProductCardProduct {
  slug: string;
  name: string;
  /** Already formatted, or a marked placeholder. See money.ts. */
  price: string;
  /** e.g. "9ct recycled gold · 1.2mm" — a measurable fact, per the copy rule. */
  materialLine: string;
  image: CardImage;
}
