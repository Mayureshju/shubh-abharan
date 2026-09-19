## Why

The mood-board homepage is five editorial sections and one hero frame. The storefront now needs a mobile-first merchandising page: a campaign slider, new arrivals, featured pieces, shop-by-occasion, and three journal stories. 90% of visitors are on phones, so rails, swipe, and scroll motion have to be authored for that width rather than stacked from desktop.

## What Changes

- **BREAKING.** The homepage narrative is no longer five sections. Order becomes Hero slider → Types → New arrivals → Occasions → Collection split → Featured → Reasons → Journal → Statement. Empty merchandising or journal lists omit their section rather than inventing filler.
- **BREAKING.** The Hero MAY cycle three or four authored campaign frames. The first frame, the brand name as the page's single `<h1>`, and one `primary` action remain in the HTML without scripting. Later frames do not spend `text-display`.
- Occasion becomes an editorial axis on the product, like collection membership. New, featured, and slider copy live as brand-owned lists — not `isNew` / `isFeatured` / date fields.
- **INR** is added to the catalog currency union. Sample merchandisable products (separate from structural fixtures) may carry development prices, materials, descriptions, and photography recorded in `BRAND-INPUTS.md`.
- A journal content module backs three authored posts and `/journal/[slug]`. Thin `/products/[slug]` and `/occasions/[slug]` pages exist so homepage links resolve. Full shop/filter stays downstream.
- Motion stays CSS `Reveal` plus the existing Motion runtime for the slider. **No GSAP.** No parallax, no scroll hijack, no per-card stagger.

## Capabilities

### New Capabilities

- `storefront/journal`: Authored journal posts, homepage latest-three presentation, and `/journal/[slug]`.

### Modified Capabilities

- `storefront/homepage`: Section order, hero slider, merchandising rails, occasions, journal block, mobile rails, motion constraints.
- `catalog/product-model`: Occasion membership; INR; merchandisable sample records vs unfilled fixtures; still no ratings, discounts, scarcity, or hype flags.
- `catalog/catalog-access`: Filter by occasion; resolve brand-owned merchandising slug lists in declared order; integrity checks for occasion and merchandising slugs.

## Impact

**Code**

- `lib/brand.ts`, `lib/catalog/*`, `scripts/check-catalog.mjs`, `lib/catalog/money.ts`
- New `lib/journal/`
- `components/home/*`, `app/page.tsx`
- `app/products/[slug]/page.tsx`, `app/journal/[slug]/page.tsx`, `app/occasions/[slug]/page.tsx`
- `BRAND-INPUTS.md`, `DESIGN-SYSTEM.md` homepage rhythm

**Dependencies**

None. Slider uses the existing `motion` package.

**Not in scope**

GSAP. Cart/wishlist. Full shop filters. CMS. Reviews, certifications, stock counts. Replacing the mood-board shoot.
