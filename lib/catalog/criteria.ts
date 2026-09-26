import type { Availability, Category, VariantAxis } from "./types";

export type SortOrder = "display" | "price-asc" | "price-desc";

export interface ListCriteria {
  readonly category?: Category;
  readonly collection?: string;
  readonly occasion?: string;
  readonly option?: { readonly axis: VariantAxis; readonly value: string };
  readonly availability?: Availability;
  readonly minPrice?: number;
  readonly maxPrice?: number;
  readonly sort?: SortOrder;
  readonly tag?: string;
  readonly isNew?: boolean;
  readonly isFeatured?: boolean;
}
