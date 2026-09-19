import Link from "next/link";
import { Plate, type PlateRole } from "@/components/editorial/Plate";

/**
 * Presentation follows the declared image role rather than a fixed template,
 * and aspect ratio and grid span vary per card. A listing that renders every
 * card at identical size in a repeating row fails review — see the
 * product-card requirement in specs/design-system/core-components.
 *
 * There is deliberately no rating, review, badge, discount or scarcity
 * affordance. Those have no prop here, so no listing can render one.
 *
 * The catalog model is out of scope for this change (it belongs to
 * define-catalog-model). This is the narrow shape the card needs; the real
 * Product type will be structurally assignable to it.
 */

type CardImage =
  | {
      role: "scale";
      /** Required for the scale role — it exists to communicate true size. */
      dimension: string;
      src?: string;
      alt: string;
      aspect: string;
      crop?: string;
    }
  | {
      role: Exclude<PlateRole, "scale">;
      dimension?: string;
      src?: string;
      alt: string;
      aspect: string;
      crop?: string;
    };

export interface ProductCardProduct {
  slug: string;
  name: string;
  /** Preformatted. Currency handling belongs to the catalog model. */
  price: string;
  /** e.g. "9ct recycled gold · 1.2mm" — a measurable fact, per the copy rule. */
  materialLine: string;
  image: CardImage;
}

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
