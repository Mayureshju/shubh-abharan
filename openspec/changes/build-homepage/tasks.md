## 1. Shell

- [x] 1.1 Mount `SiteHeader`, a single `<main id="main">` landmark and `SiteFooter` in `app/layout.tsx`, keeping the layout a server component (design.md — Decision 1)
- [x] 1.2 Remove the local `SiteHeader` / `SiteFooter` mounts and the outer wrapper from `app/specimen/page.tsx`; the surface renders both from the layout instead
- [x] 1.3 Confirm no route renders a second header, footer or main landmark (specs/storefront/app-shell — shell mounted once)
- [x] 1.4 Confirm the footer's server-rendered links to `/collections` and `/shop` satisfy the script-free navigation path at every width, and add no announcement band (Decision 2; specs/storefront/app-shell — script-free destinations, shell contributes no page content)

## 2. Brand and image inputs

- [x] 2.1 Add `heroStatement` and `closingStatement` to the `Brand` interface and to the live `brand` record in `lib/brand.ts`, both `null`, with no default string anywhere (Decision 6)
- [x] 2.2 Add a `## Homepage` section to `BRAND-INPUTS.md` with the two copy fields marked UNFILLED, and a note that each supplied sentence must carry a measurable fact or a photographable noun
- [x] 2.3 Create `components/home/plates.ts` declaring the two editorial image slots — hero frame and collection frame — each with role, aspect, second aspect where it differs, intended crop and alt, and no `src` (Decision 8; specs/storefront/homepage — editorial imagery declared by role, crop and aspect)
- [x] 2.4 Add the same two slots to the `## Homepage` section of `BRAND-INPUTS.md` as the photography the business must supply, listing role, both aspect ratios and intended crop per slot

## 3. Plate: a second declared aspect ratio

- [x] 3.1 Add an optional `aspectMd?: string` prop to `components/editorial/Plate.tsx`, writing `--plate-aspect-sm` / `--plate-aspect-md` inline and a `data-plate-aspect-md` marker attribute; keep `aspect` required (Decision 10)
- [x] 3.2 Add the one media query resolving `--plate-aspect` at 768px to `app/globals.css`, alongside the existing layout custom properties
- [x] 3.3 Have `PlatePlaceholder` print both ratios when a second one is declared, so the shoot brief reads correctly off the screen
- [x] 3.4 Confirm layout space is still reserved before load at both widths — no shift when a `src` is added (specs/storefront/homepage — renders server-first)

## 4. Sections

- [x] 4.1 `components/home/Hero.tsx` — server component: a three-step CSS keyframe entrance on `--duration-slow` / `--ease-out` with `both` fill, staged by `animation-delay` from the `instant` and `quick` tokens and only under `prefers-reduced-motion: no-preference`. Full-bleed frame, `<h1 class="text-display">` from `resolve(brand.heroStatement, …)` set **below** the frame with one `primary` action on its baseline. No scrim, no overlaid text. Not Motion: it renders `opacity:0` into the server HTML and would hide the heading and the primary action permanently without client script (Decisions 11, 12 — revised)
- [x] 4.2 `components/home/Collection.tsx` — server component: asymmetric two-column, large editorial frame against a measure-capped column. Reads `brand.collections[0]` and `getCollection(slug)`; renders a marked unfilled state for name and description when there are none, and suppresses the collection link in that state (Decision 8)
- [x] 4.3 `components/home/Selection.tsx` — server component: first four products from `listProducts()` in declared order, through `toProductCardProduct(product, role)` with the role coming from a local slot table. `.rail` below 768px with `--rail-columns: 4` above; two slots vertically offset. No ranked or promotional framing anywhere in its markup (Decision 9)
- [x] 4.4 `components/home/Scale.tsx` — server component: `data-surface="ink"`, full-bleed, one product's `scale`-role plate small in a generous field with its measured dimension as the `Plate` figcaption. No brand copy (Decision 7)
- [x] 4.5 `components/home/Statement.tsx` — server component: left-aligned `<p class="text-display">` from `resolve(brand.closingStatement, …)` and one `quiet` action to `/shop`. No image, nothing centred (Decision 5)
- [x] 4.6 Give every section an `<h2>` set in the `caption` role — `Collection`, `Selection`, `Scale` — naming what the section contains and asserting nothing about the brand; the Hero's `<h1>` is the page's only top-level heading
- [x] 4.7 Wrap sections 2 to 5 in `Reveal` as single units; do not wrap product cards individually and do not add a second scroll observer (Decision 12; specs/storefront/homepage — single orchestrated sequence)
- [x] 4.8 Add the hero entrance keyframe and its token-valued stagger delays to `app/globals.css`, beside the other motion rules (Decision 12 — revised)

