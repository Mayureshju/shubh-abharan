"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/actions/catalog";
import { ProductCard } from "@/components/product/ProductCard";
import { buttonClass } from "@/components/ui/buttonClass";
import { toProductCardProduct } from "@/lib/catalog/derive";
import type { Product } from "@/lib/catalog/types";

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const raw = window.localStorage.getItem("shubha-wishlist");
    const entries = raw ? (JSON.parse(raw) as { productId: string }[]) : [];
    void fetchProducts(entries.map((entry) => entry.productId)).then((found) =>
      setProducts([...found]),
    );
  }, []);

  return (
    <section className="page-gutter py-tight">
      <p className="text-caption uppercase tracking-[0.22em] text-accent">Wishlist</p>
      <h1 className="mt-3 text-title">Saved pieces</h1>
      {products.length === 0 ? (
        <p className="mt-tight text-body text-muted">
          Nothing saved.{" "}
          <Link href="/shop" className={buttonClass("inline")}>
            Shop
          </Link>
        </p>
      ) : (
        <div className="mt-tight grid gap-8 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={toProductCardProduct(product)} portrait />
          ))}
        </div>
      )}
    </section>
  );
}
