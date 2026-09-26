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

Hero slides 2–4 and the merchandising / journal blocks below are **development
content** (2026-09-20): they describe photographs already on disk so the rails
can be reviewed. They are not business-supplied inventory or a CMS.

| Field | Status | Value |
| --- | --- | --- |
| Hero eyebrow | SUPPLIED 2026-09-20 | Timeless elegance in every detail |
| Hero heading | SUPPLIED 2026-09-20 | Shubha Abharan (the brand name) |
| Hero support | SUPPLIED 2026-09-20 | Exquisite Jewellery for Every Moment of Your Life |
| Hero slides | DEVELOPMENT 2026-09-20 | Three frames from the same sitting: `hero`, `heroTwo`, `heroThree` — copy in `brand.heroSlides` |
| Closing statement | SUPPLIED 2026-09-20 | Because You Deserve to Shine |
| Closing support | SUPPLIED 2026-09-20 | Jewellery that celebrates you. |
| Footer brand statement | SUPPLIED 2026-09-20 | Grace in Every Gem |
| Wordmark | SUPPLIED 2026-09-20 | `/brand/lotus.svg` |
| Reasons — Premium Quality | SUPPLIED 2026-09-20 | Crafted with the finest materials |
| Reasons — Trusted Heritage | SUPPLIED 2026-09-20 | A legacy of elegance and trust |
| Reasons — Elegant Packaging | SUPPLIED 2026-09-20 | Beautifully packed for every occasion |
| Reasons — Secure Shopping | SUPPLIED 2026-09-20 | Safe & hassle-free experience |
| Occasions | DEVELOPMENT 2026-09-20 | Wedding, Festive, Everyday |
| New arrival slugs | DEVELOPMENT 2026-09-20 | emerald-drop-kundan-necklace, chandbali-earrings, emerald-drop-pendant, chain-and-pendant |
| New arrival rows | DEVELOPMENT 2026-09-20 | `1` — desktop grid pages at 1–4 rows; same photographs |
| Featured slugs | DEVELOPMENT 2026-09-20 | emerald-silk-bridal-set, floral-kundan-collar, stacked-emerald-rings, kundan-bangles, emerald-drop-kundan-necklace, chandbali-earrings, emerald-drop-pendant, chain-and-pendant |

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

Hero slides 2–3 and the extra collection frames reuse the same jewellery as the
primary hero and collection stills — a different pose or surface, not a
different piece.

| Slot | Role | Aspect | Intended crop | Status | Prompt id |
| --- | --- | --- | --- | --- | --- |
| Hero | `worn` | `4/5` below 768px, `16/9` from 768px, position `72% 40%` | Figure right, room at left for overlay type | GENERATED 2026-09-19 | `hero` |
| Hero 2 | `worn` | `4/5` below 768px, `16/9` from 768px, position `68% 40%` | Same sitting, toward camera | GENERATED 2026-09-20 | `hero-2` |
| Hero 3 | `worn` | `4/5` below 768px, `16/9` from 768px, position `72% 38%` | Same sitting, three-quarter profile | GENERATED 2026-09-20 | `hero-3` |
| Collection | `macro` | `4/5` below 768px, `5/4` from 768px | Necklace filling a split panel | GENERATED 2026-09-19 | `collection` |
| Collection 2 | `macro` | `4/5` below 768px, `5/4` from 768px | Same collar, frontal on lilac silk | GENERATED 2026-09-26 | `collection-2` |
| Collection 3 | `macro` | `4/5` below 768px, `5/4` from 768px | Same collar on aubergine velvet | GENERATED 2026-09-26 | `collection-3` |
| Detail | `detail` | `1/1` | Unused on the homepage after `clone-shubha-moodboard` | GENERATED 2026-09-19 | `detail` |
| Closing campaign | `worn` | `4/5` below 768px, `16/9` from 768px, position `60% 50%` | Figure in a lit interior, room for overlay type | GENERATED 2026-09-19 | `campaign` |
| Type — Necklaces | `macro` | `1/1` | Centred still, circular crop | GENERATED 2026-09-19 | `category-necklaces` |
| Type — Rings | `macro` | `1/1` | Centred still, circular crop | GENERATED 2026-09-19 | `category-rings` |
| Type — Bracelets | `worn` | `1/1` | Centred still, circular crop | GENERATED 2026-09-19 | `category-bracelets` |
| Type — Earrings | `detail` | `1/1` | Centred still, circular crop | GENERATED 2026-09-19 | `category-earrings` |
| Type — Bangles | `macro` | `1/1` | Centred stack, circular crop | GENERATED 2026-09-20 | `category-bangles` |
| Type — Pendants | `macro` | `1/1` | Product photography; not on the type index | GENERATED 2026-09-19 | `category-pendants` |

