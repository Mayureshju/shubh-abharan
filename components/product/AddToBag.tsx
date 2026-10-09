"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { buttonClass } from "@/components/ui/buttonClass";
import { useCart } from "@/components/cart/CartProvider";
import { DeliveryCheck } from "@/components/product/DeliveryCheck";

type Availability = "available" | "made-to-order" | "sold-out" | "unavailable";

export type BagProduct = {
  readonly id: string;
  readonly isSize: boolean;
  readonly sizes: readonly string[];
  readonly sizeValues: readonly string[];
  /** Shown in the phone action bar until a size with its own price is chosen. */
  readonly displayPrice: string;
  readonly variants: readonly {
    readonly id: string;
    readonly size: string | null;
    readonly availability: Availability;
    /** Formatted payable price for this variant, when supplied. */
    readonly price: string | null;
  }[];
};

const WISHLIST = "shubha-wishlist";
const WISHLIST_EVENT = "shubha-wishlist-change";

function subscribeWishlist(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener(WISHLIST_EVENT, listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(WISHLIST_EVENT, listener);
  };
}

function readWishlist(): string | null {
  try {
    return window.localStorage.getItem(WISHLIST);
  } catch {
    return null;
  }
}

function parseWishlist(raw: string | null): { productId: string; variantId?: string }[] {
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const buyable = (availability: Availability | undefined) =>
  availability === "available" || availability === "made-to-order";

/**
 * Size, purchase actions and delivery check for the product page — see
 * storefront/product-detail. Buy now is the view's one primary action.
 *
 * Below 768px the action row is fixed to the bottom of the viewport with the
 * price (responsive-accessibility: one-hand reach). `data-buy-bar` lets
 * globals.css pad the page so the footer is never hidden behind it.
 */
export function AddToBag({ product }: { product: BagProduct }) {
  const { lines, add, openDrawer } = useCart();
  const router = useRouter();
  const sizes = product.isSize
    ? product.sizes.length > 0
      ? product.sizes
      : product.sizeValues
    : [];

  const variantFor = (size: string) => product.variants.find((entry) => entry.size === size);
  const [size, setSize] = useState(
    () => sizes.find((value) => buyable(variantFor(value)?.availability)) ?? sizes[0] ?? "",
  );

  const variant = product.isSize ? variantFor(size) : product.variants[0];
  const canBuy = Boolean(variant) && buyable(variant?.availability);
  const price = variant?.price ?? product.displayPrice;

  const wishlistRaw = useSyncExternalStore(subscribeWishlist, readWishlist, () => null);
  // Focus follows the save to the link that replaces the button; never on load.
  const [justSaved, setJustSaved] = useState(false);
  const wishlistLink = useRef<HTMLAnchorElement>(null);
  const saved = useMemo(
    () => parseWishlist(wishlistRaw).some((entry) => entry.productId === product.id),
    [wishlistRaw, product.id],
  );

  useEffect(() => {
    if (justSaved && saved) wishlistLink.current?.focus();
  }, [justSaved, saved]);

  function addToBag() {
    if (!variant || !canBuy) return;
    add({ productId: product.id, variantId: variant.id, quantity: 1 });
    openDrawer();
  }

  function buyNow() {
    if (!variant || !canBuy) return;
    // Buying should never quietly raise a quantity already in the bag.
    if (!lines.some((line) => line.variantId === variant.id)) {
      add({ productId: product.id, variantId: variant.id, quantity: 1 });
    }
    router.push("/checkout");
  }

  function save() {
    const entries = parseWishlist(readWishlist());
    if (!entries.some((entry) => entry.productId === product.id)) {
      entries.push({ productId: product.id, variantId: variant?.id });
      try {
        window.localStorage.setItem(WISHLIST, JSON.stringify(entries));
      } catch {
        return;
      }
    }
    setJustSaved(true);
    window.dispatchEvent(new Event(WISHLIST_EVENT));
  }

  return (
    <div className="mt-tight">
      {product.isSize && sizes.length > 0 ? (
        <fieldset className="border-0 p-0">
          <legend className="text-caption uppercase tracking-[0.22em] text-accent">Size</legend>
          <ul className="mt-3 flex flex-wrap gap-2">
            {sizes.map((value) => {
              const option = variantFor(value);
              const out = !buyable(option?.availability);
              return (
                <li key={value}>
                  <label className="inline-flex min-h-11 items-center">
                    <input
                      type="radio"
                      name="size"
                      value={value}
                      checked={size === value}
                      disabled={out}
                      onChange={() => setSize(value)}
                      className="peer sr-only"
                    />
                    <span
                      className={
                        "inline-flex min-h-11 items-center border px-4 text-caption uppercase " +
                        "peer-checked:bg-lavender peer-checked:text-charcoal " +
                        "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-on-surface " +
                        (out
                          ? "cursor-not-allowed border-dashed border-line text-muted line-through"
                          : "cursor-pointer border-on-surface")
                      }
                    >
                      {value}
                      {out ? <span className="sr-only"> (sold out)</span> : null}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      ) : null}

      {variant?.availability === "made-to-order" ? (
        <p className="mt-3 text-caption uppercase text-muted">Made to order</p>
      ) : null}

      <div
        data-buy-bar
        className={
          "fixed inset-x-0 bottom-0 z-10 flex items-center gap-2 border-t border-line bg-surface px-6 py-3 " +
          "md:static md:mt-6 md:gap-3 md:border-0 md:bg-transparent md:p-0"
        }
      >
        <p className="flex-1 whitespace-nowrap text-caption md:hidden">{price}</p>
        <Button variant="quiet" disabled={!canBuy} onClick={addToBag} className="md:flex-1">
          {canBuy ? "Add to bag" : "Sold out"}
        </Button>
        <Button variant="primary" disabled={!canBuy} onClick={buyNow} className="md:flex-1">
          Buy now
        </Button>
      </div>

      <p className="mt-4" role="status">
        {saved ? (
          <span className="text-caption uppercase text-muted">
            Saved ·{" "}
            <Link ref={wishlistLink} href="/wishlist" className={buttonClass("inline")}>
              View wishlist
            </Link>
          </span>
        ) : (
          <button type="button" className={buttonClass("inline")} onClick={save}>
            Save to wishlist
          </button>
        )}
      </p>

      {variant ? <DeliveryCheck productId={product.id} variantId={variant.id} /> : null}
    </div>
  );
}
