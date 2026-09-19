## Context

Three prior changes built a storefront with no brand in it, and were explicit
that filling it in would be a data change. That held for most of it — the name,
the copy, the collection and every photograph went in through `lib/brand.ts` and
`components/home/plates.ts` with no component touched. Three things did not, and
this document is about those three.

## Decisions

### Decision 1 — The chroma ceiling is exempted by name, not raised

Four of the five supplied colours sit under the existing 0.02 chroma ceiling:
parchment at 0.0119, espresso at 0.0105, stone at 0.015, taupe at 0.0172. The
palette shift from grey to warm is therefore free, and the surface set is
unchanged in kind.

Garnet is at 0.0886 and has to get past the ceiling somehow. There were three
ways:

1. **Raise the ceiling to ~0.09.** Rejected. It makes the constraint arithmetic
   rather than editorial: any colour under 0.09 becomes admissible, including a
   second and a third, and including colours nobody argued for.
2. **Delete the check.** Rejected for the obvious reason.
3. **Name the one token in an `EXEMPT` map with its reason.** Taken. The ceiling
   still holds for every other token, a second chromatic token still fails the
   build, and the exemption is one line that a reviewer can see and argue with.

The ceiling existed to keep metal out of the token set. An exemption weakens
that, so the same commit strengthens it on a second axis: `HUE_EXCLUSION` fails
any token carrying chroma above the ceiling with a hue between 60° and 110°,
exempt or not. Gold lives there. Garnet is at 11°. The rule "gold is a material,
not a colour" is now enforced by hue, which is the property that actually
distinguishes gold, rather than only by saturation, which does not.

### Decision 2 — Garnet is an accent, never a surface

The brand direction says the interface should feel "parchment / garnet /
espresso". The literal reading is a third surface. It was rejected.

A third surface needs a foreground, a muted foreground and a hairline that all
clear their floors against it, and every component that reads `--surface-*`
would silently start rendering on it. Taupe on garnet measures 5.50:1 so it
would have worked — but the system's own requirement is "exactly two surfaces",
and buying a third to place one colour is the expensive way to do it.

Garnet is used in two places, and both are enumerable in one sentence: the fill
of the single `primary` action a view is allowed, and `::selection`. Everything
else warm on the page is inside a photograph, which is the direction's actual
point — the UI carries the mood, the jewellery carries the metal.

The `primary` button's *boundary* stays `on-surface` rather than garnet.
Garnet against ink measures 1.40:1, so a self-coloured garnet button loses its
edge entirely on the inverted surface. Fill is the brand's, boundary is the
surface's, label is paper at 11.19:1 either way.

### Decision 3 — The Selection section is replaced, not filled

`build-homepage`'s third section presented four product cards. The catalog is
still structural specimens: prices are `null`, material lines are `null`, names
name the structure they demonstrate. That section can only render four cards
reading `[PRICE]` and `[MATERIAL LINE]` until the business supplies a catalog,
and no amount of art direction changes that.

Two options:

1. **Invent products.** Rejected, and not narrowly — it is the one thing
   BRAND-INPUTS.md, the visual-language spec and the project's own rules all
   forbid independently.
2. **Present what needs no catalog data.** Taken. A product *type* has a name
   and a photograph and asserts nothing. Five of them are exactly what the
   business's own homepage composition asks for in that slot.

This is the change's one real spec edit rather than a data change, and it is why
`storefront/homepage` carries a REMOVED requirement. The constraint that
requirement expressed is not lost: it is restated for the type index, and the
structural guarantee behind it — no rating, review, badge, discount or scarcity
field anywhere in the catalog model, enforced by `check-catalog.mjs` — is
untouched.

### Decision 4 — Five frames, five ratios, hand-placed

Five divides into nothing. A 3+2 grid reads as a row that ran out, and five
equal frames in a rail read as a card grid, which is the composition the
product-card requirement rejects for listings and which reads the same way here.

`LAYOUT` places each frame by hand on the twelve-column grid, at a different
span and a different vertical offset. The offsets are drawn from the spacing
tokens, and they are **positive only**: a negative margin inside a grid is how
two frames come to overlap at a width nobody tested, and overlapping content is
a stated failure in the responsive requirement.

The aspect ratios are not decoration either. Each is the shape its subject
occupies: a hanging earring is tall, a wrist entering from the frame edge is
wide, a group of rings on stone is square. Below 1024px the same five become the
rail, which is the one arrangement where five is not awkward at all.

