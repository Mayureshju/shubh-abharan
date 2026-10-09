## Why

The left filter column takes a quarter of the desktop width and pushes the grid into a narrow column. A filter bar above the grid keeps every option one click away and gives the pieces the full width.

## What Changes

- From 1024px the filters sit in a bar above the grid instead of a left column: type and tag chips on the first row; price bands and availability chips on the second, with the "n–m of N" range and a sort select at its end.
- Chips are plain links: one click applies, the page resets to 1, and they work without script. The sort select navigates on change and falls back to a submit button without script.
- Price is chosen from four bands (up to ₹25,000; ₹25,000–₹50,000; ₹50,000–₹1,00,000; from ₹1,00,000) mapped onto the existing `min`/`max` parameters. A custom range from the URL or the phone sheet shows as its own active chip.
- The grid spans the full width (three up from 1024px, as on collections).
- Below 1024px the existing filter sheet stays (at 768px the bar wraps to over 500px and buries the grid).
- Supersedes `paginate-shop-listing`'s sticky filter column.

## Non-goals

- No rating or popularity filters (the shop spec forbids them, and there are no reviews).
- No per-option counts.

## Impact

- `app/(storefront)/shop/page.tsx`, new `components/shop/FilterBar.tsx`, `app/globals.css` (comment only).
- Query parameters, the phone sheet, collections and the wishlist are unchanged.
