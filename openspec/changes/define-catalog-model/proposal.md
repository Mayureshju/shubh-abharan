## Why

`establish-brand-system` built the presentation layer — `Plate`, `ProductCard`, tokens, motion — but no product data model. `ProductCardProduct` is a deliberately narrow placeholder carrying a preformatted `price: string`, and the only product data in the repo is three hand-written specimen literals. Every storefront surface still to be built (shop, collections, PDP, search, cart, wishlist) reads the same product, and without one owned definition each of those surfaces will invent its own fields and its own price formatting.

This change defines that one definition, and nothing else. No storefront UI, no backend, no database.

## What Changes

- **A typed catalog domain model** under `lib/catalog/` — `Product`, `ProductVariant`, `ProductImage`, `Collection`, `Category`, `Money`, `Availability`, `ProductAttribute`, `ProductLabel` — as the single source of product shape for the whole storefront.
- **Money becomes structured, not preformatted.** Prices are integer minor units plus an ISO currency code, formatted at the edge by one shared formatter. **BREAKING** for `ProductCardProduct`, whose `price: string` prop and "structurally assignable" comment are replaced by an explicit `toProductCardProduct(product, role)` adapter.
- **Brand-owned product values stay nullable.** Price, material line, description and care copy are `T | null` and resolve through the existing `lib/brand.ts` placeholder boundary, so no code path can invent a price, a material or a claim.
- **A closed `ProductLabel` union** of manufacturing facts (`made-to-order`, `one-of-a-kind`, `hallmarked`, `limited-run`). Ratings, reviews, compare-at prices, discount flags and stock counts remain absent from the types, so no surface can render one. Labels are carried by the model but are **not** rendered on the product card — `design-system/core-components` forbids badge affordances there, and this change does not modify that requirement.
- **Availability is declared, never computed.** A per-variant union (`available`, `made-to-order`, `sold-out`, `unavailable`); there is no stock quantity field, so scarcity messaging is unrepresentable.
- **Async repository functions** (`getProduct`, `listProducts`, `getCollection`, …) are the only way UI reaches catalog data. Local fixture modules back them now; a commerce API can back them later without touching a caller.
- **Structurally complete, semantically unfilled fixtures** — real slugs, real categories, real image roles and aspects, with every brand-owned string `null` until the business supplies it.
- **A referential-integrity check** (`scripts/check-catalog.mjs`) wired into `npm run check`: collection slugs resolve, slugs are unique, image ordering is well-formed, `scale` images carry a dimension, no forbidden field names appear under `lib/catalog/`.

## Capabilities

### New Capabilities
- `catalog/product-model`: The canonical entity shapes and their invariants — identity and slug strategy, variant axes, image roles and ordering, price and currency representation, availability, attributes, labels, and category/collection relationships.
- `catalog/catalog-access`: The data ownership boundary — the async repository surface, the derivations that feed cards, search, sorting, filtering and related products, the nullable-brand-value rule, and how local fixtures are replaced by an API without rewriting UI.

### Modified Capabilities
<!-- None. `design-system/core-components` keeps its product-card requirement unchanged:
     labels exist in the model but do not render on the card, and rendering them
     there would require modifying that requirement in a later change. -->

## Impact

- **New**: `lib/catalog/` (types, repository, derivations, fixtures), `scripts/check-catalog.mjs`.
- **Changed**: `components/product/ProductCard.tsx` — prop type sourced from the catalog module rather than declared locally; `app/specimen/page.tsx` — specimen products built from fixtures through the adapter; `package.json` `check` script; `DESIGN-SYSTEM.md` rule 8 wording; `BRAND-INPUTS.md` gains a catalog section listing the per-product values the business must supply.
- **Unchanged**: every design token, `Plate`, `Reveal`, motion, navigation, and all four `design-system` specs.
- **No new dependencies.** No database, no API client, no validation library.
