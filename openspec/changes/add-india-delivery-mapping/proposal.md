## Why

Delivery today is a hand-typed list of named areas, each holding pincodes and one charge. Admins cannot edit or switch an area off, there is no state or city mapping, and covering India would mean typing ~19,000 pincodes by hand. The store needs to deliver across India, set charges per city, and see and control which pincodes it serves.

## What Changes

- A **pincode directory** covering India: every pincode mapped to its city (India Post district) and state, loaded from the India Post "All India Pincode Directory" by an import script. Every pincode starts deliverable.
- A **delivery city** record per (state, city) carries an optional charge and a deliverable switch. A city without its own charge uses a new store-wide **default delivery charge**.
- Each pincode carries its own deliverable switch.
- Checkout quotes shipping from pincode → city: the pincode and its city must both be deliverable, and the charge is the city charge or the store default. Free-delivery and coupon waivers are unchanged.
- Admin Delivery page lists cities by state with charge, pincode coverage, and an edit form; a new Pincodes page searches pincodes, toggles one, or bulk-toggles a pasted list.
- **BREAKING** (data): the `DeliveryArea` model is removed. Existing area documents are ignored; the seeded "Mumbai ₹250" area is replaced by setting a charge on the Mumbai city.

## Capabilities

### Modified Capabilities

- `commerce/fulfillment`: served pincodes come from the India directory; charges are per city with a store default.
- `admin/panel`: delivery configuration becomes city charges, city and pincode switches, and the default charge.

## Impact

- New collections `pincodes` and `deliverycities`; `Settings.defaultDeliveryCharge`.
- New `data/india-pincodes.csv` (~19k rows, derived from data.gov.in under the Government Open Data License – India) and `npm run import:pincodes`.
- `lib/commerce/quote.ts` lookup changes; `deliveryAreaName` keeps its name (now "City, State"), so checkout, orders, and reports are untouched.