## 5. Page composition

- [x] 5.1 Replace `app/page.tsx` with the five sections in order, as a server component awaiting the catalog reads
- [x] 5.2 Apply the scored rhythm — `normal`, `tight`, `breath`, `normal` — and confirm the footer's own `mt-breath` completes it without producing two adjacent `breath` joins (Decision 4)
- [x] 5.3 Walk the five sections pairwise and confirm each differs from its neighbours in column count, alignment, image scale or surface (specs/storefront/homepage — adjacent sections differ)
- [x] 5.4 Set `priority` and a correct `sizes` on the hero frame only; leave every other plate lazy
- [x] 5.5 Add page metadata sourced from the brand record through `resolve`, inventing no title or description

## 6. Enforcement and documentation

- [x] 6.1 Extend `scripts/check-slop.mjs` with a homepage-scoped assertion over `app/page.tsx` and `components/home/`: `text-title` absent, `text-display` at most twice, with the `ponytail:` comment naming the source-count ceiling (Decision 14)
- [x] 6.2 Deliberately add a `text-title` and a third `text-display`, confirm the check fails and names the file each time, then revert
- [x] 6.3 Record in `DESIGN-SYSTEM.md` that `SiteFooter` owns the final `breath` join, so later routes score four joins plus one they do not control
- [x] 6.4 Record the homepage's rhythm score and its three-role type budget in `DESIGN-SYSTEM.md`, and add a "Where things live" row for `components/home/`

## 7. Verify

- [x] 7.1 Run `npm run check` — lint, typecheck, contrast, anti-slop, catalog integrity all pass, including with the new links to routes that do not yet exist (Decision 15)
- [x] 7.2 Run `npm run build`
- [x] 7.3 Open `/` at 1920, 1440, 1024, 768 and 390 and confirm no horizontal page scroll, no overlapping content and no unintended wrapping at any width; confirm margins grow above 1600px while type does not (specs/storefront/homepage — mobile is an authored composition)
- [x] 7.4 At 390px confirm editorial frames run full-bleed with no side gutter and the Selection presents as a snapping rail
- [x] 7.5 Tab the whole page and confirm reading-order focus, a visible focus ring on both surfaces, one tab stop per product card, and a 44px minimum target on every control
- [x] 7.6 Set text zoom to 200% and confirm nothing is clipped, overlapped or unreachable — required one fix: the `display` role now breaks a word it cannot fit (design.md — Decision 12a). The residual horizontal scroll at 200% comes from `SiteHeader`, is pre-existing and worse on `/specimen`, and is recorded in design.md Risks rather than fixed here
- [x] 7.7 With `prefers-reduced-motion: reduce`, confirm all content is immediately present with no translation, scale or stagger, and the hierarchy is unchanged
- [x] 7.8 Disable JavaScript and confirm every section, product link and navigation destination is present and activatable; re-enable and confirm the `Reveal` failsafe never has to fire under a throttled load
- [x] 7.9 Confirm no console error, no hydration warning and no layout shift, and that the page adds no client component of its own — the shell's header is the only client code on the route
- [x] 7.10 Open `/specimen` and confirm the header and footer still render exactly once, from the layout
- [x] 7.11 Read every string the page renders and confirm each is a navigational label, a supplied brand value, or a marked placeholder — no invented copy, claim, material, price, availability or scarcity anywhere (specs/storefront/homepage — no unsupplied value as finished content)
- [x] 7.12 Run the anti-slop review pass: no repeated section composition, no uniform card row, no centred block over two lines, no rounded or pill geometry, no gradient, no shadow on content, at most eight icons, and no section whose only content is decoration
- [x] 7.13 Confirm scope held — no cart, wishlist, search, filter, account or checkout code; no new dependency; no catalog module changed; no design-system requirement modified
