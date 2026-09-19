## Context

See `proposal.md` — Why. The relevant current state: `app/globals.css` declares two colour variables and an `Arial, Helvetica, sans-serif` body rule; `app/layout.tsx` wires Geist and Geist Mono; `openspec/specs/` is empty. Tailwind v4 is installed via `@tailwindcss/postcss` with no config file, so the theme is configured in CSS through `@theme`. `motion@^13.4.0` and React 19 / Next 16 App Router are available.

One constraint shapes several decisions below: **the working directory is not a git repository.** There is no revert path for a change that replaces the scaffold's fonts, stylesheet, and public assets.

## Goals / Non-Goals

**Goals:**
- Make the anti-generic rules *structurally unbuildable* where possible, rather than relying on review discipline.
- Give the system one place per concern: one token layer, one image primitive, one reveal mechanism.
- Keep brand-owned values behind a single typed boundary so real brand inputs drop in without touching components.
- Produce a verifiable acceptance surface — the specimen page — before any storefront page is built on this system.

**Non-Goals:**
- No design-token build pipeline, no Style Dictionary, no generated artifacts. The CSS theme block is the source.
- No component library abstraction layer, no `<Box>`/`<Stack>`/`<Section>` wrappers.
- No theming, no dark mode toggle. `paper` and `ink` are compositional surfaces, not user preferences.
- No storefront pages, no catalog model, no cart state.

## Decisions

### 1. Delete Tailwind's default scales rather than agreeing not to use them

Tailwind v4's `@theme` supports clearing a namespace with `--namespace-*: initial;` before declaring replacements. The system uses this on three namespaces:

```
--color-*:        initial  → then paper, ink, graphite, graphite-inverse, hairline
--radius-*:       initial  → then only radius-input (2px)
--text-*:         initial  → then only display, title, body, caption
--font-*:         initial  → then only display, text
--ease-*:         initial  → then only out, inout, linear
--shadow-*:       initial  ┐
--inset-shadow-*: initial  │ removes every shadow, drop-shadow,
--drop-shadow-*:  initial  │ text-shadow, blur and backdrop-blur utility
--text-shadow-*:  initial  │
--blur-*:         initial  ┘
```

The effect is that `bg-blue-600`, `text-gray-400`, `rounded-2xl`, `text-sm`, `text-3xl`, `shadow-lg`, `drop-shadow-lg`, `blur-sm` and `backdrop-blur-sm` **stop compiling**. Anti-slop rules 2, 3, 5 and 6 become build failures rather than review findings, and no gold hex can enter through a utility class.

**Corrected during implementation (task 2.9).** The original version of this decision claimed `rounded-full` would also stop compiling. It does not. Tailwind v4 implements a handful of utilities as *static* rules with no backing theme namespace, so clearing a namespace cannot remove them. Verified survivors:

| Survivor | Disposition |
| --- | --- |
| `rounded-full`, `rounded-s/e/t/b-full` | caught by `scripts/check-slop.mjs` |
| `bg-gradient-*`, `bg-linear-*`, `bg-radial`, `bg-conic` | caught by `scripts/check-slop.mjs` |
| `rounded-none` | harmless — sets `border-radius: 0`, which is the system default |

Rule 4 (radius) and rule 1 (gradients) are therefore script-enforced, not compiler-enforced. The requirement in `specs/design-system/visual-language` is unchanged and still fully enforced; only the tier that catches it moved. The enforcement table in decision 8 reflects the corrected split.

One consequence worth noting: clearing the shadow namespaces means an overlay that legitimately needs a shadow — permitted by the border-and-surface requirement — must write an arbitrary value such as `shadow-[0_24px_60px_-20px_…]`. That is a net gain. A casual `shadow-lg` is now impossible, and a deliberate overlay shadow is conspicuous in review and greppable by the check script's allowlist.

*Alternative considered:* leave the defaults and enforce by ESLint or code review. Rejected — every generic pattern this change exists to prevent is one autocomplete away, and review pressure decays across five downstream changes.

*Cost:* legitimate future needs (a semantic error colour, a wider type step) require a deliberate token addition. That friction is the point, but it is friction.

### 2. Colour is defined in OKLCH with a chroma ceiling

Tokens are declared in `oklch()` and constrained to **C ≤ 0.02**. Approximate values, to be verified against contrast targets during implementation:

| Token | Approx. | Role |
| --- | --- | --- |
| `paper` | `oklch(96% 0.006 85)` | default surface |
| `ink` | `oklch(18% 0.008 85)` | foreground, inverted surface |
| `graphite` | `oklch(56% 0.008 85)` | secondary text **on paper** |
| `graphite-inverse` | `oklch(68% 0.008 85)` | secondary text **on ink** |
| `hairline` | `ink` @ 14% | rules and borders |

The chroma ceiling is the enforcement mechanism for "gold is a material, not a colour": metallic gold sits around C 0.09–0.13, so any metal tone is an order of magnitude outside the allowed range and is trivially detectable by inspecting the token block. A hex-based palette gives no such handle.

