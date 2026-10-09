"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { BagLines } from "@/components/cart/BagLines";
import { useBagQuote } from "@/components/cart/useBagQuote";
import { buttonClass } from "@/components/ui/buttonClass";
import { formatMoney } from "@/lib/catalog/money";

export default function CartPage() {
  const { ready, lines, setQuantity, remove } = useCart();
  const { quote } = useBagQuote(lines);

  return (
    <section className="page-gutter py-tight">
      <p className="text-caption uppercase tracking-[0.22em] text-accent">Bag</p>
      <h1 className="mt-3 text-title">Your bag</h1>

      {!ready ? null : lines.length === 0 ? (
        <p className="mt-tight text-body text-muted">
          The bag is empty.{" "}
          <Link href="/shop" className={buttonClass("inline")}>
            Continue shopping
          </Link>
        </p>
      ) : (
        <div className="mt-tight grid gap-tight md:grid-cols-12">
          <div className="md:col-span-7">
            <BagLines lines={lines} quote={quote} onQuantity={setQuantity} onRemove={remove} />
          </div>
          <aside className="md:col-span-5">
            {quote?.error ? <p className="mb-4 text-body text-muted">{quote.error}</p> : null}
            {quote?.ok ? (
              <dl className="space-y-2 text-body">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd>{formatMoney({ amount: quote.subtotal, currency: "INR" })}</dd>
                </div>
                <div className="flex justify-between text-muted">
                  <dt>Delivery</dt>
                  <dd>At checkout</dd>
                </div>
              </dl>
            ) : quote ? null : (
              <p className="text-caption uppercase text-muted">Pricing the bag…</p>
            )}
            <p className="mt-6">
              <Link href="/checkout" className={`${buttonClass("primary")} w-full`}>
                Checkout
              </Link>
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}
