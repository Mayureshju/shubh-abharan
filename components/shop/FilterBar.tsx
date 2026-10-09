"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { buttonClass } from "@/components/ui/buttonClass";
import type { SortOrder } from "@/lib/catalog/criteria";
import {
  AVAILABILITY_LABELS,
  AVAILABILITY_ORDER,
  SORT_LABELS,
  SORT_ORDER,
} from "@/lib/catalog/labels";
import { formatMoney } from "@/lib/catalog/money";
import { shopHref, type ShopSearch } from "./query";

/**
 * Shop filters above the grid, from 1024px. Every option is a link to the shop URL
 * with that one filter changed and the page reset, so it applies on click
 * without script. Below 1024px FilterSheet takes over: the bar wraps too tall.
 */

const CHIP =
  "inline-flex min-h-[44px] items-center whitespace-nowrap rounded-pill border px-[18px] " +
  "text-caption uppercase transition-colors duration-[var(--duration-quick)] ease-[var(--ease-out)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2";

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

export function FilterBar({
  query,
  categories,
  tags,
  start,
  end,
  total,
}: {
  query: ShopSearch;
  categories: readonly { slug: string; name: string }[];
  tags: readonly { slug: string; name: string }[];
  start: number;
  end: number;
  total: number;
}) {
  const router = useRouter();
  const to = (change: Partial<ShopSearch>) => shopHref({ ...query, ...change }, 1);
  const sort = query.sort ?? "display";
  const noPrice = query.min === undefined && query.max === undefined;
  const band = PRICE_BANDS.find((entry) => entry.min === query.min && entry.max === query.max);

  return (
    <div className="mt-tight hidden border-y border-line lg:block">
      <div className="flex flex-wrap items-center gap-x-10 gap-y-4 py-5">
        <Group label="Type">
          <Chip href={to({ category: undefined })} on={query.category === undefined}>
            All pieces
          </Chip>
          {categories.map((category) => (
            <Chip
              key={category.slug}
              href={to({ category: category.slug })}
              on={query.category === category.slug}
            >
              {category.name}
            </Chip>
          ))}
        </Group>
        {tags.length > 0 ? (
          <Group label="Tag">
            <Chip href={to({ tag: undefined })} on={query.tag === undefined}>
              Any
            </Chip>
            {tags.map((tag) => (
              <Chip key={tag.slug} href={to({ tag: tag.slug })} on={query.tag === tag.slug}>
                {tag.name}
              </Chip>
            ))}
          </Group>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-line py-5">
        <Group label="Price">
          <Chip href={to({ min: undefined, max: undefined })} on={noPrice}>
            All prices
          </Chip>
          {/* A range typed into the phone sheet or the URL that no band matches. */}
          {!noPrice && band === undefined ? (
            <Chip href={to({})} on>
              {priceLabel(query.min, query.max)}
            </Chip>
          ) : null}
          {PRICE_BANDS.map((entry) => (
            <Chip key={priceLabel(entry.min, entry.max)} href={to(entry)} on={entry === band}>
              {priceLabel(entry.min, entry.max)}
            </Chip>
          ))}
        </Group>
        <Group label="Availability">
          <Chip href={to({ availability: undefined })} on={query.availability === undefined}>
            Any
          </Chip>
          {AVAILABILITY_ORDER.map((availability) => (
            <Chip
              key={availability}
              href={to({ availability })}
              on={query.availability === availability}
            >
              {AVAILABILITY_LABELS[availability]}
            </Chip>
          ))}
        </Group>

        <div className="ml-auto flex items-center gap-6">
          {total > 0 ? (
            <p className="whitespace-nowrap text-caption uppercase text-muted tabular-nums">
              {start}–{end} of {total}
            </p>
          ) : null}
          {/* GET fallback: without script the noscript button submits the same query. */}
          <form method="get" action="/shop" className="flex items-center gap-3">
            {(["category", "availability", "min", "max", "tag"] as const).map((key) =>
              query[key] === undefined ? null : (
                <input key={key} type="hidden" name={key} value={String(query[key])} />
              ),
            )}
            <label htmlFor="shop-sort" className="text-caption uppercase tracking-[0.22em] text-accent">
              Sort
            </label>
            <select
              key={sort}
              id="shop-sort"
              name="sort"
              defaultValue={sort === "display" ? "" : sort}
              onChange={(event) =>
                router.push(to({ sort: (event.target.value || undefined) as SortOrder | undefined }))
              }
              className="rounded-input min-h-[44px] border border-line bg-surface px-3 text-caption uppercase hover:border-on-surface"
            >
              {SORT_ORDER.map((order) => (
                <option key={order} value={order === "display" ? "" : order}>
                  {SORT_LABELS[order]}
                </option>
              ))}
            </select>
            <noscript>
              <button type="submit" className={buttonClass("quiet")}>
                Apply
              </button>
            </noscript>
          </form>
        </div>
      </div>
    </div>
  );
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  const id = `filter-${label.toLowerCase()}`;
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <p id={id} className="text-caption uppercase tracking-[0.22em] text-accent">
        {label}
      </p>
      <ul aria-labelledby={id} className="flex flex-wrap gap-2">
        {children}
      </ul>
    </div>
  );
}

function Chip({ href, on, children }: { href: string; on: boolean; children: ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        aria-current={on ? "true" : undefined}
        className={`${CHIP} ${on ? "border-lavender bg-lavender text-charcoal" : "border-line hover:border-on-surface"}`}
      >
        {children}
      </Link>
    </li>
  );
}
