# Design System

Established by the `establish-brand-system` OpenSpec change. The durable
behaviour contracts live in `openspec/specs/design-system/`; this file records
how those contracts are *enforced* and the operational constraints that came
out of implementation.

## Where things live

| Concern | File |
| --- | --- |
| All design tokens | `app/globals.css` (`@theme`) — single source of truth |
| The photography, and the prompt behind each frame | `scripts/generate-images.mjs` — content workflow, never imported by the app |
| Motion tokens for JS | `lib/motion.ts` — mirrored from the CSS, asserted in sync |
| Brand-owned values | `lib/brand.ts` + `BRAND-INPUTS.md` |
| The only path to an image | `components/editorial/Plate.tsx` |
| The only scroll animation | `components/primitives/Reveal.tsx` |
| The homepage's sections | `components/home/` — one component per section |
| The homepage's photography | `components/home/plates.ts` — mirrored in BRAND-INPUTS.md |
| Every icon | `components/ui/icons.tsx` — one file, one stroke weight |
| Button presentations | `components/ui/buttonClass.ts` — shared by `Button` and any navigating `<Link>` |
| All product shape | `lib/catalog/` — single source of truth |
| The only path to catalog data | `lib/catalog/repository.ts` (async; never import `data/`) |
| Acceptance surface | `/specimen` (noindex, unlinked) |

## Anti-generic rules — how each is enforced

Three tiers. The first two run in `npm run check`; the third is review.

### Tier 1 — does not compile

`app/globals.css` clears the `--color-*`, `--radius-*`, `--text-*`, `--font-*`,
`--ease-*`, `--shadow-*`, `--inset-shadow-*`, `--drop-shadow-*`,
`--text-shadow-*` and `--blur-*` namespaces before declaring replacements.
These utilities do not exist in the build:

- the entire default colour palette — `bg-blue-600`, `text-gray-400`, `bg-white`, `bg-black`
- the sized radius scale — `rounded-sm` through `rounded-3xl`
- the entire default type scale — `text-sm`, `text-lg`, `text-3xl`
- every shadow, drop-shadow, text-shadow, blur and backdrop-blur utility

Covers **rule 2** (no `backdrop-filter`), **rule 3** (no content shadow),
**rule 5** (no metal colour), **rule 6** (type roles).

An overlay that legitimately needs a shadow must now write an arbitrary value,
which is conspicuous in review and allowlisted by file in the check script.

### Tier 2 — `scripts/check-slop.mjs`

Tailwind implements a few utilities as *static* rules with no backing theme
namespace, so clearing a namespace cannot remove them. These are caught by grep
instead:

| Pattern | Rule |
| --- | --- |
| `linear/radial/conic-gradient`, `bg-gradient-*`, `bg-linear-*`, `bg-radial`, `bg-conic` | rule 1 |
| `backdrop-filter`, `backdrop-blur*` written as raw CSS | rule 2 |
| `box-shadow`, `shadow-[`, `drop-shadow-[` outside overlay files | rule 3 |
| `rounded-full`, `rounded-{s,e,t,b,x,y}-full` | rule 4 |

The script also asserts the six motion tokens in `lib/motion.ts` match the
custom properties in `app/globals.css`.

It also scores **rule 6** on the homepage: `text-display` at most twice under
`app/page.tsx` and `components/home/`. `text-title` is permitted for section
headings on the mood-board homepage.

Comments are stripped before scanning — a forbidden token named in prose is
documentation, not shipped CSS.

**Escape hatch.** A line carrying `slop-check: allow <reason>` is skipped. The
permitted gradient is a scrim over photography for overlay type.

### Tier 3 — review

These need composition judgement and cannot be automated:

- **rule 7** at most one orchestrated staggered sequence per route
- **rule 9** centred section titles of one or two lines are permitted; running copy is not
- **rule 10** every section differs from each neighbour in column count, alignment, image scale or surface
- **rule 11** at most five top-level navigation items *(partly guarded — `SiteHeader` throws if its list exceeds five)*
- **rule 12** at most twelve icons, one source, one stroke weight
- **rule 13** mood-board sentences supplied in the brand record are recorded exceptions

**rule 8** (no rating/review/badge/compare-at/scarcity fields) is enforced by
type: neither `ProductCardProduct`, the brand record, nor the catalog model has
such a field.

`define-catalog-model` kept it that way with one qualification. `Product` carries
an optional `labels` field typed as a closed union of **manufacturing facts** —
`made-to-order`, `one-of-a-kind`, `hallmarked`, `limited-run` — supplied by the
business. `"Sale"`, `"Only 2 left"` and `"Bestseller"` are not expressible, and
labels **never render on a product card**: the product-card requirement in
`specs/design-system/core-components` forbids badge affordances there and is
unmodified, so labels surface on the product detail page only.

Availability is a four-state union with no quantity field, so scarcity messaging
has nothing to render from.

This is now enforced twice: by the types, and by `scripts/check-catalog.mjs`,
which fails the build if a field named `rating`, `review`, `compareAt`,
`discount`, `stockCount`, `badge` or `bestseller` appears anywhere under
`lib/catalog/`. Adding one requires amending `specs/catalog/product-model`
first, not editing the type.

## Section rhythm — the join the page does not own

