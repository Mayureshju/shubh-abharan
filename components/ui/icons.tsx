/**
 * Every icon in the interface, drawn here.
 *
 * One source and one stroke weight is the whole rule — see the icon constraint
 * in specs/design-system/core-components. Drawing them rather than installing a
 * set is what keeps that true: an icon library makes it a one-import decision
 * to mix a second weight, a second corner treatment and a filled variant into
 * the page, and none of those would fail any automated check.
 *
 * Geometry matches the rest of the system. Square caps, square joins, no round
 * terminals, 1.25px at a 24px box so the line sits between the hairline rule
 * and the type. Every glyph is drawn on the same 24x24 grid with the same 3px
 * optical margin, so they align without per-icon nudging.
 *
 * Each is decorative by construction: `aria-hidden`, no title element, no
 * `role="img"`. Every icon in this system sits inside a control that already
 * carries its own accessible name, so an announced icon would double it.
 *
 * The budget is twelve. There are ten.
 */

const BOX = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "square",
  strokeLinejoin: "miter",
  "aria-hidden": true,
  focusable: false,
} as const;

export function SearchIcon() {
  return (
    <svg {...BOX}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5 L21 21" />
    </svg>
  );
}

/** Wishlist. Drawn as an outline, never filled — a filled heart is a state. */
export function WishlistIcon() {
  return (
    <svg {...BOX}>
      <path d="M12 20.5 3.5 12A5 5 0 0 1 12 7a5 5 0 0 1 8.5 5Z" />
    </svg>
  );
}

/** The bag. A flat-bottomed box with a handle, not a rounded shopping cart. */
export function BagIcon() {
  return (
    <svg {...BOX}>
      <path d="M4 7h16v14H4z" />
      <path d="M8.5 9.5V6a3.5 3.5 0 0 1 7 0v3.5" />
    </svg>
  );
}

/** Open navigation. Two rules rather than three — the third is decoration. */
export function MenuIcon() {
  return (
    <svg {...BOX}>
      <path d="M3.5 9h17" />
      <path d="M3.5 15h17" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg {...BOX}>
      <path d="m5 5 14 14" />
      <path d="M19 5 5 19" />
    </svg>
  );
}

export function ArrowIcon() {
  return (
    <svg {...BOX}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

export function DiamondIcon() {
  return (
    <svg {...BOX}>
      <path d="M12 3.5 20.5 12 12 20.5 3.5 12Z" />
    </svg>
  );
}

export function HeritageIcon() {
  return (
    <svg {...BOX}>
      <path d="M4.5 19.5h15" />
      <path d="M7 19.5V9.5L12 5.5l5 4v10" />
      <path d="M10.5 19.5v-5h3v5" />
    </svg>
  );
}

export function PackageIcon() {
  return (
    <svg {...BOX}>
      <path d="M4.5 8.5 12 4.5l7.5 4v11L12 19.5l-7.5-4z" />
      <path d="M12 4.5v15" />
      <path d="M4.5 8.5 12 12.5l7.5-4" />
    </svg>
  );
}

export function ShieldIcon() {
  return (
    <svg {...BOX}>
      <path d="M12 3.5 19.5 6.5v6c0 4.5-3.2 7.4-7.5 8.5-4.3-1.1-7.5-4-7.5-8.5v-6Z" />
    </svg>
  );
}
