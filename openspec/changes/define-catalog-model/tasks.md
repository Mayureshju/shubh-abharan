## 1. Types — the single owner of product shape

- [x] 1.1 Create `lib/catalog/types.ts` with branded `ProductId` / `VariantId`, `CurrencyCode`, `Money`, `Availability`, `Category`, `VariantAxis`, `ProductLabel`, and `ProductAttribute` (design.md — Decisions 1, 2, 3, 6)
- [x] 1.2 Define `ProductImage` as `PlateProps & { crop?: string }` and `ProductImages` as a non-empty readonly tuple, so `scale`-requires-`dimension` and `alt`-or-`decorative` are inherited from `Plate` and "at least one image" is compiler-checked (Decision 4)
- [x] 1.3 Define `ProductOption` and `ProductVariant` — one value per declared axis, `price: Money | null`, required non-nullable `availability`, optional `sku` (Decisions 3, 5)
- [x] 1.4 Define `Product` — required structural fields (`id`, `slug`, `name`, `category`, `options`, `variants`, `images`, `collections`), nullable brand-owned fields (`materialLine`, `description`, `care`), optional `attributes`, `labels`, `relatedSlugs`, and `componentSlugs` for sets (Decisions 5, 6)
- [x] 1.5 Define `CartLine` (variant id + quantity) and `WishlistEntry` (product id + optional variant id) as reference-only shapes carrying no copied display values; add no storage or state
- [x] 1.6 Move `ProductCardProduct` and its `CardImage` union verbatim from `components/product/ProductCard.tsx` into this module (Decision 8)
- [x] 1.7 Add an `asProductId` / `asVariantId` authoring helper pair for fixtures

## 2. Money

- [x] 2.1 Create `lib/catalog/money.ts` with `formatMoney(money: Money | null)` using a fixed `PRICE_LOCALE` constant and returning `placeholder("price")` for null (Decision 2)
- [x] 2.2 Add `lowestPrice(product)` and `hasPriceRange(product)` deriving a product's displayed price from its variants, returning null when no variant carries a supplied price
- [x] 2.3 Confirm the fixed locale renders identically on server and client — no hydration warning on `/specimen` (Decision 2; quality gate 5)

## 3. Fixture data

- [x] 3.1 Create `lib/catalog/data/collections.ts` reading collection identity from `brand.collections`, adding only slug-keyed product ordering
- [x] 3.2 Create `lib/catalog/data/products.ts` with a structurally complete fixture set covering every category — ring, necklace, pendant, earring, bracelet, set — including at least one multi-axis product (size × finish), one single-variant product, one product in no collection, and one `set` referencing component products
- [x] 3.3 Give every fixture image a real role, aspect and intended crop, and no `src` — placeholders render until photography is supplied (specs/catalog/product-model — image requirement)
- [x] 3.4 Leave every brand-owned value null: no invented price, material line, description, care copy, or favourable availability. Availability is stated explicitly per variant because it has no safe default (Decision 5)
- [x] 3.5 Add a `## Catalog` section to `BRAND-INPUTS.md` enumerating the per-product values the business must supply — product names, prices and currency, material lines, descriptions, care copy, option values per axis (ring sizes, chain lengths, finish names), availability per variant, and attribute label/value pairs — all marked UNFILLED

## 4. Repository and derivations

- [x] 4.1 Create `lib/catalog/repository.ts` with `async` `getProduct(slug)`, `listProducts(criteria)`, `getCollection(slug)`, `getProductsByIds(ids)`, and `search(query)`; every function async regardless of the synchronous source (Decision 7)
- [x] 4.2 Have `getProduct` and `getCollection` resolve to `null` for an unknown slug rather than throwing, so callers render a not-found response
- [x] 4.3 Implement `listProducts` filtering by category, collection, variant axis value, availability and price range, and sorting by price ascending/descending and declared display order — price sorts placing unsupplied prices last in display order, never treating null as zero (specs/catalog/catalog-access — filtering requirement)
- [x] 4.4 Implement `search` as a case-insensitive partial-word scan over name, category, collection names and *supplied* material/description/attribute values only, with the `ponytail:` comment naming the linear-scan ceiling and its upgrade path (Decision 10)
- [x] 4.5 Create `lib/catalog/derive.ts` with `imageForRole(product, role)` falling back to `images[0]` (Decision 4)
- [x] 4.6 Add `toProductCardProduct(product, role = "macro")` deriving slug, name, formatted price, resolved material line and role-selected image (Decision 8)
- [x] 4.7 Add `relatedProducts(product, all, limit = 4)` — explicit `relatedSlugs` first, then shared collection, then shared category, excluding the subject, returning empty when nothing matches (Decision 9)
- [x] 4.8 Add a barrel `lib/catalog/index.ts` exporting types, money, repository and derivations, so no component imports a `data/` module directly

## 5. Wire the existing components

- [x] 5.1 Update `components/product/ProductCard.tsx` to import and re-export `ProductCardProduct` from `lib/catalog` instead of declaring it; leave rendering untouched
- [x] 5.2 Replace the comment predicting structural assignability with one naming `toProductCardProduct` as the path from `Product` to the card, and restate that no rating, review, badge, discount or scarcity prop exists
- [x] 5.3 Update `app/specimen/page.tsx` to build its three cards from fixtures through `toProductCardProduct`, keeping one card per image role so the specimen still renders `macro`, `scale` and `worn`

## 6. Enforcement

- [x] 6.1 Create `scripts/check-catalog.mjs` verifying: product and collection slug uniqueness; product and variant id uniqueness; every collection membership resolving against `brand.collections`; every set component and explicit related slug resolving; at least one variant per product; no duplicate axis-value combination within a product; every variant value present in its product's declared option values (Decision 11)
- [x] 6.2 Extend the same script to fail on forbidden field names — `rating`, `review`, `compareAt`, `discount`, `stockCount`, `badge`, `bestseller` — anywhere under `lib/catalog/`, naming the offending file and field
- [x] 6.3 Add `check-catalog.mjs` to the `check` script in `package.json`, after `check-slop.mjs`
- [x] 6.4 Reword rule 8 in `DESIGN-SYSTEM.md`: the catalog carries a closed `ProductLabel` union of manufacturing facts, labels never render on a product card, and there is still no rating, review, compare-at or scarcity field — enforced by type plus `check-catalog.mjs`
- [x] 6.5 Add a "Where things live" row to `DESIGN-SYSTEM.md` pointing product shape at `lib/catalog/`

## 7. Verify

- [x] 7.1 Run `npm run check` — lint, typecheck, contrast, anti-slop, catalog integrity all pass
- [x] 7.2 Run `npm run build`
- [x] 7.3 Open `/specimen` and confirm the three product cards render from fixtures with marked `[PRICE]` and `[MATERIAL LINE]` placeholders, no console error, no hydration warning, and no layout shift
- [x] 7.4 Deliberately break one fixture — an unknown collection slug, then a duplicate variant combination — and confirm `check-catalog.mjs` fails and names the offending product each time
- [x] 7.5 Confirm scope held: no storefront route added, no dependency added, no `design-system` spec modified, and no rating, review, badge, compare-at or stock field anywhere in the diff
