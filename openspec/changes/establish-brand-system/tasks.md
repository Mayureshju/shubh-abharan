## 1. Restore point and brand inputs

- [ ] 1.1 Run `git init` and commit the untouched scaffold as the restore point — there is currently no version control and no rollback path for this change
- [ ] 1.2 Create `BRAND-INPUTS.md` at the repo root listing every brand-owned value the system needs: brand name, wordmark asset, voice notes, collection names, materials vocabulary, and any policy facts — each marked unfilled
- [ ] 1.3 Create `lib/brand.ts` exposing those fields as a typed record with every unsupplied value explicitly `null`, and a marked-placeholder value for rendering unfilled fields
- [ ] 1.4 Verify licence terms for Gambarino and Switzer before downloading; if either fails, switch that role to its named fallback (Fraunces / Archivo) and record the substitution in `design.md`

## 2. Token layer

- [ ] 2.1 Add the colour tokens to `globals.css` in `@theme` as `oklch()` values — `paper`, `ink`, `graphite`, `graphite-inverse`, `hairline` — all at chroma ≤ 0.02
- [ ] 2.2 Verify measured contrast: `ink` and `graphite` on `paper`, and `paper` and `graphite-inverse` on `ink`, all at 4.5:1 or better for body and caption text; adjust lightness until they pass
- [ ] 2.3 Add the four type-role tokens (`display`, `title`, `body`, `caption`) with the `clamp()` sizes, line heights, and tracking from `design.md`
- [ ] 2.4 Add the three section-rhythm spacing tokens (`tight`, `normal`, `breath`) as `clamp()` values alongside the base spacing scale
- [ ] 2.5 Add radius tokens — `0` for surfaces, `2px` for form inputs only
- [ ] 2.6 Add the four motion durations and two easing curves as custom properties
- [ ] 2.7 Clear the `--color-*`, `--radius-*`, and `--text-*` namespaces with `: initial` before the declarations above, so Tailwind's default palette, radius scale, and type scale stop compiling
- [ ] 2.8 Stub `app/page.tsx` and fix every build error produced by step 2.7; confirm `npm run build` passes
- [ ] 2.9 Confirm the deletions hold: verify `bg-blue-600`, `rounded-full`, and `text-sm` each fail to produce output

## 3. Typography

- [ ] 3.1 Add self-hosted `woff2` files under `app/fonts/` for the display serif and the grotesque
- [ ] 3.2 Wire both faces in `app/layout.tsx` with `next/font/local`, `display: 'swap'`, and fallback metric adjustment enabled; remove the Geist and Geist Mono imports
- [ ] 3.3 Remove the `Arial, Helvetica, sans-serif` body rule and the `prefers-color-scheme` block from `globals.css`; bind `display`/`title` to the serif and `body`/`caption` to the grotesque
- [ ] 3.4 Set real document metadata in `layout.tsx`, reading the brand name from `lib/brand.ts` — replace the "Create Next App" title and description
- [ ] 3.5 Verify no layout shift occurs when the real faces load, and that the page stays readable with font loading blocked

## 4. Primitives

- [ ] 4.1 Build `components/primitives/Reveal.tsx` using IntersectionObserver plus a CSS class toggle — reveals once per element per page load, travel ≤ 16px, no Motion import
- [ ] 4.2 Make `Reveal` honour `prefers-reduced-motion` by dropping to opacity-only at a single duration, and confirm its children are present in the document whether or not the reveal fires
- [ ] 4.3 Build `components/editorial/Plate.tsx` as the only path to an image: requires a declared aspect ratio, a role (`macro` / `scale` / `worn` / `detail`), and alt text or an explicit decorative marking; reserves layout space before load
- [ ] 4.4 Add role-typed neutral placeholder rendering to `Plate` — states role, intended crop, and aspect ratio, visibly unfinished, replaceable by a data change alone
- [ ] 4.5 Make `Plate` display the measured dimension alongside any image carrying the `scale` role
- [ ] 4.6 Build `components/editorial/FigureCaption.tsx` for marginal captions at `caption` size
- [ ] 4.7 Add `lib/motion.ts` exporting the four durations and two curves for JS consumers

## 5. Components

- [ ] 5.1 Build `components/ui/Button.tsx` with the four variants (`primary`, `quiet`, `inline`, `icon`), each defining rest, hover, focus-visible, active, disabled, and pending presentation
- [ ] 5.2 Ensure the pending state blocks repeat activation, and that disabled state is distinguishable by more than colour and keeps its accessible name
- [ ] 5.3 Build `components/product/ProductCard.tsx` rendering image, name, price, and material line, with presentation derived from its image role and support for varied aspect ratios and grid spans
- [ ] 5.4 Confirm `ProductCard` exposes no rating, review, badge, discount, or scarcity affordance, and that the whole card is activatable by pointer and keyboard
- [ ] 5.5 Build `components/nav/SiteHeader.tsx` with the collection-led structure — at most five top-level items, product type absent from top level — including its scrolled state
- [ ] 5.6 Build `components/nav/NavOverlay.tsx` with focus containment, scroll lock behind it, escape-to-dismiss, and focus return to the opening control; animate with Motion via `LazyMotion` + `m`
- [ ] 5.7 Build `components/nav/SiteFooter.tsx` at `caption` size with hairline rules and no boxed newsletter card
- [ ] 5.8 Give every component its mobile presentation per the responsive spec — full-bleed imagery, horizontal rails, bottom-sheet controls, full-screen nav overlay

## 6. Specimen surface

- [ ] 6.1 Create `app/specimen/page.tsx` with route metadata excluding it from indexing, unlinked from navigation
- [ ] 6.2 Render the full type scale in both faces, all colour and surface tokens with their measured contrast ratios, the spacing scale, and all three section rhythms
- [ ] 6.3 Render every button variant in every state, `Plate` in all four roles including placeholders, and `ProductCard` in its supported presentations
- [ ] 6.4 Render the header, nav overlay, and footer in their open, closed, and scrolled states

## 7. Enforcement

- [ ] 7.1 Write `scripts/check-slop.mjs` — greps `app/` and `components/` for CSS gradients, `backdrop-filter`, and `box-shadow` outside the permitted overlay components
- [ ] 7.2 Add the assertion that the motion durations in `lib/motion.ts` match the custom properties in `globals.css`
- [ ] 7.3 Add a `check` script to `package.json` running lint, typecheck, and the slop check; confirm it fails on a deliberately introduced gradient and passes once removed
- [ ] 7.4 Record the enforcement split in `BRAND-INPUTS.md` or a short `DESIGN-SYSTEM.md`: which anti-slop rules are compiler-enforced, which are script-enforced, and which stay with review

## 8. Verification

- [ ] 8.1 Verify the specimen page at 1440px, 1024px, 768px, and 390px — no horizontal scroll, no overlap, no unintended wrapping; confirm margins grow above 1600px while type does not
- [ ] 8.2 Traverse the specimen page by keyboard only — every control reachable in visual reading order, focus visible on both `paper` and `ink`, overlay focus containment and return working
- [ ] 8.3 Re-run with reduced motion enabled — no translation, scale, or parallax, and confirm drawers still open, focus stays visible, and pending states still communicate
- [ ] 8.4 Verify touch targets measure at least 44px for `caption`-sized controls, and that browser text zoom to 200% does not break the layout
- [ ] 8.5 Check the browser console for errors, hydration warnings, and layout shift on load
- [ ] 8.6 Run `npm run build` and `npm run check` clean
- [ ] 8.7 Review the specimen page against the 13 anti-slop rules and against `jewelry-visual-review`; confirm no storefront page was built and scope did not expand beyond this change
