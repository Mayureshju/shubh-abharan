# Design System

Established by the `establish-brand-system` OpenSpec change. The durable
behaviour contracts live in `openspec/specs/design-system/`; this file records
how those contracts are *enforced* and the operational constraints that came
out of implementation.

## Where things live

| Concern | File |
| --- | --- |
| All design tokens | `app/globals.css` (`@theme`) — single source of truth |
| Motion tokens for JS | `lib/motion.ts` — mirrored from the CSS, asserted in sync |
| Brand-owned values | `lib/brand.ts` + `BRAND-INPUTS.md` |
| The only path to an image | `components/editorial/Plate.tsx` |
| The only scroll animation | `components/primitives/Reveal.tsx` |
| Acceptance surface | `/specimen` (noindex, unlinked) |

## Anti-generic rules — how each is enforced

Three tiers. The first two run in `npm run check`; the third is review.

### Tier 1 — does not compile

`app/globals.css` clears the `--color-*`, `--radius-*`, `--text-*`, `--font-*`,
`--ease-*`, `--shadow-*`, `--inset-shadow-*`, `--drop-shadow-*`,
`--text-shadow-*` and `--blur-*` namespaces before declaring replacements.
These utilities do not exist in the build:

- the entire default colour palette — `bg-blue-600`, `text-gray-400`, `bg-white`, `bg-black`
- the sized radius scale — `rounded-sm` through `rounded-3xl`
- the entire default type scale — `text-sm`, `text-lg`, `text-3xl`
- every shadow, drop-shadow, text-shadow, blur and backdrop-blur utility

Covers **rule 2** (no `backdrop-filter`), **rule 3** (no content shadow),
**rule 5** (no metal colour), **rule 6** (type roles).

An overlay that legitimately needs a shadow must now write an arbitrary value,
which is conspicuous in review and allowlisted by file in the check script.

### Tier 2 — `scripts/check-slop.mjs`

Tailwind implements a few utilities as *static* rules with no backing theme
namespace, so clearing a namespace cannot remove them. These are caught by grep
instead:

| Pattern | Rule |
| --- | --- |
| `linear/radial/conic-gradient`, `bg-gradient-*`, `bg-linear-*`, `bg-radial`, `bg-conic` | rule 1 |
| `backdrop-filter`, `backdrop-blur*` written as raw CSS | rule 2 |
| `box-shadow`, `shadow-[`, `drop-shadow-[` outside overlay files | rule 3 |
| `rounded-full`, `rounded-{s,e,t,b,x,y}-full` | rule 4 |

The script also asserts the six motion tokens in `lib/motion.ts` match the
custom properties in `app/globals.css`.

Comments are stripped before scanning — a forbidden token named in prose is
documentation, not shipped CSS.

**Escape hatch.** A line carrying `slop-check: allow <reason>` is skipped. The
only sanctioned use is the one permitted gradient: a single-direction black
scrim at 35% opacity or less over photography, where text contrast fails
without it.

### Tier 3 — review

These need composition judgement and cannot be automated:

- **rule 7** at most one orchestrated staggered sequence per route
- **rule 9** no centre-aligned text block longer than two lines
- **rule 10** every section differs from each neighbour in column count, alignment, image scale or surface
- **rule 11** at most five top-level navigation items *(partly guarded — `SiteHeader` throws if its list exceeds five)*
- **rule 12** at most eight icons, one source, one stroke weight
- **rule 13** every copy sentence carries a measurable fact or a photographable noun

**rule 8** (no rating/review/badge/compare-at/scarcity fields) is enforced by
type: neither `ProductCardProduct` nor the brand record has such a field. The
catalog model in a later change must keep it that way.

## Contrast

`node scripts/contrast.mjs` converts the OKLCH tokens to linear sRGB and
measures every text/surface pairing the system renders. Re-run it after any
colour change; it exits non-zero on a failure or a chroma-ceiling breach.

Current measurements:

| Pair | Measured | Floor |
| --- | --- | --- |
| ink on paper | 16.74:1 | 4.5:1 |
| graphite on paper | 4.90:1 | 4.5:1 |
| paper on ink | 16.74:1 | 4.5:1 |
| graphite-inverse on ink | 6.53:1 | 4.5:1 |
| hairline on paper | 1.15:1 | decorative only — never text or control boundaries |

`graphite` resolves per surface via `--surface-muted`, because one mid-grey
cannot clear 4.5:1 against both paper and ink.

## Font licensing — operational constraint

Gambarino and Switzer are self-hosted under the **ITF Free Font License v2.0**
(`app/fonts/LICENSE-ITF-FFL.txt`). Free for commercial use; self-hosting is
explicitly permitted. Two terms constrain this repository:

1. **No subsetting or format conversion.** The `woff2` files are used exactly
   as distributed. Do not add a font-subsetting step to the build.
2. **No redistribution via a public repository.** Self-hosting for this site is
   granted, but Section 02 prohibits distribution through "publicly accessible
   servers" or a "repository". **If this repository is made public, remove
   `app/fonts/*.woff2` from version control** and supply them at build time.

## Running the gates

```
npm run check     # lint, typecheck, contrast, anti-slop
npm run build
```
