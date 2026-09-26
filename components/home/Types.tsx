import { Reveal } from "@/components/primitives/Reveal";
import { TypeStills } from "./typeIndex";

/**
 * Five catalog types as circular stills. Links resolve to `/shop?category=`.
 * Identically circular on purpose — that is the mood board. Bracelets and
 * Bangles both resolve to `bracelet`; the photographs differ. Below 768px
 * the rail shows two stills plus a peek; from 768px it is a five-up row.
 */

export function Types({ className }: { className?: string }) {
  return (
    <Reveal as="section" className={className}>
      <div className="page-gutter">
        <div className="flex flex-col items-center text-center">
          <p className="text-caption uppercase tracking-[0.22em] text-accent">Shop by category</p>
          <div className="mt-2 flex items-center justify-center gap-6">
            <h2 className="text-title">Find Your Perfect Piece</h2>
            <span className="hidden h-px w-[4.5rem] bg-gold md:block" aria-hidden />
          </div>
        </div>

        <div className="mt-5 md:mt-tight">
          <TypeStills />
        </div>
      </div>
    </Reveal>
  );
}
