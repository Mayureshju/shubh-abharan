## Context

See proposal.md for motivation. The storefront already talks to an async catalog repository over in-memory fixtures. Next.js 16 App Router, Tailwind 4, existing editorial tokens. `MONGO_URI` exists. No auth, cart, or admin code. Clerk on Next 16 uses `proxy.ts` and `await auth()`. Razorpay amounts are paise.

## Goals / Non-Goals

**Goals:**

- One mongoose connection and one set of models that storefront, admin, and checkout share.
- Catalog types remain the storefront contract; Mongo documents map into them.
- One pricing resolver and one quote function; checkout never trusts client money.
- Admin uses existing type/color tokens, not a second component library.

**Non-Goals:**

- GST, live gold rates, inventory counts, Cloudinary as a hard dependency, Clerk Organizations.

## Decisions

1. **Clerk `publicMetadata.role`** — single-brand store; Organizations would be unused ceremony. Alternative: env email allowlist only — too brittle for multiple admins.

2. **Mongoose models + mapper** — keep `lib/catalog/types.ts` as the UI contract so shop/PDP do not import mongoose. Alternative: use Mongo documents directly in pages — leaks persistence into UI.

3. **`isSize` expands to variants** — cart stays variant-id based. Same list/sale price copied per size unless a per-size override exists. Alternative: product-level price only — breaks the existing cart line shape.

4. **Next.js route group `(storefront)`** — admin must not inherit editorial chrome. Alternative: hide header with pathname checks in the client header — leaks admin into the storefront shell.

5. **Server actions for admin/cart; route handlers for webhooks and Razorpay create-order** — webhooks need raw bodies. Alternative: all REST — more boilerplate for form UIs.

6. **Guest cart in `localStorage`, merge on sign-in** — jewelry browsers often add before account. Alternative: cookie cart — still client state, worse for size.

7. **Razorpay webhook is source of truth; browser HMAC is UX** — matches Razorpay's capture model. Alternative: trust handler response only — lost orders when the tab closes.

8. **Seed fixtures once** — idempotent upsert by slug so `npm run seed` is safe. Structural unpriced fixtures are seeded too so catalog checks still have referents; merch is what shoppers see as priced.

9. **Image URLs** — store paths; local upload writes `public/uploads`. Cloudinary is optional later.

10. **Shop filters load categories from Mongo** — `CATEGORY_ORDER` becomes a runtime list with a seeded fallback order.

## Risks / Trade-offs

- [Missing Clerk/Razorpay keys] → Code reads env by name; storefront still renders catalog if Mongo is up. Checkout and admin auth fail closed.
- [Hot-reload model recompile] → Guard `models.X || model(...)`.
- [Sale vs anti-slop] → Allow `salePrice` in check-catalog; keep rating/stock/badge forbidden; UI uses struck type, not a pill.
- [PDP `generateStaticParams`] → Remove; catalog is live. Trade-off: slightly slower first PDP vs stale static pages.
- [Webhook retries] → Store processed Razorpay event ids.

## Migration Plan

1. Add models and seed.
2. Point repository at Mongo; keep fixture modules for seed + integrity script.
3. Ship Clerk + admin + checkout.
4. Rollback: revert repository to fixtures; Mongo data remains for re-apply.

## Open Questions

None that change the specs. First admin is granted in the Clerk dashboard.
