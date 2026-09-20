import Link from "next/link";
import { Plate } from "@/components/editorial/Plate";
import { Reveal } from "@/components/primitives/Reveal";
import { BANGLES_PLATE, CATEGORY_PLATES } from "./plates";
import type { PlateProps } from "@/components/editorial/Plate";
import type { Category } from "@/lib/catalog";

/**
 * Five catalog types as circular stills. Links resolve to `/shop?category=`.
 * Identically circular on purpose — that is the mood board. Bracelets and
 * Bangles both resolve to `bracelet`; the photographs differ. Below 768px
 * the rail shows two stills plus a peek; from 768px it is a five-up row.
 */

type TypeEntry = {
  readonly category: Category;
  readonly label: string;
  readonly plate: PlateProps & { readonly alt: string };
};

const TYPES: readonly TypeEntry[] = [
  { category: "necklace", label: "Necklaces", plate: CATEGORY_PLATES.necklace },
  { category: "ring", label: "Rings", plate: CATEGORY_PLATES.ring },
  { category: "bracelet", label: "Bracelets", plate: CATEGORY_PLATES.bracelet },
  { category: "earring", label: "Earrings", plate: CATEGORY_PLATES.earring },
  { category: "bracelet", label: "Bangles", plate: BANGLES_PLATE },
];

export function Types({ className }: { className?: string }) {
  return (
    <Reveal as="section" className={className}>
      <div className="page-gutter">
        <div className="flex flex-col items-center text-center">
          <p className="text-caption uppercase tracking-[0.22em] text-gold">Shop by category</p>
          <div className="mt-2 flex items-center justify-center gap-6">
            <h2 className="text-title">Find Your Perfect Piece</h2>
            <span className="hidden h-px w-[4.5rem] bg-gold md:block" aria-hidden />
          </div>
        </div>

        <div className="rail mt-5 [--rail-columns:5] [--rail-item:42%] md:mt-tight">
          {TYPES.map((type) => (
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
                <h3 className="mt-2 text-body md:mt-4">{type.label}</h3>
                <p className="mt-0.5 text-caption text-gold">Explore →</p>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
