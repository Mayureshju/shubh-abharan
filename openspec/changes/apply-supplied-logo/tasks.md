## 1. Brand record

- [x] 1.1 `brand.wordmarkSrc` → `/brand/logo.png`; add `brand.fullLogoSrc` → `/brand/full-logo.png`
- [x] 1.2 BRAND-INPUTS.md — both rows SUPPLIED 2026-10-12; drop the duplicate lotus row under Homepage

## 2. Header and footer

- [x] 2.1 Header: monogram at 44px through `next/image`, decorative, loaded eagerly
- [x] 2.2 Footer: full logo at 192px wide through `next/image`, alt is the brand name; text name only when no logo is supplied
- [x] 2.3 Header below 640px: monogram only; name `max-sm:sr-only` so the link keeps its accessible name

## 3. Verify

- [x] 3.1 Typecheck, build, contrast, slop, catalog, checkout and shop checks pass; touched files lint clean. Repo-wide lint has 2 pre-existing errors elsewhere (`admin/reports/page.tsx`, `home/RowSlider.tsx`)
- [x] 3.2 Visual at 1440px and 427px: header over the hero and scrolled, footer on ink. Served at 96px (monogram) and 384px (full logo) instead of the 1.1 MB / 1.5 MB sources. First Tab focuses the home link, named "Shubha Abharan". No console errors
