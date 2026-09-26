"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CloseIcon } from "@/components/ui/icons";
import { ModalDialog } from "@/components/ui/ModalDialog";
import type { Collection } from "@/lib/brand";
import type { Category } from "@/lib/catalog/types";

/**
 * Site navigation overlay. Platform behaviour — focus, Escape, inert
 * background, focus return — lives on ModalDialog. This file owns the
 * contents: type index, collections, and the primary index.
 *
 * The type index is declared here rather than imported from the homepage
 * section: the overlay is part of the shell and must not depend on a route's
 * components. Entries are keyed by the catalog's Category union.
 */

const TYPES = [
  { category: "necklace", label: "Necklaces" },
  { category: "ring", label: "Rings" },
  { category: "bracelet", label: "Bracelets" },
  { category: "earring", label: "Earrings" },
  { category: "pendant", label: "Pendants" },
] as const satisfies readonly { category: Category; label: string }[];

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
  return (
    <ModalDialog open={open} onClose={onClose} label="Site navigation" placement="overlay">
      <div className="flex items-start justify-between">
        <p className="text-caption uppercase text-muted">Navigation</p>
        <Button variant="icon" onClick={onClose} aria-label="Close navigation">
          <CloseIcon />
        </Button>
      </div>

      <nav className="mt-tight flex flex-1 flex-col justify-center gap-tight md:flex-row md:justify-start md:gap-24">
        {/* Type sits first because it is the axis a visitor arriving
            on a phone from the homepage has just been reading. */}
        <div>
          <h2 className="text-caption uppercase text-muted">Shop by type</h2>
          <ul className="mt-4 space-y-1">
            {TYPES.map((type) => (
              <li key={type.category}>
                <Link
                  href={`/shop?category=${type.category}`}
                  onClick={onClose}
                  className="inline-flex min-h-11 items-center text-body uppercase tracking-[0.18em] hover:underline underline-offset-4"
                >
                  {type.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-caption uppercase text-muted">Collections</h2>
          <ul className="mt-4 space-y-2">
            {collections.length > 0 ? (
              collections.map((collection) => (
                <li key={collection.slug}>
                  <Link
                    href={`/collections/${collection.slug}`}
                    onClick={onClose}
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
                  onClick={onClose}
                  className="inline-flex min-h-11 items-center text-body hover:underline underline-offset-4"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </ModalDialog>
  );
}
