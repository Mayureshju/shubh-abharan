## MODIFIED Requirements

### Requirement: Navigation is collection-led

Primary navigation SHALL present named collections as its main axis. An individual product type — ring, necklace, earring, and similar — SHALL be presented as a filter on the shop surface, not as top-level navigation.

Primary navigation MAY present **one** top-level destination that is an index of product types, provided it does not branch into per-type destinations at the top level and its entries resolve to the shop surface's own type filter rather than to a parallel set of routes.

Primary navigation SHALL carry at most five top-level items, the type index included. Secondary destinations SHALL be reached through progressive disclosure rather than being listed at once.

Utility destinations — search, wishlist and bag — SHALL be presented separately from the primary list and SHALL NOT count against the cap of five. Where one is presented by icon alone it SHALL carry an accessible name.

#### Scenario: A customer opens the storefront

- **WHEN** the site header renders
- **THEN** it presents at most five top-level items, with named collections as the primary axis
- **AND** at most one of them is an index of product types
- **AND** no individual product type appears among them

#### Scenario: A customer wants to browse by product type

- **WHEN** a customer wants to browse rings specifically
- **THEN** product type is available as a filter on the shop surface

#### Scenario: A type index entry is followed

- **WHEN** a customer follows an entry from the type index
- **THEN** it resolves to the shop surface filtered to that type, not to a separate route tree

#### Scenario: A utility destination is presented by icon alone

- **WHEN** search, wishlist or bag renders without a visible text label
- **THEN** it carries an accessible name, and it is not counted against the five-item cap
