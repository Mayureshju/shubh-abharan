## 1. Grid and page size

- [x] 1.1 `.shop-set`: two columns, three from 768px, four from 1024px, five from 1280px; listing and wishlist `sizes`
- [x] 1.2 `PAGE_SIZE` 20

## 2. Desktop menus

- [x] 2.1 `filters.ts`: `shopFilterMenus` builds the groups, current values, sort and the clear link from the query
- [x] 2.2 `FilterBar`: one row of `<details>` menus and a Sort menu; close on outside click, focus leaving, Escape and a choice; `ChevronIcon`

## 3. Phone bar and sheet

- [x] 3.1 `FilterSheet`: bar fixed to the bottom below 1024px with the count and "Filter (n)"; sheet of chip links with "Show N pieces"; page and focus padding under the bar
- [x] 3.2 Shop page wiring; delete `ShopFilters` and `shopQueryKey`

## 4. Verify

- [x] 4.1 `npm run check`, `npm run build`, `openspec validate shop-filter-menus --strict`
- [x] 4.2 Browser at 1440, 1280, 1024, 768 and 390: menus by pointer and keyboard, page reset, custom range option, sort, grid columns, phone bar and sheet, focus return, no horizontal scroll, no console errors

## Notes

- 4.1: typecheck, contrast, slop, catalog, checkout and shop checks pass; `openspec validate --strict` and `npm run build` pass. `npm run lint` fails on the two existing errors in `app/admin/reports/page.tsx` and `components/home/RowSlider.tsx`, untouched by this change; the touched files lint clean.
- 4.2: the grid is five up at 1440 and 1280 (221px cards), four at 1024, three at 768 and two at 390. Menus open on click, Enter and Space, one at a time; Escape and a choice return focus to the trigger; tabbing out or clicking outside closes them. A choice drops `page` and keeps the other filters, and the trigger shows the value. `?min=30000` shows a current "From ₹30,000" option. With only sort set there is no Clear link. At 1024 with every filter set the bar wraps to two lines, no panel passes the edge, and there is no horizontal scroll. The server HTML carries the menus and their links, so they work without script.
- 4.2, phone: at 390 the bar precedes the grid in reading order. A tap keeps the sheet open with focus on the chip and "Show 1 piece"; closing returns focus to "Filter (1)". The footer's last line clears the bar, and a focused Next link lands above it. Pagination was checked with the page size at 3. No console errors (only Clerk's development-key warning).
- During verification the in-progress `refine-product-page-and-addons` began leaving add-ons out of listings, so the shop went from 8 pieces to 5 and the Tag menu hid itself: no listed piece carries a tag.
