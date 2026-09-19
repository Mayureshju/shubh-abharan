## Context

See `proposal.md` — Why. The constraints that actually shape the approach:

- **The brand record is entirely `null` and no image carries a `src`.** `lib/brand.ts` has no name, no collections, no voice; `lib/catalog/data/products.ts` holds six structural specimens whose every brand-owned value is `null`. The homepage is therefore composed against placeholders by design, and the decision taken with the user is to ship that honestly rather than fill the record as part of this change.
- **`brand.collections` is empty, so `collections` in the catalog is empty too.** `data/collections.ts` derives entirely from the brand record. Any homepage section that presents a collection has nothing to name until the business supplies one.
- **The rules are mostly already enforced.** `globals.css` deletes the default palette, radius scale, type scale and every shadow/blur utility; `check-slop.mjs` greps the handful Tailwind implements statically. What remains unguarded on a page like this is tier 3 — the composition rules (6, 7, 9, 10, 13). Those are the ones this change has to hold by construction.
- **`SiteFooter` hard-codes `mt-breath`.** The last join on every page is already a `breath`, which constrains what the page can do immediately above the footer. Nothing in the design system says so; it is only visible by reading the component.
- **`Reveal` is CSS-only and deliberately does not import Motion.** Motion enters through `LazyMotion` + `m` inside client islands only. There is exactly one such island today (`NavOverlay`).
- **`app/layout.tsx` renders no shell.** `/specimen` mounts `SiteHeader` and `SiteFooter` itself, which was fine for one internal surface and is wrong for a storefront.
- Dependencies are `next`, `react`, `motion`. This change adds none. There is no test runner; verification is `npm run check` plus review at the defined widths.

## Goals / Non-Goals

**Goals:**

- A composition that holds the tier-3 rules by construction rather than by review — where a rule can be made structurally impossible or greppable, do that instead of writing it down.
- Every unsupplied value visible as unsupplied, with a single data-shaped exit: filling `BRAND-INPUTS.md` and `lib/brand.ts` turns the page real with no component change.
- No client component added by the page at all — the shell's header is the only client code on the route.
- A homepage whose sections are reusable by later routes only where that is free — no premature section framework.

**Non-Goals:**

- A layout or section abstraction. Five sections, five components, no `<Section>` wrapper taking a `rhythm` prop. `/specimen` already has one and it exists because that surface renders twenty near-identical blocks; the homepage renders five deliberately different ones.
- Per-breakpoint art direction beyond a second aspect ratio (see Decision 10).
- Any route the homepage links to.
- Filling the brand record or shooting photography.

## Decisions

### 1. The shell moves into `app/layout.tsx`; `/specimen` drops its own mounts

```
app/layout.tsx
  <body>
    <SiteHeader />
    <main id="main">{children}</main>
    <SiteFooter />
```

`app/specimen/page.tsx` loses its two mounts and its outer wrapper. The header is already a client component; putting it in the layout does not make the layout one — the layout stays a server component rendering a client child.

**Alternative rejected — the homepage mounts them itself, as `/specimen` does.** Zero change to two existing files, but every subsequent route repeats the same three lines and the landmark contract becomes a convention instead of a guarantee. The cost of getting it right is four lines now versus a correction across four later changes.

**Alternative rejected — a separate `build-storefront-shell` change**, which `establish-brand-system`'s proposal anticipated. The shell is two component mounts and a landmark; a whole change around it is ceremony. It is captured as its own capability spec (`storefront/app-shell`) so the contract is still durable.

### 2. No announcement band

The candidate structure opened with "global announcement/navigation area". An announcement is brand copy, `BRAND-INPUTS.md` has no field for one, and the business has not asked for one. Adding a field plus a placeholder band would put a permanently-empty strip above every page and invite it to be filled with "Free shipping over £X" — a policy claim the system deliberately cannot make.

The `storefront/app-shell` spec therefore states that a band exists only when content is supplied, and that no placeholder band is rendered for it. If the business later supplies announcement content, it is a brand field and a conditional render, in that order.

### 3. Five sections, and what the candidate structure lost

The nine candidate sections collapse to five because several of them are the same section twice:

| Candidate | Outcome |
| --- | --- |
| Announcement / navigation | Navigation is the shell; announcement dropped (Decision 2). |
| Hero | Section 1. |
| Featured collection / collection story | Section 2. |
| Curated product presentation | Section 3. |
| Editorial brand / story section | Merged into section 2 — a collection *is* the story, and a separate prose block with no supplied voice is a placeholder paragraph. |
| Material / detail / craftsmanship | Section 4, expressed as the `scale` plate (Decision 7). |
| Secondary product rail | **Dropped.** A second rail of the same cards is rule 10's failure case in its purest form, and with six fixtures it would repeat products from section 3. |
| Final brand statement / CTA | Section 5. |
| Footer | The shell. |

Dropping the second rail is what makes rule 10 hold without contrivance: no two sections on this page have the same job.

### 4. Rhythm is scored once, including the footer's fixed join

| Join | Value | Why |
| --- | --- | --- |
| Hero → Collection | `normal` | The default join. |
| Collection → Selection | `tight` | The collection and the pieces in it belong to each other. Satisfies "at least one `tight`". |
| Selection → Scale | `breath` | The page's one real pause, before the surface inverts. |
| Scale → Statement | `normal` | Must not be `breath`: the next join already is. |
| Statement → footer | `breath` | Fixed by `SiteFooter`, not chosen here. |

`DESIGN-SYSTEM.md` gains a line recording that the footer owns the final join, so `build-shop-and-collections` and `build-product-detail` score their pages against four joins plus one they do not control.

**Alternative rejected — removing `mt-breath` from `SiteFooter` so pages own every join.** More flexible, and it changes a component `establish-brand-system` shipped and `/specimen` is accepted against, for a flexibility no page has yet needed.

### 5. Three typographic roles; `title` is spent nowhere

Rule 6 caps the page body at three roles and `display` at two appearances. The homepage spends them:

- `display` ×2 — the Hero's `<h1>`, and the closing statement.
- `body` — running copy, and the product card's name line (the card already uses it).
- `caption` — every section heading, the register labels, the material line, the price, the scale dimension, and everything in the header and footer.

So `title` does not appear on this page. Section headings are `<h2>` elements set at `caption`, which the responsive spec explicitly permits: *"Headings SHALL reflect document structure rather than being chosen for visual size; typographic role and heading level are independent."* Small, tracked, uppercase section headings against two very large display statements is the bimodal scale doing exactly what it was built for, and it is the register a fashion house actually sets.

The closing statement is a `<p class="text-display">`, not a heading — the same spec requires display-for-emphasis not to be marked up as one.

**Alternative rejected — `display` on the Hero and the collection name, with the closing statement at `body`.** Also legal, and it makes the collection name the page's second voice. Rejected because the collection name is one or two words supplied by the business and sized at display it dominates a section whose subject is the photograph; and a closing statement set at body size is not a statement.

### 6. Two new brand fields, not inline placeholder strings

```ts
// lib/brand.ts — added to Brand, both null in the live record
heroStatement: BrandField;
closingStatement: BrandField;
```

Rendered through the existing `resolve(value, field)`, so they print `[HERO STATEMENT]` and `[CLOSING STATEMENT]` until supplied, and `BRAND-INPUTS.md` gains the matching `## Homepage` rows.

**Alternative rejected — writing `[HERO STATEMENT]` directly in the component.** Identical on screen today, and it breaks the property the whole brand boundary exists for: *filling a value is an edit to `BRAND-INPUTS.md` and `lib/brand.ts`, never to a component.* An inline string has no path from the business to the page.

**Alternative rejected — inventing a hero line.** Forbidden by the first requirement of `design-system/visual-language`, and it is the single fastest way to make this page read as generated.

### 7. The Scale section is the craftsmanship section

The candidate structure asked for a material/detail/craftsmanship section. With no materials vocabulary and no photography, the honest version of that is not a prose block about workmanship — it is the system's `scale` image role: one piece at true size in a generous empty field, with its measured dimension as the caption.

It needs no brand copy at all. `Plate` already renders the dimension as a `<figcaption>` for the `scale` role, and the dimension comes from the catalog (`[WIDTH]` today). Inverted to the `ink` surface and full-bleed, it is the page's strongest section and the one least able to be filled with marketing language, because there is nowhere to put a sentence.

This is also the section that differs most from its neighbours on every axis at once — surface, column count and image scale — which is what lets the two product-led sections above it sit closer together.

### 8. The presented collection: first in declared order, and unfilled rather than absent