### Decision 5 — `Plate` gains `position`, and it belongs to the photograph

The hero is one photograph serving a 4/5 crop at phone width and a 5/2 crop at
desktop. Its figure stands in the right half of the frame against empty
travertine — which is the composition the wide crop wants, and which a centred
4/5 crop cuts at the shoulder.

The alternatives were a second photograph per breakpoint, which downloads both
frames for every visitor because browsers fetch inside `display: none`, or
re-shooting the hero with a centred subject, which throws away the negative
space the heading is set against.

`position` is declared beside `src` and `crop` rather than passed by the layout,
because where the subject sits is a fact about the photograph. It travels with
the image wherever it is placed, and a replacement photograph replaces it along
with the `src`.

### Decision 6 — Photography is generated by a script that is not application code

`scripts/generate-images.mjs` holds one prompt per frame and writes
`public/images/`. Nothing under `app/`, `components/` or `lib/` imports it and
the storefront calls no model at request time — the pages are static and the
images are files.

Keeping the prompts in the repository is the point of the script rather than a
side effect. A frame that needs re-shooting is re-shot from a diff-able prompt,
the art direction for the whole set lives in one `HOUSE_STYLE` constant, and the
brief in BRAND-INPUTS.md has something exact to correspond to.

The key is read from `.env` inside the script and appears in no committed file,
no log line and no generated output.

`sharp` encodes the results to JPEG at 2400px. It is already present as a Next
dependency, it is used by this script only, and the call is wrapped so that if
it is ever absent the model's bytes are written unchanged. A 1.6MB lossless PNG
of a photograph is eight times the file for no visible gain.

### Decision 7 — The assurance line is policy-driven, so today it is absent

The business asked for a "why us" section: crafted with care, timeless design,
thoughtful packaging, secure shopping. Every one of those is a claim, three of
them are claims about policies the business has not stated, and the copy rule
rejects all four for carrying neither a measurable fact nor a photographable
noun.

The section is built, wired to `brand.policies`, and renders one hairline row
per policy the business has actually stated. None are stated, so the line omits
itself — which follows the rule `SiteFooter` already established: an optional
affordance omits itself, only a structural section renders unfilled.

Supplying `shipping`, `returns`, `care` or `hallmarking` in `lib/brand.ts` is the
whole of what it takes for it to appear. That is a better outcome than either
inventing four sentences or declining to build the section at all.

### Decision 8 — `/types` 404s, and that is the existing honest state

The business asked for a category entry in the primary navigation.
`build-homepage` shipped a header whose every destination 404s — `/shop`,
`/collections`, `/about` — and recorded that as "the honest state and verified
rather than hidden" rather than hiding the links until the routes existed.

`/types`, `/contact`, `/search`, `/wishlist` and `/cart` join that list on the
same terms. They are listed in tasks.md against the changes that owe them so
none is forgotten, and `/types` may reasonably be delivered as a redirect to
`/shop` rather than as a page.

## Risks

**The supplied hero and closing statements do not satisfy the copy rule.**
"Timeless beauty, made to be remembered." and "Made for your moments." carry
neither a measurable fact nor a photographable noun, which the visual-language
requirement says is grounds for rejection. They are the business's own words,
supplied deliberately, and brand copy is the business's to set — so they are
rendered as given and the exception is recorded against them in BRAND-INPUTS.md
rather than being quietly rewritten. Every other sentence on the page satisfies
the rule.

**The collection name is read from the business's section heading, not supplied
directly.** The business supplied "Modern classics. Lasting stories." as the
heading for a signature collection and did not name the collection. `Modern
Classics` is that heading read as a name. It is recorded in BRAND-INPUTS.md as
derived rather than supplied, and renaming it is one line in `lib/brand.ts`.

**The photographs are generated, not commissioned.** They are consistent,
plausible and specific, and every `alt` describes the frame as it actually
exists. They are still not photographs of the pieces the business sells, because
the business has not supplied pieces. Nothing in the composition depends on
them: `plates.ts` is a list of nine `src` values.

**The homepage is 6.6k pixels tall at 1440.** Five sections of dominant
photography is the composition the brand direction asked for, and the frames
below the fold are lazy. It is worth measuring against real-world scroll depth
once there is traffic to measure.
