## MODIFIED Requirements

### Requirement: Mobile is a distinct composition

The system SHALL define mobile presentation as an authored composition, not as desktop content reflowed into a single column.

At mobile widths:

- Editorial imagery SHALL run full-bleed without side gutters.
- Related-product and merchandising sets SHALL present as a horizontal rail rather than a long vertical stack.
- Product listings (shop, collection, wishlist) SHALL present as a two-up grid of square cards, so a customer can compare pieces side by side.
- Filters and secondary controls SHALL present as a bottom sheet rather than an inline rail.
- Primary navigation SHALL present as a full-screen overlay.

#### Scenario: An editorial section renders on a phone

- **WHEN** a section containing editorial imagery renders at a mobile width
- **THEN** the imagery extends to the full viewport width with no side gutter

#### Scenario: A set of related products renders on a phone

- **WHEN** four or more related products render at a mobile width
- **THEN** they present as a horizontally scrollable rail

#### Scenario: A product listing renders on a phone

- **WHEN** the shop, a collection, or the wishlist renders at a mobile width
- **THEN** its cards present two per row at equal size

#### Scenario: A desktop layout is narrowed

- **WHEN** a multi-column desktop section is rendered at a mobile width
- **THEN** its mobile presentation is an authored composition rather than its columns stacked in source order
