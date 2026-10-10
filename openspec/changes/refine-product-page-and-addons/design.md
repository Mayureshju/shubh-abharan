## Context

See proposal.md for motivation. The code this design builds on:

- **Product page.** The page is a server component with a 12-column grid: the gallery is 7 columns and the info column 5. The info column is `md:sticky`, which breaks once the column is taller than the viewport, and the add-ons will make it taller.
- **`AddToBag`** (client) owns the size chips, Buy now, Add to bag, wishlist and delivery check. Its bar is fixed only below 768px. `globals.css` pads `body:has([data-buy-bar])` on phones only.
- **The bag** is a list of `{ productId, variantId, quantity }` lines in `localStorage`. The server prices them with `quoteCart`, which also rejects sold-out lines. Checkout and orders take whatever lines the bag holds, so a line for any active product is valid.
- **Catalog reads** live in `lib/catalog/repository.ts`.
  - `listProducts` feeds the shop, search, occasions, related pieces and the homepage flag reads.
  - `getProductsBySlugs` feeds collections and the homepage fallbacks.
  - `getProduct` and `getProductById(s)` feed the product page, quotes and the wishlist.
- **Constraints:**
  - images go through `Plate`, buttons through `buttonClass`, with one `primary` per view
  - no shadows, gradients or `rounded-full`
  - four type roles only
  - at most twelve icons (ten exist)
  - copy carries a fact or a photographable noun
- **Concurrent work.** `paginate-shop-listing` is in flight on the shop page, `ShopFilters`, `query.ts` and `package.json`. This change touches none of those files.

## Goals / Non-Goals

**Goals:**

- Add-ons ride the existing bag, quote, checkout, coupon and order paths with no change to any of them.
- One place decides that add-ons stay out of listings.
- The page is composed for a 390px phone first: one column, full-bleed image, thumb-reach actions.
- Every interaction works by keyboard and without animation.

**Non-Goals:**

- A second product model, a bundle line type, or linking add-on lines to their piece in the bag.
- New dependencies, a carousel library, or a new icon.
- Changing the gallery's swipe, lens or full-screen behaviour beyond where the thumbnails sit.

## Decisions

### Decision 1 — An add-on is a product with a flag

`ProductSchema` gains `isAddon: Boolean` (default false), and `Product` gains `isAddon?: boolean`. An add-on therefore has images, prices, sale prices, hikes, availability, admin editing, a product page, bag lines, quotes, coupons and order snapshots for free.

Rejected alternatives:

- **A separate `Addon` collection.** It duplicates every one of those paths, and checkout would need a second line type.
- **A magic category or tag.** Category and tag slugs are admin-authored, so code keyed to `"add-on"` breaks on the first rename.

### Decision 2 — Exclusion lives in the repository

`listProducts` and `getProductsBySlugs` add `isAddon: { $ne: true }` to their Mongo filter. `$ne` also matches documents stored before the field existed. Every listing routes through one of the two, so search, related pieces and the homepage need no edits. `listTags` applies the same filter, so an add-on's tag never becomes an empty shop facet.

`getProduct`, `getProductById` and `getProductsByIds` stay unfiltered, so the add-on's product page, bag links, quotes and the wishlist still resolve.

New `listAddons()` returns active add-ons sorted by `_id`, which is creation order. It is exported from `lib/catalog/index.ts`.

Rejected: filtering in each caller. Seven call sites, and the next listing would forget.

### Decision 3 — Choosing an add-on is page state; buying writes lines

`ProductPurchase` keeps the chosen add-on variant ids in a `Set` in component state.

- **Add to bag** calls `add()` for the piece and each chosen add-on, then opens the drawer.
- **Buy now** calls `add()` only for wanted lines whose `variantId` is not already in the bag, then routes to `/checkout`. This is the existing no-doubling rule extended to several lines.

The choice persists after Add to bag. A following Buy now therefore cannot double anything.

Rejected: adding to the bag on tick, as the reference does. It changes the bag without an Add action, which the spec forbids. It also leaves orphan add-ons in the bag when the customer leaves without the piece.

The PDP computes, for each add-on, its first variant that is buyable (`available` or `made-to-order`) and priced. Add-ons without one are dropped on the server. The rail is not rendered for the current product's own id or when the piece has no buyable variant.

### Decision 4 — One client component owns the selection

`components/product/ProductPurchase.tsx` replaces `AddToBag.tsx`. It renders the name row with the wishlist toggle, price, material line, size cards, `AddonRail`, delivery check and the fixed bar, because all of them read the chosen size or add-ons.

The server page keeps the breadcrumb, gallery, description, details and related pieces.

Props are plain data: `Money` objects, ids, images and strings. Prices format in the browser with `formatMoney`, which `DeliveryCheck` already imports client-side. Its locale is pinned, so server and client strings match.

Rejected: a separate wishlist component beside a server-rendered name. It could not know the chosen size, which the wishlist entry stores.

### Decision 5 — The page columns are shared with the bar

One class string `PDP_COLUMNS` sets the column template:

- below 768px: none
- from 768px: `md:grid-cols-2`
- from 1024px: `lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]`, with a matching gap

The page uses it. The purchase bar does not — its two actions span the viewport (decision 6).

At 768px the details column is about 324px instead of 257px in the current 12-column split. That leaves room for three size cards and two add-ons.

The gallery becomes the sticky element (`md:sticky md:top-24 md:self-start`), and the details column scrolls normally. A square at 7/12 width plus the header fits a 900px-tall viewport above the bar. The details column may not fit, and that is why the old sticky broke.

### Decision 6 — The bar is fixed at every width and reserves its space

`data-buy-bar` stays `fixed inset-x-0 bottom-0`, now at every width. It carries `pb-[max(0.75rem,env(safe-area-inset-bottom))]` for the home indicator.

