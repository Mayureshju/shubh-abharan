"use client";

import { LazyMotion, MotionConfig, domAnimation, m } from "motion/react";
import { Plate, type PlateProps } from "@/components/editorial/Plate";
import { duration, ease } from "@/lib/motion";
import { NumberedPager } from "./NumberedPager";
import { useSlideShow } from "./useSlideShow";

export interface CollectionSlideView {
  readonly id: string;
  readonly plate: PlateProps & { readonly alt: string };
}

/**
 * Same necklace, three frames. The split's copy panel does not change with
 * the slide — only the photograph does.
 */

export function CollectionSlider({ slides }: { slides: readonly CollectionSlideView[] }) {
  const { index, setIndex, go, rootRef, pauseProps, count } = useSlideShow(
    slides.length,
    true,
  );

  if (slides.length === 0) return null;

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div
          ref={rootRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Collection photographs"
          className="relative h-full min-h-[20rem] overflow-hidden md:min-h-[28rem]"
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
                  <Plate
                    {...slide.plate}
                    cover
                    priority={slideIndex === 0}
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </m.div>
              </div>
            );
          })}

          {count > 1 ? (
            <div className="absolute inset-y-0 right-0 z-[1] w-[6.5rem] bg-ink/40 py-6 pr-2 md:py-8 md:pr-3">
              <NumberedPager
                count={count}
                index={index}
                onSelect={setIndex}
                onPrev={() => go(-1)}
                onNext={() => go(1)}
                variant="stack"
                tone="on-ink"
                labelledBy="Collection photographs"
              />
            </div>
          ) : null}

          <p className="sr-only" aria-live="polite">
            Photograph {index + 1} of {count}
          </p>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
