## Why

The business supplied the Shubh Abharan logo in two forms: the SA monogram
(`public/brand/logo.png`) and the full logo with the name and "Fine Jewellery"
(`public/brand/full-logo.png`). The header and footer still show the lotus SVG
taken from the mood board.

## What Changes

- The header shows the SA monogram beside the brand name, replacing the lotus.
  Below 640px the monogram stands alone (the business asked for logo-only on
  phones). It stays decorative; the name, visually hidden on phones, is still
  the home link's accessible name.
- The footer's brand column shows the full logo, replacing the lotus and the
  text name. The image takes the brand name as its alt text.
- Both render through `next/image`, so the 1.1 MB and 1.5 MB source PNGs are
  served resized rather than at full size.
- `brand.wordmarkSrc` points to the monogram; new `brand.fullLogoSrc` holds the
  full logo. `BRAND-INPUTS.md` records both.
- Brand marks are written down as the exception to the single image primitive.
  The lotus already rendered as a raw `<img>`; the requirement never said so.

## Capabilities

### Modified Capabilities

- `design-system/core-components`: the header mark in the navigation
  requirement, the brand-mark exception to the image primitive, and the
  footer's full logo.

## Out of scope

- The brand name spelling ("Shubh" in the logo, "Shubha" in code), as in
  `apply-logo-palette`. The footer logo now shows "Shubh" on screen.
- Favicon and the admin sidebar.
- Deleting `public/brand/lotus.svg`, now unreferenced.
