## 1. Tokens

- [x] 1.1 Retune tokens in `scripts/contrast.mjs`; add `lavender`, `lilac` to `EXEMPT` and their pairings
- [x] 1.2 Mirror values in `app/globals.css`; add `accent` surface token
- [x] 1.3 Primary button fill → `lavender`; size chip selected → `lavender`
- [x] 1.4 `text-gold` text → `text-accent`; gold kept for rules and on-ink icons
- [x] 1.5 Lotus SVG, admin sidebar, specimen page, DESIGN-SYSTEM.md

## 2. Photography

- [x] 2.1 Retarget `scripts/generate-images.mjs` prompts to the lilac set; regenerate all 22 frames
- [x] 2.2 Regenerate `detail`, `category-pendants`, `product-earrings` (collage, vignette, stray hand)
- [x] 2.3 Copy frames onto their `-v2` / `hero-worn` aliases; rewrite alt, crop and styling copy
- [x] 2.4 Mobile hero scrim and pager surface scope

## 3. Verify

- [ ] 3.1 `node scripts/contrast.mjs`, `check-slop`, lint, typecheck, build — contrast and slop pass; touched files lint clean; repo-wide lint has pre-existing errors elsewhere; `tsc` OOMs at 8 GB (pre-existing), build not run
- [x] 3.2 Visual check: home at 1440px, product at 390px; accent resolves lilac on paper, gold on ink; no console errors
