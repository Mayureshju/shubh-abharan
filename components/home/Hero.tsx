import Link from "next/link";
import { Plate } from "@/components/editorial/Plate";
import { buttonClass } from "@/components/ui/buttonClass";
import { ArrowIcon } from "@/components/ui/icons";
import { brand, resolve } from "@/lib/brand";
import { HERO_PLATE } from "./plates";

/**
 * Overlay statement on the worn portrait. CSS stagger, not Motion, so the
 * heading cannot be left at opacity 0 if scripting is blocked.
 *
 * The heading is the brand name. Eyebrow and support come from the brand
 * record. One primary action — Shop Now.
 */

export function Hero() {
  return (
    <section className="page-gutter pt-tight">
      <div className="relative overflow-hidden rounded-frame">
        <div data-hero-step="1">
          <Plate {...HERO_PLATE} priority sizes="100vw" />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-ink/55" />

        <div className="absolute inset-0 z-[1] flex items-end md:items-center">
          <div data-surface="ink" className="max-w-[20rem] bg-transparent px-6 py-tight md:max-w-[36rem] md:px-12 lg:px-16">
            <p data-hero-step="2" className="text-caption uppercase tracking-[0.22em] text-gold">
              {resolve(brand.heroEyebrow, "hero eyebrow")}
            </p>
            <h1 data-hero-step="2" className="mt-4 text-display [overflow-wrap:normal]">
              {resolve(brand.name, "brand name")}
            </h1>
            <p data-hero-step="3" className="mt-4 max-w-measure text-body text-muted">
              {resolve(brand.heroSupport, "hero support")}
            </p>
            <div data-hero-step="3" className="mt-tight">
              <Link href="/shop" className={buttonClass("primary")}>
                Shop Now
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
