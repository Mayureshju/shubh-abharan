/**
 * Motion tokens for JS consumers.
 *
 * These mirror the custom properties in app/globals.css. The duplication is
 * deliberate and bounded to six values — scripts/check-slop.mjs asserts the two
 * stay in sync, which costs less than a build step or reading computed styles
 * at runtime. See design.md, decision 7.
 *
 * Durations are in seconds because that is what Motion for React expects;
 * globals.css declares the same values in milliseconds.
 */

export const duration = {
  /** focus rings, toggles, immediate state changes */
  instant: 0.12,
  /** hover and small property transitions */
  quick: 0.24,
  /** drawers, overlays, image crossfades, section reveals */
  base: 0.48,
  /** page and hero entrance orchestration only */
  slow: 0.9,
} as const;

export const ease = {
  /** entrances — long deceleration */
  out: [0.16, 1, 0.3, 1],
  /** elements that travel and stop */
  inOut: [0.65, 0, 0.35, 1],
} as const;

export type DurationToken = keyof typeof duration;
export type EaseToken = keyof typeof ease;
