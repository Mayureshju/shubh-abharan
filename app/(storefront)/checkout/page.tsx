"use client";

import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type FormEvent, type InputHTMLAttributes } from "react";
import { Show, SignInButton, useUser } from "@clerk/nextjs";
import { clerkConfigured } from "@/components/auth/configured";
import { useCart } from "@/components/cart/CartProvider";
import { useBagQuote } from "@/components/cart/useBagQuote";
import { Plate } from "@/components/editorial/Plate";
import { PINCODE_KEY } from "@/components/product/DeliveryCheck";
import { Button } from "@/components/ui/Button";
import { buttonClass } from "@/components/ui/buttonClass";
import { brand, resolve } from "@/lib/brand";
import { formatMoney } from "@/lib/catalog/money";
import { markRazorpayVerified, placeOrder, type PlaceOrderResult } from "@/lib/actions/checkout";
import {
  GIFT_MESSAGE_MAX,
  checkoutDetailsSchema,
  fieldErrors,
} from "@/lib/commerce/checkout-schema";

/**
 * Checkout for guests and signed-in customers — see commerce/cart-checkout.
 * Billing is who pays (name, mobile, address); the receiver is where it goes
 * (pincode, name, mobile, address, gift message). "Deliver to my billing
 * address" is ticked by default, so a self-buyer only adds a pincode.
 *
 * The same zod schema runs here and in placeOrder. The draft survives a
 * reload or a sign-in redirect in sessionStorage and is cleared once placed.
 */

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: () => void) => void;
    };
  }
}

type Person = { name: string; phone: string; address: string };
type Draft = {
  billing: Person;
  receiver: Person & { pincode: string };
  sameAsBilling: boolean;
  giftMessage: string;
};
type RazorpayOrder = Extract<PlaceOrderResult, { method: "razorpay" }>;

const DRAFT_KEY = "shubha-checkout";
const PIN = /^[1-9]\d{5}$/;
const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const FIELD_ORDER = [
  "billing.name",
  "billing.phone",
  "billing.address",
  "receiver.pincode",
  "receiver.name",
  "receiver.phone",
  "receiver.address",
  "giftMessage",
];
const fieldId = (path: string) => `checkout-${path.replace(".", "-")}`;
const inr = (amount: number) => formatMoney({ amount, currency: "INR" });

const INPUT =
  "block w-full rounded-input border border-on-surface bg-transparent px-3 py-2 text-body " +
  "placeholder:text-muted aria-[invalid=true]:border-2";

/** Runs only in the browser: CheckoutForm never renders on the server. */
function readDraft(): Draft {
  const blank: Draft = {
    billing: { name: "", phone: "", address: "" },
    receiver: { name: "", phone: "", address: "", pincode: "" },
    sameAsBilling: true,
    giftMessage: "",
  };
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(DRAFT_KEY) ?? "null") as Partial<Draft> | null;
    const draft: Draft = saved
      ? {
          ...blank,
          ...saved,
          billing: { ...blank.billing, ...saved.billing },
          receiver: { ...blank.receiver, ...saved.receiver },
        }
      : blank;
    if (!draft.receiver.pincode) draft.receiver.pincode = window.localStorage.getItem(PINCODE_KEY) ?? "";
    return draft;
  } catch {
    return blank;
  }
}

export default function CheckoutPage() {
  const { ready, lines, clear } = useCart();
  const router = useRouter();
  const [placed, setPlaced] = useState(false);

  const onPlaced = useCallback(
    (confirmUrl: string) => {
      setPlaced(true);
      try {
        window.sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        // Nothing to clear.
      }
      clear();
      router.push(confirmUrl);
    },
    [clear, router],
  );

  if (placed) {
    return (
      <section className="page-gutter py-tight">
        <p className="text-caption uppercase text-muted" role="status">
          Order placed. Opening your confirmation…
        </p>
      </section>
    );
  }

  if (!ready || lines.length === 0) {
    return (
      <section className="page-gutter py-tight">
        <p className="text-caption uppercase tracking-[0.22em] text-accent">Checkout</p>
        <h1 className="mt-3 text-title">Checkout</h1>
        {ready ? (
          <p className="mt-4 text-body text-muted">
            The bag is empty.{" "}
            <Link href="/shop" className={buttonClass("inline")}>
              Continue shopping
            </Link>
          </p>
        ) : null}
      </section>
    );
  }

  return <CheckoutForm onPlaced={onPlaced} />;
}

