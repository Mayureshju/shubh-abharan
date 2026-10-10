import type { Metadata } from "next";
import { Detail } from "@/components/about/Detail";
import { Plate } from "@/components/editorial/Plate";
import { Reveal } from "@/components/primitives/Reveal";
import { ABOUT_PLATE, STORY_PLATE } from "@/components/home/plates";
import { brand, placeholder, resolve } from "@/lib/brand";

export const metadata: Metadata = { title: "About" };

/**
 * About, composed only from the brand record.
 *
 *   Masthead   → Story       tight
 *   Story      → Materials   normal
 *   Materials  → Reasons     normal
 *   Reasons    → footer      breath    (fixed by SiteFooter)
 *
 * Every fact the business has not supplied — story, founding year, place,
 * materials — renders as a marked placeholder until it is filled in
 * `lib/brand.ts`. See BRAND-INPUTS.md. Nothing on this page may say more than
 * the record does.
 *
 * Image placement alternates right, left, right, then none, so each section
 * differs from its neighbour in image scale or surface. On a phone every frame
 * runs full-bleed and follows its own copy.
 */
export default function AboutPage() {
  return (
    <>
      <Masthead />
      <Story className="mt-tight" />
      <Detail className="mt-normal" />
      <Reasons className="mt-normal" />
    </>
  );
}

/** Not wrapped in Reveal: the frame is the route's largest paint. */
function Masthead() {
  return (
    <section className="page-gutter pt-tight md:grid md:grid-cols-12 md:items-end md:gap-x-8">
      <div className="md:col-span-7 md:pb-tight">
        <p className="text-caption uppercase tracking-[0.22em] text-accent">About</p>
        <h1 className="mt-4 text-display">{resolve(brand.name, "brand name")}</h1>
        <p className="mt-tight text-caption uppercase tracking-[0.22em] text-muted">
          Founded {resolve(brand.foundedYear, "founding year")}
          <span aria-hidden="true" className="mx-3">·</span>
          {resolve(brand.placeOfBusiness, "place of business")}
        </p>
      </div>

      <div className="mt-tight full-bleed md:col-span-5 md:col-start-8 md:mx-0 md:mt-0 md:w-auto">
        <Plate
          {...ABOUT_PLATE}
          priority
          sizes="(min-width: 768px) 40vw, 100vw"
        />
      </div>
    </section>
  );
}

/**
 * The story is the page's subject, so an empty list placeholds rather than
 * omitting the section.
 *
 * Not revealed and loaded eagerly: from 768px this frame is above the fold and
 * larger than the masthead's, so it is the route's largest paint there.
 */
function Story({ className }: { className?: string }) {
  return (
    <section className={className}>
      <div className="page-gutter md:grid md:grid-cols-12 md:items-center md:gap-x-8">
        <div className="md:col-span-5 md:col-start-8 md:row-start-1 lg:col-span-4 lg:col-start-9">
          <h2 className="text-title">Our story</h2>
          <div className="mt-6 max-w-measure space-y-4">
            {brand.story.length > 0 ? (
              brand.story.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="text-body">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-body text-muted">
                {placeholder("brand story")} — unfilled, see BRAND-INPUTS.md
              </p>
            )}
          </div>
        </div>

        <div className="mt-tight full-bleed md:col-span-7 md:col-start-1 md:row-start-1 md:mx-0 md:mt-0 md:w-auto">
          <Plate {...STORY_PLATE} priority sizes="(min-width: 768px) 55vw, 100vw" />
        </div>
      </div>
    </section>
  );
}

/**
 * The four supplied reasons, as a numbered list rather than the homepage's
 * centred icon row — same record, a different composition, no second icon set.
 * Numerals are caption type: Gambarino is reserved for display and title.
 */
function Reasons({ className }: { className?: string }) {
  if (brand.reasons.length === 0) return null;

  return (
    <Reveal as="section" className={className}>
      <div className="page-gutter">
        <h2 className="text-caption uppercase tracking-[0.22em] text-accent">
          Why choose {resolve(brand.name, "brand name")}
        </h2>

        <ol className="mt-tight border-t border-line md:grid md:grid-cols-2 md:gap-x-8">
          {brand.reasons.map((reason, index) => (
            <li
              key={reason.title}
              className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-line py-tight"
            >
              <span aria-hidden="true" className="pt-2 text-caption text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-title">{reason.title}</h3>
                <p className="mt-3 text-body text-muted">{reason.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Reveal>
  );
}
