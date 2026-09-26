## Why

The shell already links to `/shop`, `/types`, `/collections`, and `/contact`, and every one of those routes 404s. Catalog listing, category filtering, and collection membership already exist; customers cannot use them. This change opens those destinations and adds the shop's type filter, including sort, price, and availability, without inventing contact facts or a mail backend.

## What Changes

- `/shop` lists catalog products and filters them through query parameters: `category`, `sort`, `availability`, `min`, `max`.
- At mobile widths, those filters present as a bottom sheet built on the same native `<dialog>` pattern as the navigation overlay.
- `/types` is an index of photographed product types whose entries resolve to `/shop?category=`, not to a parallel per-type route tree.
- `/collections` and `/collections/[slug]` list brand collections and their products in declared order.
- `/contact` shows supplied contact fields and a message form. Submit uses `mailto:` when an email is supplied, and otherwise states that nothing was sent.

## Capabilities

### New Capabilities

- `storefront/shop`: The shop listing, its query-parameter filters, the type index, collection listings, empty states, and the mobile filter sheet.
- `storefront/contact`: The contact page, brand-owned contact fields, and the local/mailto message form.

### Modified Capabilities

- `design-system/core-components`: Overlay surfaces share one native `<dialog>` primitive; the filter sheet is that primitive at bottom-sheet geometry rather than a second focus-trap wrapper.

## Impact

**Code**

- `app/shop/page.tsx`, `app/types/page.tsx`, `app/collections/page.tsx`, `app/collections/[slug]/page.tsx`, `app/contact/page.tsx`
- `components/shop/*`, `components/contact/*`, `components/ui` dialog shell
- `components/nav/NavOverlay.tsx` — consumes the shared dialog shell
- `lib/catalog/labels.ts`, catalog barrel
- `app/globals.css` — `.shop-set`
- `DESIGN-SYSTEM.md` routes table

**Dependencies**

None. Motion is already in the tree.

**Not in scope**

About, search, cart, wishlist, an email API, variant-axis filters, filling `BRAND-INPUTS` contact fields.