```ts
const [featured] = brand.collections;                              // declared display order
const entry = featured ? await getCollection(featured.slug) : null; // name, description, products
```

No ranking, no "featured" flag, no new field. The brand record's order *is* the editorial judgement; inferring a different one would be inventing editorial judgement the business did not supply.

**No `listCollections()` is added to the repository.** `brand.collections` is a brand read, not a catalog read, and `SiteHeader` and `NavOverlay` already read it directly — the "components must not import fixture modules" rule is about `lib/catalog/data/`, which this does not touch. The one catalog read the section needs, the collection's products, goes through `getCollection(slug)`, which exists. Adding an operation to the access surface for a caller that already has both halves would widen a spec'd contract for nothing.

When there are none, the section renders with a marked unfilled state where the name and description go — it does not remove itself. That draws a line the codebase has not had to draw before:

- **Optional affordances omit themselves.** `SiteFooter` drops a policy link when the policy is unsupplied; a link to nothing is worse than no link.
- **Structural sections render unfilled.** `NavOverlay` already does this — it prints `[COLLECTION NAMES] — unfilled, see BRAND-INPUTS.md` rather than showing an empty navigation. A homepage that silently loses a section when data is missing cannot be composed or rhythm-scored at all.

The section's link is suppressed while there is no collection to link to, because that is an affordance, not structure.

**The section's frame is an editorial slot, not the collection's first product image.** A collection story frame is a different photograph from a product shot, and sourcing it from the collection's contents would make the section render nothing at all while `brand.collections` is empty — the failure Decision 8 exists to avoid. Two editorial slots total, both declared in `components/home/plates.ts`: the hero frame and the collection frame. Every other image on the page is catalog data.

**Alternative rejected — omitting the section when there are no collections.** The page would then have two compositions, only one of which anyone has reviewed, and the rhythm score would differ between them.

### 9. The Selection set: declared catalog order, roles chosen by the layout

```ts
const products = (await listProducts()).slice(0, 4);
```

`listProducts()` with no criteria returns the catalog's declared display order. No sort, no filter, no popularity — the model carries nothing that could express one, and `check-catalog.mjs` fails the build if a field that could is ever added.

Which four is data. *How* each is presented is the layout's decision, exactly as `/specimen` does it:

```ts
const SLOTS = [
  { role: "macro",  className: "..." },
  { role: "scale",  className: "md:mt-tight" },
  { role: "worn",   className: "..." },
  { role: "detail", className: "md:mt-tight" },
];
```

`toProductCardProduct(product, role)` is the one path from a `Product` to a card, and the role it is given is the slot's, not the product's. `imageForRole` falls back to the primary image when a product has no image in that role, so the slot table cannot break on a product that carries fewer images.

Card variation comes from the image aspect ratios the roles carry (`4/5`, `1/1`, `3/4`, `5/4`) plus a vertical offset on two slots — not from grid row spans. Differing intrinsic heights are what stop this reading as a uniform row, and they survive the mobile rail, where every card is the same width by definition.

At mobile the set uses the existing `.rail` class, which already handles full-bleed escape, snap points and scroll padding, and becomes a four-column grid at 768px via `--rail-columns`.

### 10. Two declared aspect ratios per plate, not two plates

A hero frame cannot use one aspect ratio at 390px and 1920px: `2/1` is 195px tall on a phone, `4/5` is 2400px tall on a desktop. `Plate` writes `style={{ aspectRatio: aspect }}` inline, so a class cannot override it.

`Plate` gains one optional prop:

```tsx
aspectMd?: string;   // applied from 768px up
```

implemented as two custom properties set inline plus one media query in `globals.css`:

```css
[data-plate-aspect-md] { --plate-aspect: var(--plate-aspect-sm); }
@media (min-width: 768px) {
  [data-plate-aspect-md] { --plate-aspect: var(--plate-aspect-md); }
}
```

The placeholder prints both ratios, so the shoot brief still reads correctly off the screen.

**Alternative rejected — two `Plate`s, one hidden per breakpoint.** Browsers fetch images inside `display: none` subtrees, so once photography exists every visitor downloads both frames. Free today because no image has a `src`, and a permanent regression the moment one does.

**Alternative rejected — passing `aspect="var(--hero-aspect)"` with the variable defined in CSS.** No component change, and the placeholder then reads `Aspect var(--hero-aspect)`, which makes the one artifact the photographer works from useless.

