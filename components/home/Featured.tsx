import { Reveal } from "@/components/primitives/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import { brand } from "@/lib/brand";
import { getProductsBySlugs, toProductCardProduct } from "@/lib/catalog";
import type { PlateRole } from "@/components/editorial/Plate";

const ROLES: readonly PlateRole[] = ["worn", "macro", "macro", "detail"];

/**
 * Brand-owned featured slugs. Mixed grid from 768px — not a second copy of
 * the new-arrivals rail. Empty list omits the section.
 */

export async function Featured({ className }: { className?: string }) {
  const slugs = brand.homepage.featuredSlugs;
  if (slugs.length === 0) return null;

  const products = await getProductsBySlugs(slugs);
  if (products.length === 0) return null;

  return (
    <Reveal as="section" className={className}>
      <div className="page-gutter">
        <div>
          <p className="text-caption uppercase tracking-[0.22em] text-gold">Featured pieces</p>
          <h2 className="mt-3 text-title">On the marble</h2>
        </div>

        <div className="featured-set mt-tight">
          {products.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={toProductCardProduct(product, ROLES[index] ?? "macro")}
                sizes={
                  index === 0
                    ? "(min-width: 768px) 45vw, 80vw"
                    : "(min-width: 768px) 28vw, 80vw"
                }
            />
          ))}
        </div>
      </div>
    </Reveal>
  );
}
