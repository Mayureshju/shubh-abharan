/**
 * Shop filter options as data, built once on the server and rendered by
 * FilterBar (menus from 1024px) and FilterSheet (chips below it). Every option
 * is the shop URL with that one filter changed and the page reset, so it
 * applies on activation without script.
 */

import {
  AVAILABILITY_LABELS,
  AVAILABILITY_ORDER,
  SORT_LABELS,
  SORT_ORDER,
} from "@/lib/catalog/labels";
import { formatMoney } from "@/lib/catalog/money";
import { shopHref, type ShopSearch } from "./query";

export type FilterOption = { label: string; href: string; on: boolean };

/** `options[0]` is the default; `value` names the current option when it isn't. */
export type FilterGroup = { label: string; value?: string; options: FilterOption[] };

export type FilterMenus = { filters: FilterGroup[]; sort: FilterGroup; clearHref?: string };

type Named = { slug: string; name: string };

// Whole rupees, inclusive bounds, so neighbouring bands share their edge.
const PRICE_BANDS: readonly { min?: number; max?: number }[] = [
  { min: undefined, max: 25000 },
  { min: 25000, max: 50000 },
  { min: 50000, max: 100000 },
  { min: 100000, max: undefined },
];

const rupees = (major: number) => formatMoney({ amount: major * 100, currency: "INR" });

function priceLabel(min?: number, max?: number): string {
  if (min === undefined) return `Up to ${rupees(max ?? 0)}`;
  if (max === undefined) return `From ${rupees(min)}`;
  return `${rupees(min)} – ${rupees(max)}`;
}

function group(label: string, options: FilterOption[]): FilterGroup {
  return { label, options, value: options.slice(1).find((option) => option.on)?.label };
}

export function shopFilterMenus(
  query: ShopSearch,
  categories: readonly Named[],
  tags: readonly Named[],
): FilterMenus {
  const option = (label: string, change: Partial<ShopSearch>, on: boolean): FilterOption => ({
    label,
    href: shopHref({ ...query, ...change }, 1),
    on,
  });
  const anyPrice = query.min === undefined && query.max === undefined;
  const band = PRICE_BANDS.find((entry) => entry.min === query.min && entry.max === query.max);
  const sort = query.sort ?? "display";

  const filters = [
    group("Type", [
      option("All pieces", { category: undefined }, query.category === undefined),
      ...categories.map((category) =>
        option(category.name, { category: category.slug }, query.category === category.slug),
      ),
    ]),
    group("Price", [
      option("All prices", { min: undefined, max: undefined }, anyPrice),
      // A range from the URL that no band matches.
      ...(anyPrice || band ? [] : [option(priceLabel(query.min, query.max), {}, true)]),
      ...PRICE_BANDS.map((entry) => option(priceLabel(entry.min, entry.max), entry, entry === band)),
    ]),
    group("Availability", [
      option("Any", { availability: undefined }, query.availability === undefined),
      ...AVAILABILITY_ORDER.map((availability) =>
        option(AVAILABILITY_LABELS[availability], { availability }, query.availability === availability),
      ),
    ]),
  ];
  if (tags.length > 0) {
    filters.push(
      group("Tag", [
        option("Any", { tag: undefined }, query.tag === undefined),
        ...tags.map((tag) => option(tag.name, { tag: tag.slug }, query.tag === tag.slug)),
      ]),
    );
  }

  return {
    filters,
    sort: group(
      "Sort",
      SORT_ORDER.map((order) =>
        option(SORT_LABELS[order], { sort: order === "display" ? undefined : order }, order === sort),
      ),
    ),
    // Not shopHasFilters: that counts sort, which Clear keeps.
    clearHref: filters.some((entry) => entry.value) ? shopHref({ sort: query.sort }, 1) : undefined,
  };
}