The type-index frames are identically square so a circular crop can take them.
Bracelets and Bangles both resolve to the catalog `bracelet` filter; the
photographs differ.

Product cards do **not** reuse those type stills. Eight dedicated `product-*`
frames are full-bleed 1:1 catalog photographs (no circular vignette) so every
card in New arrivals and Featured is the same square.

| Slot | Role | Aspect | Intended crop | Status | Prompt id |
| --- | --- | --- | --- | --- | --- |
| Card — Necklace | `macro` | `1/1` | Full-bleed square on ivory marble, lilac silk | GENERATED 2026-09-26 | `product-necklace` |
| Card — Collar | `macro` | `1/1` | Full-bleed square on ivory marble, lilac silk | GENERATED 2026-09-26 | `product-collar` |
| Card — Earrings | `macro` | `1/1` | Full-bleed square on ivory marble, lilac silk | GENERATED 2026-09-26 | `product-earrings` |
| Card — Pendant | `macro` | `1/1` | Full-bleed square on ivory marble, lilac silk | GENERATED 2026-09-26 | `product-pendant` |
| Card — Rings | `macro` | `1/1` | Full-bleed square on ivory marble, lilac silk | GENERATED 2026-09-26 | `product-rings` |
| Card — Bangles | `macro` | `1/1` | Full-bleed square on ivory marble, lilac silk | GENERATED 2026-09-26 | `product-bangles` |
| Card — Bridal set | `macro` | `1/1` | Necklace and chandbalis on ivory marble, lilac silk | GENERATED 2026-09-26 | `product-bridal-set` |
| Card — Chain | `macro` | `1/1` | Pendant on a looping chain, ivory marble | GENERATED 2026-09-26 | `product-chain` |

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

Collection membership for the development merchandise is filled in
`PRODUCT_ORDER` (`modern-classics`). Structural fixtures still declare none. The
homepage Collection section does not read that list.

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

Structural fixtures in `products.ts` stay unfilled. Development merchandise in
`lib/catalog/data/merchandise.ts` carries sample INR prices and photography from
`public/images/`. Currency for those records is **INR**.

| Field | Status | Value |
| --- | --- | --- |
| Product names, and the slug for each | DEVELOPMENT 2026-09-20 | Eight sample pieces in `merchandise.ts`; fixtures remain named as fixtures |
| Category per product (ring, necklace, pendant, earring, bracelet, set) | DEVELOPMENT 2026-09-20 | Covered by the sample set plus fixtures |
| Price per variant, and the currency the brand sells in | DEVELOPMENT 2026-09-20 | Sample INR on merchandise only; fixtures `null` |
| Material line per product | DEVELOPMENT 2026-09-20 | Names what the photograph shows (kundan, emerald drops, pearl drops) |
| Product description per product | DEVELOPMENT 2026-09-20 | Photographable nouns from the same frames |
| Care copy per product, where it differs from the brand-level care policy | UNFILLED | |
| Ring sizes offered, and the convention used (UK letter, US numeric, or both) | UNFILLED | Sample rings keep `[SIZE A]` placeholders |
| Chain and bracelet lengths offered, with units | UNFILLED | Sample chain keeps `[LENGTH A]` placeholders |
| Finish names offered, matching the finishes vocabulary above | UNFILLED | |
| Metal options offered, matching the metals vocabulary above | UNFILLED | |
| Availability per variant — available, made-to-order, sold-out, or unavailable | DEVELOPMENT 2026-09-20 | Stated per sample variant |
| Specification table rows per product (label and value pairs) | UNFILLED | |
| Which products compose each set | DEVELOPMENT 2026-09-20 | `emerald-silk-bridal-set` → necklace + chandbalis |
| Collection membership per product, and the order within each collection | DEVELOPMENT 2026-09-20 | See `PRODUCT_ORDER` for `modern-classics` |
| Occasion membership | DEVELOPMENT 2026-09-20 | wedding / festive / everyday as declared on each sample product |

## Journal

Three development posts in `lib/journal/data/posts.ts`. Copy describes the
photograph. Not business editorial.

| Slug | Title | Date | Frame |
| --- | --- | --- | --- |
| `kundan-collar-on-marble` | A collar on marble | 2026-09-12 | `collection.jpg` |
| `chandbali-on-cream-marble` | Chandbalis, paired | 2026-09-08 | `category-earrings.jpg` |
| `kundan-in-lamplight` | Kundan in lamplight | 2026-09-02 | `campaign.jpg` |

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
