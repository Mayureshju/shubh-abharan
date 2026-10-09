## 1. Pagination

- [x] 1.1 `query.ts`: parse `page` (positive integer); keep it out of `shopQueryKey` and `shopHasFilters`
- [x] 1.2 Shop page slices 12 per page, clamps out-of-range pages, count label shows the total
- [x] 1.3 `Pagination`: previous/next + numbered links with gaps from 768px; previous/"n of N"/next below

## 2. Sticky filters

- [x] 2.1 Aside sticks below the header from 768px with internal scroll

## 3. Verify

- [x] 3.1 `npm run typecheck`, lint on touched files, `npm run build`
- [x] 3.2 Browser at 1440 and 390: sticky aside, pagination links, filters reset page, keyboard focus

## Notes

- 3.2 verified on the dev server with the page size temporarily at 3 and 6 (the catalog has 8 pieces, so at 12 it is one page and pagination hides): links keep `sort`, page 2 shows the remainder, count shows the total, aside sticks at 1440 and releases at the grid end, Apply stays pinned. At 390 the row is "Previous · 1 of 2 · Next" and the page has no horizontal scroll after the header fix. No console errors. `npm run build` passes.
