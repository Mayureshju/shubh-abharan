## Why

The business supplied a mood board and asked the storefront to match it: royal
green, gold, cream, Playfair Display with Montserrat, a lotus mark, an overlay
hero, circular category stills, a featured split, a four-column Why Choose row,
and a dark campaign CTA. The live homepage is the opposite system — parchment,
garnet, Gambarino, square frames, no circles, no gold token — so matching the
board is a visual-language rewrite, not a restyle.

## What Changes

- **BREAKING.** Colour is cream paper, royal-green inverted surface, charcoal
  text, and a gold accent. Metal may be a UI colour. The single-garnet exemption
  and the metal hue ban are replaced by named exemptions for green and gold.
- **BREAKING.** Typefaces become Playfair Display (display/title) and Montserrat
  (body/caption), loaded through `next/font/google`.
- **BREAKING.** Pill geometry and circular frames are permitted for CTAs,
  category stills, and the lotus mark. Radius tokens exist for pill and frame.
- **BREAKING.** Primary navigation is destination-led: Home, Shop, Categories,
  About, Contact. Collections drop to the footer. Cap of five is unchanged.
- **BREAKING.** Homepage narrative becomes Hero overlay → circular Types →
  featured Collection split → Reasons → campaign Statement. Detail leaves the
  page. Homepage type budget admits `title`; `display` remains at most twice.
- Why Choose copy and the mood-board homepage sentences are brand-supplied by
  this board, stored in `lib/brand.ts`, not invented in components.
- Photography prompts shift to emerald silk / kundan stills so circular crops
  and overlay heroes have something to land on. Catalog categories stay
  Necklaces, Rings, Bracelets, Earrings, Pendants — Bangles is not added.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `design-system/visual-language`: palette, metal-as-colour, typefaces, radius,
  icon budget, homepage type-role cap.
- `design-system/core-components`: pill buttons, destination-led nav, circular
  category frames.
- `storefront/homepage`: section jobs and compositions listed above.

## Impact

**Code**

- `app/globals.css`, `app/layout.tsx`, `scripts/contrast.mjs`, `scripts/check-slop.mjs`
- `components/ui/buttonClass.ts`, `components/ui/icons.tsx`
- `components/nav/SiteHeader.tsx`, `SiteFooter.tsx`, `NavOverlay.tsx`
- `components/home/*`, `app/page.tsx`, `app/specimen/page.tsx`
- `lib/brand.ts`, `BRAND-INPUTS.md`, `DESIGN-SYSTEM.md`
- `scripts/generate-images.mjs`, `public/images/*`, `public/brand/lotus.svg`

**Dependencies**

None added. Playfair and Montserrat load through `next/font/google`.

**Not in scope**

Shop, cart, search, about, contact routes (still 404). Catalog model. GSAP.
Sparkle. Fake carousel. Invented social URLs.
