## Context

`apply-shubha-abharan` shipped an editorial homepage the business has now asked to replace with a supplied mood board. This change supersedes that visual language and homepage composition. Catalog, shell landmarks, and the 404-honest downstream routes stay.

## Decisions

### Decision 1 — Green is a surface, gold is an accent, charcoal is text

The mood board lists six hexes. Rose gold is unused on the page and is not tokenised. Charcoal cannot be the inverted surface because the featured panel and footer are royal green. So:

- `paper` = cream
- `ink` = royal green (the inverted surface)
- `charcoal` = paper foreground, split from `ink` because they are no longer the same colour
- `gold` = primary fill and rules

White (or cream) on `#D4AF37` measures 1.98:1. Charcoal on gold measures 8.28:1. The `primary` label is charcoal, not cream. The fill stays the supplied gold rather than being darkened, so the board's metal reads as metal.

`ink` (chroma 0.052) and `gold` (chroma 0.139, hue ~91°) are named exemptions. The hue exclusion still fails any *unnamed* token in the metal band.

### Decision 2 — Pill via a radius token, not `rounded-full`

The slop check keeps banning `rounded-full`. `--radius-pill: 9999px` makes a square category still into a circle and a button into a pill. `--radius-frame` rounds the inset hero/campaign photographs. Product cards stay square.

### Decision 3 — Overlay hero, CSS stagger kept

The board overlays type on photography. A green scrim on the left of the hero (and a darker one on the campaign close) is required for cream type. It is marked `slop-check: allow scrim`. The existing CSS hero stagger stays — Motion's `initial` state still cannot hide the heading if JS is off.

No carousel: there is one hero frame.

### Decision 4 — Why Choose is brand-supplied, not invented

The four reasons are stored on the brand record as the business's mood-board copy. The component maps that array. An empty array would omit the section; the board supplies four, so four render. No fifth, no statistic.

### Decision 5 — Categories stay the catalog's five

The board's fifth circle is Bangles. The catalog has `pendant`, not `bangle`. Inventing a category without products is rejected. The fifth circle is Pendants.

### Decision 6 — No GSAP, no sparkle

The board's OpenRouter prompt asked for GSAP sparkle. Motion stays CSS + the existing overlay Motion runtime. Sparkle and lens flare are not implemented.

### Decision 7 — Homepage may spend `title`

Section headings on the board ("Find Your Perfect Piece", "More Than Just Jewellery") are title-sized serif. Display remains twice: hero name and closing statement. The slop check is updated to allow `text-title` on the homepage and still fail a third `text-display`.

## Risks / Trade-offs

- Playfair + Montserrat is a known template pairing. Accepted because the board names them.
- Overlay scrims hide photography. Accepted because overlay type is the board.
- Charcoal-on-gold is not the board's cream-on-gold. Accepted because cream-on-gold fails WCAG and the plan required the pairing to pass.

## Migration

`apply-shubha-abharan` remains in-progress for its three downstream 404s. This change does not close those. Specimen, BRAND-INPUTS and DESIGN-SYSTEM are rewritten in place to the new tokens.
