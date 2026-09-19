## MODIFIED Requirements

### Requirement: The homepage presents a fixed luxury-template narrative

The homepage SHALL present five authored sections inside the main landmark, in this order and with these purposes:

| Order | Section | Purpose |
| --- | --- | --- |
| 1 | Hero | Overlay statement on a worn portrait: brand name, supplied eyebrow and support, one primary action. |
| 2 | Types | Circular index of the five catalog product types, each linking to that type's filter on the shop surface. |
| 3 | Collection | One named collection as a royal-green copy panel against a still-life photograph, with a link into that collection. |
| 4 | Reasons | Four brand-supplied reasons to buy, each a line icon, a title and a short line from the brand record. |
| 5 | Statement | Overlay closing statement on a worn campaign portrait, with one quiet action into the shop. |

The homepage MUST NOT present a Detail craftsmanship band. The homepage MUST NOT invent a sixth marketing section.

#### Scenario: The homepage renders

- **WHEN** a customer opens the homepage
- **THEN** the five sections render in the stated order inside one main landmark
- **AND** no Detail section is present

### Requirement: The Hero is an overlay statement with one primary action

The Hero SHALL present one dominant photographic frame with the page's single top-level heading, the supplied eyebrow, the supplied support line, and at most one action in the `primary` presentation overlaid on the photograph.

Where heading text is placed over photography, it SHALL meet its required contrast ratio against the underlying image, using a marked scrim.

The Hero MUST NOT present a carousel of frames the catalog does not have.

#### Scenario: The Hero renders

- **WHEN** the Hero renders
- **THEN** it presents one photographic frame, one top-level heading, and no more than one `primary` action
- **AND** the heading remains visible with scripting disabled

### Requirement: The type index is a circular shop

The Types section SHALL present each photographed catalog category as a circular still with the type's name and a link to that type on the shop surface. The set of types SHALL be drawn from the catalog's closed category set. `set` SHALL be absent.

The five frames MAY be identically circular. The section MUST NOT attach a ranking, a count, or a stock claim to any type.

#### Scenario: The type index renders

- **WHEN** the Types section renders
- **THEN** each entry presents a circular photographic still, the type's name, and a link to that type on the shop surface
- **AND** no entry carries a count, a ranking, a badge or a merchandising claim about stock

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

At mobile widths the type index SHALL present as a horizontally scrollable rail of circular stills rather than a long vertical stack.

#### Scenario: The homepage renders on a phone

- **WHEN** the homepage renders at 390px
- **THEN** its type index presents as a horizontally scrollable rail with snap points
- **AND** overlay headings remain readable

## REMOVED Requirements

### Requirement: The type index is a composition, not a card row

**Reason**: The mood board asks for five equal circular stills. Variation-by-aspect is no longer this section's job. The catalog-keyed link contract is restated in "The type index is a circular shop".

### Requirement: The Detail section describes only what its frame shows

**Reason**: The mood board has no craftsmanship band. Detail is removed from the homepage. The prohibition on inventing workmanship claims survives in the Reasons section, which may only render copy stored in the brand record.
