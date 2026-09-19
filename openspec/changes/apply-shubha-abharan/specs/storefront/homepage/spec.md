## MODIFIED Requirements

### Requirement: The homepage presents a fixed editorial narrative

The homepage SHALL present five authored sections inside the main landmark, in this order and with these purposes:

| Order | Section | Purpose |
| --- | --- | --- |
| 1 | Hero | The primary visual statement: dominant photography, the page's top-level heading, one primary action. |
| 2 | Types | An index of the product types the shop sells, each presented as a photographic frame linking to that type's filter on the shop surface. |
| 3 | Collection | One named collection presented as a story — a large image against a short passage of running copy and a link into that collection. |
| 4 | Detail | One piece presented close, on the inverted surface, with copy describing what is visible in the frame. |
| 5 | Statement | A closing photographic frame, a closing brand statement, and one secondary action into the shop. |

The homepage MUST NOT present a section whose only content is decorative, and MUST NOT repeat a section's composition elsewhere on the page to fill vertical space.

#### Scenario: The homepage renders

- **WHEN** a customer opens the homepage
- **THEN** the five sections render in the stated order inside one main landmark
- **AND** no additional marketing, statistics, testimonial, certification or badge section is present

#### Scenario: A section would carry no content

- **WHEN** a section has neither supplied content nor a declared structural placeholder to render
- **THEN** the page is recomposed rather than filling the section with decoration

### Requirement: The Hero is a single visual statement with one primary action

The Hero SHALL present one dominant photographic frame, the page's single top-level heading, and at most one action in the `primary` presentation. It MUST NOT present a second competing call to action, a badge, a statistic, or a decorative graphic element.

The Hero MAY present one secondary action alongside the primary one, provided it is set in a presentation that cannot be mistaken for a button — an underlined inline link — so the two do not read as a pair of equal choices.

Where heading text is placed over photography, it SHALL meet its required contrast ratio against the underlying image, using a single-direction scrim at 35% opacity or less only where the photograph alone cannot.

#### Scenario: The Hero renders

- **WHEN** the Hero renders
- **THEN** it presents one photographic frame, one top-level heading, and no more than one `primary` action

#### Scenario: A secondary action is present

- **WHEN** the Hero presents a second action
- **THEN** it is set as an inline link rather than as a second button
- **AND** the primary action remains the only filled control in the section

#### Scenario: Heading text overlays photography

- **WHEN** the Hero's heading is placed over its photograph
- **THEN** the heading meets its contrast floor against the image
- **AND** any scrim applied is a single-direction black at 35% opacity or less

#### Scenario: A second call to action is proposed

- **WHEN** a second `primary` action is added to the Hero
- **THEN** it is rejected and demoted to a secondary presentation or removed

### Requirement: Mobile is an authored composition

The homepage SHALL be verified at 1920px, 1440px, 1024px, 768px and 390px, presenting no horizontal page scroll, no overlapping content and no unintended wrapping at any of them. Above 1600px the layout SHALL gain margin rather than enlarging type.

At mobile widths the homepage SHALL present editorial imagery full-bleed without side gutters, and SHALL present its set of type frames as a horizontally scrollable rail rather than a long vertical stack. Its mobile composition SHALL be authored rather than being its desktop columns stacked in source order.

#### Scenario: The homepage is submitted as complete

- **WHEN** the homepage is submitted as done
- **THEN** it has been verified at 1920px, 1440px, 1024px, 768px and 390px
- **AND** exhibits no horizontal page scroll or overlapping content at any of them

#### Scenario: The homepage renders on a phone

- **WHEN** the homepage renders at 390px
- **THEN** its editorial imagery extends to the full viewport width with no side gutter
- **AND** its type index presents as a horizontally scrollable rail with snap points

#### Scenario: A very wide viewport is used

- **WHEN** the homepage renders above 1600px
- **THEN** margins increase and type sizes remain unchanged

#### Scenario: A customer zooms text to 200%

- **WHEN** a customer sets text zoom to 200%
- **THEN** all content remains readable and reachable with no clipped or overlapping text

## ADDED Requirements

### Requirement: The type index is a composition, not a card row

The Types section SHALL present each product type the shop sells as a photographic frame with the type's name and a link to that type on the shop surface. Its links SHALL resolve to the shop surface's own type filter, and the set of types it presents SHALL be drawn from the catalog's own closed set of categories, so a type cannot be presented that the shop cannot filter to.

The frames SHALL differ from one another in aspect ratio and in placement, and the section MUST NOT render as a row of identically-sized frames. Above the mobile breakpoint the frames SHALL be placed on the page grid rather than flowed evenly.

The section MUST NOT attach a ranking, a count, a claim, or a merchandising phrase to any type. Where a supporting mark is shown beneath a type's name, it SHALL be an index within the sequence and nothing else.

#### Scenario: The type index renders

- **WHEN** the Types section renders
- **THEN** each entry presents a photographic frame, the type's name and a link to that type on the shop surface
- **AND** no entry carries a count, a ranking, a badge or a merchandising phrase

#### Scenario: A type is presented that the shop cannot filter to

- **WHEN** an entry names a type outside the catalog's category set
- **THEN** the build fails

#### Scenario: The frames are inspected for variation

- **WHEN** the section is inspected above the mobile breakpoint
- **THEN** the frames differ in aspect ratio and in placement on the grid
- **AND** they do not read as a row of identically-sized frames

### Requirement: The Detail section describes only what its frame shows

The Detail section SHALL present one photographic frame on the inverted surface with copy beside it. Every sentence of that copy SHALL name something visible in the frame beside it.

The section MUST NOT make a claim about workmanship, materials, provenance, care, packaging or service that the business has not supplied as a fact.

Where the section presents an assurance line, each entry SHALL render a policy the business has supplied, and the line SHALL omit itself entirely rather than render an approximation of a policy that has not been supplied.

#### Scenario: The Detail section renders

- **WHEN** the section renders
- **THEN** each sentence of its copy names something present in its photograph

#### Scenario: A workmanship claim is proposed

- **WHEN** a sentence asserts care, quality, heritage or craftsmanship without a supplied fact behind it
- **THEN** it is rejected

#### Scenario: No policy has been supplied

- **WHEN** the business has supplied none of the policies the assurance line would show
- **THEN** the line is omitted, and the section's composition is otherwise unchanged

#### Scenario: A policy is supplied

- **WHEN** a policy is supplied in the brand record
- **THEN** it appears in the assurance line through a data change alone

## REMOVED Requirements

### Requirement: The presented product set carries no ranking or merchandising claim

**Reason**: The homepage no longer presents a product set. Its third section is now an index of product *types*, which carries no price, material line or availability and therefore has nothing a ranking or merchandising claim could attach to. The section it governed does not exist.

The constraint it expressed is not lost. The prohibition on ranked or promotional framing is restated for the type index in "The type index is a composition, not a card row", and the underlying guarantee is structural rather than editorial: `ProductCardProduct` carries no rating, review, badge, discount or scarcity field, the catalog model carries none, and `scripts/check-catalog.mjs` fails the build if one is introduced. None of that changes.

**Migration**: The shop and collection surfaces are where product sets are presented, and `build-shop-and-collections` carries this requirement forward for them. No consumer of the homepage depended on it: the section was removed in the same change, and the product card component, its type and its enforcement script are untouched.
