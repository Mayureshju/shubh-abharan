## 1. Palette

- [x] 1.1 Replace the four achromatic tokens in `app/globals.css` with the supplied warm neutrals — parchment, espresso, stone, taupe — keeping the token names as structural roles and recording the brand name and hex beside each (Decision 1)
- [x] 1.2 Add `--color-garnet` with a comment enumerating its two permitted uses
- [x] 1.3 Point `::selection` at garnet over paper rather than at the surface pair
- [x] 1.4 Update the two stale ratio comments on `--surface-muted` to the measured values
- [x] 1.5 Update the NavOverlay backdrop from the old ink value to espresso
- [x] 1.6 Make `primary` a garnet fill with an `on-surface` boundary and a `paper` label, and confirm it still reads on the ink surface (Decision 2)

## 2. Contrast gate

- [x] 2.1 Replace the token table in `scripts/contrast.mjs` with the supplied values
- [x] 2.2 Add the single-entry `EXEMPT` map with its reason, rather than raising `CHROMA_CEILING` (Decision 1)
- [x] 2.3 Add `HUE_EXCLUSION` failing any above-ceiling token in the warm-metal band, exempt or not
- [x] 2.4 Fail if `EXEMPT` names a token that does not exist
- [x] 2.5 Add the `paper on garnet` and `garnet on paper` pairings
- [x] 2.6 Run it and confirm every pairing clears its floor: ink/paper 15.61, graphite/paper 5.27, taupe/ink 7.67, paper/garnet 11.19
- [x] 2.7 Confirm a second above-ceiling token fails, and that an above-ceiling token at hue 85 fails even when exempted

## 3. Photography

- [x] 3.1 Write `scripts/generate-images.mjs` with one prompt per frame derived from the two art-direction prompts in SHUBHA-BRAND-DIRECTION.md, and a shared `HOUSE_STYLE` (Decision 6)
- [x] 3.2 Read the key from `.env` inside the script; no credential in any committed file, log line or output
- [x] 3.3 Request `image_size: "2K"` — the model's default long edge is 1264px, which the full-bleed frames upscale past at any desktop width
- [x] 3.4 Encode to JPEG at 2400px through `sharp`, falling back to the model's bytes if it is absent
- [x] 3.5 Generate nine frames: hero, collection, detail, campaign, and one per product type
- [x] 3.6 State in `HOUSE_STYLE` that any person in frame is the same model, so the set reads as one shoot — the first pass produced a mismatched hand in the bracelet frame
- [x] 3.7 Review every frame at full size and re-shoot the ones that missed: the bracelet frame for skin tone and composition, the campaign frame alongside it
- [x] 3.8 Write each `alt` from the photograph as it actually exists, not from the brief, and correct the three that drifted after re-shooting

## 4. Plate

- [x] 4.1 Add `position?: string` to `Plate`, documented as a property of the photograph rather than of the layout (Decision 5)
- [x] 4.2 Set it on the hero (`72% 50%`) and the closing frame (`60% 50%`), and confirm the subject survives both the narrow and the wide crop
- [x] 4.3 Leave `crop` declared on every frame that now has a `src`

## 5. Brand record

- [x] 5.1 Fill `name`, `heroStatement` and `closingStatement` from the values the business supplied
- [x] 5.2 Record against `heroStatement` and `closingStatement` that they do not satisfy the copy rule and are retained at the business's direction (Risks)
- [x] 5.3 Add the one supplied collection, with a description naming only what is in its photograph
- [x] 5.4 Add `footerStatement`, nullable, omitted while unsupplied
- [x] 5.5 Leave every other field `null` — no legal name, founding year, place of business, materials vocabulary, policy or contact is invented

## 6. Sections