At every width the bar is `grid-cols-2`. Add to bag is a gold outline and Buy now is a charcoal fill with an ivory label reading "Buy now · ₹total". Both use `--radius-input`, not the site's pill. The label may wrap to two lines at six-figure totals rather than overflow. There is no thumbnail and no written summary — the piece is already on the page.

`globals.css` pads `body:has([data-buy-bar])` at every width. It also sets `html:has([data-buy-bar]) { scroll-padding-bottom }` so a focused control scrolls clear of the bar (WCAG 2.4.11).

Rejected: the earlier summary-plus-pills bar. A thumbnail and a lilac pill under the details column read as a template, and they left most of the bar empty.

### Decision 7 — The gallery moves its thumbnails, nothing else

On a phone the slide row runs full-bleed (`-mx-[var(--page-gutter)]`) and the thumbnail row sits below, scrolling sideways when long.

From 1024px the gallery is `grid-cols-[4.5rem_minmax(0,1fr)]`, with thumbnails in the first column. The list is `lg:h-0 lg:min-h-full lg:overflow-y-auto`, so it never sets the row height and scrolls when it holds more images than the frame is tall. With one image, the frame spans both columns.

Between 768px and 1023px the thumbnails stay in a row under the frame. The browser pass showed a 4.5rem column shrinking the frame to 232px in a 320px gallery column.

The gallery's width is capped at `100svh` less the header, the breadcrumb, the "View larger" row and the bar. On a short laptop (1366×768, 1440×900) the whole square then sits above the bar on load and while sticky.

Slide, lens and viewer logic are unchanged.

### Decision 8 — Native controls for every choice

**Size cards.** Each card is a `radio` in a `fieldset`. The browser gives arrow-key movement inside the group, and the existing `peer-checked` and `peer-focus-visible` styling carries over to a larger card holding the size and, when prices differ, its price. A sold-out card is a disabled radio with a dashed border, the size struck through, and "Sold out" printed where the price would be.

**Add-ons.** Each add-on is a `checkbox` inside a `label` card:

- image (decorative — the name labels the control)
- name
- price
- a text state, "+ Add" or "Added", marked `aria-hidden`

Focus is shown on the card with `has-[:focus-visible]:outline-2`. The card is a square-cornered photograph and text, not a pill, so selection reads by border and the "Added" text.

**Rail scrolling.** The rail is a scroll-snap row inside the inset panel at every width. Previous and next icon buttons call `scrollBy` with 80% of the width. They are disabled at either end and hidden when nothing overflows; this state comes from a scroll listener plus a `ResizeObserver`. The reduced-motion rule already forces `scroll-behavior: auto`.

**Wishlist.** The wishlist is a `Button variant="icon"` with `aria-pressed`, labelled "Save to wishlist". `WishlistIcon` gains a `filled` prop: the file's own comment reserves a filled heart for a state, so it is the same icon, the same stroke, and no budget change. A `role="status"` line shows "Saved · View wishlist" while saved. A second press filters the entry out of `shubha-wishlist`.

### Decision 9 — Copy

- The section is headed "Add-ons".
- Its one line is factual: "Ticked add-ons go in the bag with this piece."
- The total line reads "2 add-ons · ₹740".
- No reference copy is reused.

The breadcrumb's type name comes from the category record via `listCategories()`, falling back to `categoryLabel`. It replaces the category eyebrow, which would repeat it.

### Decision 10 — No add-on is seeded

Add-on names, photographs and prices are business-supplied. BRAND-INPUTS gains an UNFILLED "Add-ons" row pointing at the admin switch.

The browser pass uses two QA add-ons created in the development database and deleted after verification. This follows the precedent of the QA order in `streamline-purchase-flow`.

### Decision 11 — Policy facts are the brand's own words, or nothing

The owner reported that the page lacked authority. The honest fix is to state the business's real policies where the buying decision happens. Trust marks would be invented.

`page.tsx` renders a `<dl>` directly after `ProductPurchase`. It renders server-side because `brand` is a static module.

- **Facts.** Hallmarking, returns and shipping, in that order, each from `brand.policies`.
- **Filtering.** The row keeps only facts that pass `isSupplied`. With none, it renders nothing — not a placeholder.
- **No links.** No policy pages exist yet. The footer's `POLICY_LINKS` point at routes that are not built, so the row states the text in full.
- **Style.** A hairline top border, caption-role labels and body-role values. No icons, badges or new component.

Rejected: trust badges such as "100% secure" or "certified". They make claims the business has not supplied, and CLAUDE.md forbids invented certifications and policies.

## Risks / Trade-offs

- **[A fixed bar on desktop covers content]** → Body padding at every width, and `scroll-padding-bottom` for focus. The related rail and footer are checked at 1440px.
- **[An add-on's own category shows as an empty shop facet]** → Categories need not be active for products to reference them. The admin switch's helper text says to keep add-ons in a hidden category.
- **[A chosen add-on sells out before checkout]** → `quoteCart` already rejects sold-out lines with a message naming the piece.
- **[The client total differs from the server quote]** → A price rule or sale can change between render and checkout, so the bar total is display only. Checkout shows the server's quote, and the order uses it.
- **[An add-on with sizes]** → Only its first buyable, priced variant is offered. Admins create add-ons without sizes. The editor's add-on helper text says so.
- **[Selection is lost on reload]** → Intended. Choosing is not buying, and nothing is written until an action.

## Migration Plan

None. `isAddon` defaults to false, and `$ne: true` treats existing documents as ordinary products.

Rollback is a code revert. The stored flag is then ignored, and any add-ons reappear in listings until they are hidden or deleted.

## Open Questions

- Which add-ons the business sells (names, photographs, prices). This is data entered in admin and changes no code.
