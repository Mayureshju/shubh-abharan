"use client";

import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { duration, ease } from "@/lib/motion";

/**
 * Native <dialog> shell shared by the navigation overlay, the shop filter
 * sheet, the bag drawer and the product image view. showModal() supplies focus
 * containment, Escape, an inert background and focus return — the overlay
 * requirement, handled by the platform.
 *
 * Motion is presentation only. reducedMotion="user" drops travel and keeps
 * opacity, so the dialog still appears and still takes focus.
 *
 * `overlay` is full-viewport (nav, image view). `sheet` sits at the bottom of
 * the viewport with a max height so primary controls stay in reach on a phone.
 * `drawer` is a full-height panel on the right edge (the bag).
 */

type Placement = "overlay" | "sheet" | "drawer";

// A literal colour rather than var(--color-ink): ::backdrop does not inherit
// custom properties in every browser. Ink (aubergine) at 45%.
const BACKDROP = "backdrop:bg-[oklch(31%_0.06_305_/_0.45)]";

const DIALOG: Record<Placement, string> = {
  overlay: "m-0 size-full max-h-none max-w-none bg-surface text-on-surface",
  sheet: "m-0 mt-auto max-h-[85vh] w-full max-w-none border-0 bg-surface p-0 text-on-surface",
  drawer: "m-0 ml-auto h-dvh max-h-none w-full max-w-[26rem] border-0 bg-surface p-0 text-on-surface",
};

const PANEL: Record<Placement, string> = {
  overlay: "flex h-full flex-col p-6 md:p-10",
  sheet: "flex max-h-[85vh] min-h-0 flex-col px-6 pb-8 pt-5",
  drawer: "flex h-full min-h-0 flex-col px-6 pb-6 pt-5",
};

const TRAVEL: Record<Placement, { x?: number; y?: number }> = {
  overlay: { y: -8 },
  sheet: { y: 24 },
  drawer: { x: 24 },
};

export function ModalDialog({
  open,
  onClose,
  label,
  placement,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  placement: Placement;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;

    if (!dialog.open) dialog.showModal();

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };

    dialog.addEventListener("cancel", onCancel);
    return () => dialog.removeEventListener("cancel", onCancel);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={label}
      data-surface="paper"
      className={`${DIALOG[placement]} ${BACKDROP}`}
    >
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          <AnimatePresence onExitComplete={() => dialogRef.current?.close()}>
            {open ? (
              <m.div
                key={placement}
                initial={{ opacity: 0, ...TRAVEL[placement] }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, ...TRAVEL[placement] }}
                transition={{ duration: duration.base, ease: ease.out }}
                className={PANEL[placement]}
              >
                {children}
              </m.div>
            ) : null}
          </AnimatePresence>
        </MotionConfig>
      </LazyMotion>
    </dialog>
  );
}
