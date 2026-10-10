import type { Availability, Money, ProductImage } from "@/lib/catalog/types";

/**
 * Plain module shared by the server page and the client purchase panel. A
 * constant exported from a "use client" file reaches a server component as a
 * client reference, not a value — the same reason `buttonClass.ts` exists.
 */

/**
 * The product page's two columns. The page and the fixed purchase bar's inner
 * row both use it, so the bar's actions sit exactly under the details column.
 */
export const PDP_COLUMNS =
  "md:grid md:grid-cols-2 md:gap-x-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-x-16";

export const buyable = (availability: Availability | undefined) =>
  availability === "available" || availability === "made-to-order";

export type PurchaseVariant = {
  readonly id: string;
  readonly size: string | null;
  readonly availability: Availability;
  /** Payable price after sale and hike; null while unsupplied. */
  readonly price: Money | null;
  /** Shown struck through when higher than `price`. */
  readonly compare: Money | null;
};

/** One add-on as the rail offers it: its first buyable, priced variant. */
export type AddonOption = {
  readonly productId: string;
  readonly variantId: string;
  readonly name: string;
  readonly price: Money;
  readonly image: ProductImage;
};
