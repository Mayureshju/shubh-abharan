## 1. Filter bar

- [x] 1.1 `FilterBar`: type/tag row, price/availability row, range and sort select; chips are links via `shopHref`
- [x] 1.2 Shop page: bar replaces the aside from 1024px; grid spans full width; sheet below 1024px

## 2. Verify

- [x] 2.1 `npm run check`, `npm run build`
- [x] 2.2 Browser at 1440, 768 and 390: chips apply and reset page, custom range chip, sort select, keyboard focus, no console errors

## Notes

- 2.1: typecheck, contrast, slop, catalog, checkout and shop checks pass; `npm run build` passes. `npm run lint` fails on two existing errors in `app/admin/reports/page.tsx` and `components/home/RowSlider.tsx`, untouched by this change; the touched files lint clean.
- 2.2: at 1440, chips keep the other filters and drop `page`; `?min=30000` shows an active "From ₹30,000" chip; the sort select navigates and keeps the filters; the focus ring is visible on chips; no console errors. At 1024 the bar is 351px tall and fits the grid above the fold; 768 and 390 show the Filter sheet button, with no horizontal scroll at any width.
