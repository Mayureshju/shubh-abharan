## Why

The desktop filter bar wraps into three rows of chips (type and tag; price; availability, range and sort) and pushes the pieces below the fold. On a phone the filter sheet is a long radio list that scrolls inside itself, and its only entry sits beside the heading, ten rows of cards away once the customer is browsing.

## What Changes

- From 1024px, Type, Price, Availability and Tag are menus in one row above the grid, with the "n–m of N" range and a Sort menu at its end. A menu opens on click, tap, Enter or Space and closes on Escape, a click outside, or a choice; focus returns to its trigger. Options are links: one activation applies, the page resets to 1, and they work without script. A trigger shows its current value. Sort becomes a menu of links like the others, replacing the select and its no-script submit.
- The grid is two columns below 768px, three from 768px, four from 1024px and five from 1280px, on the shop, collections and the wishlist alike.
- The shop lists 20 pieces per page instead of 12.
- Below 1024px a bar is fixed to the bottom of the screen with the piece count and "Filter (n)". It opens the bottom sheet, which now shows each group as chips that apply on tap while the sheet stays open; "Show N pieces" closes it. Price is chosen from the same four bands as desktop; the typed minimum and maximum fields go. A range from the URL that matches no band still shows as its own current chip.
- Supersedes `shop-filter-bar`'s chip rows and sort select, `paginate-shop-listing`'s page size, `streamline-purchase-flow`'s column counts and `build-shop-and-collections`' GET filter form.

## Non-goals

- No hover-open menus: they open by accident while the pointer crosses the bar, and fight the click toggle.
- No typed price range, no per-option counts, no rating or popularity filters.
- Phones without script still have no filter entry, as today: the sheet needs script to open.

## Impact

- `app/(storefront)/shop/page.tsx`, new `components/shop/filters.ts`, `components/shop/FilterBar.tsx` and `FilterSheet.tsx` (rewritten), `components/shop/ShopFilters.tsx` (deleted), `components/shop/query.ts` (`shopQueryKey` deleted), `components/shop/pages.ts`, `components/shop/ProductListing.tsx`, `app/(storefront)/wishlist/page.tsx` (image `sizes`), `components/ui/icons.tsx` (chevron, eleven of twelve), `app/globals.css` (`.shop-set` columns, page and focus padding under the bar).
- Query parameters are unchanged.
- Archive after `build-shop-and-collections`, `streamline-purchase-flow`, `paginate-shop-listing` and `shop-filter-bar`: this delta renames and modifies requirements they add.
