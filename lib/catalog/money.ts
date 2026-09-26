/**
 * The only place a price becomes a string.
 *
 * No component formats a price itself — a second formatter is how two surfaces
 * start disagreeing about whether £420 shows its pence.
 */

import { placeholder } from "../brand";
import type { CurrencyCode, Money, Product } from "./types";

/**
 * Fixed per currency, never the visitor's locale.
 *
 * Rendering is server-first, so `Intl` runs once on the server and again on
 * hydration. A visitor-derived locale produces a different string on each side
 * and a hydration mismatch. Pinning it also means every visitor sees the same
 * price, which is correct for a single-currency brand.
 */
const PRICE_LOCALE: Record<CurrencyCode, string> = {
  GBP: "en-GB",
  EUR: "en-GB",
  USD: "en-US",
  INR: "en-IN",
};

/**
 * Accepts null so the placeholder path is the same call — no caller can forget
 * that an unsupplied price must render as a marked placeholder rather than a
 * figure the business never gave us.
 */
export function formatMoney(money: Money | null): string {
  if (money === null) return placeholder("price");

  // A whole amount shows no pence: £420, not £420.00. Both bounds are set
  // because leaving the maximum at the currency default renders 4250 as "£42.5".
  const whole = money.amount % 100 === 0;

  // ponytail: assumes a two-decimal minor unit, true of GBP/EUR/USD/INR. A
  // zero-decimal currency (JPY) would need a per-currency exponent here.
  return new Intl.NumberFormat(PRICE_LOCALE[money.currency], {
    style: "currency",
    currency: money.currency,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(money.amount / 100);
}

/**
 * A product's displayed price: the cheapest configuration that carries one.
 * Null when the business has supplied no price for any variant.
 */
export function lowestPrice(product: Product): Money | null {
  if (product.quote?.payable) return product.quote.payable;
  let lowest: Money | null = null;
  for (const variant of product.variants) {
    const amount = variant.payablePrice ?? variant.price;
    if (amount === null) continue;
    if (lowest === null || amount.amount < lowest.amount) lowest = amount;
  }
  return lowest;
}

/** True when variants carry differing payable prices, so the display reads as a "from" price. */
export function hasPriceRange(product: Product): boolean {
  const amounts = new Set<number>();
  for (const variant of product.variants) {
    const amount = variant.payablePrice ?? variant.price;
    if (amount !== null) amounts.add(amount.amount);
  }
  return amounts.size > 1;
}
