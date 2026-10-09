"use client";

import Link from "next/link";
import { Plate } from "@/components/editorial/Plate";
import { buttonClass } from "@/components/ui/buttonClass";
import { formatMoney } from "@/lib/catalog/money";
import type { CartLineInput, QuoteResult } from "@/lib/commerce/quote";

/**
 * The bag's lines, shared by the drawer and the bag page. Quantity comes from
 * the browser bag; name, image and price come from the server quote, so a
 * line shows "Loading" rather than an identifier until the quote arrives, and
 * "Not priced" when the quote failed (the caller shows the quote's error).
 */
export function BagLines({
  lines,
  quote,
  onQuantity,
  onRemove,
  onNavigate,
  compact = false,
}: {
  lines: readonly CartLineInput[];
  quote: QuoteResult | null;
  onQuantity: (variantId: string, quantity: number) => void;
  onRemove: (variantId: string) => void;
  /** Called when a product link is followed, so the drawer can close. */
  onNavigate?: () => void;
  compact?: boolean;
}) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {lines.map((line) => {
        const quoted = quote?.lines.find((entry) => entry.variantId === line.variantId);
        const name = quoted?.name ?? null;
        return (
          <li
            key={line.variantId}
            className={`grid items-start gap-x-4 py-4 ${compact ? "grid-cols-[4rem_1fr]" : "grid-cols-[5rem_1fr] md:grid-cols-[6rem_1fr]"}`}
          >
            <div className="relative aspect-square overflow-hidden bg-[color-mix(in_oklab,var(--surface-fg)_4%,var(--surface-bg))]">
              {quoted?.imageSrc ? (
                <Plate role="macro" aspect="1/1" src={quoted.imageSrc} decorative cover sizes="96px" />
              ) : null}
            </div>

            <div className="min-w-0">
              <div className="flex items-baseline justify-between gap-3">
                {quoted ? (
                  <Link
                    href={`/products/${quoted.slug}`}
                    className="text-body underline-offset-4 hover:underline"
                    onClick={onNavigate}
                  >
                    {quoted.name}
                  </Link>
                ) : (
                  <span className="text-caption uppercase text-muted">
                    {quote ? "Not priced" : "Loading"}
                  </span>
                )}
                {quoted ? (
                  <span className="shrink-0 text-caption">
                    {formatMoney({ amount: quoted.lineTotal, currency: "INR" })}
                  </span>
                ) : null}
              </div>
              {quoted?.sizeLabel ? (
                <p className="mt-1 text-caption uppercase text-muted">Size {quoted.sizeLabel}</p>
              ) : null}
              {quoted && line.quantity > 1 ? (
                <p className="mt-1 text-caption text-muted">
                  {formatMoney(quoted.unitPayable)} each
                </p>
              ) : null}

              <div className="mt-2 flex items-center gap-1">
                <button
                  type="button"
                  className={buttonClass("icon")}
                  aria-label={`Decrease quantity${name ? ` of ${name}` : ""}`}
                  disabled={line.quantity <= 1}
                  onClick={() => onQuantity(line.variantId, line.quantity - 1)}
                >
                  <span aria-hidden="true">−</span>
                </button>
                <output
                  aria-live="polite"
                  aria-label={`Quantity${name ? ` of ${name}` : ""}`}
                  className="min-w-8 text-center text-caption"
                >
                  {line.quantity}
                </output>
                <button
                  type="button"
                  className={buttonClass("icon")}
                  aria-label={`Increase quantity${name ? ` of ${name}` : ""}`}
                  onClick={() => onQuantity(line.variantId, line.quantity + 1)}
                >
                  <span aria-hidden="true">+</span>
                </button>
                <button
                  type="button"
                  className={`${buttonClass("inline")} ml-auto`}
                  onClick={() => onRemove(line.variantId)}
                >
                  Remove<span className="sr-only">{name ? ` ${name}` : ""}</span>
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