function CheckoutForm({ onPlaced }: { onPlaced: (confirmUrl: string) => void }) {
  const { lines, count } = useCart();
  const [draft, setDraft] = useState<Draft>(readDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState("");
  const [code, setCode] = useState("");
  const [paying, setPaying] = useState<"razorpay" | "cod" | null>(null);

  const pincode = PIN.test(draft.receiver.pincode.trim()) ? draft.receiver.pincode.trim() : undefined;
  const { quote, pending: pricing } = useBagQuote(lines, { coupon: code, pincode });

  useEffect(() => {
    try {
      window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // Draft not kept; the form still works.
    }
  }, [draft]);

  const prefill = useCallback((name: string, phone: string) => {
    setDraft((current) => {
      const next = { name: current.billing.name || name, phone: current.billing.phone || phone };
      return next.name === current.billing.name && next.phone === current.billing.phone
        ? current
        : { ...current, billing: { ...current.billing, ...next } };
    });
  }, []);

  // Editing a field clears its own error; the rest wait for the next submit.
  const clearError = (path: string) =>
    setErrors((current) => {
      if (!(path in current)) return current;
      const next = { ...current };
      delete next[path];
      return next;
    });
  const setBilling = (field: keyof Person, value: string) => {
    setDraft((current) => ({ ...current, billing: { ...current.billing, [field]: value } }));
    clearError(`billing.${field}`);
  };
  const setReceiver = (field: keyof Draft["receiver"], value: string) => {
    setDraft((current) => ({ ...current, receiver: { ...current.receiver, [field]: value } }));
    clearError(`receiver.${field}`);
  };

  function details() {
    return {
      billing: draft.billing,
      receiver: draft.sameAsBilling
        ? { ...draft.billing, pincode: draft.receiver.pincode }
        : draft.receiver,
      giftMessage: draft.giftMessage,
    };
  }

  function showErrors(next: Record<string, string>) {
    // While the receiver mirrors billing, its name/phone/address errors are
    // billing's, already shown on the billing fields.
    const visible = draft.sameAsBilling
      ? Object.fromEntries(
          Object.entries(next).filter(([key]) => !/^receiver\.(name|phone|address)$/.test(key)),
        )
      : next;
    setErrors(visible);
    const first = FIELD_ORDER.find((key) => key in visible);
    if (first) document.getElementById(fieldId(first))?.focus();
  }

  async function submit(method: "razorpay" | "cod") {
    if (paying) return;
    const input = details();
    const parsed = checkoutDetailsSchema.safeParse(input);
    if (!parsed.success) {
      setMessage(null);
      showErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setMessage(null);
    setPaying(method);

    let result: PlaceOrderResult;
    try {
      result = await placeOrder({ method, lines, details: input, couponCode: code || undefined });
    } catch {
      setMessage("Something went wrong placing the order. Try again.");
      setPaying(null);
      return;
    }
    if (!result.ok) {
      setMessage(result.error);
      if (result.fieldErrors) showErrors(result.fieldErrors);
      setPaying(null);
      return;
    }
    if (result.method === "cod") {
      onPlaced(result.confirmUrl);
      return;
    }
    pay(result, parsed.data.billing);
  }

  function pay(order: RazorpayOrder, billing: { name: string; phone: string }) {
    const Razorpay = window.Razorpay;
    if (!Razorpay) {
      setMessage("Payment is still loading. Try again in a moment.");
      setPaying(null);
      return;
    }
    const checkout = new Razorpay({
      key: order.key,
      amount: order.amount,
      currency: "INR",
      order_id: order.razorpayOrderId,
      name: resolve(brand.name, "brand name"),
      prefill: {
        name: billing.name,
        contact: `+91${billing.phone}`,
        ...(order.email ? { email: order.email } : {}),
      },
      modal: { ondismiss: () => setPaying(null) },
      handler: (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        // The payment webhook decides `paid`; the confirmation page reports
        // whatever the order says, so a failed browser check still goes there.
        void markRazorpayVerified({
          orderId: order.orderId,
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        })
          .catch(() => undefined)
          .finally(() => onPlaced(order.confirmUrl));
      },
    });
    checkout.on("payment.failed", () =>
      setMessage("The payment didn't go through. You can try again or choose another way to pay."),
    );
    checkout.open();
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    void submit(submitter?.value === "cod" || !RAZORPAY_KEY ? "cod" : "razorpay");
  }

  // What the latest quote says, once it matches what is on screen.
  const settled = quote && !pricing ? quote : null;
  const bagProblem = settled && settled.lines.length === 0 ? settled.error : null;
  const unserved = Boolean(pincode && settled?.unservedPincode);
  const codeProblem =
    code && settled && !settled.ok && settled.couponCode === null && settled.lines.length > 0 && !unserved
      ? settled.error
      : null;
  const pincodeNote = pincode && settled?.deliveryAreaName ? `Delivers to ${settled.deliveryAreaName}` : undefined;
  const total = quote && quote.lines.length > 0 ? inr(quote.total) : null;
  const delivery = !pincode
    ? "Add pincode"
    : quote?.deliveryAreaName
      ? quote.shippingWaived || quote.shipping === 0
        ? "Free"
        : inr(quote.shipping)
      : "—";
  const codOffered = quote?.codEnabled !== false;

  return (
    <section className="page-gutter py-tight">
      {RAZORPAY_KEY ? (
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      ) : null}

      <p className="text-caption uppercase tracking-[0.22em] text-accent">Checkout</p>
      <h1 className="mt-3 text-title">Details and payment</h1>
      {clerkConfigured() ? <AccountLine onUser={prefill} /> : null}
      <p className="mt-3 text-caption uppercase text-muted md:hidden">
        {count} {count === 1 ? "piece" : "pieces"}
        {total ? ` · ${total}` : ""} ·{" "}
        <a href="#order-summary" className={buttonClass("inline")}>
          Review order
        </a>
      </p>

      <form noValidate className="mt-tight grid gap-tight md:grid-cols-12" onSubmit={onSubmit}>
        <div className="grid content-start gap-tight md:col-span-7">
          <fieldset className="grid gap-4 border-0 p-0">
            <legend className="mb-4 text-caption uppercase tracking-[0.22em] text-accent">
              Billing details
            </legend>
            <TextField
              path="billing.name"
              label="Full name"
              value={draft.billing.name}
              onChange={(value) => setBilling("name", value)}
              error={errors["billing.name"]}
              autoComplete="billing name"
            />
            <TextField
              path="billing.phone"
              label="Mobile number"
              value={draft.billing.phone}
              onChange={(value) => setBilling("phone", value)}
              error={errors["billing.phone"]}
              autoComplete="billing tel-national"
              inputMode="tel"
              type="tel"
              prefix="+91"
            />
            <TextField
              path="billing.address"
              label="Address"
              hint="House or flat, street, area and city."
              value={draft.billing.address}
              onChange={(value) => setBilling("address", value)}
              error={errors["billing.address"]}
              autoComplete="billing street-address"
              multiline
            />
          </fieldset>

          <fieldset className="grid gap-4 border-0 p-0">
            <legend className="mb-4 text-caption uppercase tracking-[0.22em] text-accent">
              Receiver details
            </legend>
            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-body">
              <input
                type="checkbox"
                checked={draft.sameAsBilling}
                onChange={(event) => {
                  const checked = event.target.checked;
                  setDraft((current) => ({ ...current, sameAsBilling: checked }));
                }}
                className="size-4 accent-charcoal"
              />
              Deliver to my billing address
            </label>
            <TextField
              path="receiver.pincode"
              label="Delivery pincode"
              value={draft.receiver.pincode}
              onChange={(value) => setReceiver("pincode", value)}
              error={
                errors["receiver.pincode"] ?? (unserved ? "We don't deliver to this pincode yet." : undefined)
              }
              hint={pincodeNote}
              autoComplete="shipping postal-code"
              inputMode="numeric"
              maxLength={6}
              narrow
            />
            {draft.sameAsBilling ? null : (
              <>
                <TextField
                  path="receiver.name"
                  label="Receiver's full name"
                  value={draft.receiver.name}
                  onChange={(value) => setReceiver("name", value)}
                  error={errors["receiver.name"]}
                  autoComplete="shipping name"
                />
                <TextField
                  path="receiver.phone"
                  label="Receiver's mobile number"
                  value={draft.receiver.phone}
                  onChange={(value) => setReceiver("phone", value)}
                  error={errors["receiver.phone"]}
                  autoComplete="shipping tel-national"
                  inputMode="tel"
                  type="tel"
                  prefix="+91"
                />
                <TextField
                  path="receiver.address"
                  label="Receiver's address"
                  hint="House or flat, street, area and city."
                  value={draft.receiver.address}
                  onChange={(value) => setReceiver("address", value)}
                  error={errors["receiver.address"]}
                  autoComplete="shipping street-address"
                  multiline
                />
              </>
            )}
            <TextField
              path="giftMessage"
              label="Gift message (optional)"
              hint={`${draft.giftMessage.length}/${GIFT_MESSAGE_MAX}`}
              value={draft.giftMessage}
              onChange={(value) => {
                setDraft((current) => ({ ...current, giftMessage: value }));
                clearError("giftMessage");
              }}
              error={errors.giftMessage}
              maxLength={GIFT_MESSAGE_MAX}
              autoComplete="off"
              multiline
            />
          </fieldset>
        </div>

        <aside
          id="order-summary"
          aria-labelledby="order-summary-title"
          className="md:col-span-5 md:sticky md:top-24 md:self-start"
        >
          <h2 id="order-summary-title" className="text-caption uppercase tracking-[0.22em] text-accent">
            Order summary
          </h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {lines.map((line) => {
              const quoted = quote?.lines.find((entry) => entry.variantId === line.variantId);
              return (
                <li key={line.variantId} className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-3 py-3">
                  <div className="relative aspect-square overflow-hidden bg-[color-mix(in_oklab,var(--surface-fg)_4%,var(--surface-bg))]">
                    {quoted?.imageSrc ? (
                      <Plate role="macro" aspect="1/1" src={quoted.imageSrc} decorative cover sizes="56px" />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-body">{quoted?.name ?? "Loading"}</p>
                    <p className="text-caption uppercase text-muted">
                      {quoted?.sizeLabel ? `Size ${quoted.sizeLabel} · ` : ""}Qty {line.quantity}
                    </p>
                  </div>
                  <p className="text-caption">{quoted ? inr(quoted.lineTotal) : ""}</p>
                </li>
              );
            })}
          </ul>
          <p className="mt-2">
            <Link href="/cart" className={buttonClass("inline")}>
              Edit bag
            </Link>
          </p>

          <details className="mt-2 border-b border-line pb-3">
            <summary className="flex min-h-11 cursor-pointer items-center text-caption uppercase">
              Have a code?
            </summary>
            <div className="mt-2 flex gap-2">
              <input
                id="checkout-code"
                aria-label="Discount code"
                value={codeInput}
                onChange={(event) => setCodeInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    setCode(codeInput.trim().toUpperCase());
                  }
                }}
                autoComplete="off"
                className={INPUT}
              />
              <Button type="button" variant="quiet" onClick={() => setCode(codeInput.trim().toUpperCase())}>
                Apply
              </Button>
            </div>
            {code ? (
              <p className="mt-2 text-caption" role="status">
                {codeProblem ?? (settled?.couponCode === code ? `Code ${code} applied.` : `Checking ${code}…`)}{" "}
                <button
                  type="button"
                  className={buttonClass("inline")}
                  onClick={() => {
                    setCode("");
                    setCodeInput("");
                  }}
                >
                  Remove
                </button>
              </p>
            ) : null}
          </details>

          <dl className="mt-4 space-y-2 text-body">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{quote && quote.lines.length > 0 ? inr(quote.subtotal) : "—"}</dd>
            </div>
            {quote && quote.discount > 0 ? (
              <div className="flex justify-between">
                <dt>Discount</dt>
                <dd>−{inr(quote.discount)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd className={pincode ? undefined : "text-muted"}>{delivery}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3">
              <dt>Total</dt>
              <dd>{total ?? "—"}</dd>
            </div>
          </dl>

          <div role="alert" className="mt-4 text-body empty:hidden">
            {message ?? bagProblem}
            {bagProblem ? (
              <>
                {" "}
                <Link href="/cart" className={buttonClass("inline")}>
                  Edit bag
                </Link>
              </>
            ) : null}
          </div>

          <div className="mt-6 flex flex-col gap-3">
            {RAZORPAY_KEY ? (
              <Button
                type="submit"
                value="razorpay"
                variant="primary"
                pending={paying === "razorpay"}
                pendingLabel="Opening payment"
                disabled={paying === "cod"}
              >
                {total ? `Pay ${total}` : "Pay now"}
              </Button>
            ) : null}
            {codOffered ? (
              <Button
                type="submit"
                value="cod"
                variant={RAZORPAY_KEY ? "quiet" : "primary"}
                pending={paying === "cod"}
                pendingLabel="Placing order"
                disabled={paying === "razorpay"}
              >
                Cash on delivery
              </Button>
            ) : null}
            {!RAZORPAY_KEY && !codOffered ? (
              <p className="text-body text-muted">Payment is not set up yet.</p>
            ) : null}
            {RAZORPAY_KEY ? (
              <p className="text-caption text-muted">Online payments are processed by Razorpay.</p>
            ) : null}
          </div>
        </aside>
      </form>
    </section>
  );
}

function AccountLine({ onUser }: { onUser: (name: string, phone: string) => void }) {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    onUser(user.fullName ?? "", (user.primaryPhoneNumber?.phoneNumber ?? "").replace(/^\+91/, ""));
  }, [isLoaded, isSignedIn, user, onUser]);

  // Two lines rather than one sentence: the inline button keeps its 44px
  // touch target, which would stretch a wrapped sentence's first line.
  return (
    <div className="mt-4 text-body text-muted">
      <Show when="signed-out">
        <p className="flex flex-wrap items-center gap-x-2">
          Have an account?
          <SignInButton mode="modal">
            <button type="button" className={buttonClass("inline")}>
              Sign in
            </button>
          </SignInButton>
        </p>
        <p className="text-caption">Or continue as a guest. Signing in keeps this order in your account.</p>
      </Show>
      <Show when="signed-in">
        <p>
          Signed in{user?.primaryEmailAddress ? ` as ${user.primaryEmailAddress.emailAddress}` : ""}. This
          order will appear in your orders.
        </p>
      </Show>
    </div>
  );
}

function TextField({
  path,
  label,
  value,
  onChange,
  error,
  hint,
  multiline = false,
  prefix,
  narrow = false,
  ...rest
}: {
  path: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  multiline?: boolean;
  prefix?: string;
  narrow?: boolean;
} & Pick<InputHTMLAttributes<HTMLInputElement>, "autoComplete" | "inputMode" | "maxLength" | "type">) {
  const id = fieldId(path);
  const describedBy =
    [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined;
  const shared = {
    id,
    name: path,
    value,
    "aria-invalid": Boolean(error),
    "aria-describedby": describedBy,
  };

  return (
    <div>
      <label htmlFor={id} className="text-caption uppercase text-muted">
        {label}
        {prefix ? <span className="sr-only"> (India, {prefix})</span> : null}
      </label>
      <div className={`mt-1 flex ${narrow ? "max-w-48" : ""}`}>
        {prefix ? (
          <span
            aria-hidden="true"
            className="inline-flex items-center rounded-l-input border border-r-0 border-on-surface px-3 text-body text-muted"
          >
            {prefix}
          </span>
        ) : null}
        {multiline ? (
          <textarea
            {...shared}
            rows={3}
            maxLength={rest.maxLength}
            autoComplete={rest.autoComplete}
            onChange={(event) => onChange(event.target.value)}
            className={INPUT}
          />
        ) : (
          <input
            {...shared}
            {...rest}
            onChange={(event) => onChange(event.target.value)}
            className={`${INPUT} ${prefix ? "rounded-l-none" : ""}`}
          />
        )}
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-caption text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-caption text-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}
