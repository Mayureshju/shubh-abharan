"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { buttonClass } from "@/components/ui/buttonClass";
import { ChevronIcon } from "@/components/ui/icons";
import type { FilterGroup, FilterMenus } from "./filters";

/**
 * Shop filters from 1024px: one row of menus above the grid. Each menu is a
 * native <details>, so it opens by pointer or keyboard without script, and each
 * option is a link from shopFilterMenus. Script only closes what the platform
 * leaves open. Below 1024px FilterSheet takes over.
 */

export function FilterBar({
  menus,
  start,
  end,
  total,
}: {
  menus: FilterMenus;
  start: number;
  end: number;
  total: number;
}) {
  const barRef = useRef<HTMLDivElement>(null);

  // <details> stays open after a click elsewhere, Escape, or a soft navigation.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const openMenus = () => bar.querySelectorAll<HTMLDetailsElement>("details[open]");
    const close = (menu: HTMLDetailsElement, refocus: boolean) => {
      menu.open = false;
      if (refocus) menu.querySelector("summary")?.focus();
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element;
      for (const menu of openMenus()) {
        if (!menu.contains(target)) close(menu, false);
        else if (target.closest("a")) close(menu, true);
      }
    };
    // Focus only; the link rule above would close a menu as Tab enters it.
    const onFocusIn = (event: FocusEvent) => {
      for (const menu of openMenus()) {
        if (!menu.contains(event.target as Node)) close(menu, false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      for (const menu of openMenus()) close(menu, true);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div
      ref={barRef}
      className="mt-tight hidden flex-wrap items-center gap-x-8 border-y border-line py-2 lg:flex"
    >
      {menus.filters.map((group) => (
        <Menu key={group.label} group={group} />
      ))}
      {menus.clearHref ? (
        <Link href={menus.clearHref} className={buttonClass("inline")}>
          Clear filters
        </Link>
      ) : null}
      <div className="ml-auto flex items-center gap-8">
        {total > 0 ? (
          <p className="whitespace-nowrap text-caption uppercase text-muted tabular-nums">
            {start}–{end} of {total}
          </p>
        ) : null}
        <Menu group={menus.sort} alignEnd />
      </div>
    </div>
  );
}

function Menu({ group, alignEnd = false }: { group: FilterGroup; alignEnd?: boolean }) {
  return (
    // One name: the platform keeps a single menu open.
    <details name="shop-filter" className="group relative">
      <summary className="flex min-h-11 cursor-pointer items-center gap-2 text-caption uppercase [&::-webkit-details-marker]:hidden">
        <span className="tracking-[0.22em] text-accent">{group.label}</span>
        {group.value ? <span>{group.value}</span> : null}
        {/* No transition: the flip is state, and reduced motion keeps it. */}
        <span className="-mx-1 inline-flex group-open:rotate-180" aria-hidden="true">
          <ChevronIcon />
        </span>
      </summary>
      <ul
        aria-label={group.label}
        // mt-2 clears the bar's padding, so the panel hangs from its rule.
        className={`absolute top-full z-10 mt-2 w-max min-w-48 border border-line bg-surface py-2 ${alignEnd ? "right-0" : "left-0"}`}
      >
        {group.options.map((option) => (
          <li key={option.label}>
            <Link
              href={option.href}
              aria-current={option.on ? "true" : undefined}
              className={
                "flex min-h-11 items-center px-4 text-caption uppercase underline-offset-[6px] " +
                (option.on ? "underline decoration-accent" : "text-muted hover:text-on-surface")
              }
            >
              {option.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
