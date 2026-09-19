## Context

See `proposal.md` — Why. Constraints that shape the approach:

- `establish-brand-system` is authoritative. `lib/brand.ts` already owns the "supplied, never invented" boundary (`BrandField = string | null`, `resolve`, `placeholder`, `isSupplied`); the catalog extends that pattern rather than inventing a second one.
- `components/editorial/Plate.tsx` already owns image roles (`macro | scale | worn | detail`), requires a declared aspect, and requires `dimension` on the `scale` role via a discriminated union. The catalog's image type must line up with `PlateProps` so no conversion layer is needed.
- `components/product/ProductCard.tsx` declares a local `ProductCardProduct` with `price: string` and a comment predicting the real `Product` will be "structurally assignable to it". That prediction does not survive contact with a cart — see Decision 8.
- No test runner is installed. `npm run check` = lint, typecheck, `scripts/contrast.mjs`, `scripts/check-slop.mjs`. New verification follows that shape: a plain Node script, no framework.
- Dependencies are `next`, `react`, `motion`. Nothing else. This change adds none.

## Goals / Non-Goals

**Goals:**

- One product object that satisfies card, listing, search, detail, cart and wishlist without any surface adding a field.
- Make the forbidden things — ratings, reviews, compare-at prices, scarcity, invented prices and materials — unrepresentable in the type system rather than forbidden by review.
- A data-source seam narrow enough that swapping fixtures for a commerce API touches one directory.

**Non-Goals:**

- Cart and wishlist *state* — persistence, reducers, storage. This change defines the reference shapes those will store (`CartLine`, `WishlistEntry`) and nothing more.
- Filter and sort *UI*. Listing options are typed here; the controls belong to `build-shop-and-collections`.
- Real product content. Fixtures are structurally complete and semantically unfilled by design.
- Any runtime schema validation library. Types plus one integrity script cover a local, hand-authored catalog.

## Decisions

### 1. Two identifiers: an opaque `id` and a public `slug`

```ts
export type ProductId = string & { readonly __brand: "ProductId" };
export type VariantId = string & { readonly __brand: "VariantId" };
```

`slug` is the URL segment and can change when marketing changes. `id` never changes and is what cart lines and wishlist entries store.

**Alternative rejected — slug as sole identity.** Simpler by one field, but a slug rename silently invalidates every saved cart in `localStorage`, and there is no server-side migration path for browser-local data. One extra field buys correctness across the only persistence this project has.

Branded string types cost nothing at runtime and stop a `ProductId` being passed where a `VariantId` belongs — the two are both strings and are easy to transpose in a cart lookup.

### 2. Money is integer minor units plus an ISO code

```ts
export interface Money {
  /** Integer, in the currency's minor unit. 4250 = £42.50. */
  readonly amount: number;
  readonly currency: CurrencyCode; // "GBP" | "EUR" | "USD"
}
```

Floats are excluded because cart summation needs exact arithmetic. Preformatted strings are excluded because they cannot be summed, sorted or compared, and they bake a locale into data.

Formatting lives in exactly one place:

```ts
const PRICE_LOCALE = "en-GB"; // fixed, not the visitor's

export function formatMoney(money: Money | null): string {
  if (!money) return placeholder("price");
  return new Intl.NumberFormat(PRICE_LOCALE, {
    style: "currency",
    currency: money.currency,
    minimumFractionDigits: money.amount % 100 === 0 ? 0 : 2,
  }).format(money.amount / 100);
}
```

The locale is a fixed constant rather than the visitor's. Server-first rendering means `Intl` runs on the server and again on hydration; a visitor-derived locale produces a different string on each side and a hydration mismatch. Pinning it is the fix, and it keeps prices identical for every visitor — correct for a single-currency brand.

`Money | null` flowing into the formatter is why `formatMoney` accepts null: the placeholder path is the same call, so no caller can forget it.

**Currency is per-`Money`, not global.** One field, and it is the difference between adding a second currency later by editing data versus editing every price site.

### 3. Variant axes are a closed union with ordered values

```ts
export type VariantAxis = "size" | "length" | "finish" | "metal";

export interface ProductOption {
  readonly axis: VariantAxis;
  /** Ordered — presentation order for selectors. Sizes are not alphabetical. */
  readonly values: readonly string[];
}

export interface ProductVariant {
  readonly id: VariantId;
  /** One entry per axis the product declares. */
  readonly options: Readonly<Partial<Record<VariantAxis, string>>>;
  readonly price: Money | null;
  readonly availability: Availability;
  readonly sku?: string;
}
```

**Alternative rejected — concrete `size?: string; finish?: string` fields on the variant.** Fewer moving parts, but rings take a size while necklaces take a length and bracelets take both length and finish; the field list grows and every filter becomes a special case. The axis/values shape handles all of them with one structure and is the shape every commerce backend already speaks, which makes Decision 7 a mapping rather than a redesign.

