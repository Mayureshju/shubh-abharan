"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The only scroll-triggered animation in this codebase.
 *
 * Every section reveal goes through here, so reduced-motion handling and the
 * travel budget live in one place. Components must not implement their own
 * scroll observers — see specs/design-system/motion-language.
 *
 * Deliberately does not import Motion. This runs in every section of every
 * page; an observer plus a class toggle costs no bundle. See design.md,
 * decision 6.
 *
 * Degradation is handled in CSS rather than here:
 *   - scripting disabled  -> the pending state never applies, content is visible
 *   - bundle never loads  -> a CSS failsafe reveals the element anyway
 *   - reduced motion      -> --reveal-travel resolves to 0, opacity only
 */

type RevealElement = "div" | "section" | "article" | "figure" | "li" | "header" | "footer";

interface RevealProps {
  children: ReactNode;
  /** Element to render. Pick the one the document structure calls for. */
  as?: RevealElement;
  className?: string;
  /**
   * Fires slightly before the element reaches the viewport edge so the reveal
   * reads as part of the scroll rather than a reaction to it.
   */
  rootMargin?: string;
}

export function Reveal({
  children,
  as: Tag = "div",
  className,
  rootMargin = "0px 0px -12% 0px",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reveal immediately where the observer is unavailable rather than
    // leaving content in its pending state.
    if (typeof IntersectionObserver === "undefined") {
      el.dataset.reveal = "shown";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.reveal = "shown";
          // Once per element per page load.
          observer.unobserve(entry.target);
        }
      },
      { rootMargin, threshold: 0.01 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <Tag ref={ref as never} data-reveal="pending" className={className}>
      {children}
    </Tag>
  );
}
