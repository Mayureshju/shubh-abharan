import type { Availability, Money, ProductImage } from "@/lib/catalog/types";

/**
 * Plain module shared by the server page and the client purchase panel. A
 * constant exported from a "use client" file reaches a server component as a
 * client reference, not a value — the same reason `buttonClass.ts` exists.
 */

/**
 * The product page's two columns. Phones stack. From 768px the photo and
 * the details share the row. From 1280px the photo stops at 32rem and the
 * details column keeps the rest, so add-ons have room on a wide screen.
 */
export const PDP_COLUMNS =
  "md:grid md:items-start md:grid-cols-2 md:gap-x-8 xl:grid-cols-[minmax(0,32rem)_minmax(0,1fr)] xl:gap-x-12";

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
