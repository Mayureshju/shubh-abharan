import { Plate } from "@/components/editorial/Plate";
import { Reveal } from "@/components/primitives/Reveal";
import { DETAIL_PLATE } from "@/components/home/plates";
import { brand, isSupplied, placeholder, resolve } from "@/lib/brand";

/**
 * About's materials section: one piece, close, on the inverted surface.
 *
 * Moved from the homepage, which no longer presents a Detail band. The line
 * beside the frame names only what is visible in it — a beaded border, a domed
 * cabochon, silk. The frame is generated, so it cannot carry a claim about
 * technique or stone identity; "garnet", "closed by hand" and "made rather than
 * cast" were removed for that reason.
 *
 * The materials rows are the page's structural facts and placehold while
 * unsupplied. The policy rows are optional and omit themselves, the same rule
 * `SiteFooter` follows for its policy links. Supplying either in `lib/brand.ts`
 * is the whole of what it takes for a row to fill in.
 */

const POLICIES = [
  { key: "hallmarking", term: "Hallmarking" },
  { key: "care", term: "Care" },
] as const;

function vocabulary(values: readonly string[], field: string): string {
  return values.length > 0 ? values.join(", ") : placeholder(field);
}

export function Detail({ className }: { className?: string }) {
  const rows = [
    { term: "Metals", value: vocabulary(brand.materials.metals, "metals") },
    { term: "Stones", value: vocabulary(brand.materials.stones, "stones") },
    { term: "Made in", value: resolve(brand.materials.madeIn, "made in") },
    ...POLICIES.flatMap(({ key, term }) => {
      const value = brand.policies[key];
      return isSupplied(value) ? [{ term, value }] : [];
    }),
  ];

  return (
    <Reveal as="section" className={className}>
      {/* The ink band runs edge to edge; its contents keep the page gutter. */}
      <div data-surface="ink" className="py-normal">
        <div className="page-gutter md:grid md:grid-cols-12 md:items-center md:gap-x-8">
          <div className="md:col-span-6 md:row-start-1 lg:col-span-5">
            <h2 className="text-caption uppercase tracking-[0.22em] text-accent">Materials</h2>

            <p className="mt-tight max-w-[22ch] text-title">
              A beaded gold border around a domed red cabochon, resting on lilac silk.
            </p>

            <dl className="mt-tight border-t border-line">
              {rows.map((row) => (
                <div key={row.term} className="flex gap-6 border-b border-line py-4">
                  <dt className="w-24 shrink-0 pt-1 text-caption uppercase text-muted">
                    {row.term}
                  </dt>
                  <dd className="text-body">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right, and narrower than the copy column: the frame is one object
              against a dark field, and giving it half the page would turn a
              close view into a poster. */}
          <div className="mt-tight full-bleed md:col-span-5 md:col-start-8 md:row-start-1 md:mx-0 md:mt-0 md:w-auto lg:col-span-4 lg:col-start-9">
            <Plate {...DETAIL_PLATE} sizes="(min-width: 1024px) 34vw, (min-width: 768px) 42vw, 100vw" />
          </div>
        </div>
      </div>
    </Reveal>
  );
}
