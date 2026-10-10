"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Plate } from "@/components/editorial/Plate";
import { Button } from "@/components/ui/Button";
import { buttonClass } from "@/components/ui/buttonClass";
import { ArrowIcon, CloseIcon } from "@/components/ui/icons";
import { ModalDialog } from "@/components/ui/ModalDialog";
import type { ProductImage } from "@/lib/catalog/types";

/**
 * Product images in one square frame: native scroll-snap slides (swipe on
 * touch, thumbnails everywhere), a round magnifier for a mouse, and a
 * full-screen view as the keyboard and touch equivalent — see
 * storefront/product-detail.
 *
 * The magnifier is user-directed inspection, not hover scale
 * (motion-language): it tracks the pointer with no easing and never moves on
 * its own. Pointer moves write transforms through refs inside an animation
 * frame, so inspecting never re-renders React. Its large image mounts on the
 * first mouse hover, so touch devices never download it.
 */

const LENS = 180;
const ZOOM = 2.5;

const FRAME_TINT = "bg-[color-mix(in_oklab,var(--surface-fg)_4%,var(--surface-bg))]";

type Point = { x: number; y: number; width: number; height: number };

/** Distance between slide starts: slide width plus the column gap. */
function slideStep(slides: HTMLDivElement): number {
  const [first, second] = slides.children as HTMLCollectionOf<HTMLElement>;
  return second && first ? second.offsetLeft - first.offsetLeft : slides.clientWidth;
}

/** Centres the lens on the point and shifts its 2.5× layer to match. */
function placeLens(lens: HTMLDivElement | null, layer: HTMLDivElement | null, point: Point | null) {
  if (!lens || !layer || !point) return;
  layer.style.width = `${point.width * ZOOM}px`;
  layer.style.height = `${point.height * ZOOM}px`;
  layer.style.transform = `translate(${LENS / 2 - point.x * ZOOM}px, ${LENS / 2 - point.y * ZOOM}px)`;
  lens.style.transform = `translate(${point.x - LENS / 2}px, ${point.y - LENS / 2}px)`;
  lens.style.opacity = "1";
}

