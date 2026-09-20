"use client";

import { LazyMotion, MotionConfig, domAnimation, m } from "motion/react";
import Link from "next/link";
import { Plate, type PlateProps } from "@/components/editorial/Plate";
import { buttonClass } from "@/components/ui/buttonClass";
import { ArrowIcon } from "@/components/ui/icons";
import { duration, ease } from "@/lib/motion";
import { NumberedPager } from "./NumberedPager";
import { useSlideShow } from "./useSlideShow";

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

/**
 * Viewport-height campaign band. First frame, heading and primary action
 * render in the server HTML. Motion never sets their initial opacity to 0.
 */

export function HeroSlider({ slides }: { slides: readonly HeroSlideView[] }) {
  const { index, setIndex, go, rootRef, pauseProps, count } = useSlideShow(
    slides.length,
    true,
  );

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
          className="relative h-[72svh] min-h-[22rem] overflow-hidden md:h-[100svh] md:min-h-[32rem]"
          {...pauseProps}
        >
          {slides.map((slide, slideIndex) => {
            const active = slideIndex === index;
            return (
              <div
                key={slide.id}
                className="absolute inset-0"
                aria-hidden={active ? undefined : true}
                inert={active ? undefined : true}
              >
                <m.div
                  className="h-full"
                  initial={false}
                  animate={{ opacity: active ? 1 : 0 }}
                  transition={{ duration: duration.base, ease: ease.inOut }}
                  drag={active && count > 1 ? "x" : false}
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
                  <div
                    data-hero-step={slideIndex === 0 ? "1" : undefined}
                    className="absolute inset-0"
                  >
                    <Plate {...slide.plate} cover priority={slideIndex === 0} sizes="100vw" />
                  </div>

                  <div className="pointer-events-none absolute inset-0 bg-ink/30" />

                  <div className="pointer-events-none absolute inset-0 z-[1] flex items-end md:items-center">
                    <div
                      data-surface="ink"
                      className="w-full max-w-[22rem] bg-transparent px-6 pb-20 pt-24 md:max-w-[42rem] md:px-12 md:pb-28 md:pt-28 lg:px-16"
                    >
                      <p
                        data-hero-step={slideIndex === 0 ? "2" : undefined}
                        className="max-w-[16rem] text-caption uppercase tracking-[0.22em] text-gold"
                      >
                        {slide.eyebrow}
                      </p>
                      {slide.brandHeading ? (
                        <p
                          data-hero-step={slideIndex === 0 ? "2" : undefined}
                          className="mt-4 text-display [overflow-wrap:normal] [font-size:clamp(2.75rem,5vw,4.5rem)]"
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
                        <Link href={slide.ctaHref} className={buttonClass("quiet")}>
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
            <div className="absolute bottom-6 left-6 z-[2] md:bottom-10 md:left-12 lg:left-16">
              <NumberedPager
                count={count}
                index={index}
                onSelect={setIndex}
                onPrev={() => go(-1)}
                onNext={() => go(1)}
                tone="on-ink"
              />
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
