"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type ReactNode,
  type TransitionEvent,
} from "react";
import { useReducedMotion } from "motion/react";
import { NumberedPager } from "./NumberedPager";

const AUTOPLAY_MS = 6000;
/** Matches the largest `--slider-columns` in globals.css. */
const MAX_COLUMNS = 4;

export type SliderRows = 1 | 2 | 3 | 4;

/**
 * Equal-width product rail. Mobile is a native snap track. From 768px the
 * same cards sit in a looping strip that autoplays one card at a time —
 * paused on pointer, keyboard focus, a hidden document, or when the rail
 * is offscreen. Reduced motion keeps the pager and drops the travel.
 */

export function RowSlider({
  children,
  label,
  heading,
}: {
  children: ReactNode;
  label: string;
  heading?: ReactNode;
}) {
  const items = Children.toArray(children);
  const count = items.length;
  const reduce = useReducedMotion();
  const [offset, setOffset] = useState(0);
  const [instant, setInstant] = useState(false);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [hidden, setHidden] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  offsetRef.current = offset;

  const current = count === 0 ? 0 : offset % count;

  const goNext = useCallback(() => {
    if (count < 2) return;
    setInstant(false);
    setOffset((value) => value + 1);
  }, [count]);

  const goPrev = useCallback(() => {
    if (count < 2) return;
    if (offsetRef.current === 0) {
      setInstant(true);
      setOffset(count);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setInstant(false);
          setOffset(count - 1);
        });
      });
      return;
    }
    setInstant(false);
    setOffset((value) => value - 1);
  }, [count]);

  const select = useCallback((index: number) => {
    setInstant(false);
    setOffset(index);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) setVisible(entry.isIntersecting);
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (reduce || paused || hidden || !visible || count < 2) return;
    const id = window.setInterval(goNext, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [reduce, paused, hidden, visible, count, goNext]);

  const onTrackTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== "transform") return;
    if (offset >= count) {
      setInstant(true);
      setOffset(0);
    }
  };

  const pauseProps = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocusCapture: () => setPaused(true),
    onBlurCapture: (event: FocusEvent<HTMLDivElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
        setPaused(false);
      }
    },
    onPointerDown: () => setPaused(true),
    onPointerUp: () => setPaused(false),
    onPointerCancel: () => setPaused(false),
  };

  if (count === 0) return null;

  const clones = takeClones(items, Math.min(MAX_COLUMNS, count));
  const track = count > 1 ? [...items, ...clones] : items;
  const duration = instant || reduce ? "0ms" : "var(--duration-base)";
  const travel = `translate3d(calc(${offset} * -1 * (100% + 2rem) / var(--slider-columns)), 0, 0)`;

  const pager =
    count > 1 ? (
      <NumberedPager
        count={count}
        index={current}
        onSelect={select}
        onPrev={goPrev}
        onNext={goNext}
        tone="on-paper"
      />
    ) : null;

  return (
    <div ref={rootRef} {...pauseProps}>
      {heading ? (
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
          {heading}
          {pager ? <div className="max-md:hidden">{pager}</div> : null}
        </div>
      ) : null}

      <div className={heading ? "mt-tight" : undefined}>
        <div className="rail md:hidden">{items}</div>

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label={label}
          className="row-slider-viewport max-md:hidden"
        >
          <div
            className="row-slider-track"
            style={{
              transform: travel,
              transition: `transform ${duration} var(--ease-inout)`,
            }}
            onTransitionEnd={onTrackTransitionEnd}
          >
            {track}
          </div>
        </div>
      </div>

      {pager ? (
        <>
          <div className={heading ? "mt-6 md:hidden" : "mt-tight"}>{pager}</div>
          <p className="sr-only" aria-live="polite">
            {label} {current + 1} of {count}
          </p>
        </>
      ) : null}
    </div>
  );
}

function takeClones(items: readonly ReactNode[], count: number): ReactNode[] {
  if (items.length === 0 || count === 0) return [];

  const clones: ReactNode[] = [];
  for (let index = 0; index < count; index += 1) {
    const child = items[index % items.length];
    clones.push(
      isValidElement(child) ? cloneElement(child, { key: `clone-${index}` }) : child,
    );
  }
  return clones;
}
