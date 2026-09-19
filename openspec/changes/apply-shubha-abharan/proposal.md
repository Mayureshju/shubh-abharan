## Why

`establish-brand-system`, `define-catalog-model` and `build-homepage` produced a
complete storefront homepage with no brand in it. Every colour was achromatic
because no palette had been supplied, every sentence was a marked placeholder
because no copy had been supplied, and every frame was a grey box stating its
intended crop because no photography had been supplied. That was the correct
state for a system built before its brand existed, and the three changes were
explicit that filling it in would be a data change and nothing more.

The business has now supplied the brand: the name **Shubha Abharan**, a five
colour palette led by Deep Garnet, two sentences of homepage copy, one
collection, and the art direction for the photography. This change fills those
in and closes the two gaps that filling them in exposed — the palette is not
achromatic, and the homepage's third section was a product listing the brand's
own composition does not call for.

## What Changes

**The palette becomes warm-neutral plus one brand colour.** Parchment, espresso,
stone and taupe replace the four grey tokens and all four still sit under the
0.02 chroma ceiling, so the surface set is unchanged in kind — only in
temperature. Garnet is the exception and the only one: it is named in a single
`EXEMPT` entry in `scripts/contrast.mjs` rather than raising the ceiling, so a
second chromatic token still fails the build. The ceiling's original purpose —
metal is a material, not a colour — is now held by hue as well as by chroma: a
new hue exclusion fails any token with usable chroma between 60° and 110°,
where gold sits, exemption or not. Garnet is at 11°. Gold is still photography.

Garnet appears in exactly two places in the interface: the fill of the one
`primary` action a view is allowed, and selected text. Everything else warm on
screen is in a photograph.

**The homepage's Selection section is replaced by a type index.** Selection
presented four product cards. The catalog is still structural specimens with
null prices and null material lines, so that section could only render four
cards reading `[PRICE]` and `[MATERIAL LINE]` — and the business's own homepage
composition asks for a type index in that slot, not a product row. `Types`
presents Necklaces, Rings, Bracelets, Earrings and Pendants as five frames at
five aspect ratios hung on a twelve-column grid, each linking to
`/shop?category=<Category>`. It asserts nothing about any piece, so nothing in
it has to wait for catalog data.

**The Scale section becomes Detail.** Scale rendered one product's `scale`-role
image, which is a placeholder until the catalog carries photography. Detail
renders a supplied editorial frame on the same ink surface and carries the
craftsmanship copy the brand direction asks for — written from what is visible
in the frame, so no sentence makes a claim the business has not made.

**The closing statement gains a photographic frame.** The Statement section was
type alone. It now opens on the campaign frame, which is what makes the Hero and
the close read as a pair rather than as two unrelated ends.

**Nine photographs, generated and reproducible.** `scripts/generate-images.mjs`
holds one prompt per frame, derived from the two art-direction prompts in
SHUBHA-BRAND-DIRECTION.md, and writes `public/images/`. It is a content-workflow
tool: nothing under `app/`, `components/` or `lib/` imports it and the storefront
calls no model at request time. The key is read from `.env` and appears in no
file. Replacing a generated frame with a commissioned photograph is an edit to
`src` and `alt` in `components/home/plates.ts`.

**`Plate` gains `position`.** One optional `object-position` value, declared
beside `src` because it is a property of the photograph rather than of the
layout. The hero's figure stands in the right half of a 3:2 frame; without it a
centred 4/5 crop at phone width cuts her at the shoulder.

**The shell grows to the navigation the business asked for.** Five top-level
destinations, three icon-only utility destinations, five line icons drawn in one
file at one stroke weight, a type index inside the mobile overlay, and a four
column footer whose columns render only where they have content.

## Capabilities

### Modified Capabilities

- `design-system/visual-language`: the colour requirement changes from *achromatic*
  to *warm-neutral with exactly one supplied brand colour*, with metal still
  excluded — now by hue as well as by chroma.
- `design-system/core-components`: the navigation requirement gains one permitted
  top-level destination, a type index, without raising the cap of five.
- `storefront/homepage`: the third section of the narrative changes from a product
  selection to a type index; the fourth from a scale study to a detail study; and
  the closing section may carry one photographic frame.

### New Capabilities

None. Nothing here is a behaviour the system did not already describe.

## Impact

**Code**

- `app/globals.css` — five palette values, one garnet token, `::selection`.
- `scripts/contrast.mjs` — new tokens, the single-entry exemption, the hue exclusion, two new pairings.
- `components/ui/buttonClass.ts` — `primary` is garnet-filled with a surface-relative boundary.
- `components/ui/icons.tsx` — new. Five icons, one stroke weight.
- `components/editorial/Plate.tsx` — `position?: string`.
- `components/home/plates.ts` — nine frames, all with `src` and real `alt`.
- `components/home/Types.tsx` — new, replaces `Selection.tsx` (deleted).
- `components/home/Detail.tsx` — new, replaces `Scale.tsx` (deleted).
- `components/home/Hero.tsx`, `Statement.tsx` — eyebrow, supporting line, second action, campaign frame.
- `components/nav/*` — five destinations, utility links, type index in the overlay, four column footer.
- `lib/brand.ts` — supplied values, plus one new nullable field, `footerStatement`.
- `scripts/generate-images.mjs` — new. Content workflow, not application code.
- `public/images/*.jpg` — nine frames.
- `BRAND-INPUTS.md`, `DESIGN-SYSTEM.md`, `SHUBHA-BRAND-DIRECTION.md` — records.

**Dependencies**

None added. `sharp` is used by `generate-images.mjs` only, is already present as
a Next dependency, and the script falls back to writing the model's bytes
unchanged if it is ever absent.

**Downstream**

`build-shop-and-collections` now owes `/shop`, its `category` query parameter,
`/collections`, `/collections/modern-classics` and `/types`.
`build-cart-and-wishlist` owes `/cart` and `/wishlist`, `build-search` owes
`/search`, and the About and Contact routes are unassigned. Every one of those
is linked from the shell today and 404s, which is the same verified honest state
`build-homepage` shipped and is listed in tasks.md so none of them is forgotten.

**Blocking input**

None. What is still unsupplied — prices, material lines, product names, policies,
legal entity, place of business, contact email, wordmark — renders as a marked
placeholder or omits its affordance, exactly as before.

**Not in scope**

Cart, wishlist, search, filtering, account, checkout, payment, backend
integration, the collection and product routes, and any change to the catalog
model.
