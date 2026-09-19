## MODIFIED Requirements

### Requirement: The homepage presents a fixed luxury-template narrative

The homepage SHALL present authored sections inside the main landmark, in this order and with these purposes:

| Order | Section | Purpose |
| --- | --- | --- |
| 1 | Hero | Overlay statement on an authored campaign slider: brand name as the page heading on the first frame, supplied copy, one primary action. |
| 2 | Types | Circular index of the five catalog product types, each linking to that type's filter on the shop surface. |
| 3 | New arrivals | Product cards for brand-owned new-arrival slugs, as a snapping rail on mobile. |
| 4 | Occasions | Photographed destination tiles for brand-owned occasions, each linking to that occasion's listing. |
| 5 | Collection | One named collection as a royal-green copy panel against a still-life photograph, with a link into that collection. |
| 6 | Featured | Product cards for brand-owned featured slugs, as a mixed grid on desktop and a snapping rail on mobile. |
| 7 | Reasons | Brand-supplied reasons to buy, each a line icon, a title and a short line from the brand record. |
| 8 | Journal | The three latest journal posts, one featured story and two compact stories. |
| 9 | Statement | Overlay closing statement on a worn campaign portrait, with one quiet action into the shop. |

A section whose backing list is empty SHALL be omitted. The homepage MUST NOT present a Detail craftsmanship band. The homepage MUST NOT present testimonials, statistics, ratings, discount badges, or scarcity claims.

New arrivals and Featured SHALL use different compositions so they do not read as the same product row twice.

#### Scenario: The homepage renders

- **WHEN** a customer opens the homepage and merchandising lists and journal posts are supplied
- **THEN** the sections render in the stated order inside one main landmark
- **AND** no Detail section is present

#### Scenario: A merchandising list is empty

- **WHEN** the brand record carries no new-arrival slugs
- **THEN** the New arrivals section is omitted
- **AND** the remaining sections keep their relative order

### Requirement: The Hero is an overlay statement with one primary action

The Hero SHALL present authored campaign photography with the page's single top-level heading, supplied eyebrow and support, and at most one action in the `primary` presentation overlaid on the photograph.

The Hero MAY cycle three or four authored frames. Frames SHALL come from supplied campaign photography, not from catalog product images the catalog does not have. Only the first frame SHALL carry the page heading. Subsequent frames MUST NOT use the `display` type role.

Where heading text is placed over photography, it SHALL meet its required contrast ratio against the underlying image, using a marked scrim.

The first frame, the heading, and the primary action SHALL remain visible with scripting disabled. Autoplay SHALL pause on pointer, touch, keyboard focus, when the document is hidden, and when the Hero is offscreen. Autoplay SHALL NOT run when the visitor has requested reduced motion.

#### Scenario: The Hero renders

- **WHEN** the Hero renders
- **THEN** it presents the first photographic frame, one top-level heading, and no more than one `primary` action
- **AND** the heading remains visible with scripting disabled

#### Scenario: The visitor advances a slide

- **WHEN** the visitor swipes, uses previous/next, or activates a slide control
- **THEN** the Hero presents the corresponding authored frame
- **AND** the page still has exactly one top-level heading

#### Scenario: Reduced motion is requested

- **WHEN** the visitor has requested reduced motion
- **THEN** the Hero does not autoplay
- **AND** changing frames does not use travel animation

### Requirement: The type index is a circular shop

The Types section SHALL present each photographed catalog category as a circular still with the type's name and a link to that type on the shop surface. The set of types SHALL be drawn from the catalog's closed category set. `set` SHALL be absent.

The five frames MAY be identically circular. The section MUST NOT attach a ranking, a count, or a stock claim to any type.

#### Scenario: The type index renders

- **WHEN** the Types section renders
- **THEN** each entry presents a circular photographic still, the type's name, and a link to that type on the shop surface
- **AND** no entry carries a count, a ranking, or a merchandising claim about stock

#### Scenario: A type is presented that the shop cannot filter to

- **WHEN** an entry names a type outside the catalog's category set
- **THEN** the build fails

### Requirement: The Collection section is a green split

The Collection section SHALL present the first supplied collection as a royal-green copy panel beside its still-life photograph, with a link into that collection. Copy SHALL come from the brand record.

#### Scenario: The Collection section renders

- **WHEN** a collection has been supplied
- **THEN** the section presents its name, its supplied description, its photograph and a link to `/collections/{slug}`

### Requirement: The Reasons section renders only supplied reasons

The Reasons section SHALL render one column per reason in the brand record, each with a line icon, the supplied title and the supplied body. It MUST NOT invent a fifth reason, a statistic, or a policy the brand record does not carry.

#### Scenario: The Reasons section renders

- **WHEN** the brand record carries four reasons
- **THEN** four columns render, and each column's copy matches the brand record

#### Scenario: A fifth trust claim is proposed

- **WHEN** a claim not present in the brand record is added to the section
- **THEN** it is rejected

### Requirement: Mobile is an authored composition

The homepage SHALL be verified at 1920px, 1440px, 1024px, 768px and 390px, presenting no horizontal page scroll, no overlapping content and no unintended wrapping at any of them.

At mobile widths the type index, new arrivals, occasions, and featured product set SHALL present as horizontally scrollable rails with snap points rather than long vertical stacks. The journal SHALL present one featured story above two compact stories rather than three equal cards.

Overlay headings SHALL remain readable. Product and journal cards SHALL remain usable with one hand. Scroll-linked motion SHALL NOT hijack the browser scroll.

#### Scenario: The homepage renders on a phone

- **WHEN** the homepage renders at 390px
- **THEN** its type index, new arrivals, occasions and featured set present as horizontally scrollable rails with snap points
- **AND** overlay headings remain readable
- **AND** the page itself does not scroll horizontally

## ADDED Requirements

### Requirement: New arrivals and featured products resolve from brand-owned slug lists

New arrivals and Featured SHALL render products whose slugs appear on the brand record, in the order those lists declare. They MUST NOT infer membership from a product flag, a date, or a ranking field.

Each card SHALL be a product card derived from the catalog. Structural fixture products whose slugs are absent from the brand lists MUST NOT appear on the homepage.

#### Scenario: New arrivals render

- **WHEN** the brand record lists new-arrival slugs that resolve in the catalog
- **THEN** those products render in declared order
- **AND** no fixture product absent from the list appears

#### Scenario: A merchandising slug is unknown

- **WHEN** a brand-owned merchandising list names a slug absent from the catalog
- **THEN** the project's check command fails and names the slug

### Requirement: Occasions are photographed destinations from the brand record

The Occasions section SHALL present one tile per occasion in the brand record, each with a photograph, the occasion's name, and a link to that occasion's listing. The set SHALL be capped at three.

The section MUST NOT attach a count, a ranking, or a stock claim to an occasion.

#### Scenario: Occasions render

- **WHEN** the brand record carries three occasions
- **THEN** three destination tiles render
- **AND** each links to that occasion's listing

#### Scenario: No occasions are supplied

- **WHEN** the brand record carries no occasions
- **THEN** the Occasions section is omitted

### Requirement: The journal block shows the three latest posts

When journal posts exist, the homepage SHALL present the three latest as one featured story and two compact stories, each linking to its journal article. The section MUST NOT invent a fourth post or a testimonial.

#### Scenario: Three posts exist

- **WHEN** three journal posts are authored
- **THEN** the homepage presents all three
- **AND** the featured story is visually distinct from the two compact stories

#### Scenario: No posts exist

- **WHEN** no journal posts are authored
- **THEN** the Journal section is omitted
