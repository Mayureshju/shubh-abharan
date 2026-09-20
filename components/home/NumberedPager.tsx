import { buttonClass } from "@/components/ui/buttonClass";
import { ArrowIcon } from "@/components/ui/icons";

/**
 * 01 — 02 — 03 plus previous/next. Used on the hero (inline, over photography)
 * and the collection split (stacked on the image). Product rails use the paper
 * tone. Every control is a 44px target.
 */

export function NumberedPager({
  count,
  index,
  onSelect,
  onPrev,
  onNext,
  variant = "inline",
  tone = "on-ink",
  labelledBy,
}: {
  count: number;
  index: number;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  variant?: "inline" | "stack";
  tone?: "on-ink" | "on-paper";
  labelledBy?: string;
}) {
  if (count < 2) return null;

  const currentClass = tone === "on-ink" ? "text-gold" : "text-gold";
  const idleClass = tone === "on-ink" ? "text-paper/55" : "text-muted";
  const ruleClass = tone === "on-ink" ? "text-gold/40" : "text-gold/50";
  const iconClass = tone === "on-ink" ? `${buttonClass("icon")} text-gold` : buttonClass("icon");

  const tabs = (
    <div
      className={variant === "stack" ? "flex flex-col items-end gap-1" : "flex items-center"}
      role="tablist"
      aria-label={labelledBy ?? "Slides"}
    >
      {Array.from({ length: count }, (_, slideIndex) => {
        const current = slideIndex === index;
        return (
          <span key={slideIndex} className="flex items-center">
            {variant === "inline" && slideIndex > 0 ? (
              <span className={`px-2 text-caption ${ruleClass}`} aria-hidden>
                –
              </span>
            ) : null}
            <button
              type="button"
              role="tab"
              aria-label={`Go to slide ${slideIndex + 1}`}
              aria-selected={current}
              className={
                "flex size-[44px] items-center justify-center text-caption tracking-[0.18em] " +
                (current ? currentClass : idleClass)
              }
              onClick={() => onSelect(slideIndex)}
            >
              {String(slideIndex + 1).padStart(2, "0")}
            </button>
          </span>
        );
      })}
    </div>
  );

  const arrows = (
    <div className="flex items-center">
      <button type="button" className={iconClass} aria-label="Previous slide" onClick={onPrev}>
        <span className="-scale-x-100">
          <ArrowIcon />
        </span>
      </button>
      <button type="button" className={iconClass} aria-label="Next slide" onClick={onNext}>
        <ArrowIcon />
      </button>
    </div>
  );

  if (variant === "stack") {
    return (
      <div className="flex h-full flex-col items-end justify-between">
        {tabs}
        {arrows}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {tabs}
      {arrows}
    </div>
  );
}
