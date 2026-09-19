import Link from "next/link";
import { Plate } from "@/components/editorial/Plate";
import { Reveal } from "@/components/primitives/Reveal";
import { buttonClass } from "@/components/ui/buttonClass";
import { ArrowIcon } from "@/components/ui/icons";
import { brand, resolve } from "@/lib/brand";
import { CAMPAIGN_PLATE } from "./plates";

/**
 * Closing campaign overlay. The statement is a paragraph set at display —
 * large text is not a heading. The action is `quiet`; the page's `primary`
 * is in the Hero.
 */

export function Statement({ className }: { className?: string }) {
  return (
    <Reveal as="section" className={className}>
      <div className="page-gutter">
        <div className="relative overflow-hidden rounded-frame">
          <Plate {...CAMPAIGN_PLATE} sizes="100vw" />
          <div className="pointer-events-none absolute inset-0 bg-ink/55" />
          <div data-surface="ink" className="absolute inset-0 z-[1] flex flex-col items-start justify-end bg-transparent px-6 py-tight md:px-12 lg:px-16">
            <p className="max-w-[14ch] text-display">
              {resolve(brand.closingStatement, "closing statement")}
            </p>
            <p className="mt-4 max-w-measure text-body text-muted">
              {resolve(brand.closingSupport, "closing support")}
            </p>
            <div className="mt-tight">
              <Link href="/shop" className={buttonClass("quiet")}>
                Shop Now
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