export function ProductGallery({
  images,
  name,
}: {
  images: readonly ProductImage[];
  name: string;
}) {
  const slidesRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const lensImageRef = useRef<HTMLDivElement>(null);
  const scrollFrame = useRef(0);
  const moveFrame = useRef(0);
  const lastPoint = useRef<Point | null>(null);
  const [current, setCurrent] = useState(0);
  const [lensMounted, setLensMounted] = useState(false);
  const [viewing, setViewing] = useState<number | null>(null);
  const many = images.length > 1;

  function onScroll() {
    if (scrollFrame.current) return;
    scrollFrame.current = requestAnimationFrame(() => {
      scrollFrame.current = 0;
      const slides = slidesRef.current;
      if (slides) setCurrent(Math.round(slides.scrollLeft / slideStep(slides)));
    });
  }

  function show(index: number) {
    const slides = slidesRef.current;
    // No `behavior`: the stylesheet's smooth scroll applies, and reduced
    // motion turns it off.
    if (slides) slides.scrollTo({ left: index * slideStep(slides) });
  }

  // The first mouse move mounts the lens; this places it at that move.
  useEffect(() => {
    if (lensMounted) placeLens(lensRef.current, lensImageRef.current, lastPoint.current);
  }, [lensMounted]);

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    lastPoint.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      width: rect.width,
      height: rect.height,
    };
    if (!lensMounted) {
      setLensMounted(true);
      return;
    }
    cancelAnimationFrame(moveFrame.current);
    moveFrame.current = requestAnimationFrame(() =>
      placeLens(lensRef.current, lensImageRef.current, lastPoint.current),
    );
  }

  function onPointerLeave() {
    cancelAnimationFrame(moveFrame.current);
    lastPoint.current = null;
    if (lensRef.current) lensRef.current.style.opacity = "0";
  }

  const image = images[current] ?? images[0];

  return (
    // Phone: the frame runs full-bleed, thumbnails and "View larger" share the
    // row beneath. From 768px the thumbnails form a column on the left of the
    // frame, aligned to the top, and scroll when they are taller than it.
    <div
      className={
        "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 [grid-template-areas:'frame_frame'_'thumbs_more'] " +
        "md:w-full md:gap-x-4 " +
        (many
          ? "md:grid-cols-[4.5rem_minmax(0,1fr)] md:[grid-template-areas:'thumbs_frame'_'._more']"
          : "md:[grid-template-areas:'frame_frame'_'more_more']")
      }
    >
      <div
        className="relative -mx-[var(--page-gutter)] overflow-hidden [grid-area:frame] md:mx-0"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <div
          ref={slidesRef}
          className="pdp-slides focus-visible:outline-2 focus-visible:-outline-offset-2"
          onScroll={onScroll}
          role="region"
          aria-label={`${name}, images`}
          tabIndex={0}
        >
          {images.map((entry, index) => (
            <div
              key={`${entry.role}-${index}`}
              className={`relative aspect-square cursor-zoom-in ${FRAME_TINT}`}
              onClick={() => setViewing(index)}
            >
              <Plate {...entry} cover sizes="(min-width: 768px) 55vw, 100vw" priority={index === 0} />
            </div>
          ))}
        </div>

        {lensMounted ? (
          <div
            ref={lensRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 overflow-hidden rounded-pill border border-gold bg-surface opacity-0"
            style={{ width: LENS, height: LENS }}
          >
            <div ref={lensImageRef} className="absolute left-0 top-0">
              <Plate {...image} cover sizes="140vw" />
            </div>
          </div>
        ) : null}
      </div>

      {many ? (
        <ul
          className={
            "flex min-w-0 gap-2 self-start overflow-x-auto [grid-area:thumbs] [scrollbar-width:none] " +
            "md:max-h-full md:flex-col md:self-stretch md:overflow-x-hidden md:overflow-y-auto"
          }
        >
          {images.map((entry, index) => (
            <li key={`${entry.role}-${index}`} className="shrink-0">
              <button
                type="button"
                aria-label={`Show image ${index + 1} of ${images.length}`}
                aria-current={index === current ? "true" : undefined}
                onClick={() => show(index)}
                className={
                  `relative block size-16 overflow-hidden border md:size-[4.5rem] ${FRAME_TINT} ` +
                  "focus-visible:outline-2 focus-visible:-outline-offset-2 " +
                  (index === current ? "border-on-surface" : "border-transparent hover:border-line")
                }
              >
                <Plate {...entry} cover sizes="72px" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="justify-self-end [grid-area:more]">
        <button type="button" className={buttonClass("inline")} onClick={() => setViewing(current)}>
          View larger
        </button>
      </div>

      <ImageViewer
        images={images}
        name={name}
        index={viewing}
        onChange={setViewing}
        onClose={() => setViewing(null)}
      />
    </div>
  );
}

/**
 * Full-screen view: the image at its declared aspect rather than the square
 * gallery crop, fitted to the viewport with container units. Pinch zoom is the
 * browser's own.
 */
function ImageViewer({
  images,
  name,
  index,
  onChange,
  onClose,
}: {
  images: readonly ProductImage[];
  name: string;
  index: number | null;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  const count = images.length;
  const open = index !== null;
  const at = index ?? 0;
  const image = images[at] ?? images[0];
  const [w, h] = image.aspect.split("/").map(Number);
  const step = (by: number) => onChange((at + by + count) % count);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (count < 2) return;
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  }

  return (
    <ModalDialog open={open} onClose={onClose} label={`${name}, enlarged image`} placement="overlay">
      <div className="flex h-full min-h-0 flex-col" onKeyDown={onKeyDown}>
        <div className="flex items-center justify-between gap-4">
          <p className="text-caption uppercase text-muted">
            {count > 1 ? `${at + 1} / ${count}` : name}
          </p>
          <Button variant="icon" aria-label="Close" onClick={onClose}>
            <CloseIcon />
          </Button>
        </div>

        <div className="mt-4 flex min-h-0 flex-1 items-center gap-2">
          {count > 1 ? (
            <Button variant="icon" aria-label="Previous image" onClick={() => step(-1)}>
              <span className="inline-flex rotate-180">
                <ArrowIcon />
              </span>
            </Button>
          ) : null}
          <div className="relative grid min-w-0 flex-1 place-items-center self-stretch" style={{ containerType: "size" }}>
            <div
              className={`relative ${FRAME_TINT}`}
              style={{
                aspectRatio: image.aspect,
                width: w && h ? `min(100cqw, calc(100cqh * ${w} / ${h}))` : "100cqw",
              }}
            >
              {open ? <Plate {...image} cover sizes="100vw" /> : null}
            </div>
          </div>
          {count > 1 ? (
            <Button variant="icon" aria-label="Next image" onClick={() => step(1)}>
              <ArrowIcon />
            </Button>
          ) : null}
        </div>
      </div>
    </ModalDialog>
  );
}
