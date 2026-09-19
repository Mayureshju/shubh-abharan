## 1. Catalog and brand data

- [x] 1.1 Add `INR` to `CurrencyCode` and pin `formatMoney` locale by currency (`en-IN` for INR)
- [x] 1.2 Add `brand.occasions`, `brand.heroSlides`, `brand.homepage` slug lists to `lib/brand.ts`
- [x] 1.3 Add `occasions` on `Product`; `listProducts({ occasion })`; `getProductsBySlugs` preserving order
- [x] 1.4 Author ~8 merchandisable sample products with existing photography and development INR prices; keep fixtures unfilled
- [x] 1.5 Extend `scripts/check-catalog.mjs` for occasion membership and merchandising slug resolution
- [x] 1.6 Record development merchandise, occasions, hero slides and journal copy in `BRAND-INPUTS.md`

## 2. Journal

- [x] 2.1 Add `lib/journal/` types, three authored posts, async `listPosts` / `getPost`
- [x] 2.2 Add `/journal/[slug]` article page

## 3. Hero slider

- [x] 3.1 Keep Hero as a server shell; first frame, heading and primary action in HTML
- [x] 3.2 Client island: Motion crossfade, swipe, dots, 44px prev/next, autoplay that pauses on interaction / hidden / offscreen / reduced motion
- [x] 3.3 Only slide 1 uses `priority` and `text-display`; subsequent slides use `text-title`

## 4. Homepage sections

- [x] 4.1 `NewArrivals` — brand slug list, mixed plate roles, `.rail` with `--rail-columns: 4`
- [x] 4.2 `Occasions` — three destination tiles; rail on mobile; wedding spans two rows from 768px
- [x] 4.3 `Featured` — brand slug list; rail on mobile; mixed grid from 768px
- [x] 4.4 `Journal` — latest three as 1 featured + 2 compact
- [x] 4.5 Recompose `app/page.tsx` in spec order with tight/normal rhythm; omit empty sections
- [x] 4.6 Update `DESIGN-SYSTEM.md` homepage join table

## 5. Destinations

- [x] 5.1 Thin `/products/[slug]` — gallery, name, price, material, description, one primary action
- [x] 5.2 Thin `/occasions/[slug]` — occasion name and matching product cards

## 6. Verify

- [x] 6.1 `npx tsc --noEmit` and `npm run check`
- [x] 6.2 Browser pass at 390 and 768: swipe hero, snap rails, keyboard on slider controls, reduced-motion, no page-level horizontal scroll
