import { ProductCard } from "@/components/product/ProductCard";
import { toProductCardProduct, type Product } from "@/lib/catalog";

/**
 * Shop, collection and wishlist grid. Every card is the square still at one
 * size, so pieces compare at the same scale — see design-system/core-components.
 */

export function ProductListing({ products }: { products: readonly Product[] }) {
  return (
    <div className="shop-set">
      {products.map((product, index) => (
        <ProductCard
          key={product.slug}
          product={toProductCardProduct(product, "macro")}
          portrait
          priority={index === 0}
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
        />
      ))}
    </div>
  );
}
