"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { formatMoney } from "@/lib/catalog/money";
import {
  markRazorpayVerified,
  placeCodOrder,
  placeRazorpayOrder,
  type AddressInput,
} from "@/lib/actions/checkout";
import { previewQuote } from "@/lib/actions/quote";
import type { QuoteResult } from "@/lib/commerce/quote";

const FIELD = "mt-1 w-full border border-on-surface bg-transparent px-3 py-2 text-body";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CheckoutPage() {
  const { lines, clear } = useCart();
  const router = useRouter();
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [coupon, setCoupon] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<AddressInput>({
    name: "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (lines.length === 0) return;
    let cancelled = false;
    void previewQuote(lines, coupon || undefined, address.pincode || undefined)
      .then((result) => {
        if (!cancelled) setQuote(result);
      })
      .catch(() => {
        if (!cancelled) setError("Could not price the order.");
      });
    return () => {
      cancelled = true;
    };
  }, [lines, coupon, address.pincode]);

  async function payRazorpay() {
    setPending(true);
    setError(null);
    const result = await placeRazorpayOrder({ lines, address, couponCode: coupon || undefined });
    if (!result.ok) {
      setError(result.error);
      setPending(false);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      const Razorpay = window.Razorpay;
      if (!Razorpay) {
        setError("Razorpay failed to load.");
        setPending(false);
        return;
      }
      const checkout = new Razorpay({
        key: result.key,
        amount: result.amount,
        currency: "INR",
        order_id: result.razorpayOrderId,
        name: "Checkout",
        prefill: { name: result.name, email: result.email },
        handler: (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          void markRazorpayVerified({
            orderId: result.orderId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          }).then(() => {
            clear();
            router.push(`/account/orders/${result.orderId}`);
          });
        },
      });
      checkout.open();
      setPending(false);
    };
    document.body.appendChild(script);
  }

  async function payCod() {
    setPending(true);
    setError(null);
    const result = await placeCodOrder({ lines, address, couponCode: coupon || undefined });
    if (!result.ok) {
      setError(result.error);
      setPending(false);
      return;
    }
    clear();
    router.push(`/account/orders/${result.orderId}`);
  }

  if (lines.length === 0) {
    return (
      <section className="page-gutter py-tight">
        <h1 className="text-title">Checkout</h1>
        <p className="mt-4 text-body text-muted">The bag is empty.</p>
      </section>
    );
  }

  return (
    <section className="page-gutter py-tight">
      <p className="text-caption uppercase tracking-[0.22em] text-accent">Checkout</p>
      <h1 className="mt-3 text-title">Delivery</h1>
      <form className="mt-tight grid gap-tight md:grid-cols-12" onSubmit={(event) => event.preventDefault()}>
        <div className="grid gap-4 md:col-span-7">
          {(
            [
              ["name", "Name"],
              ["phone", "Phone"],
              ["line1", "Address"],
              ["city", "City"],
              ["state", "State"],
              ["pincode", "Pincode"],
            ] as const
          ).map(([key, label]) => (
            <p key={key}>
              <label className="text-caption uppercase text-muted" htmlFor={key}>
                {label}
              </label>
              <input
                id={key}
                className={FIELD}
                value={address[key] ?? ""}
                onChange={(event) => setAddress({ ...address, [key]: event.target.value })}
                required
              />
            </p>
          ))}
          <p>
            <label className="text-caption uppercase text-muted" htmlFor="coupon">
              Coupon
            </label>
            <input
              id="coupon"
              className={FIELD}
              value={coupon}
              onChange={(event) => setCoupon(event.target.value)}
            />
          </p>
        </div>
        <aside className="md:col-span-5">
          {quote ? (
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
              <div className="flex justify-between">
                <dt>Delivery</dt>
                <dd>
                  {quote.shippingWaived
                    ? "Free"
                    : formatMoney({ amount: quote.shipping, currency: "INR" })}
                </dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3">
                <dt>Total</dt>
                <dd>{formatMoney({ amount: quote.total, currency: "INR" })}</dd>
              </div>
            </dl>
          ) : null}
          {quote?.error ? <p className="mt-4 text-body text-muted">{quote.error}</p> : null}
          {error ? <p className="mt-4 text-body text-muted">{error}</p> : null}
          <div className="mt-6 flex flex-col gap-3">
            <Button variant="primary" pending={pending} onClick={() => void payRazorpay()}>
              Pay with Razorpay
            </Button>
            {quote?.codEnabled !== false ? (
              <Button variant="quiet" pending={pending} onClick={() => void payCod()}>
                Cash on delivery
              </Button>
            ) : null}
          </div>
        </aside>
      </form>
    </section>
  );
}
