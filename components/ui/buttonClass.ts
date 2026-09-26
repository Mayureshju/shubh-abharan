/**
 * The button presentations, in one place, importable from a server component.
 *
 * `Button.tsx` is a client component, and a non-component export cannot be
 * called from the server across that boundary — so the class strings live
 * here, outside it, and both the button and a `<Link>` that navigates read
 * from the same source.
 *
 * A link that performs navigation is an anchor, not a button, but it is still
 * one of the four presentations the system defines. Without this, the only
 * ways to style it would be duplicating the strings at each call site or
 * nesting a button inside an anchor.
 */

export type ButtonVariant = "primary" | "quiet" | "inline" | "icon";

export const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 text-caption uppercase " +
  // The label wraps inside the control rather than pushing the control past its
  // column. At 200% text zoom a caption-set label is wide enough to overflow a
  // four-column slot on a 768px grid, and a control that overflows puts
  // horizontal scroll on the page.
  "max-w-full text-center " +
  "transition-[background-color,color,border-color,opacity] duration-[var(--duration-quick)] " +
  "ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "disabled:cursor-not-allowed aria-disabled:cursor-not-allowed";

/**
 * Minimum 44px touch target, including for caption-sized labels.
 *
 * Fixed px rather than the rem-based `min-h-11 px-6`, for the reason given on
 * `ICON_BOX` below: the 44px floor is a touch target and the padding is chrome,
 * and neither is text. At 200% text zoom the rem forms resolve to an 88px floor
 * and 96px of padding a side, which is how a single action comes to be wider
 * than the column holding it.
 */
export const BUTTON_TARGET = "min-h-[44px] px-[24px]";

/**
 * The icon control's box is a fixed 44px rather than the rem-based `size-11`.
 *
 * An icon is a graphic, not text, and the 44px floor is a *touch target* rather
 * than a type size — so it must not multiply with the root font size. At 200%
 * text zoom `size-11` resolves to 88px, and four of them plus the wordmark put
 * 367px of horizontal scroll on a 390px viewport, which is the reflow failure
 * the responsive requirement forbids. Fixed px keeps the target at its floor at
 * every zoom level, and the icon inside is drawn on a 24px grid regardless.
 */
const ICON_BOX = "size-[44px]";

export const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  // Lavender fill, charcoal label (6.79:1) — the logo's lilac. Pill via the
  // radius token, not `rounded-full`.
  primary:
    "rounded-pill bg-lavender text-charcoal border border-lavender " +
    "hover:bg-transparent hover:text-on-surface hover:border-on-surface " +
    "active:opacity-90 " +
    "disabled:border-dashed disabled:bg-transparent disabled:text-muted " +
    "aria-disabled:border-dashed aria-disabled:bg-transparent aria-disabled:text-muted",
  quiet:
    "rounded-pill bg-transparent text-on-surface border border-gold " +
    "hover:bg-gold hover:text-charcoal " +
    "active:opacity-90 " +
    "disabled:border-dashed disabled:text-muted " +
    "aria-disabled:border-dashed aria-disabled:text-muted",
  inline:
    "bg-transparent text-on-surface border-0 p-0 min-h-11 " +
    "underline underline-offset-4 hover:no-underline " +
    "disabled:no-underline disabled:line-through disabled:text-muted " +
    "aria-disabled:no-underline aria-disabled:line-through aria-disabled:text-muted",
  icon:
    `bg-transparent text-on-surface border border-transparent ${ICON_BOX} p-0 ` +
    "hover:border-on-surface " +
    "disabled:border-dashed disabled:border-line disabled:text-muted " +
    "aria-disabled:border-dashed aria-disabled:border-line aria-disabled:text-muted",
};

/** The full class list for a variant. A view still presents at most one `primary`. */
export function buttonClass(variant: ButtonVariant = "quiet"): string {
  const sizing = variant === "inline" || variant === "icon" ? "" : BUTTON_TARGET;
  return `${BUTTON_BASE} ${sizing} ${BUTTON_VARIANTS[variant]}`;
}
