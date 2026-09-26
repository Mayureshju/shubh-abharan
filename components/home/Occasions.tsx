import Link from "next/link";
import { Plate } from "@/components/editorial/Plate";
import { Reveal } from "@/components/primitives/Reveal";
import { brand, resolve } from "@/lib/brand";
import { OCCASION_PLATES } from "./plates";

/**
 * Three destination tiles from the brand record. Wedding is the tall lead
 * from 768px; mobile is a snap rail. Empty list omits the section.
 */

export function Occasions({ className }: { className?: string }) {
  if (brand.occasions.length === 0) return null;

  return (
    <Reveal as="section" className={className}>
      <div className="page-gutter">
        <div>
          <p className="text-caption uppercase tracking-[0.22em] text-accent">Shop by occasion</p>
          <h2 className="mt-3 text-title">Worn for the day</h2>
        </div>

        <div className="occasion-set mt-tight">
          {brand.occasions.map((occasion) => {
            const plate =
              occasion.slug in OCCASION_PLATES
                ? OCCASION_PLATES[occasion.slug as keyof typeof OCCASION_PLATES]
                : undefined;
            return (
              <article key={occasion.slug} className="relative overflow-hidden rounded-frame">
                <Link
                  href={`/occasions/${occasion.slug}`}
                  className="group block focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  {plate ? (
                    <Plate {...plate} sizes="(min-width: 768px) 50vw, 68vw" />
                  ) : null}
                  {/* slop-check: allow scrim — overlay type on photography */}
                  <div className="pointer-events-none absolute inset-0 bg-ink/45" />
                  <div
                    data-surface="ink"
                    className="absolute inset-0 flex flex-col justify-end bg-transparent px-5 py-5 md:px-6 md:py-6"
                  >
                    <h3 className="text-title text-paper">{occasion.name}</h3>
                    <p className="mt-2 max-w-measure text-caption text-muted">
                      {resolve(occasion.description, "occasion description")}
                    </p>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}
