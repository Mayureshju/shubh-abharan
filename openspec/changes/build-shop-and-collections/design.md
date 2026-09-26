## Context

See proposal.md for motivation. `listProducts` already filters by category, availability, price, and sort. Occasion listings exist; `/shop`, `/types`, `/collections`, and `/contact` do not. `NavOverlay` already implements the native `<dialog>` behaviour the responsive spec requires for overlays. Contact email and address are `null`.

## Goals / Non-Goals

**Goals:**

- Query-parameter shop that works as a GET form without script.
- One dialog primitive shared by the nav overlay and the filter sheet.
- Type index and collection pages that resolve existing shell and homepage links.
- Contact form that is honest about unsent mail.

**Non-Goals:**

- Variant-axis filters (fixture option values are placeholders).
- Hiding structural fixtures from the shop (no published flag exists).
- An email API, phone, hours, or filled brand contact fields.
- A second animation runtime.

## Decisions

### Decision 1 — Filters live in the URL

Shop state is `category`, `sort`, `availability`, `min`, and `max` query parameters. The page is a server component that awaits `searchParams`, parses them with type guards, and calls `listProducts`. Unknown values are dropped, not 404s.

Price bounds are major units in the URL and `* 100` for the catalog's minor-unit criteria, matching `formatMoney`.

Rejected: client-only filter state. It would break the script-free destination rule and hide the listing from shareable URLs.

Rejected: path-based `/shop/rings`. Navigation already contracts type as a shop facet, not a route tree.

### Decision 2 — One native dialog, two geometries

Extract `ModalDialog` from `NavOverlay`: `showModal()`, cancel interception, scroll lock, `AnimatePresence` close. Placement `overlay` is full viewport (nav). Placement `sheet` is `mt-auto` / max-height ~85vh with controls in the lower viewport (filters).

Rejected: a second focus-trap wrapper. DESIGN-SYSTEM.md already forbids it.

Rejected: CSS-only mobile accordion. The responsive spec requires a bottom sheet with focus containment.

### Decision 3 — GET form is the filter UI

`ShopFilters` is one GET form. Desktop renders it in a three-column aside. Mobile opens the same fields inside the sheet. Submit is `Apply`. Category is radios including an all-pieces option so sort and price submit together.

Clear filters is a link to `/shop`.

### Decision 4 — Type index is a page, not a redirect

`/types` reuses the photographed homepage type list, including Bangles → `bracelet`. Shop facets list the full category union, including `set`. No `/types/[slug]` routes.

Rejected: redirect `/types` → `/shop`. The business asked for a category destination in primary nav; an index is the permitted form.

### Decision 5 — Contact submit is mailto or an unsent notice

The form is a client island. If `contactEmail` is supplied, submit composes `mailto:`. If not, it states the message was not sent. Address omits when null. No `app/api` route.

Rejected: a fake success toast. It would invent a support process.

### Decision 6 — Shop listing is an editorial grid, not featured-set

`.shop-set` stacks on mobile and uses an asymmetric spanning grid from 768px so four-plus cards are not a uniform repeating row. Collection pages reuse the grid without filter chrome.

## Risks / Trade-offs

- [Structural fixtures appear in `/shop`] → Honest; there is no published flag. Replacing fixtures is a data edit.
- [mailto: is unreliable on some desktop browsers] → Documented limitation; still more honest than a backend that does not exist.
- [Two copies of the filter form in the DOM at `md`] → Distinct field ids (`desktop-` / `sheet-`); desktop form is `hidden` below 768px and the sheet trigger is `md:hidden`.

## Migration

No data migration. Downstream cart/search work is unchanged. Update the DESIGN-SYSTEM.md owed-routes table so shop, types, collections, and contact are no longer listed as missing.
