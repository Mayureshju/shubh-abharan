import { ProductCard } from "@/components/product/ProductCard";
import { toProductCardProduct, type Product } from "@/lib/catalog";
import type { PlateRole } from "@/components/editorial/Plate";

/**
 * Editorial shop/collection grid. Span and image role cycle so four or more
 * cards are not a uniform repeating row — see design-system/core-components.
 */

function roleFor(index: number): PlateRole {
  const slot = index % 4;
  if (slot === 1) return "worn";
  if (slot === 2) return "detail";
  return "macro";
}

export function ProductListing({ products }: { products: readonly Product[] }) {
  return (
    <div className="shop-set">
      {products.map((product, index) => {
        const slot = index % 4;
        return (
          <ProductCard
            key={product.slug}
            product={toProductCardProduct(product, roleFor(index))}
            portrait={slot !== 0}
            priority={index === 0}
            sizes={
              slot === 0
                ? "(min-width: 1024px) 66vw, (min-width: 768px) 100vw, 100vw"
                : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            }
          />
        );
      })}
    </div>
  );
}
