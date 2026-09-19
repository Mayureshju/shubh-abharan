## Why

`establish-brand-system` built a design system and verified it on `/specimen`. `define-catalog-model` built the product model and verified it on `/specimen`. The storefront still has no customer-facing page: `app/page.tsx` is a stub that says so, and `app/layout.tsx` renders neither the header nor the footer — `/specimen` mounts them itself.

The homepage is where the system stops being a token sheet and becomes a point of view. It is also the first place the system's composition rules — section-to-section variation, non-uniform rhythm, a three-role type cap, one staggered sequence per route — have to hold across a real editorial narrative rather than a labelled grid of component states.

## What Changes

**A single continuous composition, not a stack of marketing blocks.** Five authored sections between the header and the footer, each differing from its neighbours in column count, alignment, image scale or surface, joined by a deliberately scored rhythm:

| # | Section | Composition | Join to next |
| --- | --- | --- | --- |
| 1 | Hero | full-bleed `worn` plate, one column, display heading, one `primary` action | `normal` |
| 2 | Collection | asymmetric two-column — large `macro` plate against a short measure-capped column | `tight` |
| 3 | Selection | four product cards, varied image roles and aspect ratios; a rail below 768px | `breath` |
| 4 | Scale | `ink` surface, one `scale` plate small in a generous field with its measured dimension | `normal` |
| 5 | Statement | `paper`, left-aligned display statement, one `quiet` action, no image | `breath` (`SiteFooter`) |

Rhythm scores: one `tight` join present, no two `breath` joins adjacent. **The footer's own `mt-breath` is the final join** and is fixed in `SiteFooter`, so section 5 must not be entered on `breath` — a constraint invisible without reading that component, and recorded here so later routes do not rediscover it.

**Every word and every photograph stays unsupplied and visibly so.** The brand record is entirely `null` and no catalog image carries a `src`. The homepage renders the same marked placeholders `SiteHeader`, `SiteFooter` and `NavOverlay` already render — structure present, content marked unfilled — and adds the two brand copy fields it needs to `lib/brand.ts` and `BRAND-INPUTS.md` rather than inventing a hero line. Its two editorial image slots — the hero frame and the collection frame — are declared with role, aspect, intended crop and alt, which makes the page reviewable without photography and doubles as the shoot brief.

**Type roles are rationed, and `title` does not appear.** Rule 6 caps a page body at three of the four roles. The homepage spends them on `display`, `body` and `caption`: `display` twice (hero heading, closing statement), `body` for running copy and card names, `caption` for every section heading set in the register style. Section headings stay `<h2>` elements — the responsive spec makes heading level and typographic role independent precisely so this is legal.

**Motion spends its one orchestrated sequence on the hero.** A Motion-for-React client island stages the plate, the heading and the action on the `slow` duration. Every other section reveals as a single unit through the existing CSS `Reveal`, which stays server-rendered. No parallax, no per-card stagger, no second animation runtime.

**The shell moves into the root layout.** `app/layout.tsx` gains `SiteHeader`, a `<main>` landmark and `SiteFooter`; `/specimen` drops the two mounts it was making itself. Every route after this one inherits the landmarks instead of repeating them.

## Capabilities

### New Capabilities

- `storefront/app-shell`: The persistent frame every storefront route renders inside — header, main landmark and footer mounted once in the root layout, the landmark and heading contract each route inherits, and the rule that a route composes only its own content.
- `storefront/homepage`: The homepage's narrative composition and section contract, its content contract for unsupplied brand and catalog values, its selection rules for which collection and which products it presents, its motion budget, and its responsive composition at the verified widths.

### Modified Capabilities

None. The design-system and catalog requirements are consumed as written. This change adds fields to the brand record, which the "brand inputs are supplied, never invented" requirement already provides for, and adds one optional capability to the image primitive, which the "all imagery renders through a single image primitive" requirement already permits. No requirement text changes.

## Impact

**Code**

- `app/page.tsx` — replaced: the stub becomes the homepage.
- `app/layout.tsx` — mounts `SiteHeader`, `<main>`, `SiteFooter`.
- `app/specimen/page.tsx` — its local `SiteHeader` / `SiteFooter` mounts are removed; the surface still renders both, now from the layout.
- New `components/home/` — one component per section, plus the module declaring the editorial plate slots.
- `lib/brand.ts` — two nullable fields: `heroStatement`, `closingStatement`. No default string, same `resolve`/`placeholder` path as every other brand value.
- `components/editorial/Plate.tsx` + `app/globals.css` — `Plate` gains one optional second aspect ratio applied from 768px, because a hero frame cannot use the same ratio at 390px and 1920px. Adds a capability, changes no requirement. See design.md — Decision 10.
- `scripts/check-slop.mjs` — one homepage-scoped assertion: `text-title` absent, `text-display` at most twice.
- `BRAND-INPUTS.md` — a `## Homepage` section: the two copy fields and the editorial image slots, all `UNFILLED`.
- `DESIGN-SYSTEM.md` — records the footer's fixed `mt-breath` join and the homepage's rhythm score.

No catalog change. The presented collection comes from `brand.collections` and `getCollection(slug)`, both of which exist; no operation is added to the catalog access surface.

**Dependencies**

None added. `motion@^13.4.0` is already installed and is imported only inside the hero island, through `LazyMotion` + `m`.

**Downstream**

`build-shop-and-collections`, `build-product-detail` and `build-cart-and-wishlist` inherit the shell from the layout. The homepage links to `/shop`, `/collections/<slug>` and `/products/<slug>`, which those changes deliver — those links resolve to 404 until then, which is the honest state and is verified rather than hidden.

**Blocking input**

None for implementation. The page is buildable and reviewable with placeholders. It must not be presented as finished brand work until the `## Homepage` and `## Collections` rows of `BRAND-INPUTS.md` are filled — while `brand.collections` is empty the Collection section renders its marked unfilled state and the Selection section falls back to catalog display order.

**Not in scope**

Cart, wishlist, search, filtering, account, checkout, payment, backend integration, collection and product routes, real photography, and any refactor of the design system or catalog.