This touches a design-system component. It adds an optional capability and changes no requirement: `core-components` requires a declared aspect ratio that reserves space before load, and two declared ratios satisfy it at both widths.

### 11. The Hero sets its heading below the frame, not over it

The frame runs full-bleed; the `<h1>` and the single `primary` action sit beneath it, the heading in the left column and the action on its baseline at the right. Nothing overlaps the photograph.

This deletes the page's only encounter with the sanctioned gradient. Text over photography needs a contrast guarantee against an image nobody has shot yet, which can only be satisfied with the 35% scrim — the one slop-check exemption in the system. Setting the line under the frame needs no scrim, no exemption and no `slop-check: allow` comment, and it is the more editorial composition.

If a later art direction wants the line over the image, the scrim is available and the spec already states its terms.

### 12. The hero entrance is CSS, and the page has no client component

**Revised during implementation.** This decision originally specified a Motion
client island: `LazyMotion` + `m` + `MotionConfig reducedMotion="user"`,
staggering frame, heading and action. Built that way, the production build
renders this into the static HTML:

```html
<h1 class="max-w-[14ch] text-display" style="opacity:0;transform:translateY(14px)">
```

Motion renders its `initial` variant server-side. With scripting disabled, or
with the bundle blocked or failed, the hero heading and the page's only
`primary` action stay invisible permanently — the exact failure
`specs/design-system/responsive-accessibility` forbids: *"no content is hidden
pending an animation"*. It also breaks the `storefront/app-shell` scenario
requiring links to be activatable before client script initialises.

The entrance is therefore a CSS keyframe with `both` fill, three steps staged
by `animation-delay`, timing entirely in tokens:

```css
[data-hero-step]          { animation: hero-in var(--duration-slow) var(--ease-out) both; }
[data-hero-step="2"]      { animation-delay: var(--duration-instant); }
[data-hero-step="3"]      { animation-delay: var(--duration-quick); }
```

It runs with or without scripting and cannot be left half-applied. The delays
sit inside `@media (prefers-reduced-motion: no-preference)`, so a customer who
asked for reduced motion gets no stagger at all — the global rule already drops
the duration to 1ms and resolves `--reveal-travel` to 0, giving two independent
neutralisations.

This is still one orchestrated staggered sequence, which is what the motion
spec budgets per route; the requirement is about composition, not about which
runtime plays it.

The original objection to CSS — *"hand-rolled delay chains are where bespoke
durations creep in"* — is answered by the delays being `--duration-instant` and
`--duration-quick` rather than literals. An arbitrary millisecond value in that
block would be as conspicuous as anywhere else in the system.

**Consequence: the homepage adds no client component at all.** Every section
renders on the server; the only client code on the route is `SiteHeader`, which
the shell already owned. Sections 2 to 5 reveal as single units through
`Reveal`, which is CSS-only. Product cards are **not** individually staggered.

**Alternative rejected — keep Motion and patch the gap** with a `<noscript>`
style override plus a 3s failsafe animation mirroring `Reveal`'s. The
`<noscript>` covers scripting-disabled but not a failed or slow bundle, which
would leave the page's opening frame blank for three seconds. Tolerable for a
section below the fold, which is what `Reveal`'s failsafe was sized for; not
for the hero.

