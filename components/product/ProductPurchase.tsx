"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { WishlistIcon } from "@/components/ui/icons";
import { useCart } from "@/components/cart/CartProvider";
import { AddonRail } from "@/components/product/AddonRail";
import { DeliveryCheck } from "@/components/product/DeliveryCheck";
import { formatMoney } from "@/lib/catalog/money";
import type { Money } from "@/lib/catalog/types";
import { buyable, type AddonOption, type PurchaseVariant } from "./purchase";

export type PurchaseProduct = {
  readonly id: string;
  readonly name: string;
  /** Resolved on the server: the supplied line or its marked placeholder. */
  readonly materialLine: string;
  readonly isSize: boolean;
  readonly sizes: readonly string[];
  readonly variants: readonly PurchaseVariant[];
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

/** Purchase-bar actions only. Square, equal, not the site's lavender pill. */
const BAR_ACTION =
  "grid w-full min-w-0 min-h-[44px] place-items-center px-3 text-center text-caption uppercase text-balance sm:px-[24px] " +
  "rounded-input border " +
  "transition-[background-color,color,border-color,opacity] duration-[var(--duration-quick)] ease-[var(--ease-out)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "disabled:cursor-not-allowed disabled:border-dashed disabled:bg-transparent disabled:text-muted " +
  "disabled:hover:bg-transparent disabled:hover:text-muted";

const BAR_ADD = `${BAR_ACTION} border-gold bg-transparent text-on-surface hover:bg-gold hover:text-charcoal`;
const BAR_BUY = `${BAR_ACTION} border-charcoal bg-charcoal text-paper hover:bg-transparent hover:text-on-surface`;

const sum = (amounts: readonly Money[]): Money | null =>
  amounts.length === 0
    ? null
    : { amount: amounts.reduce((total, money) => total + money.amount, 0), currency: amounts[0].currency };

/**
 * Everything on the product page that reads the chosen size or add-ons — see
 * storefront/product-detail: the name with its wishlist toggle, the price,
 * size cards, add-ons, delivery check and the purchase bar.
 *
 * The bar is fixed to the bottom at every width as two equal actions.
 * `data-buy-bar` lets globals.css pad the page and its focus scroll so neither
 * the footer nor a focused control hides behind it.
 */
export function ProductPurchase({
  product,
  addons,
}: {
  product: PurchaseProduct;
  addons: readonly AddonOption[];
}) {
  const { lines, add, openDrawer } = useCart();
  const router = useRouter();
  const sizes = product.isSize ? product.sizes : [];

  const variantFor = (size: string) => product.variants.find((entry) => entry.size === size);
  const [size, setSize] = useState(
    () => sizes.find((value) => buyable(variantFor(value)?.availability)) ?? sizes[0] ?? "",
  );
  const [chosen, setChosen] = useState<ReadonlySet<string>>(() => new Set());

  const variant = product.isSize ? variantFor(size) : product.variants[0];
  const canBuy = Boolean(variant) && buyable(variant?.availability);
  const price = variant?.price ?? null;
  const compare = variant?.compare && price && variant.compare.amount > price.amount ? variant.compare : null;
  const sizePrices = new Set(product.variants.map((entry) => entry.price?.amount ?? null));
  const showSizePrices = sizePrices.size > 1;

  const pickedAddons = canBuy ? addons.filter((addon) => chosen.has(addon.variantId)) : [];
  const total = price ? sum([price, ...pickedAddons.map((addon) => addon.price)]) : null;
  const wanted = variant
    ? [{ productId: product.id, variantId: variant.id }, ...pickedAddons]
    : [];

  const wishlistRaw = useSyncExternalStore(subscribeWishlist, readWishlist, () => null);
  const saved = useMemo(
    () => parseWishlist(wishlistRaw).some((entry) => entry.productId === product.id),
    [wishlistRaw, product.id],
  );

  function toggleAddon(variantId: string) {
    setChosen((current) => {
      const next = new Set(current);
      if (!next.delete(variantId)) next.add(variantId);
      return next;
    });
  }

  function addToBag() {
    if (!canBuy) return;
    for (const line of wanted) add({ productId: line.productId, variantId: line.variantId, quantity: 1 });
    openDrawer();
  }

  function buyNow() {
    if (!canBuy) return;
    // Buying never quietly raises a quantity already in the bag.
    for (const line of wanted) {
      if (!lines.some((entry) => entry.variantId === line.variantId)) {
        add({ productId: line.productId, variantId: line.variantId, quantity: 1 });
      }
    }
    router.push("/checkout");
  }

  function toggleWishlist() {
    const entries = parseWishlist(readWishlist());
    const next = saved
      ? entries.filter((entry) => entry.productId !== product.id)
      : [...entries, { productId: product.id, variantId: variant?.id }];
    try {
      window.localStorage.setItem(WISHLIST, JSON.stringify(next));
    } catch {
      return;
    }
    window.dispatchEvent(new Event(WISHLIST_EVENT));
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-display text-[2rem]/[1.15] font-normal tracking-[-0.01em]">{product.name}</h1>
        <Button
          variant="icon"
          aria-label="Save to wishlist"
          aria-pressed={saved}
          onClick={toggleWishlist}
          className="-mr-2.5 -mt-1 shrink-0 text-accent"
        >
          <WishlistIcon filled={saved} />
        </Button>
      </div>

      {/* Holds its line while empty, so a saved piece does not shift the page on load. */}
      <p role="status" className="mt-1 min-h-[1lh] text-caption uppercase text-muted">
        {saved ? (
          <>
            Saved ·{" "}
            <Link href="/wishlist" className="text-on-surface underline underline-offset-4 hover:no-underline">
              View wishlist
            </Link>
          </>
        ) : null}
      </p>

      <p className="mt-4 flex flex-wrap items-baseline gap-x-3">
        <span className="font-text text-[2rem]/[1.15] font-medium">{formatMoney(price)}</span>
        {compare ? (
          <s className="text-body text-muted">
            <span className="sr-only">Was </span>
            {formatMoney(compare)}
          </s>
        ) : null}
      </p>
      <p className="mt-2 text-body text-muted">{product.materialLine}</p>

      {sizes.length > 0 ? (
        <fieldset className="mt-tight border-0 p-0">
          <legend className="text-caption uppercase tracking-[0.22em] text-accent">
            Size{size ? <span className="text-on-surface"> · {size}</span> : null}
          </legend>
          <ul className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-2">
            {sizes.map((value) => {
              const option = variantFor(value);
              const out = !buyable(option?.availability);
              return (
                <li key={value}>
                  <label className="block h-full">
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
                        "flex h-full min-h-14 flex-col items-center justify-center gap-0.5 border px-2 py-2 text-center " +
                        "transition-[background-color,border-color] duration-[var(--duration-quick)] ease-[var(--ease-out)] " +
                        "peer-checked:border-lavender peer-checked:bg-lavender peer-checked:text-charcoal " +
                        "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-on-surface " +
                        (out
                          ? "cursor-not-allowed border-dashed border-line text-muted"
                          : "cursor-pointer border-line hover:border-on-surface")
                      }
                    >
                      <span className={`text-body ${out ? "line-through" : ""}`}>{value}</span>
                      {out ? (
                        <span className="text-caption uppercase">Sold out</span>
                      ) : showSizePrices ? (
                        <span className="text-caption">{formatMoney(option?.price ?? null)}</span>
                      ) : null}
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

      {canBuy && addons.length > 0 ? (
        <AddonRail addons={addons} chosen={chosen} onToggle={toggleAddon} />
      ) : null}

      {variant ? <DeliveryCheck productId={product.id} variantId={variant.id} /> : null}

      <div data-buy-bar className="fixed inset-x-0 bottom-0 z-10 overflow-x-clip border-t border-line bg-surface">
        <div className="page-gutter grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:gap-3">
          <button type="button" className={BAR_ADD} disabled={!canBuy} onClick={addToBag}>
            {canBuy ? "Add to bag" : "Sold out"}
          </button>
          <button type="button" className={BAR_BUY} disabled={!canBuy} onClick={buyNow}>
            {canBuy && total ? `Buy now · ${formatMoney(total)}` : "Buy now"}
          </button>
        </div>
      </div>
    </div>
  );
}
