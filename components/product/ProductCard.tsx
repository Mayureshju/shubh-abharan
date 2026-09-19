import Link from "next/link";
import { Plate } from "@/components/editorial/Plate";
import type { ProductCardProduct } from "@/lib/catalog/types";

/**
 * Presentation follows the declared image role rather than a fixed template,
 * and aspect ratio and grid span vary per card. A listing that renders every
 * card at identical size in a repeating row fails review — see the
 * product-card requirement in specs/design-system/core-components.
 *
 * There is deliberately no rating, review, badge, discount or scarcity
 * affordance. Those have no prop here, so no listing can render one. Product
 * labels — made-to-order, hallmarked and the rest — are manufacturing facts
 * the catalog carries, and they are not among them: they surface on the
 * product detail page only.
 *
 * `ProductCardProduct` is owned by lib/catalog and re-exported here. A
 * `Product` is *not* assignable to it — the catalog's price is structured
 * Money, its material line may be unsupplied, and the card cannot know which
 * image role the layout wants. `toProductCardProduct(product, role)` is the
 * one path between them. The type is imported from lib/catalog/types rather
 * than the barrel, so this component depends on product shape and never on
 * the repository or the fixtures behind it.
 */

export type { ProductCardProduct } from "@/lib/catalog/types";

export function ProductCard({
  product,
  className,
  sizes = "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
  priority = false,
}: {
  product: ProductCardProduct;
  /** Grid span is the parent's decision — listings vary it deliberately. */
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const { image } = product;

  // The scale role is shown small in a generous field; macro runs edge to
  // edge. Presentation follows the role, not the card's position.
  const frame =
    image.role === "scale"
      ? "px-[12%] py-[8%]"
      : image.role === "detail"
        ? "px-[4%] py-[3%]"
        : "";

  return (
    <article className={className}>
      {/* One link, one tab stop, whole card is the pointer target. */}
      <Link href={`/products/${product.slug}`} className="group block focus-visible:outline-2 focus-visible:outline-offset-4">
        <div className={`plate-zoom bg-[color-mix(in_oklab,var(--surface-fg)_4%,var(--surface-bg))] ${frame}`}>
          <Plate {...image} sizes={sizes} priority={priority} />
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 className="text-body group-hover:underline underline-offset-4">{product.name}</h3>
          <p className="text-caption uppercase text-muted">{product.price}</p>
        </div>
        <p className="mt-1 text-caption uppercase text-muted">{product.materialLine}</p>
      </Link>
    </article>
  );
}
