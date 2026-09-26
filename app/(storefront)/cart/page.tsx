"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { buttonClass } from "@/components/ui/buttonClass";
import { formatMoney } from "@/lib/catalog/money";
import { previewQuote } from "@/lib/actions/quote";
import type { QuoteResult } from "@/lib/commerce/quote";

const FAILED: QuoteResult = {
  ok: false,
  error: "Could not price the bag.",
  lines: [],
  subtotal: 0,
  discount: 0,
  shipping: 0,
  shippingWaived: false,
  total: 0,
  currency: "INR",
  couponCode: null,
  deliveryAreaName: null,
  codEnabled: false,
};

export default function CartPage() {
  const { lines, setQuantity, remove } = useCart();
  const [quote, setQuote] = useState<QuoteResult | null>(null);

  useEffect(() => {
    if (lines.length === 0) {
      setQuote(null);
      return;
    }
    let cancelled = false;
    void previewQuote(lines)
      .then((result) => {
        if (!cancelled) setQuote(result);
      })
      .catch(() => {
        if (!cancelled) setQuote(FAILED);
      });
    return () => {
      cancelled = true;
    };
  }, [lines]);

  return (
    <section className="page-gutter py-tight">
      <p className="text-caption uppercase tracking-[0.22em] text-accent">Bag</p>
      <h1 className="mt-3 text-title">Your bag</h1>

      {lines.length === 0 ? (
        <p className="mt-tight text-body text-muted">
          The bag is empty.{" "}
          <Link href="/shop" className={buttonClass("inline")}>
            Continue shopping
          </Link>
        </p>
      ) : (
        <div className="mt-tight grid gap-tight md:grid-cols-12">
          <ul className="md:col-span-7">
            {(quote?.lines.length ? quote.lines : lines).map((line) => {
              const quoted = "name" in line ? line : null;
              return (
                <li key={line.variantId} className="border-t border-line py-6">
                  <p className="text-body">{quoted?.name ?? line.variantId}</p>
                  {quoted?.sizeLabel ? (
                    <p className="mt-1 text-caption uppercase text-muted">Size {quoted.sizeLabel}</p>
                  ) : null}
                  {quoted ? (
                    <p className="mt-1 text-caption">
                      {formatMoney(quoted.unitPayable)} × {quoted.quantity}
                    </p>
                  ) : null}
                  <p className="mt-2 text-caption">
                    <label>
                      Qty
                      <input
                        type="number"
                        min={1}
                        className="ml-3 w-16 border border-on-surface bg-transparent px-2 py-1"
                        value={line.quantity}
                        onChange={(event) => setQuantity(line.variantId, Number(event.target.value))}
                      />
                    </label>
                    <button
                      type="button"
                      className={`${buttonClass("inline")} ml-6`}
                      onClick={() => remove(line.variantId)}
                    >
                      Remove
                    </button>
                  </p>
                </li>
              );
            })}
          </ul>
          <aside className="md:col-span-5">
            {quote?.ok ? (
              <dl className="space-y-2 text-body">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd>{formatMoney({ amount: quote.subtotal, currency: "INR" })}</dd>
                </div>
                {quote.discount > 0 ? (
                  <div className="flex justify-between">
                    <dt>Discount</dt>
                    <dd>−{formatMoney({ amount: quote.discount, currency: "INR" })}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between border-t border-line pt-3">
                  <dt>Total</dt>
                  <dd>{formatMoney({ amount: quote.total, currency: "INR" })}</dd>
                </div>
              </dl>
            ) : quote?.error ? (
              <p className="text-body text-muted">{quote.error}</p>
            ) : (
              <p className="text-caption uppercase text-muted">Pricing the bag…</p>
            )}
            <p className="mt-6">
              <Link href="/checkout" className={buttonClass("primary")}>
                Checkout
              </Link>
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}
