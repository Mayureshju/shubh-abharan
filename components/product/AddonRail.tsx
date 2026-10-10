"use client";

import { useEffect, useRef, useState } from "react";
import { Plate } from "@/components/editorial/Plate";
import { Button } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/ui/icons";
import { formatMoney } from "@/lib/catalog/money";
import type { AddonOption } from "./purchase";

/**
 * The add-ons rail on the product page — see storefront/product-detail.
 *
 * Each add-on is a native checkbox inside its card, so pointer, touch, Tab and
 * Space all work without script. Ticking is page state only; the bag changes
 * when the customer chooses Add to bag or Buy now.
 *
 * The row is native scroll-snap. From 768px, previous/next buttons scroll it
 * by most of its width, and they appear only when the row overflows.
 */
export function AddonRail({
  addons,
  chosen,
  onToggle,
}: {
  addons: readonly AddonOption[];
  chosen: ReadonlySet<string>;
  onToggle: (variantId: string) => void;
}) {
  const railRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ overflow: false, start: true, end: true });

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const measure = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      setEdges({ overflow: max > 1, start: rail.scrollLeft <= 1, end: rail.scrollLeft >= max - 1 });
    };
    measure();
    rail.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    return () => {
      rail.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, []);

  // No `behavior`: the rail's smooth scroll applies, and reduced motion
  // turns it off in the stylesheet.
  const page = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (rail) rail.scrollBy({ left: direction * rail.clientWidth * 0.8 });
  };

  const picked = addons.filter((addon) => chosen.has(addon.variantId));
  const pickedTotal = picked.reduce((sum, addon) => sum + addon.price.amount, 0);

  return (
    <section
      aria-labelledby="addons-heading"
      className="mt-8 rounded-frame border border-line bg-[color-mix(in_oklab,var(--surface-fg)_4%,var(--surface-bg))] p-4"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 id="addons-heading" className="text-body">
            Add-ons
          </h2>
          <p className="mt-1 text-caption text-muted">Ticked add-ons go in the bag with this piece.</p>
        </div>
        {edges.overflow ? (
          <div className="hidden shrink-0 md:flex">
            <Button
              variant="icon"
              aria-label="Previous add-ons"
              disabled={edges.start}
              onClick={() => page(-1)}
            >
              <span className="inline-flex -scale-x-100">
                <ArrowIcon />
              </span>
            </Button>
            <Button variant="icon" aria-label="More add-ons" disabled={edges.end} onClick={() => page(1)}>
              <ArrowIcon />
            </Button>
          </div>
        ) : null}
      </div>

      <ul ref={railRef} className="addon-rail mt-4">
        {addons.map((addon) => {
          const on = chosen.has(addon.variantId);
          return (
            <li key={addon.variantId}>
              <label
                className={
                  "flex h-full cursor-pointer flex-col items-center bg-surface px-3 py-4 text-center " +
                  "transition-[border-color] duration-[var(--duration-quick)] ease-[var(--ease-out)] " +
                  "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-on-surface " +
                  (on ? "border border-on-surface" : "border border-transparent")
                }
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={on}
                  onChange={() => onToggle(addon.variantId)}
                />
                <span className="relative block size-24 overflow-hidden rounded-pill bg-[color-mix(in_oklab,var(--surface-fg)_4%,var(--surface-bg))]">
                  <Plate {...addon.image} alt={undefined} decorative cover sizes="96px" />
                </span>
                <span className="mt-3 line-clamp-2 min-h-[2lh] text-caption">{addon.name}</span>
                <span className="mt-1 text-caption">{formatMoney(addon.price)}</span>
                <span
                  aria-hidden="true"
                  className={
                    "mt-3 inline-flex min-h-9 w-full items-center justify-center rounded-pill border px-3 text-caption " +
                    (on ? "border-on-surface" : "border-gold")
                  }
                >
                  {on ? "Added" : "+ Add"}
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      <p role="status" className="mt-3 min-h-[1lh] text-caption">
        {picked.length > 0
          ? `${picked.length} ${picked.length === 1 ? "add-on" : "add-ons"} · ${formatMoney({
              amount: pickedTotal,
              currency: picked[0].price.currency,
            })}`
          : null}
      </p>
    </section>
  );
}
