## 1. Tokens, type, gates

- [x] 1.1 Replace palette in `app/globals.css`: cream paper, charcoal text, royal-green ink, brown graphite, cream-grey graphite-inverse, gold accent; drop garnet
- [x] 1.2 Add `--radius-pill` and `--radius-frame`; keep `--radius-input`
- [x] 1.3 Point `::selection` at gold over charcoal
- [x] 1.4 Map paper surface to charcoal foreground; ink surface to cream on green
- [x] 1.5 Load Playfair Display + Montserrat in `app/layout.tsx` and bind `--font-display` / `--font-text`
- [x] 1.6 Make `primary` a gold pill with charcoal label; `quiet` a gold-outline pill
- [x] 1.7 Rewrite `scripts/contrast.mjs` exemptions for `ink` and `gold`; skip hue exclusion for named gold; assert charcoal-on-gold and cream-on-green
- [x] 1.8 Keep `rounded-full` banned in `check-slop.mjs`; allow `text-title` on the homepage; keep `text-display` at most twice

## 2. Shell

- [x] 2.1 Add `public/brand/lotus.svg` and set `brand.wordmarkSrc`
- [x] 2.2 Header: lotus + name, centered Home / Shop / Categories / About / Contact, utility icons
- [x] 2.3 Footer: green surface, lotus + tagline, Quick Links + Categories; omit social and empty legal
- [x] 2.4 Brand copy: eyebrow, support, closing, footer statement, four reasons, collection description from the mood board

## 3. Homepage

- [x] 3.1 Hero overlay with scrim, brand name as h1, gold Shop Now; no carousel
- [x] 3.2 Types as five equal circles with Explore; catalog-keyed links; rail below 768
- [x] 3.3 Collection as green split + still
- [x] 3.4 Reasons section from `brand.reasons`; drop Detail from `app/page.tsx`
- [x] 3.5 Statement overlay CTA on campaign frame
- [x] 3.6 Add reason and arrow icons in `icons.tsx` (budget ≤ 12)

## 4. Photography, specimen, docs, verify

- [x] 4.1 Update `scripts/generate-images.mjs` prompts for emerald silk / circular stills
- [x] 4.2 Regenerate frames if OpenRouter key is present in `.env`; otherwise leave current files
- [x] 4.3 Update `plates.ts` crops/alts as needed
- [x] 4.4 Update `/specimen` for the new palette, type, pills
- [x] 4.5 Update `BRAND-INPUTS.md` and `DESIGN-SYSTEM.md`
- [x] 4.6 `npx tsc --noEmit`, `node scripts/contrast.mjs`, `node scripts/check-slop.mjs`
- [x] 4.7 Browser: home at desktop and ~390px, keyboard, reduced-motion
