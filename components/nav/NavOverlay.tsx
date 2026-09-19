"use client";

import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { duration, ease } from "@/lib/motion";
import { Button } from "@/components/ui/Button";
import type { Collection } from "@/lib/brand";

/**
 * Built on a native <dialog>. showModal() supplies focus containment, Escape
 * handling, an inert background and focus return to the opening control — all
 * behaviour the overlay requirement demands, and all of it better handled by
 * the platform than by a hand-rolled focus trap.
 *
 * Motion drives only the visual transition. It is imported through LazyMotion
 * + `m` so the animation runtime stays out of the static page tree — see
 * design.md, decision 6.
 *
 * MotionConfig carries reducedMotion="user". The global CSS reduced-motion
 * rule cannot reach a JS-driven animation, so without this the overlay would
 * keep its translation for a customer who asked for reduced motion. With it,
 * Motion drops transform animations and keeps opacity — the drawer still
 * appears and still takes focus, which is the feedback the motion spec
 * requires reduced motion to preserve.
 */

export function NavOverlay({
  open,
  onClose,
  collections,
  links,
}: {
  open: boolean;
  onClose: () => void;
  collections: readonly Collection[];
  links: readonly { label: string; href: string }[];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;

    if (!dialog.open) dialog.showModal();

    // showModal() makes the background inert but does not lock scroll.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Escape closes natively and instantly. Intercept it so the close runs
    // through the same animated path as the dismiss control.
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
      aria-label="Site navigation"
      data-surface="paper"
      className="m-0 size-full max-h-none max-w-none bg-surface text-on-surface backdrop:bg-[oklch(18%_0.008_85_/_0.4)]"
    >
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
        <AnimatePresence onExitComplete={() => dialogRef.current?.close()}>
          {open ? (
            <m.div
              key="nav"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: duration.base, ease: ease.out }}
              className="flex h-full flex-col p-6 md:p-10"
            >
              <div className="flex items-start justify-between">
                <p className="text-caption uppercase text-muted">Navigation</p>
                <Button variant="icon" onClick={onClose} aria-label="Close navigation">
                  <span aria-hidden="true">&#10005;</span>
                </Button>
              </div>

              <nav className="mt-tight flex flex-1 flex-col justify-center gap-8 md:flex-row md:justify-start md:gap-24">
                <div>
                  <h2 className="text-caption uppercase text-muted">Collections</h2>
                  <ul className="mt-4 space-y-2">
                    {collections.length > 0 ? (
                      collections.map((collection) => (
                        <li key={collection.slug}>
                          <Link
                            href={`/collections/${collection.slug}`}
                            className="inline-flex min-h-11 items-center text-title hover:underline underline-offset-8"
                          >
                            {collection.name}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li className="text-body text-muted">
                        [COLLECTION NAMES] &mdash; unfilled, see BRAND-INPUTS.md
                      </li>
                    )}
                  </ul>
                </div>

                <div>
                  <h2 className="text-caption uppercase text-muted">Index</h2>
                  <ul className="mt-4 space-y-2">
                    {links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="inline-flex min-h-11 items-center text-body hover:underline underline-offset-4"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </nav>
            </m.div>
          ) : null}
        </AnimatePresence>
        </MotionConfig>
      </LazyMotion>
    </dialog>
  );
}
