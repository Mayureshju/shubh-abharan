## MODIFIED Requirements

### Requirement: The button system has a fixed set of variants

The system SHALL provide exactly four button presentations: `primary` (the single strongest action on a view), `quiet` (secondary actions), `inline` (a text-level action within running copy), and `icon` (an icon-only control).

Each variant SHALL define rest, hover, focus-visible, active, disabled, and pending presentations. `primary` and `quiet` SHALL use pill geometry. `primary` SHALL be a gold fill with charcoal label. `quiet` SHALL be a gold outline on paper and a cream outline on ink.

A view SHALL present at most one `primary` button.

#### Scenario: A view defines its actions

- **WHEN** a view renders its interactive actions
- **THEN** at most one action uses the `primary` presentation
- **AND** every other action uses `quiet`, `inline`, or `icon`

#### Scenario: The primary action is inspected

- **WHEN** a `primary` button is rendered
- **THEN** it is pill-shaped, gold-filled, and labelled in charcoal

### Requirement: Navigation is destination-led

Primary navigation SHALL present at most five top-level destinations. On this storefront those destinations SHALL be Home, Shop, Categories, About and Contact.

An individual product type SHALL be presented as a filter on the shop surface, not as a top-level item. Categories MAY be one top-level destination provided it is an index whose entries resolve to the shop surface's type filter.

Utility destinations — search, wishlist and bag — SHALL be presented separately from the primary list and SHALL NOT count against the cap of five. Where one is presented by icon alone it SHALL carry an accessible name.

The header SHALL present a lotus mark with the brand name. The mark SHALL be a single-colour SVG.

#### Scenario: A customer opens the storefront

- **WHEN** the site header renders
- **THEN** it presents at most five top-level items: Home, Shop, Categories, About, Contact
- **AND** no individual product type appears among them
- **AND** a lotus mark sits with the brand name

#### Scenario: A customer wants to browse by product type

- **WHEN** a customer wants to browse rings specifically
- **THEN** product type is available as a filter on the shop surface

#### Scenario: A utility destination is presented by icon alone

- **WHEN** search, wishlist or bag renders without a visible text label
- **THEN** it carries an accessible name, and it is not counted against the five-item cap
