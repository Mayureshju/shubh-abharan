## Why

The product page is where a visit turns into an order, and most customers open it on a phone. The business shared a reference product page and wants ours to work the same way:

- the price of the chosen option is shown large
- options are presented as cards
- small gift add-ons can go in the bag with the piece
- the purchase actions never leave the screen

Today the page has gaps against that reference:

- It shows a "From" price.
- Sizes are plain chips.
- There is no way to offer add-ons.
- Buy now and Add to bag stay pinned only on phones. On a desktop they scroll away once the details column grows.

## What Changes

- **Breadcrumb.** A breadcrumb (Home › type › piece) replaces the category eyebrow above the name.
- **Gallery.** On a phone, the image runs full-bleed with a thumbnail row beneath. From 768px, the thumbnails form a column beside the image, and the gallery stays in view while the details scroll.
- **Name and wishlist.** The name carries a wishlist heart that saves and removes in place. A saved piece shows "Saved · View wishlist".
- **Price.** The price of the selected size is shown large, with its compare price struck through when higher.
- **Size cards.** Sizes are cards. A card shows its own price when the sizes differ in price. A sold-out card says "Sold out" and cannot be chosen.
- **Add-ons.** Products an admin marks as add-ons appear in a rail on every other product page.
  - A customer ticks the add-ons they want.
  - Add to bag and Buy now put the ticked add-ons in the bag with the piece.
  - Buy now shows the piece plus add-ons total.
  - The rail is omitted when there are no add-ons, on an add-on's own page, and when the piece cannot be bought.
- **Purchase bar.** The purchase bar is fixed to the bottom at every width; it was phones only.
  - Phone: Add to bag and "Buy now · total" sit side by side.
  - From 768px: a summary of the selection sits on the left, and the actions sit under the details column.
- **Catalog.** Products gain an `isAddon` flag.
  - Shop, search, occasions, related pieces and the new/featured flags leave add-ons out.
  - A new read lists the active add-ons.
  - An add-on keeps its own product page, so bag and order links still resolve.
- **Admin.** The product editor gains an "Add-on" switch, and the product list marks add-ons.
- **Not taken from the reference:**
  - The star rating and review count. The product model has no such field, by rule.
  - The WhatsApp button.
  - The delivery-date picker. No delivery times are supplied.
  - The offers drawer.
  - The statistics row.
  - The line "Make it extra special". It is generic marketing copy, so the section is headed "Add-ons".

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `storefront/product-detail`:
  - adds the breadcrumb, the selected-size price and the add-ons
  - presents sizes as cards
  - makes the wishlist a toggle beside the name
  - fixes the purchase bar at every width and shows the total
- `catalog/product-model`: a product may be flagged as an add-on.
- `catalog/catalog-access`: listings exclude add-ons, and a dedicated read lists them.
- `admin/panel`: the product editor covers the add-on flag.

## Impact

**Code**

- `app/(storefront)/products/[slug]/page.tsx`
- `components/product/ProductGallery.tsx`
- `components/product/AddToBag.tsx`, replaced by `components/product/ProductPurchase.tsx`. It holds the name, wishlist, price, size cards, add-ons, delivery check and bar.
- New `components/product/AddonRail.tsx`
- `components/ui/icons.tsx`: `WishlistIcon` gains a filled state. It is not a new icon, so the budget is unchanged.
- `app/globals.css`: bar padding and focus scroll padding at every width.
- `lib/db/models.ts`, `lib/catalog/types.ts`, `lib/catalog/mapDoc.ts`, `lib/catalog/repository.ts`, `lib/catalog/index.ts`
- `app/admin/products/[slug]/page.tsx`, `app/admin/products/page.tsx`, `lib/actions/admin-catalog.ts`
- `DESIGN-SYSTEM.md`, `BRAND-INPUTS.md`

**Data**

`isAddon` defaults to false. Existing products, bags and orders read unchanged, and nothing needs migrating. Add-on lines are ordinary bag lines, so quote, checkout, coupons and orders are untouched.

**Dependencies**

None new.

**Not in scope**

- Choosing add-ons per product. Every product page offers the same set.
- Reordering add-ons. They show in the order they were created.
- An add-on quantity on the product page. Quantity is edited in the bag.
- Variant axes other than size in the selector.
- Ratings, reviews and a WhatsApp contact.
