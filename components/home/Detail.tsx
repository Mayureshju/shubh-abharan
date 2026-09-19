import { Plate } from "@/components/editorial/Plate";
import { Reveal } from "@/components/primitives/Reveal";
import { brand, isSupplied } from "@/lib/brand";
import { DETAIL_PLATE } from "./plates";

/**
 * One piece, close, on the inverted surface.
 *
 * This is the craftsmanship section, and it is deliberately not a paragraph
 * about workmanship. With no materials vocabulary supplied, that paragraph
 * could only be invented — and "crafted with care" is exactly the sentence the
 * copy rule in specs/design-system/visual-language exists to reject. So the
 * copy here names only what is visible in the frame beside it: granulation,
 * wire, a bezel, a cabochon. Every noun in it can be pointed at in the
 * photograph. Nothing in it is a claim about the business.
 *
 * The section is on `ink` and the copy sits left of the frame, which is how it
 * differs from the Collection above it on every axis the section-variation rule
 * scores: surface, alignment, column count and image scale.
 *
 * The assurance line is the one part of this section that is not photography.
 * It renders the policies the business has actually stated and nothing else —
 * a shipping timeframe, a returns window, a care instruction. While those are
 * unsupplied the line omits itself rather than approximating them, which is the
 * same rule `SiteFooter` follows for its policy links: an optional affordance
 * omits itself, only a structural section renders unfilled. Supplying a policy
 * in `lib/brand.ts` is the whole of what it takes for this line to appear.
 */

const ASSURANCES = [
  { key: "hallmarking", term: "Hallmarking" },
  { key: "care", term: "Care" },
  { key: "shipping", term: "Shipping" },
  { key: "returns", term: "Returns" },
] as const;

export function Detail({ className }: { className?: string }) {
  const stated = ASSURANCES.filter((item) => isSupplied(brand.policies[item.key]));

  return (
    <Reveal as="section" className={className}>
      {/* The ink band runs edge to edge; its contents keep the page gutter. */}
      <div data-surface="ink" className="py-normal">
        <div className="page-gutter md:grid md:grid-cols-12 md:items-center md:gap-x-8">
          <div className="md:col-span-5 md:row-start-1">
            <h2 className="text-caption uppercase text-muted">Detail</h2>

            <p className="mt-tight max-w-measure text-body">
              Granulation, twisted wire, and a bezel closed by hand around a single garnet
              cabochon.
            </p>

            <p className="mt-6 max-w-measure text-body text-muted">
              The tool marks stay where the hand left them. Under this much light they are the
              easiest way to tell the piece was made rather than cast.
            </p>

            {stated.length > 0 ? (
              <dl className="mt-tight border-t border-line pt-tight text-caption uppercase">
                {stated.map((item) => (
                  <div key={item.key} className="flex gap-6 border-b border-line py-3">
                    <dt className="w-24 shrink-0 text-muted">{item.term}</dt>
                    <dd>{brand.policies[item.key]}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>

          {/* Right, and narrower than the copy column: the frame is one object
              against a dark field, and giving it half the page would turn a
              close view into a poster. */}
          <div className="mt-tight md:col-span-4 md:col-start-9 md:row-start-1 md:mt-0">
            <Plate {...DETAIL_PLATE} sizes="(min-width: 768px) 34vw, 100vw" />
          </div>
        </div>
      </div>
    </Reveal>
  );
}
