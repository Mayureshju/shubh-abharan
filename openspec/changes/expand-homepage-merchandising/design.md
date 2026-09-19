## Context

See proposal.md for motivation. The live homepage is five mood-board sections; catalog fixtures are structural and unfilled; `motion` is already a dependency; GSAP is not. Clone-shubha-moodboard forbids a hero carousel and a sixth marketing section — this change replaces those rules rather than ignoring them.

## Goals / Non-Goals

**Goals:**

- One merchandising homepage that reads as authored on a 390px phone.
- Hero slider that degrades to the first frame without JavaScript.
- Sample merchandise that looks like a live store without adding hype fields to the catalog.
- Journal and product URLs that resolve from homepage cards.

**Non-Goals:**

- GSAP, scroll pinning, or parallax.
- Replacing fixtures used by `/specimen`.
- Full shop, cart, search, or a CMS.
- Generating a new photography set (reuse `public/images/` frames).

## Decisions

### Decision 1 — Merchandising lists live on the brand record

New arrivals and featured are slug arrays on `brand.homepage`, same pattern as `brand.collections` order being the featured collection. Occasion names live on `brand.occasions` (capped at three). Products declare `occasions: string[]` membership, like `collections`.

Rejected: `isNew` / `isFeatured` / `publishedAt` on `Product`. Those are the hype fields `check-catalog.mjs` exists to keep out, and they would make "new" a data accident instead of an editorial choice.

### Decision 2 — Fixtures stay; merchandise is a second authored set

`/specimen` still needs the six structural fixtures. Homepage rails resolve only brand slug lists, so fixtures never appear there. Sample products reuse existing JPEGs and carry development INR prices recorded in `BRAND-INPUTS.md`.

Rejected: replacing fixtures with pretty names. That would break specimen cards and hide the unfilled-placeholder contract.

### Decision 3 — INR locale is pinned to the currency

`formatMoney` selects `en-IN` for INR and keeps `en-GB` for GBP/EUR. Locale is not the visitor's, so SSR and hydration match.

### Decision 4 — Hero is a server shell plus a Motion island

The first slide, `<h1>`, and primary CTA render in HTML. A client island crossfades, handles swipe/dots, and autoplays only when motion is allowed and the section is onscreen. Motion `initial` must not hide the heading (`opacity: 0` in SSR HTML is the failure `build-homepage` already rejected).

Rejected: GSAP ScrollTrigger. 90% mobile; the motion language already bans parallax and scroll hijack; `motion` is in the tree.

Rejected: a JS carousel library. One more dependency for behaviour the runtime already covers.

### Decision 5 — Two product sections, two layouts

New arrivals: `.rail` at every width (four columns from 768px), mixed `Plate` roles via a slot table.

Featured: `.rail` below 768px with a wider first snap; mixed grid from 768px (one large worn cell, remaining macros).

Occasions: rail below 768px; wedding spans two rows from 768px.

Journal: one featured + two stacked, both breakpoints — never three equal cards.

### Decision 6 — Thin destinations, not a shop

`/products/[slug]`, `/journal/[slug]`, `/occasions/[slug]` are enough for homepage links. `/shop?category=` stays 404 until `build-shop-and-collections`. Occasion tiles do not use that dead query.

### Decision 7 — One scroll observer

`Reveal` stays the only IntersectionObserver. The slider may observe itself to pause autoplay; it does not drive section reveals. No per-card stagger.

## Risks / Trade-offs

- [Sample prices look like real inventory] → Recorded as development content in `BRAND-INPUTS.md`; fixtures remain unfilled; copy names what the photographs show, not invented karat or hallmark claims.
- [Reused editorial JPEGs on product cards] → Honest until a product shoot exists; `src` swaps are data-only.
- [Hero slider vs no-JS] → First frame only without script; later frames progressive.
- [Nine homepage sections feel long] → Empty lists omit; rhythm still has a `tight` join and no adjacent `breath`.

## Migration

No data migration. Specimen fixtures unchanged. Downstream shop/cart work is unchanged.
