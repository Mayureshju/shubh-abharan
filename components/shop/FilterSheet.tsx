"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { buttonClass } from "@/components/ui/buttonClass";
import { CloseIcon } from "@/components/ui/icons";
import { ModalDialog } from "@/components/ui/ModalDialog";
import type { FilterGroup, FilterMenus } from "./filters";

/**
 * Shop filters below 1024px (FilterBar takes over above). A bar fixed to the
 * bottom keeps Filter in thumb reach while the grid scrolls; it precedes the
 * grid in the DOM so keyboard and screen-reader users meet it first, and
 * `data-filter-bar` pads the page and its focus scroll (globals.css). The
 * sheet's chips are links: a tap applies while the sheet stays open, because
 * a search-param navigation keeps this island's state.
 */

const CHIP =
  "inline-flex min-h-[44px] items-center whitespace-nowrap rounded-pill border px-[18px] " +
  "text-caption uppercase transition-colors duration-[var(--duration-quick)] ease-[var(--ease-out)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2";

export function FilterSheet({ menus, countLabel }: { menus: FilterMenus; countLabel: string }) {
  const [open, setOpen] = useState(false);
  const active = menus.filters.filter((group) => group.value).length;

  return (
    <div
      data-filter-bar
      className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-surface lg:hidden"
    >
      <div className="page-gutter flex items-center justify-between gap-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <p className="text-caption uppercase text-muted">{countLabel}</p>
        <Button variant="quiet" onClick={() => setOpen(true)}>
          {active > 0 ? `Filter (${active})` : "Filter"}
        </Button>
      </div>
      <ModalDialog open={open} onClose={() => setOpen(false)} label="Filter and sort" placement="sheet">
        <div className="flex items-center justify-between">
          <p className="text-caption uppercase text-muted">Filter and sort</p>
          <Button variant="icon" onClick={() => setOpen(false)} aria-label="Close filters">
            <CloseIcon />
          </Button>
        </div>
        {/* The inset keeps chip focus rings clear of the scroll clip. */}
        <div className="-mx-1 mt-3 min-h-0 flex-1 space-y-6 overflow-y-auto px-1 py-1">
          {[...menus.filters, menus.sort].map((group) => (
            <Group key={group.label} group={group} />
          ))}
        </div>
        <div className="mt-4 flex items-center gap-6 border-t border-line pt-4">
          {menus.clearHref ? (
            <Link href={menus.clearHref} className={buttonClass("inline")}>
              Clear filters
            </Link>
          ) : null}
          <Button variant="primary" className="flex-1" onClick={() => setOpen(false)}>
            Show {countLabel}
          </Button>
        </div>
      </ModalDialog>
    </div>
  );
}

function Group({ group }: { group: FilterGroup }) {
  const id = `sheet-filter-${group.label.toLowerCase()}`;
  return (
    <div>
      <p id={id} className="text-caption uppercase tracking-[0.22em] text-accent">
        {group.label}
      </p>
      <ul aria-labelledby={id} className="mt-3 flex flex-wrap gap-2">
        {/* Keyed by label: a chip keeps focus when navigation changes its href. */}
        {group.options.map((option) => (
          <li key={option.label}>
            <Link
              href={option.href}
              aria-current={option.on ? "true" : undefined}
              className={`${CHIP} ${option.on ? "border-lavender bg-lavender text-charcoal" : "border-line hover:border-on-surface"}`}
            >
              {option.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
