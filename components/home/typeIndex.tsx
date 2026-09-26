import Link from "next/link";
import { Plate } from "@/components/editorial/Plate";
import { BANGLES_PLATE, CATEGORY_PLATES } from "./plates";
import type { PlateProps } from "@/components/editorial/Plate";
import type { Category } from "@/lib/catalog/types";

/**
 * Photographed type index. Bracelets and Bangles both resolve to `bracelet`;
 * the stills differ. `set` is absent — there is no photograph for it.
 */

export type TypeIndexEntry = {
  readonly category: Category;
  readonly label: string;
  readonly plate: PlateProps & { readonly alt: string };
};

export const TYPE_INDEX: readonly TypeIndexEntry[] = [
  { category: "necklace", label: "Necklaces", plate: CATEGORY_PLATES.necklace },
  { category: "ring", label: "Rings", plate: CATEGORY_PLATES.ring },
  { category: "bracelet", label: "Bracelets", plate: CATEGORY_PLATES.bracelet },
  { category: "earring", label: "Earrings", plate: CATEGORY_PLATES.earring },
  { category: "bracelet", label: "Bangles", plate: BANGLES_PLATE },
];

export function TypeStills({ heading: Heading = "h3" }: { heading?: "h2" | "h3" }) {
  return (
    <div className="rail [--rail-columns:5] [--rail-item:42%]">
      {TYPE_INDEX.map((type) => (
        <article key={type.label}>
          <Link
            href={`/shop?category=${type.category}`}
            className="group block text-center focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <div className="plate-zoom mx-auto w-full overflow-hidden rounded-pill bg-[color-mix(in_oklab,var(--surface-fg)_4%,var(--surface-bg))] md:max-w-[11rem]">
              <Plate
                {...type.plate}
                sizes="(min-width: 1024px) 16vw, (min-width: 768px) 28vw, 42vw"
              />
            </div>
            <Heading className="mt-2 text-body md:mt-4">{type.label}</Heading>
            <p className="mt-0.5 text-caption text-accent">Explore →</p>
          </Link>
        </article>
      ))}
    </div>
  );
}
