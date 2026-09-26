"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { buttonClass } from "@/components/ui/buttonClass";
import { useCart } from "@/components/cart/CartProvider";

export type BagProduct = {
  readonly id: string;
  readonly isSize: boolean;
  readonly sizes: readonly string[];
  readonly sizeValues: readonly string[];
  readonly variants: readonly {
    readonly id: string;
    readonly size: string | null;
    readonly availability: "available" | "made-to-order" | "sold-out" | "unavailable";
  }[];
};

export function AddToBag({ product }: { product: BagProduct }) {
  const { add } = useCart();
  const router = useRouter();
  const sizes = product.isSize
    ? (product.sizes.length > 0 ? product.sizes : product.sizeValues)
    : [];
  const [size, setSize] = useState(sizes[0] ?? "");

  const variant = useMemo(() => {
    if (!product.isSize) return product.variants[0];
    return product.variants.find((entry) => entry.size === size) ?? product.variants[0];
  }, [product, size]);

  const sold =
    !variant || variant.availability === "sold-out" || variant.availability === "unavailable";

  return (
    <div className="mt-tight flex flex-col gap-4">
      {product.isSize && sizes.length > 0 ? (
        <fieldset className="border-0 p-0">
          <legend className="text-caption uppercase tracking-[0.22em] text-accent">Size</legend>
          <ul className="mt-3 flex flex-wrap gap-2">
            {sizes.map((value) => (
              <li key={value}>
                <label className="inline-flex min-h-11 items-center">
                  <input
                    type="radio"
                    name="size"
                    value={value}
                    checked={size === value}
                    onChange={() => setSize(value)}
                    className="peer sr-only"
                  />
                  <span className="min-h-11 border border-on-surface px-4 py-2 text-caption uppercase peer-checked:bg-lavender peer-checked:text-charcoal">
                    {value}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      ) : null}

      <p>
        <Button
          variant="primary"
          disabled={sold || (product.isSize && !size)}
          onClick={() => {
            if (!variant) return;
            add({ productId: product.id, variantId: variant.id, quantity: 1 });
            router.push("/cart");
          }}
        >
          {sold ? "Unavailable" : "Add to bag"}
        </Button>
      </p>
      <p>
        <button
          type="button"
          className={buttonClass("inline")}
          onClick={() => {
            if (!variant) return;
            const raw = window.localStorage.getItem("shubha-wishlist");
            const entries = raw ? (JSON.parse(raw) as { productId: string; variantId?: string }[]) : [];
            if (!entries.some((entry) => entry.productId === product.id)) {
              entries.push({ productId: product.id, variantId: variant.id });
              window.localStorage.setItem("shubha-wishlist", JSON.stringify(entries));
            }
            router.push("/wishlist");
          }}
        >
          Save to wishlist
        </button>
      </p>
    </div>
  );
}
