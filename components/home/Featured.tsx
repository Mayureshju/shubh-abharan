import Link from "next/link";
import { Reveal } from "@/components/primitives/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import { buttonClass } from "@/components/ui/buttonClass";
import { ArrowIcon } from "@/components/ui/icons";
import { brand } from "@/lib/brand";
import { getProductsBySlugs, listProducts, toProductCardProduct } from "@/lib/catalog";

/**
 * Brand-owned featured slugs in a regular merchandising grid — 2 columns
 * from 768px (four rows at eight pieces), 4 columns from 1024px. Same 1/1
 * crop as new arrivals so the two sections differ by composition, not by
 * card geometry. Empty list omits the section.
 */

export async function Featured({ className }: { className?: string }) {
  const flagged = await listProducts({ isFeatured: true });
  const products =
    flagged.length > 0 ? flagged : await getProductsBySlugs(brand.homepage.featuredSlugs);
  if (products.length === 0) return null;

  return (
    <Reveal as="section" className={className}>
      <div className="page-gutter">
        <div>
          <p className="text-caption uppercase tracking-[0.22em] text-accent">Featured pieces</p>
          <h2 className="mt-3 text-title">On the marble</h2>
        </div>

        <div className="featured-set mt-tight">
          {products.map((product) => (
            <ProductCard
              key={product.slug}
              product={toProductCardProduct(product, "macro")}
              portrait
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 46vw"
            />
          ))}
        </div>

        <p className="mt-tight">
          <Link href="/shop" className={buttonClass("quiet")}>
            See all
            <ArrowIcon />
          </Link>
        </p>
      </div>
    </Reveal>
  );
}
