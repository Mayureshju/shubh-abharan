import { Reveal } from "@/components/primitives/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import { brand } from "@/lib/brand";
import { getProductsBySlugs, listProducts, toProductCardProduct } from "@/lib/catalog";
import { RowSlider } from "./RowSlider";

/**
 * Brand-owned new-arrival slugs, in declared order. Cards share a 1/1 crop
 * so the looping rail reads as one strip, not mixed frames. Empty omits.
 */

export async function NewArrivals({ className }: { className?: string }) {
  const flagged = await listProducts({ isNew: true });
  const products =
    flagged.length > 0 ? flagged : await getProductsBySlugs(brand.homepage.newArrivalSlugs);
  if (products.length === 0) return null;

  return (
    <Reveal as="section" className={className}>
      <div className="page-gutter">
        <RowSlider
          label="New arrivals"
          heading={
            <div>
              <p className="text-caption uppercase tracking-[0.22em] text-accent">New arrivals</p>
              <h2 className="mt-3 text-title">Just in</h2>
            </div>
          }
        >
          {products.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={toProductCardProduct(product, "macro")}
              portrait
              priority={index < 4}
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 46vw"
            />
          ))}
        </RowSlider>
      </div>
    </Reveal>
  );
}
