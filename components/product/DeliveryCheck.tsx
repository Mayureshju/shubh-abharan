"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { previewQuote } from "@/lib/actions/quote";
import { formatMoney } from "@/lib/catalog/money";

/** Shared with checkout, which prefills the receiver pincode from it. */
export const PINCODE_KEY = "shubha-pincode";
const PINCODE = /^[1-9]\d{5}$/;

type Result = { variantId: string; message: string };

/**
 * Pincode check on the product page. It prices this one piece through the
 * same quote as checkout, so the answer is the store's delivery data — the
 * served place and its charge, or not served — and never a delivery time or
 * policy the business has not supplied.
 */
export function DeliveryCheck({ productId, variantId }: { productId: string; variantId: string }) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [pending, setPending] = useState(false);

  async function check(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const pin = inputRef.current?.value.trim() ?? "";
    if (!PINCODE.test(pin)) {
      setResult({ variantId, message: "Enter a six-digit pincode." });
      return;
    }
    setPending(true);
    try {
      const quote = await previewQuote([{ productId, variantId, quantity: 1 }], undefined, pin);
      if (quote.ok && quote.deliveryAreaName) {
        const charge =
          quote.shippingWaived || quote.shipping === 0
            ? "Free delivery."
            : `Delivery ${formatMoney({ amount: quote.shipping, currency: "INR" })}.`;
        setResult({ variantId, message: `Delivers to ${quote.deliveryAreaName}. ${charge}` });
        try {
          window.localStorage.setItem(PINCODE_KEY, pin);
        } catch {
          // Not remembered; checkout asks again.
        }
      } else if (quote.unservedPincode) {
        setResult({ variantId, message: `We don't deliver to ${pin} yet.` });
      } else {
        setResult({ variantId, message: quote.error ?? "Could not check delivery. Try again." });
      }
    } catch {
      setResult({ variantId, message: "Could not check delivery. Try again." });
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="mt-tight" onSubmit={(event) => void check(event)} noValidate>
      <label htmlFor={id} className="text-caption uppercase tracking-[0.22em] text-accent">
        Check delivery
      </label>
      <div className="mt-3 flex min-w-0 flex-wrap items-end gap-x-4 gap-y-2">
        <input
          id={id}
          ref={(element) => {
            inputRef.current = element;
            // Prefill once from an earlier check, without a render: the
            // server never sees localStorage, so state would mismatch.
            if (element && !element.value) {
              try {
                element.value = window.localStorage.getItem(PINCODE_KEY) ?? "";
              } catch {
                // Storage unavailable; start empty.
              }
            }
          }}
          name="pincode"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          placeholder="Pincode"
          aria-describedby={`${id}-result`}
          className="h-11 w-full min-w-0 max-w-40 border-0 border-b border-line bg-transparent px-0 text-body placeholder:text-muted focus-visible:border-on-surface"
        />
        <Button type="submit" variant="inline" pending={pending} pendingLabel="Checking" className="shrink-0 self-end">
          Check
        </Button>
      </div>
      <p id={`${id}-result`} role="status" className="mt-2 min-h-[1.5em] text-caption text-muted">
        {result && result.variantId === variantId ? result.message : ""}
      </p>
    </form>
  );
}
