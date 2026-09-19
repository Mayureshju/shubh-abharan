# Brand Inputs

Every brand-owned value the storefront renders is listed here. The design system
reads them through `lib/brand.ts`, which types each unsupplied value as `null`.

**Nothing in this file may be filled in by guesswork.** A `null` value renders a
visibly marked placeholder on screen. That is the intended behaviour — an unfilled
brand value must look unfilled, not like finished copy. Do not invent a value to
remove a placeholder.

Mark a field filled by replacing `UNFILLED` with the real value and setting the
matching field in `lib/brand.ts`.

A row marked **SUPPLIED** carries the date the business supplied it. A row marked
**DERIVED** was read from something the business supplied rather than given
directly, and says what it was read from — those are the rows to check first.

---

## Identity

| Field | Status | Value |
| --- | --- | --- |
| Brand name | SUPPLIED 2026-09-19 | Shubha Abharan |
| Legal entity name (footer, policies) | UNFILLED | |
| Wordmark asset (SVG, single colour, no embedded text) | SUPPLIED 2026-09-20 | `/brand/lotus.svg` |
| Wordmark clear-space ratio | UNFILLED | |
| Founding year (only if factual) | UNFILLED | |
| Place of business shown to customers | UNFILLED | |

## Voice

| Field | Status | Value |
| --- | --- | --- |
| Voice notes — 3 to 5 adjectives, with a sentence that exemplifies each | UNFILLED | |
| Words the brand uses | UNFILLED | |
| Words the brand never uses | UNFILLED | |
| How the brand refers to its customer (second person, "the wearer", …) | UNFILLED | |

Copy written against this system must satisfy the rule in
`specs/design-system/visual-language`: **every sentence carries either a
measurable fact or a physically photographable noun.**

## Homepage

The homepage renders mood-board copy from this record, supplied 2026-09-20 with
the board. Several sentences do not carry a measurable fact; they render as
given and the exception is recorded here rather than being rewritten.

| Field | Status | Value |
| --- | --- | --- |
| Hero eyebrow | SUPPLIED 2026-09-20 | Timeless elegance in every detail |
| Hero heading | SUPPLIED 2026-09-20 | Shubha Abharan (the brand name) |
| Hero support | SUPPLIED 2026-09-20 | Exquisite Jewellery for Every Moment of Your Life |
| Closing statement | SUPPLIED 2026-09-20 | Because You Deserve to Shine |
| Closing support | SUPPLIED 2026-09-20 | Jewellery that celebrates you. |
| Footer brand statement | SUPPLIED 2026-09-20 | Grace in Every Gem |
| Wordmark | SUPPLIED 2026-09-20 | `/brand/lotus.svg` |
| Reasons — Premium Quality | SUPPLIED 2026-09-20 | Crafted with the finest materials |
| Reasons — Trusted Heritage | SUPPLIED 2026-09-20 | A legacy of elegance and trust |
| Reasons — Elegant Packaging | SUPPLIED 2026-09-20 | Beautifully packed for every occasion |
| Reasons — Secure Shopping | SUPPLIED 2026-09-20 | Safe & hassle-free experience |

The four reasons are the Why Choose row. They are claims. They render because
the business supplied them on the mood board, not because the copy rule was
relaxed for invented text.

### Homepage photography

Nine frames, declared in `components/home/plates.ts`. Every one currently exists,
generated from a prompt held in `scripts/generate-images.mjs` under the id in the
last column. **These are generated photographs, not photographs of pieces the
business sells** — replacing one with a commissioned frame is an edit to `src`
and `alt` in `plates.ts` and this table, and no component changes.

`position` is set where the subject is deliberately off-axis and a narrower crop
would otherwise cut it.

| Slot | Role | Aspect | Intended crop | Status | Prompt id |
| --- | --- | --- | --- | --- | --- |
| Hero | `worn` | `4/5` below 768px, `16/9` from 768px, position `72% 40%` | Figure right, room at left for overlay type | GENERATED 2026-09-19 | `hero` |
| Collection | `macro` | `4/5` below 768px, `5/4` from 768px | Necklace filling a split panel | GENERATED 2026-09-19 | `collection` |
| Detail | `detail` | `1/1` | Unused on the homepage after `clone-shubha-moodboard` | GENERATED 2026-09-19 | `detail` |
| Closing campaign | `worn` | `4/5` below 768px, `16/9` from 768px, position `60% 50%` | Figure in a lit interior, room for overlay type | GENERATED 2026-09-19 | `campaign` |
| Type — Necklaces | `macro` | `1/1` | Centred still, circular crop | GENERATED 2026-09-19 | `category-necklaces` |
| Type — Rings | `macro` | `1/1` | Centred still, circular crop | GENERATED 2026-09-19 | `category-rings` |
| Type — Bracelets | `worn` | `1/1` | Centred still, circular crop | GENERATED 2026-09-19 | `category-bracelets` |
| Type — Earrings | `detail` | `1/1` | Centred still, circular crop | GENERATED 2026-09-19 | `category-earrings` |
| Type — Pendants | `macro` | `1/1` | Centred still, circular crop | GENERATED 2026-09-19 | `category-pendants` |

