import { Reveal } from "@/components/primitives/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import { brand } from "@/lib/brand";
import { getProductsBySlugs, toProductCardProduct } from "@/lib/catalog";
import type { PlateRole } from "@/components/editorial/Plate";

const ROLES: readonly PlateRole[] = ["macro", "worn", "detail", "macro"];

/**
 * Brand-owned new-arrival slugs, in declared order. Mixed roles stop the rail
 * reading as four identical cards. Empty list omits the section.
 */

export async function NewArrivals({ className }: { className?: string }) {
  const slugs = brand.homepage.newArrivalSlugs;
  if (slugs.length === 0) return null;

  const products = await getProductsBySlugs(slugs);
  if (products.length === 0) return null;

  return (
    <Reveal as="section" className={className}>
      <div className="page-gutter">
        <div>
          <p className="text-caption uppercase tracking-[0.22em] text-gold">New arrivals</p>
          <h2 className="mt-3 text-title">Just in</h2>
        </div>

        <div className="rail mt-tight [--rail-columns:4]">
          {products.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={toProductCardProduct(product, ROLES[index] ?? "macro")}
              sizes="(min-width: 768px) 25vw, 72vw"
            />
          ))}
        </div>
      </div>
    </Reveal>
  );
}
