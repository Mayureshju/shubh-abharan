"use client";

import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { duration, ease } from "@/lib/motion";

/**
 * Native <dialog> shell shared by the navigation overlay and the shop filter
 * sheet. showModal() supplies focus containment, Escape, an inert background
 * and focus return — the overlay requirement, handled by the platform.
 *
 * Motion is presentation only. reducedMotion="user" drops travel and keeps
 * opacity, so the dialog still appears and still takes focus.
 *
 * `overlay` is full-viewport (nav). `sheet` sits at the bottom of the viewport
 * with a max height so primary controls stay in reach on a phone.
 */

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
  placement: "overlay" | "sheet";
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const sheet = placement === "sheet";

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
      className={
        sheet
          ? "m-0 mt-auto max-h-[85vh] w-full max-w-none border-0 bg-surface p-0 text-on-surface backdrop:bg-[oklch(32.6%_0.0523_175.48_/_0.45)]"
          : "m-0 size-full max-h-none max-w-none bg-surface text-on-surface backdrop:bg-[oklch(32.6%_0.0523_175.48_/_0.45)]"
      }
    >
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          <AnimatePresence onExitComplete={() => dialogRef.current?.close()}>
            {open ? (
              <m.div
                key={placement}
                initial={{ opacity: 0, y: sheet ? 24 : -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: sheet ? 24 : -8 }}
                transition={{ duration: duration.base, ease: ease.out }}
                className={
                  sheet
                    ? "flex max-h-[85vh] min-h-0 flex-col px-6 pb-8 pt-5"
                    : "flex h-full flex-col p-6 md:p-10"
                }
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
