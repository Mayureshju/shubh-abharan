## 1. Model

- [x] 1.1 Replace DeliveryArea with Pincode and DeliveryCity models; add Settings.defaultDeliveryCharge
- [x] 1.2 Drop the Mumbai DeliveryArea seed

## 2. Data

- [x] 2.1 Import script reads the India Post directory by header, normalises names, picks the majority district, upserts without resetting switches; `--out` writes the compact CSV
- [x] 2.2 Commit data/india-pincodes.csv; add `npm run import:pincodes`

## 3. Checkout

- [x] 3.1 quoteCart resolves pincode → city, requires both active, charges city charge or store default

## 4. Admin

- [x] 4.1 saveDeliveryCity and setPincodesActive actions; saveSettings saves the default charge
- [x] 4.2 Delivery page: cities by state, coverage, charge, edit form, store settings
- [x] 4.3 Pincodes page: search, state and status filters, row toggle, bulk paste

## 5. Verify

- [x] 5.1 Import counts; re-import keeps a switched-off pincode off
- [x] 5.2 Quote checks: city charge, default charge, pincode off, city off, unknown pincode, free-delivery waiver
- [x] 5.3 Lint, typecheck, check, build
- [ ] 5.4 Browser check of both admin pages at desktop and mobile widths, keyboard only

## Notes

- Dataset: data.gov.in `Pincode_30052019.csv` (155,599 post offices → 19,252 pincodes, 703 cities, 36 states/UTs). The live data.gov.in API needs a key and was unreachable, so the 2019 bulk file was used.
- `npm run lint` reports 5 pre-existing errors in files this change does not touch (cart page, reports page, CartProvider, RowSlider, `let subtotal` in quote.ts). Files changed here lint clean.
