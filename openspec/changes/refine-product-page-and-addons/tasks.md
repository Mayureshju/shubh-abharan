## 1. Catalog: the add-on flag

- [ ] 1.1 `ProductSchema.isAddon` (default false); `Product.isAddon?`; `mapProduct` maps it
- [ ] 1.2 `listProducts` and `getProductsBySlugs` filter `isAddon: { $ne: true }`; single reads stay unfiltered
- [ ] 1.3 `listAddons()`: active add-ons sorted by `_id`, exported from `lib/catalog/index.ts`

## 2. Admin

- [ ] 2.1 Product editor "Add-on" switch with helper text: no sizes, keep them in a hidden category
- [ ] 2.2 `saveProduct` persists `isAddon`
- [ ] 2.3 Product list marks add-ons

## 3. Purchase panel

- [ ] 3.1 `ProductPurchase` replaces `AddToBag`:
  - name row with the `aria-pressed` wishlist toggle (save and remove)
  - "Saved · View wishlist" status
  - selected-size price with struck compare
  - material line
- [ ] 3.2 Size cards: radios in a fieldset, price when sizes differ, "Sold out" text on disabled cards, focus ring
- [ ] 3.3 `AddonRail`:
  - checkbox cards with decorative image, name, price and an "+ Add"/"Added" text state
  - full-bleed scroll-snap row on phones
  - previous/next from 768px only when it overflows
  - "n add-ons · ₹x" line
- [ ] 3.4 Buy now and Add to bag include the chosen add-ons; Buy now never raises an existing line; the choice persists after Add to bag
- [ ] 3.5 Fixed bar at every width:
  - phone: halves, "Buy now · total"
  - from 768px: summary on the left, actions under the details column
  - safe-area padding
- [ ] 3.6 `WishlistIcon` `filled` prop; icon budget unchanged

## 4. Page and gallery

- [ ] 4.1 PDP page:
  - breadcrumb (Home › type › name) replaces the eyebrow
  - `PDP_COLUMNS` grid; sticky gallery; details column unsticky
  - add-on options built on the server: first buyable priced variant; none on an add-on's own page or an unbuyable piece
- [ ] 4.2 `ProductGallery`: full-bleed slides and a thumbnail row on phones; thumbnail column beside the frame from 768px
- [ ] 4.3 `globals.css`: bar padding and `scroll-padding-bottom` at every width. Re-read the file first: other work edits it.
- [ ] 4.4 Delete `AddToBag.tsx`; nothing else imports it

## 5. Records

- [ ] 5.1 `BRAND-INPUTS.md`: UNFILLED "Add-ons" row pointing at the admin switch
- [ ] 5.2 `DESIGN-SYSTEM.md`: purchase bar at every width; add-ons are flagged products excluded in the repository

## 6. Verify

- [ ] 6.1 `npm run typecheck`, lint on touched files, `npm run build`, and the `npm run check` scripts this change touches
- [ ] 6.2 Create two QA add-ons in the development database for the browser pass; delete them afterwards
- [ ] 6.3 Browser at 390, 768 and 1440:
  - breadcrumb, gallery and thumbnails
  - size cards and price update
  - add-on tick, keyboard and arrows
  - totals; Buy now (no doubling) and Add to bag (drawer)
  - wishlist toggle
  - bar never covers the footer or a focused control
  - no horizontal scroll; console clean
- [ ] 6.4 Add-ons absent from the shop, search and related; the rail is absent on an add-on's own page and with no add-ons
- [ ] 6.5 Reduced motion emulated: rail and gallery scroll without smooth travel; nothing hidden
