## 1. Shared catalog and dialog

- [x] 1.1 Add `lib/catalog/labels.ts` with category, availability and sort labels; export from the catalog barrel
- [x] 1.2 Add shop query parse/serialise (`category`, `sort`, `availability`, `min`, `max`) that ignores unknown values
- [x] 1.3 Extract `ModalDialog` from `NavOverlay` (native dialog, showModal, Escape, scroll lock, reduced-motion MotionConfig)
- [x] 1.4 Point `NavOverlay` at `ModalDialog` with overlay placement

## 2. Shop listing

- [x] 2.1 Add `.shop-set` editorial grid in `app/globals.css`
- [x] 2.2 Add `ProductListing` using `ProductCard` + `toProductCardProduct` with varied span/role
- [x] 2.3 Add `ShopFilters` GET form (type, availability, sort, min/max, Apply, clear)
- [x] 2.4 Add mobile `FilterSheet` on `ModalDialog` sheet placement; Filter trigger `md:hidden`
- [x] 2.5 Add `/shop` page: heading, count, empty state, desktop aside + listing

## 3. Types and collections

- [x] 3.1 Extract photographed type index data and render `/types` as an index whose entries go to `/shop?category=`
- [x] 3.2 Add `/collections` index from the brand record
- [x] 3.3 Add `/collections/[slug]` with `getCollection`, `notFound` on unknown slug, empty listing copy, no shop filter chrome

## 4. Contact

- [x] 4.1 Add `/contact` with supplied-or-placeholder email and omitted address when null
- [x] 4.2 Add `ContactForm`: mailto when email is supplied, local unsent notice when it is not

## 5. Verify

- [x] 5.1 Update `DESIGN-SYSTEM.md` owed-routes table
- [x] 5.2 `npx tsc --noEmit` and `npm run check`
- [x] 5.3 Browser pass: shop filters, types, collections, contact submit, keyboard/sheet/reduced-motion
