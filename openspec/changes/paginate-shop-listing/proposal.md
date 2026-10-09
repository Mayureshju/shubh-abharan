## Why

The shop renders every matching piece on one page, and the filter column scrolls away with the grid. As the catalog grows, browsing gets long and the filters fall out of reach.

## What Changes

- The shop lists 12 pieces per page, selected by a `page` query parameter. Previous/next links and page numbers navigate between pages and keep the active filters.
- Changing a filter or sort returns to page 1.
- From 768px the filter column stays in view while the grid scrolls; it scrolls internally when taller than the viewport.
- Phones show previous/next with "n of N" instead of the number row.
- Signed-in header on phones: the "Orders" text link moves into the avatar menu below 640px; it pushed the menu button off a 390px screen.

## Impact

- `app/(storefront)/shop/page.tsx`, `components/shop/query.ts`, new `components/shop/Pagination.tsx` and `pages.ts`, `components/shop/ShopFilters.tsx` (Apply pinned to the column bottom), `components/auth/AccountControl.tsx`, `scripts/check-shop.mjs`.
- Collections, occasions and the wishlist are unchanged.