**Alternative rejected — fully generic `options: { name: string; value: string }[]`.** Maximum flexibility, but `name` being an open string means a filter UI must discover axes at runtime and two products can disagree on spelling ("Finish" vs "finish"). The closed union keeps the vocabulary fixed and the filter code exhaustive.

Values stay `string` rather than a union per axis: ring sizes, chain lengths and finish names are brand vocabulary that belongs in `BRAND-INPUTS.md`, not in the type system. The integrity script checks that each variant's values appear in its product's declared `values` list.

### 4. Image order *is* the ordering — no primary or secondary field

```ts
export type ProductImage = PlateProps & { readonly crop?: string };
export type ProductImages = readonly [ProductImage, ...ProductImage[]]; // non-empty
```

Primary is `images[0]`, secondary is `images[1]`, gallery is `images`. A separate `primaryImageId` can disagree with the array; an array index cannot. The non-empty tuple type means "a product has at least one image" is checked by the compiler, not the integrity script.

Reusing `PlateProps` directly means the `scale`-requires-`dimension` and `alt`-or-`decorative` unions the design system already enforces apply to catalog data for free, and a `ProductImage` spreads into `<Plate {...image} />` with no adapter.

Role lookup is one function:

```ts
export function imageForRole(p: Product, role: PlateRole): ProductImage {
  return p.images.find((i) => i.role === role) ?? p.images[0];
}
```

The fallback to primary is what satisfies the design system's "falls back to a defined alternate role" scenario, and the non-empty tuple is what makes the `??` total.

### 5. Brand-owned product values are nullable and reuse the existing boundary

`price`, `materialLine`, `description` and `care` are `T | null`. They resolve through `lib/brand.ts`'s `resolve()` / `placeholder()` — the same functions, the same `[MATERIAL LINE]` output already visible on `/specimen`.

The split is deliberate: **structural** fields (`id`, `slug`, `category`, `options`, `images[].role`, `images[].aspect`, `availability`) are required, because they are facts about the model rather than claims about the product, and a storefront cannot be built or reviewed without them. **Brand-owned** fields are nullable, because the business has not supplied them and nothing may invent them.

`availability` is required and *not* nullable, deliberately: an absent availability has no safe default. Defaulting to `available` is an invented inventory claim; defaulting to `unavailable` silently empties the shop. Forcing the author to state it is the only honest option.

### 6. `ProductLabel` is a closed union of manufacturing facts

```ts
export type ProductLabel = "made-to-order" | "one-of-a-kind" | "hallmarked" | "limited-run";
```

Per the decision recorded against this change: the brief asked for "badges when explicitly provided by data"; `DESIGN-SYSTEM.md` rule 8 and `BRAND-INPUTS.md` forbid badge fields. The union resolves both — these are photographable or verifiable manufacturing facts, and `"Sale"`, `"Only 2 left"` and `"Bestseller"` cannot be expressed.

Labels do **not** render on `ProductCard`. `design-system/core-components` states the card "SHALL NOT display ratings, reviews, badges, discount flags, or scarcity indicators"; that requirement is unmodified by this change, so labels surface on the PDP only. Rendering them on a card would require modifying that spec first.

`DESIGN-SYSTEM.md` rule 8 is reworded to match: the catalog carries a closed `ProductLabel` union, and still has no rating, review, compare-at or scarcity field. Tier 2 gains a grep rule so the guarantee stays enforced rather than described.

### 7. An async repository over local fixture modules

```
lib/catalog/
  types.ts        entities, ids, Money, Availability, ProductLabel
  money.ts        formatMoney, fromPrice, comparePrice
  repository.ts   getProduct, listProducts, getCollection, getProductsByIds, search
  derive.ts       imageForRole, toProductCardProduct, relatedProducts, priceRange
  data/
    products.ts   the only place product records are authored
    collections.ts
```

Every repository function is `async` even though the fixtures are synchronous:

```ts
export async function getProduct(slug: string): Promise<Product | null> { … }
```

One keyword now versus changing every call site and every server component later. Server components `await` naturally, so it costs nothing to read.

`derive.ts` is separate from `repository.ts` because derivations are pure and stay unchanged when the data source moves; only `repository.ts` is rewritten against an API.

**Alternative rejected — a `CatalogSource` interface with a `LocalCatalogSource` implementation.** One interface, one implementation, a factory and a wiring point, to defer a decision a module swap already defers. The module boundary *is* the seam.

### 8. `ProductCardProduct` gets an adapter, not structural assignability

`ProductCard`'s comment predicts `Product` will be structurally assignable to `ProductCardProduct`. It will not be, and should not be: that would force `Product.price` to be a preformatted string (Decision 2) and `materialLine` to be non-null (Decision 5), and would require the product to know which image role the layout wants.