`graphite` splits into two values because a single mid-grey cannot clear 4.5:1 against both surfaces — a mid-tone that passes on paper lands near 3.3:1 on ink, which fails the contrast requirement for caption text. Each surface resolves its own secondary value.

### 3. No error colour

Form validation is communicated with ink text, an increased border weight from hairline to ink, and an inline message — not with a red. This keeps the achromatic requirement intact with no carve-out, and the accessibility spec already forbids communicating state by colour alone, so a red would have been redundant reinforcement rather than the mechanism.

*Alternative considered:* a single `critical` token exempted from the chroma ceiling. Rejected — one exception to an absolute rule is how absolute rules stop being absolute, and the museum-label register this system encodes does not turn red.

### 4. Two Fontshare faces, self-hosted, with a named fallback pool

| Role | Family | Source |
| --- | --- | --- |
| display serif (`display`, `title`) | **Gambarino** | Fontshare |
| grotesque (`body`, `caption`) | **Switzer** (variable) | Fontshare |

Fontshare is chosen over Google Fonts specifically because it is *not* the pool that generated sites draw from — Playfair/Cormorant paired with Inter/Montserrat is itself a recognisable tell. Switzer occupies the Suisse Int'l register without being Helvetica; Gambarino supplies high-contrast display character without being Playfair.

Loaded with `next/font/local` from self-hosted `woff2` under `app/fonts/`, with `display: 'swap'` and fallback metric adjustment enabled so the swap produces no layout shift.

**Licences must be verified per family before files are committed.** If either is unavailable, the pre-named fallback is Fraunces (variable, optical-size axis, `wonk` disabled) for display and Archivo (variable) for the grotesque — both Google, both avoiding the default pairing.

**Verified during implementation (task 1.4).** Both families ship under the **ITF Free Font License v2.0** (identical text in both archives). Section 01 grants free personal and commercial use in perpetuity and states that self-hosting via CSS `@font-face` is "permitted and recommended". **No substitution is required — Gambarino and Switzer are retained** and the Fraunces/Archivo fallback is not used.

Two licence terms constrain implementation and are carried forward:

- **Section 02 prohibits subsetting and format conversion.** The `woff2` files are used exactly as distributed. `next/font/local` is compatible — it copies the file and emits `@font-face` without modifying it — but no subsetting step may be added to the build.
- **Section 02 prohibits redistribution via "publicly accessible servers" or a "repository".** Self-hosting for the licensee's own site is explicitly exempted, so committing the files to a *private* repository for this project is within the grant. **If this repository is ever made public, the font files must be removed from version control** and supplied at build time instead. This is recorded in `DESIGN-SYSTEM.md`.

Gambarino ships a single Regular weight; Switzer ships a variable file covering 100–900. The display serif therefore has one weight, which is sufficient for the two roles it carries.

### 5. The type scale is fluid and deliberately gapped

```
display   clamp(3.25rem, 1.5rem + 7vw, 7.5rem)      52 → 120px   Gambarino, tracking -0.02em
title     clamp(1.75rem, 1.1rem + 2.2vw, 2.75rem)   28 →  44px   Gambarino, tracking -0.01em
body      1.0625rem  / 1.55                              17px    Switzer 400
caption   0.75rem    / 1.35                              12px    Switzer 500, tracking +0.06em
```

`clamp()` on the two large roles is what produces the asymmetric scaling the responsive spec requires: `display` compresses 120→52px across the range while `body` and `caption` are fixed. All sizes are `rem`-based so browser text zoom works; no container is px-locked.

### 6. `Reveal` uses IntersectionObserver and CSS — not Motion

The scroll reveal is the single most-used animation on the site and appears in every section of every page. Implementing it with an observer plus a class toggle costs roughly fifteen lines and zero bundle, and it keeps Motion out of otherwise-static server-rendered sections.

Motion is reserved for the two cases that genuinely need it — the cart drawer and the navigation overlay, both of which require exit animation and focus-coordinated open/close. In those islands Motion is imported as `LazyMotion` + `domAnimation` + `m` rather than the full `motion` export.

*Alternative considered:* Motion's `whileInView` everywhere. Rejected — it pulls the animation runtime into every page for an effect CSS already performs, on the page type most sensitive to bundle weight.

### 7. Motion tokens live in TS; CSS mirrors them; a check asserts they match

`lib/motion.ts` is the source for the four durations and two curves. `globals.css` declares the same six values as custom properties for CSS-driven transitions. A single assertion in the slop-check script compares them.

This is a real, if small, duplication — six values in two files. The alternatives were a build step to generate one from the other, or reading CSS custom properties from JS at runtime; both cost more than the assertion they replace.

### 8. Enforcement is split between the compiler and one grep script

| Rule | Enforced by |
| --- | --- |
| 2 `backdrop-filter`, 3 content shadow, 5 metal colour, 6 type roles | Tailwind theme — **does not compile** |
| 1 gradients, 4 radius (`rounded-*-full` only) | `scripts/check-slop.mjs` — grep, run in `npm run check` |
| 7 stagger budget, 9 centred text, 10 section variation, 11 nav count, 12 icon count, 13 copy rule | review against the specs |
| 8 no rating/review/badge fields | the catalog model's type — a later change |

