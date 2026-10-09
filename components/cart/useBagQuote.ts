"use client";

import { useEffect, useState } from "react";
import { previewQuote } from "@/lib/actions/quote";
import type { CartLineInput, QuoteResult } from "@/lib/commerce/quote";

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
  unservedPincode: false,
};

/**
 * Prices the bag on the server for the drawer, the bag page and checkout.
 * Keeps the last quote on screen while a newer one is in flight (`pending`),
 * so totals update rather than blink. An empty bag is never quoted.
 */
export function useBagQuote(
  lines: readonly CartLineInput[],
  { coupon, pincode }: { coupon?: string; pincode?: string } = {},
): { quote: QuoteResult | null; pending: boolean } {
  const key = JSON.stringify([lines, coupon ?? "", pincode ?? ""]);
  const [result, setResult] = useState<{ key: string; quote: QuoteResult } | null>(null);

  useEffect(() => {
    if (lines.length === 0) return;
    let cancelled = false;
    previewQuote([...lines], coupon || undefined, pincode || undefined)
      .then((quote) => {
        if (!cancelled) setResult({ key, quote });
      })
      .catch(() => {
        if (!cancelled) setResult({ key, quote: FAILED });
      });
    return () => {
      cancelled = true;
    };
  }, [key, lines, coupon, pincode]);

  if (lines.length === 0) return { quote: null, pending: false };
  return { quote: result?.quote ?? null, pending: result?.key !== key };
}
