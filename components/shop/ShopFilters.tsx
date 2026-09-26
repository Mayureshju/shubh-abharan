"use client";

import Link from "next/link";
import { type FormEvent } from "react";
import { buttonClass } from "@/components/ui/buttonClass";
import {
  AVAILABILITY_LABELS,
  AVAILABILITY_ORDER,
  SORT_LABELS,
  SORT_ORDER,
} from "@/lib/catalog/labels";
import { shopHasFilters, type ShopSearch } from "./query";

/**
 * GET form for the shop surface. Desktop renders it inline; the mobile sheet
 * mounts a second copy with a distinct id prefix. Submitting reloads /shop
 * with the query, so filters work without the sheet's client script.
 */

const FIELD =
  "rounded-input w-full border border-on-surface bg-transparent px-3 py-2 text-body placeholder:text-muted";

export function ShopFilters({
  query,
  idPrefix,
  categories,
  tags = [],
}: {
  query: ShopSearch;
  idPrefix: string;
  categories: readonly { slug: string; name: string }[];
  tags?: readonly { slug: string; name: string }[];
}) {
  const sort = query.sort ?? "display";

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const data = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    for (const [key, value] of data.entries()) {
      if (String(value) !== "") params.set(key, String(value));
    }
    event.preventDefault();
    const queryString = params.toString();
    window.location.assign(queryString === "" ? "/shop" : `/shop?${queryString}`);
  }

  return (
    <form method="get" action="/shop" onSubmit={onSubmit} className="flex flex-col gap-tight">
      <fieldset className="min-w-0 border-0 p-0">
        <legend className="text-caption uppercase tracking-[0.22em] text-accent">Type</legend>
        <ul className="mt-3 space-y-1">
          <li>
            <Radio
              id={`${idPrefix}-category-all`}
              name="category"
              value=""
              checked={query.category === undefined}
              label="All pieces"
            />
          </li>
          {categories.map((category) => (
            <li key={category.slug}>
              <Radio
                id={`${idPrefix}-category-${category.slug}`}
                name="category"
                value={category.slug}
                checked={query.category === category.slug}
                label={category.name}
              />
            </li>
          ))}
        </ul>
      </fieldset>

      {tags.length > 0 ? (
        <fieldset className="min-w-0 border-0 p-0">
          <legend className="text-caption uppercase tracking-[0.22em] text-accent">Tag</legend>
          <ul className="mt-3 space-y-1">
            <li>
              <Radio
                id={`${idPrefix}-tag-all`}
                name="tag"
                value=""
                checked={query.tag === undefined}
                label="Any"
              />
            </li>
            {tags.map((tag) => (
              <li key={tag.slug}>
                <Radio
                  id={`${idPrefix}-tag-${tag.slug}`}
                  name="tag"
                  value={tag.slug}
                  checked={query.tag === tag.slug}
                  label={tag.name}
                />
              </li>
            ))}
          </ul>
        </fieldset>
      ) : null}

      <fieldset className="min-w-0 border-0 p-0">
        <legend className="text-caption uppercase tracking-[0.22em] text-accent">Availability</legend>
        <ul className="mt-3 space-y-1">
          <li>
            <Radio
              id={`${idPrefix}-availability-any`}
              name="availability"
              value=""
              checked={query.availability === undefined}
              label="Any"
            />
          </li>
          {AVAILABILITY_ORDER.map((availability) => (
            <li key={availability}>
              <Radio
                id={`${idPrefix}-availability-${availability}`}
                name="availability"
                value={availability}
                checked={query.availability === availability}
                label={AVAILABILITY_LABELS[availability]}
              />
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset className="min-w-0 border-0 p-0">
        <legend className="text-caption uppercase tracking-[0.22em] text-accent">Sort</legend>
        <ul className="mt-3 space-y-1">
          {SORT_ORDER.map((order) => (
            <li key={order}>
              <Radio
                id={`${idPrefix}-sort-${order}`}
                name="sort"
                value={order === "display" ? "" : order}
                checked={sort === order}
                label={SORT_LABELS[order]}
              />
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset className="min-w-0 border-0 p-0">
        <legend className="text-caption uppercase tracking-[0.22em] text-accent">Price</legend>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <p>
            <label htmlFor={`${idPrefix}-min`} className="text-caption uppercase text-muted">
              Minimum
            </label>
            <input
              id={`${idPrefix}-min`}
              name="min"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              defaultValue={query.min ?? ""}
              className={`${FIELD} mt-1`}
            />
          </p>
          <p>
            <label htmlFor={`${idPrefix}-max`} className="text-caption uppercase text-muted">
              Maximum
            </label>
            <input
              id={`${idPrefix}-max`}
              name="max"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              defaultValue={query.max ?? ""}
              className={`${FIELD} mt-1`}
            />
          </p>
        </div>
      </fieldset>

      <p
        className={
          "flex flex-wrap items-center gap-4 bg-surface " +
          (idPrefix === "sheet" ? "sticky bottom-0 pt-4" : "")
        }
      >
        <button type="submit" className={buttonClass("quiet")}>
          Apply
        </button>
        {shopHasFilters(query) ? (
          <Link href="/shop" className={buttonClass("inline")}>
            Clear filters
          </Link>
        ) : null}
      </p>
    </form>
  );
}

function Radio({
  id,
  name,
  value,
  checked,
  label,
}: {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  label: string;
}) {
  return (
    <label htmlFor={id} className="inline-flex min-h-11 items-center gap-3 text-body">
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        defaultChecked={checked}
        className="size-[1.125rem] accent-lilac"
      />
      {label}
    </label>
  );
}
