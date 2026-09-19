import Link from "next/link";
import { Plate } from "@/components/editorial/Plate";
import { Reveal } from "@/components/primitives/Reveal";
import { CATEGORY_PLATES } from "./plates";

/**
 * Five catalog types as circular stills. Links resolve to `/shop?category=`.
 * Identically circular on purpose — that is the mood board. The rail below
 * 768px is the authored mobile composition.
 */

type PhotographedCategory = keyof typeof CATEGORY_PLATES;

const TYPES: readonly { category: PhotographedCategory; label: string }[] = [
  { category: "necklace", label: "Necklaces" },
  { category: "ring", label: "Rings" },
  { category: "bracelet", label: "Bracelets" },
  { category: "earring", label: "Earrings" },
  { category: "pendant", label: "Pendants" },
];

export function Types({ className }: { className?: string }) {
  return (
    <Reveal as="section" className={className}>
      <div className="page-gutter">
        <div className="text-center">
          <p className="text-caption uppercase tracking-[0.22em] text-gold">Shop by category</p>
          <h2 className="mt-3 text-title">Find Your Perfect Piece</h2>
        </div>

        <div className="rail mt-tight [--rail-columns:3] lg:grid-cols-5">
          {TYPES.map((type) => (
            <article key={type.category}>
              <Link
                href={`/shop?category=${type.category}`}
                className="group block text-center focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                <div className="plate-zoom mx-auto max-w-[11rem] overflow-hidden rounded-pill bg-[color-mix(in_oklab,var(--surface-fg)_4%,var(--surface-bg))]">
                  <Plate
                    {...CATEGORY_PLATES[type.category]}
                    sizes="(min-width: 1024px) 16vw, (min-width: 768px) 28vw, 60vw"
                  />
                </div>
                <h3 className="mt-4 text-body">{type.label}</h3>
                <p className="mt-1 text-caption text-gold">Explore →</p>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