- [x] 6.1 Hero — add the eyebrow and the supporting line, move both into the existing three-step stagger, add one `inline` secondary action beside the `primary`
- [x] 6.2 `components/home/Types.tsx` — five types on a hand-placed twelve-column hang, five aspect ratios, positive offsets only, the rail below 1024px (Decision 4)
- [x] 6.3 Key `Types` off `keyof typeof CATEGORY_PLATES` so a type the shop cannot filter to is a type error
- [x] 6.4 Delete `Selection.tsx`
- [x] 6.5 `components/home/Detail.tsx` — ink band, copy left of the frame, every sentence naming something in the photograph (Decision 7)
- [x] 6.6 Give `Detail` the policy-driven assurance line, omitting itself while no policy is supplied
- [x] 6.7 Delete `Scale.tsx`
- [x] 6.8 Statement — add the closing campaign frame above the statement, keep the statement a `<p>` and the action `quiet`
- [x] 6.9 Recompose `app/page.tsx` and re-score the rhythm: `normal`, `tight`, `breath`, `normal`, plus the footer's fixed `breath`
- [x] 6.10 Walk the five sections pairwise and confirm each differs from its neighbours in column count, alignment, image scale or surface
- [x] 6.11 Confirm the type budget still holds — `display` twice, `body`, `caption`, no `title`

## 7. Shell

- [x] 7.1 `components/ui/icons.tsx` — five icons, one file, one stroke weight, square caps, all decorative
- [x] 7.2 Five top-level destinations; keep the throw above five
- [x] 7.3 Make search, wishlist and bag icon-only links rather than inert buttons (Decision 8)
- [x] 7.4 Add the type index to the mobile overlay, above collections, declared in the overlay rather than imported from a route's components
- [x] 7.5 Close the overlay when a destination is chosen
- [x] 7.6 Footer — four columns, each rendering only where it has entries, plus the brand column and the contact line
- [x] 7.7 Move the desktop nav breakpoint to `lg`: five items plus three icons do not fit beside the wordmark at 768px

## 8. Documentation

- [x] 8.1 BRAND-INPUTS.md — mark every supplied field SUPPLIED with its source and date; keep every unsupplied field UNFILLED
- [x] 8.2 BRAND-INPUTS.md — record the copy-rule exception against the two statements, and that the collection name is derived rather than supplied
- [x] 8.3 BRAND-INPUTS.md — replace the two-frame photography table with the nine frames, each with role, aspect, crop and the prompt id it was generated from
- [x] 8.4 DESIGN-SYSTEM.md — the palette, the exemption, the hue exclusion, garnet's two uses, the new measured ratios
- [x] 8.5 DESIGN-SYSTEM.md — the homepage's new section list, its re-scored rhythm and its unchanged type budget
- [x] 8.6 DESIGN-SYSTEM.md — `scripts/generate-images.mjs` in "Where things live", and the routes the shell now links to that do not exist

## 9. Verify

- [x] 9.1 `npm run check` — lint, typecheck, contrast, anti-slop, catalog integrity
- [x] 9.2 `npm run build`
- [x] 9.3 Open `/` at 1920, 1440, 1024, 768 and 390 and confirm no horizontal page scroll, no overlapping content and no unintended wrapping at any width
- [x] 9.4 At 390px confirm the hero and the closing frame run full-bleed and the type index presents as a snapping rail
- [x] 9.5 Tab the whole page: reading-order focus, a visible ring on both surfaces, one tab stop per type frame, 44px minimum on every control
- [x] 9.6 Set text zoom to 200% and confirm nothing is clipped, overlapped or unreachable
- [x] 9.7 With `prefers-reduced-motion: reduce`, confirm all content is immediately present with no translation, scale or stagger
- [x] 9.8 Confirm no console error, no hydration warning and no layout shift, and that the header is still the route's only client component
- [x] 9.9 Open `/specimen` and confirm the garnet `primary` reads on both surfaces and the header and footer still render once each
- [x] 9.10 Read every string the page renders and confirm each is a navigational label, a supplied brand value, a description of its own photograph, or a marked placeholder
- [x] 9.11 Confirm scope held — no cart, wishlist, search, filter or checkout code; no new dependency; no catalog module changed

## 10. Owed downstream

Recorded here because the shell now links to them and every one 404s today,
which is the same verified state `build-homepage` shipped (Decision 8).

- [ ] 10.1 `build-shop-and-collections` — `/shop`, its `category` query parameter, `/collections`, `/collections/modern-classics`, and `/types` (which may be a redirect to `/shop`)
- [ ] 10.2 `build-cart-and-wishlist` — `/cart` and `/wishlist`
- [ ] 10.3 Unassigned — `/search`, `/about`, `/contact`
