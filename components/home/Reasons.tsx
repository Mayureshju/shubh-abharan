import { Reveal } from "@/components/primitives/Reveal";
import {
  DiamondIcon,
  HeritageIcon,
  PackageIcon,
  ShieldIcon,
} from "@/components/ui/icons";
import { brand } from "@/lib/brand";

/**
 * Four mood-board reasons, rendered from the brand record. An empty list
 * omits the section. Icons are paired by order, not by inventing a fifth.
 */

const ICONS = [DiamondIcon, HeritageIcon, PackageIcon, ShieldIcon] as const;

export function Reasons({ className }: { className?: string }) {
  if (brand.reasons.length === 0) return null;

  return (
    <Reveal as="section" className={className}>
      <div className="page-gutter text-center">
        <p className="text-caption uppercase tracking-[0.22em] text-accent">
          Why choose {brand.name ?? "us"}
        </p>
        <h2 className="mt-3 text-title">More Than Just Jewellery</h2>

        <ul className="mt-tight grid gap-tight sm:grid-cols-2 lg:grid-cols-4">
          {brand.reasons.map((reason, index) => {
            const Icon = ICONS[index] ?? DiamondIcon;
            return (
              <li key={reason.title} className="text-center">
                <span className="mx-auto inline-flex size-[44px] items-center justify-center text-accent">
                  <Icon />
                </span>
                <h3 className="mt-4 text-body">{reason.title}</h3>
                <p className="mt-2 text-caption text-muted">{reason.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </Reveal>
  );
}
