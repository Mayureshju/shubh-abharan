## Context

`build-commerce-platform` modelled delivery as `DeliveryArea { name, pincodes[], charge }`, looked up by `quoteCart` with `findOne({ pincodes: pin })`. India has ~19,000 pincodes in ~700 districts; arrays of pincodes inside area documents do not scale to that, and admins think in cities and states, not hand-made areas.

## Goals / Non-Goals

**Goals:** cover every Indian pincode with its city and state; per-city charges; per-pincode and per-city deliverable switches; keep checkout, orders, and reports unchanged.

**Non-goals:** per-pincode charge overrides, CSV upload from the admin, checkout city/state autofill, delivery timeframes, courier integration.

## Decisions

1. **Two collections: `Pincode` and `DeliveryCity`.** `Pincode { pincode, state, city, isActive }` and `DeliveryCity { state, name, charge|null, isActive }`. A pincode is served when both it and its city are active. A city switch therefore never overwrites pincode-level choices. Rejected: one collection with the charge copied onto every pincode — a city charge edit would rewrite hundreds of documents and a city switch would destroy pincode choices.
2. **"City" is the India Post district.** The directory has no city field; district is the only official grouping of pincodes. Names are title-cased and a short alias list fixes known misspellings (e.g. "Mumbai Subueban", "Kasargod") and abbreviated state names ("Megalaya", "Andaman and Nico.In.").
3. **One district per pincode by majority.** ~1,600 pincodes are listed under more than one district across their post offices; the district named by most offices wins. Ties go to the first seen.
4. **Charge fallback.** `DeliveryCity.charge` is paise or `null`; `null` uses `Settings.defaultDeliveryCharge` (paise, default 0). Admins set one default and override only the cities that differ.
5. **Committed compact dataset.** `data/india-pincodes.csv` holds `pincode,district,statename` (one row per pincode). The import script reads columns by header name, so it loads this file or a fresh full India Post export; `--out` writes a new compact file. Source: data.gov.in "All India Pincode Directory" (2019-05-30 snapshot, the latest bulk file reachable without an API key).
6. **Import never resets admin choices.** Pincodes upsert with `$set {state, city}` and `$setOnInsert {isActive: true}`; cities upsert with `$setOnInsert {charge: null, isActive: true}`.
7. **`deliveryAreaName` is kept** on the quote and order and now reads "City, State", so checkout's served-area guard, order snapshots, and reports need no change.

## Risks / Trade-offs

- The 2019 snapshot predates some district reorganisations (e.g. Andhra Pradesh 2022, Ladakh UT). Mitigation: re-run the import on a newer export; existing switches are kept, but pincodes that move to a new district fall under a new city with the default charge.
- Removing `DeliveryArea` drops the seeded Mumbai charge. Mitigation: set it on the Mumbai city after import.

## Migration Plan

1. Deploy code. 2. `npm run import:pincodes`. 3. Set the default charge and any city charges in Admin → Delivery. Old `deliveryareas` documents can be dropped at leisure.
