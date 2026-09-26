/**
 * Shop URL query: type guards only. Unknown values are dropped so a typo
 * cannot 404 the listing.
 */

import {
  AVAILABILITY_ORDER,
  SORT_ORDER,
} from "@/lib/catalog/labels";
import type { Availability, Category } from "@/lib/catalog/types";
import type { ListCriteria, SortOrder } from "@/lib/catalog/criteria";

export type ShopSearch = {
  readonly category?: Category;
  readonly sort?: SortOrder;
  readonly availability?: Availability;
  readonly min?: number;
  readonly max?: number;
  readonly tag?: string;
};

export type SearchParamsInput = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseMajor(value: string | undefined): number | undefined {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  if (trimmed === "" || !/^\d+$/.test(trimmed)) return undefined;
  return Number(trimmed);
}

export function parseShopSearch(params: SearchParamsInput): ShopSearch {
  const categoryRaw = first(params.category);
  const sortRaw = first(params.sort);
  const availabilityRaw = first(params.availability);
  const tagRaw = first(params.tag);

  return {
    category:
      categoryRaw !== undefined && /^[a-z0-9-]+$/.test(categoryRaw) ? categoryRaw : undefined,
    sort:
      sortRaw !== undefined && (SORT_ORDER as readonly string[]).includes(sortRaw)
        ? (sortRaw as SortOrder)
        : undefined,
    availability:
      availabilityRaw !== undefined &&
      (AVAILABILITY_ORDER as readonly string[]).includes(availabilityRaw)
        ? (availabilityRaw as Availability)
        : undefined,
    min: parseMajor(first(params.min)),
    max: parseMajor(first(params.max)),
    tag: tagRaw !== undefined && /^[a-z0-9-]+$/.test(tagRaw) ? tagRaw : undefined,
  };
}

export function toListCriteria(search: ShopSearch): ListCriteria {
  return {
    category: search.category,
    sort: search.sort,
    availability: search.availability,
    minPrice: search.min !== undefined ? search.min * 100 : undefined,
    maxPrice: search.max !== undefined ? search.max * 100 : undefined,
    tag: search.tag,
  };
}

export function shopHasFilters(search: ShopSearch): boolean {
  return (
    search.category !== undefined ||
    (search.sort !== undefined && search.sort !== "display") ||
    search.availability !== undefined ||
    search.min !== undefined ||
    search.max !== undefined ||
    search.tag !== undefined
  );
}

/** Remount the GET form when the query changes so defaultChecked tracks the URL. */
export function shopQueryKey(search: ShopSearch): string {
  return [
    search.category ?? "",
    search.sort ?? "",
    search.availability ?? "",
    search.min ?? "",
    search.max ?? "",
    search.tag ?? "",
  ].join(":");
}