Instead the card keeps its narrow prop — it is a good boundary, and it is what makes "no badge prop exists" a type-level guarantee — and the catalog supplies the one adapter:

```ts
export function toProductCardProduct(
  product: Product,
  role: PlateRole = "macro",
): ProductCardProduct {
  return {
    slug: product.slug,
    name: product.name,
    price: formatMoney(lowestPrice(product)),
    materialLine: resolve(product.materialLine, "material line"),
    image: imageForRole(product, role),
  };
}
```

`ProductCardProduct` moves from `ProductCard.tsx` into `lib/catalog/types.ts` and is re-exported by the card, so the catalog stays the sole owner of product shape while the card's props stay narrow. The `role` parameter is what lets one listing vary its cards, per the design system's product-card requirement.

`app/specimen/page.tsx` switches to building its three cards from fixtures through this adapter — which is also how the adapter gets exercised without a test runner.

### 9. Related products: explicit list, else shared collection, else shared category

```ts
export function relatedProducts(p: Product, all: readonly Product[], limit = 4): Product[]
```

Explicit `relatedSlugs` wins when present. Otherwise: products sharing a collection, then products sharing a category, excluding `p`, capped at `limit`. Empty result means the calling surface omits its section.

Deliberately not a scoring or similarity model. There is no behavioural data to score with, and a hand-tuned weight table is invented editorial judgement.

### 10. Search is substring matching over a derived haystack

```ts
// ponytail: linear substring scan over the full catalog; swap for the commerce
// API's search endpoint, or an index, when the catalog outgrows a few hundred items.
```

Matches over name, category, collection names, and supplied material/description/attribute values — supplied values only, so placeholder text like `[MATERIAL LINE]` is never a hit. Case-insensitive, partial-word.

No search index, no fuzzy matching, no dependency. A linear scan over a local array is imperceptible at this scale and a real backend brings its own search.

### 11. Verification is one Node script, no test framework

`scripts/check-catalog.mjs`, wired into `npm run check` beside `contrast.mjs` and `check-slop.mjs`. It checks exactly what the compiler cannot: slug and id uniqueness, collection memberships resolving against `brand.collections`, set components and explicit related slugs resolving, no duplicate axis-value combinations within a product, variant values appearing in the product's declared option values, and no forbidden field name (`rating`, `review`, `compareAt`, `discount`, `stockCount`, `badge`, `bestseller`) under `lib/catalog/`.

Adding a test runner for a hand-authored catalog is a dependency, a config file and a CI step to assert facts about fifteen literals. The compiler covers shape; this covers references.

## Risks / Trade-offs

- **Fixtures with nothing filled in are hard to design against** → Structural completeness is the mitigation: real slugs, categories, variant axes, image roles, aspects and crops. Composition, ordering, variant selection and filtering are all exercisable; only the words and the photographs are marked absent. This is the behaviour `/specimen` already demonstrates.
- **`ProductCardProduct` moving to `lib/catalog` inverts the current dependency direction** → It is the stated intent of the card's own comment (the catalog owns product shape), and the card re-exports the type so existing imports keep working. The card gains no dependency on the repository — only on types.
- **The closed `VariantAxis` union will eventually need a fifth axis** → Adding one is a one-line union edit plus whatever filter code the compiler then flags as non-exhaustive. That flagging is the point; an open string would let it pass silently.
- **`ProductLabel` re-opens a door rule 8 closed** → Closed union, four values, all manufacturing facts, none renderable on a card, plus a grep rule in `check-slop.mjs`. The type-level guarantee against ratings, reviews, compare-at prices and scarcity is unchanged.
- **Branded id types add friction when authoring fixtures** → One `asProductId()` helper at the authoring boundary. Accepted in exchange for making a product/variant id transposition a compile error in cart code.
- **Async repository functions over synchronous data look like ceremony** → One keyword, and it is precisely the thing that makes Decision 7's swap a rewrite of one file instead of a rewrite of every caller.

## Migration Plan

No data to migrate — the catalog does not exist yet. Two existing files change:

1. `components/product/ProductCard.tsx` — `ProductCardProduct` and `CardImage` are deleted and re-exported from `lib/catalog/types.ts`. Rendering is untouched.
2. `app/specimen/page.tsx` — `SPECIMEN_PRODUCTS` literals become fixtures passed through `toProductCardProduct`.

`npm run check` and `npm run build` are the rollback signal; the change is additive and revertible as one commit.

## Open Questions

- **Ring size vocabulary** (UK letter sizes, US numeric, or both) is brand input, not a model decision — it lands in `BRAND-INPUTS.md` as option *values* and changes no type.
- **Whether a second currency is ever needed.** `Money` already carries its code, so the answer changes data, not shape.