**Alternative rejected — Motion `whileInView` on every section.** It would
duplicate `Reveal`, which the motion spec forbids outright ("Components MUST
NOT implement their own scroll observers"), and pull an animation runtime into
every section of a server-rendered page.

Motion stays a dependency and stays loaded on this route through `NavOverlay`,
where a JS-driven animation is the right tool: that overlay only exists when
script is running, so there is no degradation gap to open.

### 12a. The display role breaks a word it cannot fit

Found during verification, not planned. The type scale is rem-based so browser
text zoom works, which means at 200% zoom the `display` role's own floor is
104px. Any word longer than about six characters is then wider than a 390px
viewport, and it spilled past the gutter and gave the page a horizontal
scrollbar — which the responsive requirement forbids at every verified width.

One declaration on the role binding in `globals.css`:

```css
:where(.text-display, .text-title) { overflow-wrap: break-word; }
```

`break-word` only acts when a word genuinely cannot fit, so nothing changes at
normal zoom or on any viewport the page is verified at. It is a defect fix in
an existing rule rather than a new capability, and it changes no requirement:
the scale, its four roles and its rem basis are untouched.

The placeholder `[HERO STATEMENT]` exposed it, but it is not a placeholder
artefact — real brand copy with any ordinary long word hits it identically.

### 13. No parallax

The motion spec permits parallax on decorative imagery at ≤8% travel and forbids it on anything a customer reads or activates. Every image on this page is informational — product photography with alt text, or the hero frame the `<h1>` refers to. Satisfying the rule would mean adding an image that exists only to move, and scroll-linked work would need a second client island on a page that currently needs one.

Recorded rather than silently skipped, because "restrained parallax where it improves depth" was asked for and this is the reason it is absent.

### 14. Enforcement: extend `check-slop.mjs` rather than trust review

Rule 6 is the rule this page is most likely to erode under later edits, and it is greppable. `check-slop.mjs` gains one homepage-scoped assertion over `app/page.tsx` and `components/home/`:

- `text-title` must not appear at all.
- `text-display` must appear at most twice.

```
ponytail: counts occurrences in source, not renders. A conditional branch
could hide a third display, or a loop could render one twice. Tightens to a
DOM assertion if this page ever grows a conditional heading.
```

Rules 7, 9, 10 and 13 stay review — a grep cannot see a composition. They are held by Decision 3 (no two sections share a job), Decision 5 (no centred block exists), Decision 12 (one sequence) and Decision 6 (no copy is authored here at all).

### 15. Links to routes that do not exist

The homepage links to `/shop`, `/collections/<slug>` and `/products/<slug>`. None exist; all 404 until later changes land. `SiteHeader` and `ProductCard` already do this and `npm run check` passes, so typed routes are not rejecting them today. The verification task re-confirms it rather than assuming, because this change adds the first `/collections/<slug>` link in the codebase.

A 404 is the honest state. Stubbing the routes to avoid it would put three empty pages in a change whose scope is one.

## Risks / Trade-offs

**The page reads as a wireframe, and is judged as one.** → Accepted deliberately, with the user's decision on record. Acceptance for this change is compositional: section variation, rhythm score, responsive behaviour at five widths, motion budget, keyboard order. The exit is two rows of `BRAND-INPUTS.md` and a shoot brief the page itself generates — not a code change.

**The Collection section is the weakest with no data.** It is the one section whose entire text content is unfilled placeholders. → Its composition carries it: a large `macro` frame against a short column, which is legible as a composition without a word. If it still reads as empty at review, the fallback is to merge sections 2 and 3 into one collection-led presentation rather than to invent a collection.

**Only four products with roles that may not all exist.** Fixtures declare between one and four images each. → `imageForRole` falls back to the primary image, so a slot never breaks; the cost is two cards possibly sharing an aspect ratio. The verification task checks that the rendered set still varies.

**`Plate` gains a prop for one page's benefit.** → It is the image primitive for every page, and the second ratio is the general form of a problem every hero and every full-bleed editorial frame will hit. If no other surface uses `aspectMd` by the end of `build-product-detail`, it should be removed.

**The hero entrance cannot be interrupted.** A CSS animation with `both` fill
plays to completion; there is no equivalent of Motion's interruptible
transitions. → It is a 900ms non-blocking entrance on decorative timing, and
the motion spec's interruption requirement is about *state changes* not waiting
on animation — nothing on this page changes state during it. Links are
clickable throughout.

**The `Reveal` failsafe reveals after 3s.** A slow hydration on a five-section page could show sections appearing late. → Already the established behaviour and already accepted on `/specimen`; the failsafe is the safe direction to fail in. Verification includes a throttled load.

**Found, not fixed — `SiteHeader` overflows at 200% text zoom.** At 390px with
the root font doubled, the header's single flex row (wordmark plus the 44px
menu control) measures 440px and gives the page a horizontal scrollbar. It is
`SiteHeader`, shipped by `establish-brand-system`, and `/specimen` has the same
problem more severely — 974px, from its demo tables. → Out of scope here: this
change does not refactor another change's component, and fixing the header
alone would not make `/specimen` pass. The homepage's own content is clean at
200% — the display role now breaks an unfittable word rather than spilling.
Hand this to whichever change next owns the shell.

**Shell in the layout changes `/specimen`.** → Two mounts removed from a surface that is not customer-facing and is verified by opening it. The verification task opens `/specimen` and confirms the header and footer still render exactly once.
