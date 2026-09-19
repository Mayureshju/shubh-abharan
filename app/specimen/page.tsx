import type { Metadata } from "next";
import { SiteHeader } from "@/components/nav/SiteHeader";
import { SiteFooter } from "@/components/nav/SiteFooter";
import { Button } from "@/components/ui/Button";
import { Plate, PLATE_ROLE_INTENT } from "@/components/editorial/Plate";
import { FigureCaption } from "@/components/editorial/FigureCaption";
import { ProductCard, type ProductCardProduct } from "@/components/product/ProductCard";
import { Reveal } from "@/components/primitives/Reveal";
import { duration, ease } from "@/lib/motion";
import { OverlayDemo } from "./OverlayDemo";
import { PendingDemo } from "./PendingDemo";

/**
 * The acceptance surface for the design system. Every token and every
 * component state defined by this change renders here.
 *
 * Excluded from indexing and unlinked from customer-facing navigation.
 */
export const metadata: Metadata = {
  title: "Specimen",
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Contrast ratios measured by `node scripts/contrast.mjs`. Re-run that script
 * after any change to the colour tokens.
 */
const CONTRAST = [
  { pair: "ink on paper", ratio: "16.74:1", floor: "4.5:1", use: "body and caption text" },
  { pair: "graphite on paper", ratio: "4.90:1", floor: "4.5:1", use: "secondary text" },
  { pair: "paper on ink", ratio: "16.74:1", floor: "4.5:1", use: "body and caption text" },
  { pair: "graphite-inverse on ink", ratio: "6.53:1", floor: "4.5:1", use: "secondary text" },
  { pair: "hairline on paper", ratio: "1.15:1", floor: "decorative", use: "rules only, never text or control boundaries" },
];

const RHYTHMS = [
  { name: "tight", value: "clamp(2.5rem, 4vw, 3.5rem)", use: "sections that belong to each other" },
  { name: "normal", value: "clamp(5rem, 9vw, 8rem)", use: "the default join" },
  { name: "breath", value: "clamp(8rem, 16vw, 14rem)", use: "at most twice per page, never adjacent" },
];

/** Specimen data. Deliberately not brand content — see BRAND-INPUTS.md. */
const SPECIMEN_PRODUCTS: ProductCardProduct[] = [
  {
    slug: "specimen-macro",
    name: "Specimen — macro role",
    price: "[PRICE]",
    materialLine: "[MATERIAL LINE]",
    image: { role: "macro", aspect: "4/5", alt: "Specimen plate, macro role", crop: "fills frame" },
  },
  {
    slug: "specimen-scale",
    name: "Specimen — scale role",
    price: "[PRICE]",
    materialLine: "[MATERIAL LINE]",
    image: {
      role: "scale",
      aspect: "1/1",
      alt: "Specimen plate, true-scale role",
      crop: "object small in field",
      dimension: "14mm",
    },
  },
  {
    slug: "specimen-worn",
    name: "Specimen — worn role",
    price: "[PRICE]",
    materialLine: "[MATERIAL LINE]",
    image: { role: "worn", aspect: "3/4", alt: "Specimen plate, worn role", crop: "on the body" },
  },
];

/**
 * Section rhythm is scored, not uniform — no two `breath` joins adjacent and at
 * least one `tight` join present, per the spacing requirement. The specimen
 * follows the rule it documents rather than exempting itself from it.
 */
type Rhythm = "tight" | "normal" | "breath";

const RHYTHM_CLASS: Record<Rhythm, string> = {
  tight: "py-tight",
  normal: "py-normal",
  breath: "py-breath",
};

function Section({
  title,
  intent,
  children,
  surface,
  rhythm = "normal",
}: {
  title: string;
  intent: string;
  children: React.ReactNode;
  surface?: "ink";
  rhythm?: Rhythm;
}) {
  return (
    <Reveal as="section" className={`${surface ? "full-bleed " : ""}${RHYTHM_CLASS[rhythm]}`}>
      <div {...(surface ? { "data-surface": "ink" } : {})} className={surface ? "page-gutter py-normal" : ""}>
        <h2 className="text-title">{title}</h2>
        <p className="mt-3 max-w-measure text-caption uppercase text-muted">{intent}</p>
        <div className="mt-tight">{children}</div>
      </div>
    </Reveal>
  );
}

export default function SpecimenPage() {
  return (
    <>
      <SiteHeader />

      <main className="page-gutter">
        <header className="py-normal">
          <p className="text-caption uppercase text-muted">Internal — not indexed, not linked</p>
          <h1 className="mt-4 text-display">Specimen</h1>
          <p className="mt-tight max-w-measure text-body">
            Every token and component state defined by the design system. This
            page is the acceptance surface for the <code>establish-brand-system</code>{" "}
            change. No storefront page is built here.
          </p>
          <p className="mt-4 max-w-measure text-caption uppercase text-muted">
            Note: the limits of three type roles and two display uses per page
            apply to storefront surfaces. This page demonstrates all four roles
            by definition and is exempt from that one rule. Section rhythm is
            scored here like any other page.
          </p>
        </header>

        <Section
          title="Typography"
          intent="Four roles, bimodal by design. Display compresses 120 to 52px across the viewport range while body and caption stay fixed."
        >
          <div className="space-y-tight">
            <div className="border-t border-line pt-4">
              <p className="text-caption uppercase text-muted">display · Gambarino · clamp(3.25rem, 1.5rem + 7vw, 7.5rem) · -0.02em</p>
              <p className="mt-3 font-display text-display">Hand &amp; file</p>
            </div>
            <div className="border-t border-line pt-4">
              <p className="text-caption uppercase text-muted">title · Gambarino · clamp(1.75rem, 1.1rem + 2.2vw, 2.75rem) · -0.01em</p>
              <p className="mt-3 font-display text-title">Nine carat, recycled</p>
            </div>
            <div className="border-t border-line pt-4">
              <p className="text-caption uppercase text-muted">body · Switzer · 17px / 1.55</p>
              <p className="mt-3 max-w-measure font-text text-body">
                Measure is capped at 62 characters and positioned by the grid.
                Images size independently of it. There is deliberately no global
                centred page wrapper, which is what lets a composition sit off
                axis without fighting a container.
              </p>
            </div>
            <div className="border-t border-line pt-4">
              <p className="text-caption uppercase text-muted">caption · Switzer 500 · 12px / 1.35 · +0.06em</p>
              <p className="mt-3 font-text text-caption uppercase">
                Band width 1.2mm · Plate 04 · 14mm
              </p>
            </div>
          </div>
        </Section>

        <Section
          title="Colour and surfaces"
          intent="Achromatic, authored in OKLCH at chroma 0.02 or below. Metal and gem colour enter only through photography — no token expresses them."
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "paper", cls: "bg-paper", token: "oklch(96% 0.006 85)" },
              { name: "ink", cls: "bg-ink", token: "oklch(18% 0.008 85)" },
              { name: "graphite", cls: "bg-graphite", token: "oklch(52% 0.008 85)" },
              { name: "graphite-inverse", cls: "bg-graphite-inverse", token: "oklch(68% 0.008 85)" },
            ].map((swatch) => (
              <div key={swatch.name}>
                <div className={`${swatch.cls} h-24 border border-line`} />
                <p className="mt-2 text-caption uppercase">{swatch.name}</p>
                <p className="text-caption uppercase text-muted">{swatch.token}</p>
              </div>
            ))}
          </div>

          <div className="mt-tight overflow-x-auto">
          <table className="w-full min-w-[30rem] border-collapse text-caption uppercase">
            <caption className="pb-3 text-left text-caption uppercase text-muted">
              Measured by scripts/contrast.mjs
            </caption>
            <thead>
              <tr className="border-b border-line text-left">
                <th scope="col" className="py-2 font-normal">Pair</th>
                <th scope="col" className="py-2 font-normal">Measured</th>
                <th scope="col" className="py-2 font-normal">Floor</th>
                <th scope="col" className="py-2 font-normal">Use</th>
              </tr>
            </thead>
            <tbody>
              {CONTRAST.map((row) => (
                <tr key={row.pair} className="border-b border-line">
                  <td className="py-2">{row.pair}</td>
                  <td className="py-2">{row.ratio}</td>
                  <td className="py-2 text-muted">{row.floor}</td>
                  <td className="py-2 text-muted">{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Section>

        <Section
          title="The ink surface"
          rhythm="tight"
          intent="One of exactly two surfaces. Secondary text resolves to graphite-inverse here automatically — a single mid-grey cannot clear 4.5:1 against both."
          surface="ink"
        >
          <p className="max-w-measure text-body">
            Foreground and muted values resolve from the surface scope rather
            than being chosen by hand at each placement.
          </p>
          <p className="mt-3 max-w-measure text-caption uppercase text-muted">
            This line is muted on ink — 6.53:1
          </p>
          <div className="mt-tight flex flex-wrap gap-4">
            <Button variant="primary">Primary on ink</Button>
            <Button variant="quiet">Quiet on ink</Button>
          </div>
        </Section>

        <Section
          title="Spacing and section rhythm"
          rhythm="breath"
          intent="Three named joins. Rhythm is never uniform down a page: no two breath joins adjacent, at least one tight join present."
        >
          <div className="space-y-6">
            {RHYTHMS.map((rhythm) => (
              <div key={rhythm.name} className="border-t border-line pt-4">
                <p className="text-caption uppercase">
                  {rhythm.name} <span className="text-muted">{rhythm.value}</span>
                </p>
                <p className="mt-1 text-caption uppercase text-muted">{rhythm.use}</p>
                <div
                  className={`mt-3 border-l border-line ${
                    rhythm.name === "tight" ? "h-tight" : rhythm.name === "normal" ? "h-normal" : "h-breath"
                  }`}
                />
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Border and surface language"
          rhythm="tight"
          intent="Radius 0 on surfaces, images and buttons; 2px on form inputs only. Depth comes from hairline rules and image scale, never from elevation."
        >
          <div className="flex flex-wrap items-end gap-8">
            <div>
              <div className="size-24 border border-on-surface" />
              <p className="mt-2 text-caption uppercase text-muted">surface · radius 0</p>
            </div>
            <div>
              <input
                aria-label="Specimen input"
                placeholder="Form input"
                className="rounded-input border border-on-surface bg-transparent px-3 py-2 text-body placeholder:text-muted"
              />
              <p className="mt-2 text-caption uppercase text-muted">input · radius 2px</p>
            </div>
            <div>
              <hr className="w-24 border-t border-line" />
              <p className="mt-2 text-caption uppercase text-muted">hairline rule</p>
            </div>
          </div>
        </Section>

        <Section
          title="Buttons"
          intent="Four presentations, each in every state. Disabled and pending are signalled by border and text treatment, never by colour alone."
        >
          <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse">
            <thead>
              <tr className="border-b border-line text-left text-caption uppercase text-muted">
                <th scope="col" className="py-3 font-normal">Variant</th>
                <th scope="col" className="py-3 font-normal">Rest</th>
                <th scope="col" className="py-3 font-normal">Disabled</th>
                <th scope="col" className="py-3 font-normal">Pending</th>
              </tr>
            </thead>
            <tbody>
              {(["primary", "quiet", "inline", "icon"] as const).map((variant) => (
                <tr key={variant} className="border-b border-line align-middle">
                  <th scope="row" className="py-4 pr-6 text-left text-caption uppercase font-normal">
                    {variant}
                  </th>
                  <td className="py-4 pr-6">
                    <Button variant={variant} aria-label={variant === "icon" ? "Add to wishlist" : undefined}>
                      {variant === "icon" ? <span aria-hidden="true">&#9671;</span> : "Add to bag"}
                    </Button>
                  </td>
                  <td className="py-4 pr-6">
                    <Button variant={variant} disabled aria-label={variant === "icon" ? "Add to wishlist" : undefined}>
                      {variant === "icon" ? <span aria-hidden="true">&#9671;</span> : "Add to bag"}
                    </Button>
                  </td>
                  <td className="py-4">
                    <Button variant={variant} pending aria-label={variant === "icon" ? "Add to wishlist" : undefined}>
                      {variant === "icon" ? <span aria-hidden="true">&#9671;</span> : "Add to bag"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          <p className="mt-tight text-caption uppercase text-muted">
            Hover, active and focus-visible are pointer and keyboard states — tab
            through the row above to verify the focus indicator.
          </p>

          <div className="mt-tight border-t border-line pt-tight">
            <PendingDemo />
          </div>
        </Section>

        <Section
          title="Plate — image roles"
          intent="Every image goes through one primitive. Layouts request imagery by role, not by position. Photography is unsupplied, so each frame renders its marked placeholder."
        >
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <figure>
              <Plate role="macro" aspect="4/5" alt="Specimen, macro role" crop="fills frame" sizes="(min-width:1024px) 25vw, 50vw" />
              <FigureCaption index={1}>{PLATE_ROLE_INTENT.macro}</FigureCaption>
            </figure>
            <figure>
              <Plate role="scale" aspect="1/1" alt="Specimen, true-scale role" crop="object small in field" dimension="14mm" sizes="(min-width:1024px) 25vw, 50vw" />
              <FigureCaption index={2}>{PLATE_ROLE_INTENT.scale}</FigureCaption>
            </figure>
            <figure>
              <Plate role="worn" aspect="3/4" alt="Specimen, worn role" crop="on the body" sizes="(min-width:1024px) 25vw, 50vw" />
              <FigureCaption index={3}>{PLATE_ROLE_INTENT.worn}</FigureCaption>
            </figure>
            <figure>
              <Plate role="detail" aspect="1/1" decorative crop="single feature" sizes="(min-width:1024px) 25vw, 50vw" />
              <FigureCaption index={4}>
                {PLATE_ROLE_INTENT.detail} Marked decorative — no alt text.
              </FigureCaption>
            </figure>
          </div>
        </Section>

        <Section
          title="Product card"
          rhythm="tight"
          intent="Presentation follows the declared image role. Aspect ratio and grid span vary deliberately — a uniform repeating row fails review. Rendered with specimen data, not brand content."
        >
          <div className="rail" style={{ ["--rail-columns" as string]: "3" }}>
            {SPECIMEN_PRODUCTS.map((product, index) => (
              <ProductCard
                key={product.slug}
                product={product}
                className={index === 0 ? "lg:row-span-2" : undefined}
              />
            ))}
          </div>
          <p className="mt-tight text-caption uppercase text-muted">
            Below 768px this set is a horizontal rail with snap points; above it,
            a grid. Native scroll, no interception.
          </p>
        </Section>

        <Section
          title="Motion"
          intent="Four durations, two curves. Reveal travel is budgeted at 16px or less; hover scale at 1.03 or less over the base duration."
        >
          <div className="overflow-x-auto">
          <table className="w-full min-w-[30rem] border-collapse text-caption uppercase">
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th scope="col" className="py-2 font-normal">Token</th>
                <th scope="col" className="py-2 font-normal">Value</th>
                <th scope="col" className="py-2 font-normal">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-line"><td className="py-2">instant</td><td className="py-2">{duration.instant * 1000}ms</td><td className="py-2 text-muted">focus, toggles, state</td></tr>
              <tr className="border-b border-line"><td className="py-2">quick</td><td className="py-2">{duration.quick * 1000}ms</td><td className="py-2 text-muted">hover, small transitions</td></tr>
              <tr className="border-b border-line"><td className="py-2">base</td><td className="py-2">{duration.base * 1000}ms</td><td className="py-2 text-muted">drawers, crossfades, reveals</td></tr>
              <tr className="border-b border-line"><td className="py-2">slow</td><td className="py-2">{duration.slow * 1000}ms</td><td className="py-2 text-muted">page and hero entrance only</td></tr>
              <tr className="border-b border-line"><td className="py-2">ease-out</td><td className="py-2">cubic-bezier({ease.out.join(", ")})</td><td className="py-2 text-muted">entrances</td></tr>
              <tr className="border-b border-line"><td className="py-2">ease-inout</td><td className="py-2">cubic-bezier({ease.inOut.join(", ")})</td><td className="py-2 text-muted">travel and stop</td></tr>
            </tbody>
          </table>
          </div>
          <p className="mt-tight max-w-measure text-caption uppercase text-muted">
            Every section on this page is wrapped in the single Reveal
            primitive. With reduced motion requested, travel resolves to 0 and
            only opacity changes — hierarchy and feedback are unaffected.
          </p>
        </Section>

        <Section
          title="Navigation overlay"
          rhythm="breath"
          intent="Built on a native dialog: focus containment, Escape, inert background and focus return come from the platform. Motion drives only the visual transition."
        >
          <OverlayDemo />
          <p className="mt-6 max-w-measure text-caption uppercase text-muted">
            The header above is sticky and adopts its scrolled state past 24px —
            scroll this page to verify. At mobile widths its menu control opens
            the same overlay full screen.
          </p>
        </Section>
      </main>

      <SiteFooter />
    </>
  );
}
