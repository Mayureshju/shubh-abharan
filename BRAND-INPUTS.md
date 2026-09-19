# Brand Inputs

Every brand-owned value the storefront renders is listed here. The design system
reads them through `lib/brand.ts`, which types each unsupplied value as `null`.

**Nothing in this file may be filled in by guesswork.** A `null` value renders a
visibly marked placeholder on screen. That is the intended behaviour — an unfilled
brand value must look unfilled, not like finished copy. Do not invent a value to
remove a placeholder.

Mark a field filled by replacing `UNFILLED` with the real value and setting the
matching field in `lib/brand.ts`.

---

## Identity

| Field | Status | Value |
| --- | --- | --- |
| Brand name | UNFILLED | |
| Legal entity name (footer, policies) | UNFILLED | |
| Wordmark asset (SVG, single colour, no embedded text) | UNFILLED | |
| Wordmark clear-space ratio | UNFILLED | |
| Founding year (only if factual) | UNFILLED | |
| Place of business shown to customers | UNFILLED | |

## Voice

| Field | Status | Value |
| --- | --- | --- |
| Voice notes — 3 to 5 adjectives, with a sentence that exemplifies each | UNFILLED | |
| Words the brand uses | UNFILLED | |
| Words the brand never uses | UNFILLED | |
| How the brand refers to its customer (second person, "the wearer", …) | UNFILLED | |

Copy written against this system must satisfy the rule in
`specs/design-system/visual-language`: **every sentence carries either a
measurable fact or a physically photographable noun.**

## Collections

Navigation is collection-led — these are the primary navigation axis, capped at
five top-level items.

| Field | Status | Value |
| --- | --- | --- |
| Collection names, in display order | UNFILLED | |
| One-line description per collection | UNFILLED | |
| Collection slugs | UNFILLED | |

## Materials vocabulary

The exact terms the brand uses for its materials. These appear in the product
card material line and the product specification table.

| Field | Status | Value |
| --- | --- | --- |
| Metals and how they are named (e.g. "9ct recycled gold") | UNFILLED | |
| Finishes | UNFILLED | |
| Stones and the terms used for cut, colour and setting | UNFILLED | |
| Dimension conventions (mm, ct, gauge) and where each applies | UNFILLED | |
| Country or workshop of manufacture, if disclosed | UNFILLED | |

## Policy facts

Only real, business-confirmed values. If a policy does not exist, leave it
UNFILLED and the surface that would show it is omitted — it is not approximated.

| Field | Status | Value |
| --- | --- | --- |
| Shipping regions and stated timeframes | UNFILLED | |
| Returns window and conditions | UNFILLED | |
| Warranty or repair terms | UNFILLED | |
| Care instructions | UNFILLED | |
| Hallmarking or certification, if any actually held | UNFILLED | |
| Contact address and email shown to customers | UNFILLED | |

## Not collected, by design

The system has no field for these, so they cannot be rendered:

- Customer reviews, ratings, or review counts
- Testimonials
- Certifications the business does not hold
- Compare-at prices, discount flags, or sale badges
- Stock countdowns or scarcity messaging
- Awards, press quotes, or customer counts

Adding any of them requires changing the spec first, not the component.
