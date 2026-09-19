"use client";

import { LazyMotion, MotionConfig, domAnimation, m, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Plate, type PlateProps } from "@/components/editorial/Plate";
import { buttonClass } from "@/components/ui/buttonClass";
import { ArrowIcon } from "@/components/ui/icons";
import { duration, ease } from "@/lib/motion";

export interface HeroSlideView {
  readonly id: string;
  readonly plate: PlateProps & { readonly alt: string };
  readonly eyebrow: string;
  readonly heading: string;
  readonly brandHeading: boolean;
  readonly support: string;
  readonly ctaLabel: string;
  readonly ctaHref: string;
}

const AUTOPLAY_MS = 6000;

/**
 * First frame, heading and primary action render in the server HTML. Motion
 * never sets their initial opacity to 0 — that is the SSR trap the hero
 * stagger already exists to avoid.
 */

export function HeroSlider({ slides }: { slides: readonly HeroSlideView[] }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [hidden, setHidden] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const count = slides.length;
  const go = useCallback(
    (delta: number) => {
      if (count < 2) return;
      setIndex((current) => (current + delta + count) % count);
    },
    [count],
  );

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
    const id = window.setInterval(() => go(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [reduce, paused, hidden, visible, count, go]);

  const current = slides[index] ?? slides[0];
  if (!current) return null;

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div
          ref={rootRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Campaign"
          className="relative overflow-hidden rounded-frame"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setPaused(false);
            }
          }}
          onPointerDown={() => setPaused(true)}
        >
          {slides.map((slide, slideIndex) => {
            const active = slideIndex === index;
            return (
              <div
                key={slide.id}
                className={slideIndex === 0 ? "relative" : "absolute inset-0"}
                aria-hidden={active ? undefined : true}
                inert={active ? undefined : true}
              >
                <m.div
                  className="h-full"
                  animate={{ opacity: active ? 1 : 0 }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { duration: duration.base, ease: ease.inOut }
                  }
                  drag={active && count > 1 && !reduce ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.12}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -48 || info.velocity.x < -200) go(1);
                    else if (info.offset.x > 48 || info.velocity.x > 200) go(-1);
                  }}
                  style={{
                    pointerEvents: active ? "auto" : "none",
                    opacity: active ? 1 : 0,
                  }}
                >
                <div data-hero-step={slideIndex === 0 ? "1" : undefined}>
                  <Plate
                    {...slide.plate}
                    priority={slideIndex === 0}
                    sizes="100vw"
                  />
                </div>

                {/* slop-check: allow scrim — overlay type on photography */}
                <div className="pointer-events-none absolute inset-0 bg-ink/55" />

                <div className="pointer-events-none absolute inset-0 z-[1] flex items-end md:items-center">
                  <div
                    data-surface="ink"
                    className="max-w-[20rem] bg-transparent px-6 py-tight md:max-w-[36rem] md:px-12 lg:px-16"
                  >
                    <p
                      data-hero-step={slideIndex === 0 ? "2" : undefined}
                      className="text-caption uppercase tracking-[0.22em] text-gold"
                    >
                      {slide.eyebrow}
                    </p>
                    {slide.brandHeading ? (
                      <p
                        data-hero-step={slideIndex === 0 ? "2" : undefined}
                        className="mt-4 text-display [overflow-wrap:normal]"
                      >
                        {slide.heading}
                      </p>
                    ) : (
                      <p className="mt-4 text-title [overflow-wrap:normal]">{slide.heading}</p>
                    )}
                    <p
                      data-hero-step={slideIndex === 0 ? "3" : undefined}
                      className="mt-4 max-w-measure text-body text-muted"
                    >
                      {slide.support}
                    </p>
                    <div
                      data-hero-step={slideIndex === 0 ? "3" : undefined}
                      className="pointer-events-auto mt-tight"
                    >
                      <Link href={slide.ctaHref} className={buttonClass("primary")}>
                        {slide.ctaLabel}
                        <ArrowIcon />
                      </Link>
                    </div>
                  </div>
                </div>
                </m.div>
              </div>
            );
          })}

          {count > 1 ? (
            <div className="absolute inset-x-0 bottom-4 z-[2] flex items-center justify-between gap-4 px-4 md:bottom-6 md:px-8">
              <button
                type="button"
                className={`${buttonClass("icon")} text-gold`}
                aria-label="Previous slide"
                onClick={() => go(-1)}
              >
                <span className="-scale-x-100">
                  <ArrowIcon />
                </span>
              </button>

              <div className="flex items-center gap-2" role="tablist" aria-label="Slides">
                {slides.map((slide, slideIndex) => (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-label={`Go to slide ${slideIndex + 1}`}
                    aria-selected={slideIndex === index}
                    className="flex size-[44px] items-center justify-center"
                    onClick={() => setIndex(slideIndex)}
                  >
                    <span
                      className={
                        "size-[11px] rounded-pill border border-gold " +
                        (slideIndex === index ? "bg-gold" : "bg-transparent")
                      }
                    />
                  </button>
                ))}
              </div>

              <button
                type="button"
                className={`${buttonClass("icon")} text-gold`}
                aria-label="Next slide"
                onClick={() => go(1)}
              >
                <ArrowIcon />
              </button>
            </div>
          ) : null}

          <p className="sr-only" aria-live="polite">
            Slide {index + 1} of {count}
          </p>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