`SiteFooter` carries its own `mt-breath`. **The last join on every page is
already a `breath`**, and no page chooses it. A page composing five sections is
therefore scoring six joins, and the one entering its final section must not be
`breath` or the two adjacent `breath` joins fail the spacing requirement.

Nothing in the tokens says so; it is only visible by reading the component.
Recorded here so `build-shop-and-collections` and `build-product-detail` do not
rediscover it.

The homepage's score, as an example of the shape:

| Join | Value |
| --- | --- |
| Hero → Types | `normal` |
| Types → New arrivals | `tight` |
| New arrivals → Occasions | `normal` |
| Occasions → Collection | `tight` |
| Collection → Featured | `normal` |
| Featured → Reasons | `normal` |
| Reasons → Journal | `tight` |
| Journal → Statement | `normal` |
| Statement → footer | `breath` *(fixed by `SiteFooter`)* |

One `tight` present, no two `breath` adjacent.

## Type budget per page

`display` at most twice. The homepage spends all four roles:

- `display` ×2 — the hero `<h1>` (brand name) and the closing statement
- `title` — Types, Collection and Reasons headings
- `body` — running copy and type names
- `caption` — eyebrows, Explore labels, header and footer

## Palette and contrast

The palette is the mood board's, recorded in `clone-shubha-moodboard`. Token
names stayed as structural roles; only the values changed.

| Token | Brand name | Hex | Chroma |
| --- | --- | --- | --- |
| `paper` | Cream | `#FAF8F3` | 0.0070 |
| `charcoal` | Charcoal | `#1A1A1A` | 0 |
| `ink` | Royal Green | `#0F3D33` | **0.0523** |
| `graphite` | Deep Brown | `#3B2F2F` | 0.0176 |
| `graphite-inverse` | Cream-grey | `#C8C2B6` | 0.0178 |
| `gold` | Gold | `#D4AF37` | **0.1387** |

### Named exemptions

`ink` and `gold` sit past the 0.02 chroma ceiling and are named in `EXEMPT`.
Gold is also in the metal hue band; the hue exclusion skips named exemptions
so that unnamed metal tokens still fail.

`primary` is gold fill with a charcoal label — cream on gold is 1.98:1.

### Measurements

`node scripts/contrast.mjs` converts the OKLCH tokens to linear sRGB and
measures every pairing the system renders. Re-run it after any colour change.

| Pair | Floor |
| --- | --- |
| charcoal on paper | 4.5:1 |
| graphite on paper | 4.5:1 |
| paper on ink | 4.5:1 |
| graphite-inverse on ink | 4.5:1 |
| charcoal on gold | 4.5:1 |
| gold on ink | 4.5:1 |

## Font licensing — operational constraint

Playfair Display and Montserrat load through `next/font/google` and are
self-hosted at build time. Gambarino and Switzer remain in `app/fonts/` but
are unused by the live storefront.

## Routes the shell links to that do not exist

Every top-level destination in the header and footer resolves to a 404 today.
That was already true when `build-homepage` shipped and was recorded there as the
honest state rather than hidden by removing the links; `apply-shubha-abharan`
adds to the list rather than changing the policy.

| Route | Owed by |
| --- | --- |
| `/shop` (and its `?category=` filter), `/collections`, `/collections/modern-classics`, `/types` | `build-shop-and-collections` |
| `/cart`, `/wishlist` | `build-cart-and-wishlist` |
| `/search`, `/about`, `/contact` | unassigned |

`/types` may reasonably be delivered as a redirect to `/shop` rather than as a
page — it exists because the business asked for a category entry in the primary
navigation, and the navigation requirement permits exactly one such index.

## The photography

Nine frames in `public/images/`, generated by `scripts/generate-images.mjs` from
prompts held in that file and derived from the two art-direction prompts in
SHUBHA-BRAND-DIRECTION.md. Extra hero and collection frames (`hero-2`, `hero-3`,
`collection-2`, `collection-3`, `category-bangles`) keep the same jewellery as
the primary stills so sliders can page without swapping the piece.

The script is a content workflow, not application code. Nothing under `app/`,
`components/` or `lib/` imports it, and the storefront calls no model at request
time — the pages are static and the images are files on disk. The API key is read
from `.env` inside the script and appears in no committed file or log line.

Two operational notes:

1. **`image_size: "2K"`.** The model's default long edge is 1264px, which the
   full-bleed frames upscale past at any desktop width and badly on a 2x display.
   `"4K"` is rejected by this model.
2. **`sharp` encodes the output to JPEG at 2400px.** It is already present as a
   Next dependency and is used by this script only; the call is wrapped so the
   model's bytes are written unchanged if it is ever absent.

These are generated photographs, not photographs of pieces the business sells.
Every `alt` describes the frame as it actually exists rather than as it was
briefed — when a frame is re-shot, its `alt` is rewritten with it.

## Known gap carried forward

The responsive spec requires filters to present as a **bottom sheet** at mobile
widths. No filter UI exists yet, so no `Sheet` component was built. Implement it
in `build-shop-and-collections` by generalising `components/nav/NavOverlay.tsx`
— the native `<dialog>` already supplies focus containment, Escape and focus
return; only geometry and the entry transform differ. Do not write a second
dialog wrapper.

## Running the gates

```
npm run check     # lint, typecheck, contrast, anti-slop, catalog integrity
npm run build
```
