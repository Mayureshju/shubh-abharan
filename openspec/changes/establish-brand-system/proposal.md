## Why

The repository is an unmodified `create-next-app` scaffold: Geist fonts, an Arial body fallback, a two-token `globals.css`, and Next.js logos in `public/`. Every storefront change that follows — homepage, collections, product detail, cart — will need typography, spacing, surfaces, components, and motion. Without a defined system first, each page invents its own, and the result converges on the generic template that `CLAUDE.md` and the project's jewelry skills exist to prevent.

This change establishes the design system and reusable foundations only. It builds no storefront pages.

## What Changes

**Visual direction — the "Specimen" register.** A gemological/museum visual language: macro photography on stone and paper, annotated dimensions, hairline rules, numbered plates, and deliberately small caption type. Two commitments drive every token:

- **Scale is the grammar.** Every image plays a declared role — `macro`, `scale`, `worn`, or `detail` — and the type scale is intentionally bimodal (something genuinely large, something genuinely small, little between) to mirror the gap between a piece's real size and its presented size.
- **Gold is a material, not a colour.** The token palette is achromatic — paper, ink, graphite, hairline. No metal hex value exists anywhere in the system. All chroma enters through photography.

**Brand inputs are supplied, not invented.** The brand is real and will be provided. This change ships a `BRAND-INPUTS.md` sheet enumerating every brand-owned value the system needs (wordmark, brand name, voice notes, collection names, materials vocabulary, policy facts) and wires tokens to read from a single `brand.ts` module. Placeholders are neutral and clearly marked. No brand claims, materials, certifications, reviews, prices, or policies are fabricated.

Specifically, this change adds:

- **Typography system** — self-hosted variable faces via `next/font/local` (Fontshare-first, Google as fallback pool), a four-step bimodal scale (`display` / `title` / `body` / `caption`), tracking and measure rules. Removes Geist and the Arial body fallback.
- **Colour tokens** — achromatic surfaces (`paper`, `ink`, `graphite`, `hairline`) as Tailwind v4 `@theme` tokens. Exactly two surfaces; no third.
- **Spacing system** — a base scale plus three named *section rhythms* (`tight` / `normal` / `breath`) with composition rules that forbid uniform vertical rhythm.
- **Border and surface language** — radius `0` on surfaces, images, and buttons (`2px` maximum on form inputs); hairline rules instead of elevation; `box-shadow` restricted to overlay surfaces.
- **Button system** — a small set of real variants (primary, quiet, inline-link, icon-only) with defined focus, hover, disabled, and pending states. No pill geometry.
- **Navigation system** — collection-led header structure: named collections are primary, product type is demoted to a `/shop` facet. Defines header, nav overlay, and footer *contracts and states*; the wired storefront shell is a later change.
- **Product-card system** — a card driven by image role rather than a fixed template, supporting varied aspect ratios and grid spans so listings never render as a uniform three-column row.
- **Image treatment** — a single `Plate` primitive through which every image on the site is rendered. Owns aspect ratio, role, caption placement, and reveal. Role-typed neutral placeholder plates for development.
- **Editorial layout rules** — a 12-column grid with *measure decoupled from container*: text caps at ~62ch and is positioned by the grid; images run to full-bleed independently. No global centred max-width wrapper.
- **Motion tokens** — four durations, two easing curves, and orchestration budgets (one staggered sequence per route; reveal travel 12–16px; hover scale ≤1.03). A single `Reveal` primitive is the only scroll-triggered animation in the codebase.
- **Interaction principles** — hover, focus, press, pending, and success feedback rules; state change never waits on animation.
- **Mobile behaviour** — mobile as a distinct composition (full-bleed imagery, horizontal rails, bottom sheets, one-hand reach), not a narrowed desktop layout. Caption type stays small on mobile.
- **Accessibility rules** — focus visibility, contrast floors, semantic heading order, touch target minimums, screen-reader names for icon-only controls, and a reduced-motion contract that preserves feedback rather than deleting it.
- **Anti-AI-slop rules** — a numbered, checkable ruleset (no gradients, no `backdrop-filter`, no content elevation, no metal hex, section-to-section variation, copy must carry a measurable fact or photographable noun) that later changes are reviewed against.
- **A `/specimen` route** — an internal, non-indexed page rendering the full token set and every component state. This is the acceptance surface for this change; without it the system cannot be visually verified before pages are built on it.

## Capabilities

### New Capabilities

- `design-system/visual-language`: Brand visual direction, typography scale and faces, colour tokens, spacing and section rhythm, border and surface language, editorial grid and layout rules, and the enforceable anti-AI-slop ruleset.
- `design-system/motion-language`: Motion tokens (durations, easings, travel and scale budgets), the single scroll-reveal primitive, orchestration limits, interaction and feedback principles, and the reduced-motion contract.
- `design-system/core-components`: Button system, navigation contracts (header, nav overlay, footer), product-card system, and the `Plate` image primitive including role-typed placeholders.
- `design-system/responsive-accessibility`: Mobile-first composition rules and breakpoint behaviour, plus accessibility requirements — focus, contrast, semantics, targets, and assistive naming — that all later storefront changes must satisfy.

### Modified Capabilities

None. `openspec/specs/` is currently empty; this change introduces the first capabilities.

## Impact

**Code**
- `app/layout.tsx` — replaces Geist wiring with the brand faces; sets real metadata.
- `app/globals.css` — replaced: Tailwind v4 `@theme` token layer, the Arial body fallback removed, the default light/dark `prefers-color-scheme` block reconsidered against the paper/ink surface model.
- `app/page.tsx` — the scaffold placeholder is out of scope here and is replaced by the `build-homepage` change. This change leaves it alone or reduces it to a stub.
- New: `lib/tokens.ts`, `lib/brand.ts`, `components/primitives/Reveal.tsx`, `components/editorial/Plate.tsx`, `components/ui/Button.tsx`, `components/product/ProductCard.tsx`, navigation component contracts, `app/specimen/page.tsx`.
- New: `BRAND-INPUTS.md` at the repo root.
- `public/` — Next.js scaffold SVGs removed; placeholder plate assets added.

**Dependencies**
- Self-hosted font files added under `app/fonts/` (Fontshare licences verified per family before use). No new npm dependencies expected.
- `motion@^13.4.0` is already installed and is imported only inside client islands, via `LazyMotion` + `m` to keep the bundle off the server tree.

**Downstream**
- `build-storefront-shell`, `build-homepage`, `build-shop-and-collections`, `build-product-detail`, and `build-cart-and-wishlist` all consume these tokens and primitives. Token or component contract changes after this lands will ripple into those changes.

**Blocking input**
- Brand name, wordmark, voice notes, collection names, and materials vocabulary must be supplied via `BRAND-INPUTS.md` before the system can be considered complete. The system is buildable without them — placeholders are explicit and neutral — but must not be presented as finished brand work until they are filled.

**Not in scope**
- Any storefront page, the catalog data model, cart state, search, filtering, checkout, and real product photography.