Revised after task 2.9 — see the correction in decision 1. Rules 2 and 3 moved *up* into the compiler tier once the shadow and blur namespaces were cleared; rules 1 and 4 moved *down* into the script tier because the utilities backing them are static and cannot be removed via the theme.

The script is a plain Node grep over `app/` and `components/`, not custom ESLint rules. It earns its place by catching the three CSS-level rules the theme cannot; anything requiring composition judgement stays with review, where it belongs.

### 9. Brand values pass through one typed boundary

`BRAND-INPUTS.md` at the repo root is the human-facing sheet the business fills. `lib/brand.ts` exposes the same fields as a typed record where every unsupplied value is explicitly `null`.

Components render a marked placeholder for `null` rather than a default string, so an unfilled brand value is visible on screen instead of silently reading as finished copy. This is the mechanism behind the "supplied, never invented" requirement — there is no code path that produces a brand value the business did not provide.

*Alternative considered:* environment variables or a CMS. Both are premature with no catalog and no deployment target.

### 10. The specimen route ships with the site, noindex

`app/specimen/page.tsx`, excluded from indexing via route metadata and unlinked from navigation. It is not environment-gated, so it remains reviewable on a deployed preview URL — which is where visual review of a design system actually happens.

### 11. File layout

```
app/
  layout.tsx            brand faces, real metadata
  globals.css           @theme token layer — the source of truth
  fonts/                self-hosted woff2
  specimen/page.tsx     acceptance surface
lib/
  brand.ts              typed brand inputs, null-by-default
  motion.ts             durations and curves for JS
components/
  ui/Button.tsx
  editorial/Plate.tsx           the only path to an <img>
  editorial/FigureCaption.tsx
  primitives/Reveal.tsx         the only scroll animation
  product/ProductCard.tsx
  nav/SiteHeader.tsx  NavOverlay.tsx  SiteFooter.tsx
scripts/check-slop.mjs
BRAND-INPUTS.md
```

Navigation components are built to contract with their states rendered on the specimen page; wiring them into a live layout is `build-storefront-shell`.

**Deferred from this change (task 5.8).** The responsive spec requires filters to present as a bottom sheet at mobile widths. No filter UI exists here — it belongs to `build-shop-and-collections` — so no `Sheet` component is built. `NavOverlay`'s native `<dialog>` pattern generalises to one directly: `showModal()` supplies focus containment, Escape and focus return, and only the geometry and entry transform differ. That change should extract the shared primitive rather than write a second dialog wrapper.

## Risks / Trade-offs

- **The repository is not under version control** → `git init` and an initial commit before implementation begins. This change replaces the stylesheet, fonts, and `public/` contents with no other rollback path. This is the first task in `tasks.md`.
- **Fontshare licence terms may not permit a given family** → verify both licences before committing font files; the Fraunces/Archivo fallback pair is named in advance so the blocker cannot stall implementation.
- **Clearing Tailwind's colour, radius, and text namespaces will break unrelated code that assumes defaults** → the repo is a bare scaffold, so present breakage is limited to `app/page.tsx`, which this change stubs. The cost lands on future work, deliberately.
- **12px caption type is a genuine legibility risk** despite meeting contrast → mitigated by 4.5:1 contrast, 44px touch targets, and rem-based sizing that honours browser text zoom. If review finds it fails in practice, the correct response is to raise the token once in the theme, not to bypass the scale per-component.
- **Placeholder plates will make the specimen page look unfinished** → that is the intended trade. The system is reviewed on composition, spacing, and type; photography quality is not what this change is claiming to deliver.
- **The bimodal scale breaks down with long headlines** — a 120px display size over a long string wraps badly → mitigated by the measure cap and the two-uses-per-page limit on `display`. Copy length becomes a composition constraint, which is the editorial behaviour intended.
- **Splitting `graphite` per surface adds a decision to every secondary-text placement** → acceptable; the alternative is a token that silently fails contrast on one of the two surfaces.

## Migration Plan

The scaffold is replaced rather than migrated:

1. `git init`, commit the untouched scaffold as the restore point.
2. Add the token layer to `globals.css` alongside the existing variables; verify Tailwind still compiles.
3. Clear the three namespaces and fix the resulting build errors — `app/page.tsx` is stubbed at this step.
4. Swap fonts in `layout.tsx`; remove the `Arial` body rule and the `prefers-color-scheme` block.
5. Build primitives and components, adding each to the specimen page as it lands.
6. Remove the Next.js scaffold SVGs from `public/` last, once nothing references them.

Rollback at any step is `git checkout` against the step-1 commit.

## Open Questions

- Whether the specimen route should additionally be environment-gated out of production builds once a real deployment target exists. Noindex plus no inbound links is sufficient for now and the decision does not affect the specs.
- Crop conventions for `worn` photography — where the frame cuts relative to the body — settle when real photography is supplied. The role itself is specified; only its art direction is open.
- Whether an editorial `journal` capability is wanted later. Out of scope here and it does not affect this system's tokens or primitives.