The five type frames are identically square so a circular crop can take them.

The hero and the closing frame are shot to two ratios. Overlay type sits on both.

## Collections

Navigation is collection-led — these are the primary navigation axis, capped at
five top-level items.

| Field | Status | Value |
| --- | --- | --- |
| Collection names, in display order | DERIVED 2026-09-19 | Modern Classics |
| One-line description per collection | SUPPLIED 2026-09-20 | Exquisite jewellery that blends tradition with contemporary elegance. |
| Collection tagline | SUPPLIED 2026-09-20 | Timeless Beauty |
| Collection slugs | DERIVED 2026-09-19 | `modern-classics` |

**The collection name is derived, not supplied.** The business supplied *"Modern
classics. Lasting stories."* as the heading for a signature collection and did not
name the collection itself. `Modern Classics` is that heading read as a name.
Renaming it is one line in `lib/brand.ts` plus this row.

The description names only what is in the collection's photograph, which is how a
line here clears the copy rule without making a claim about the pieces. Replace it
when the business writes its own.

Which products belong to the collection is still UNFILLED — `PRODUCT_ORDER` in
`lib/catalog/data/collections.ts` is empty, so `/collections/modern-classics`
presents no products. The homepage's Collection section does not read that list,
so it renders correctly regardless.

## Materials vocabulary

The exact terms the brand uses for its materials. These appear in the product
card material line and the product specification table.

| Field | Status | Value |
| --- | --- | --- |
| Metals and how they are named (e.g. "9ct recycled gold") | UNFILLED | |
| Finishes | UNFILLED | |
| Stones and the terms used for cut, colour and setting | UNFILLED | |
| Dimension conventions (mm, ct, gauge) and where each applies | UNFILLED | |
| Country or workshop of manufacture, if disclosed | UNFILLED | |

## Policy facts

Only real, business-confirmed values. If a policy does not exist, leave it
UNFILLED and the surface that would show it is omitted — it is not approximated.

**The homepage's Why Choose row reads from `brand.reasons`, not from these
policies.** Policies still omit their footer links while unsupplied.

| Field | Status | Value |
| --- | --- | --- |
| Shipping regions and stated timeframes | UNFILLED | |
| Returns window and conditions | UNFILLED | |
| Warranty or repair terms | UNFILLED | |
| Care instructions | UNFILLED | |
| Hallmarking or certification, if any actually held | UNFILLED | |
| Contact address and email shown to customers | UNFILLED | |

## Catalog

The per-product values the business must supply. Until they are, `lib/catalog/data/products.ts`
holds structural specimens whose brand-owned values are all `null` and render as marked
placeholders. Filling these in is an edit to that file and this table — no component changes.

| Field | Status | Value |
| --- | --- | --- |
| Product names, and the slug for each | UNFILLED | |
| Category per product (ring, necklace, pendant, earring, bracelet, set) | UNFILLED | |
| Price per variant, and the currency the brand sells in | UNFILLED | |
| Material line per product (e.g. "9ct recycled gold · 1.2mm") | UNFILLED | |
| Product description per product | UNFILLED | |
| Care copy per product, where it differs from the brand-level care policy | UNFILLED | |
| Ring sizes offered, and the convention used (UK letter, US numeric, or both) | UNFILLED | |
| Chain and bracelet lengths offered, with units | UNFILLED | |
| Finish names offered, matching the finishes vocabulary above | UNFILLED | |
| Metal options offered, matching the metals vocabulary above | UNFILLED | |
| Availability per variant — available, made-to-order, sold-out, or unavailable | UNFILLED | |
| Specification table rows per product (label and value pairs) | UNFILLED | |
| Which products compose each set | UNFILLED | |
| Collection membership per product, and the order within each collection | UNFILLED | |

Availability must be stated for every variant. The model has no default, because
`available` would be an inventory claim the business did not make and `unavailable`
would silently empty the shop.

Product labels are optional and drawn from a closed list of manufacturing facts —
**made-to-order**, **one-of-a-kind**, **hallmarked**, **limited-run**. Supply one only
where it is true of the piece. There is no field for anything else, and labels never
render on a product card.

## Not collected, by design

The system has no field for these, so they cannot be rendered:

- Customer reviews, ratings, or review counts
- Testimonials
- Certifications the business does not hold
- Compare-at prices, discount flags, or sale badges
- Stock countdowns or scarcity messaging
- Awards, press quotes, or customer counts

Adding any of them requires changing the spec first, not the component.
