## MODIFIED Requirements

### Requirement: All imagery renders through a single image primitive

Every image in the storefront SHALL be rendered through one shared image primitive. Components MUST NOT render raw image elements directly.

The primitive SHALL require a declared aspect ratio, a declared role, and alternative text or an explicit decorative marking. It SHALL reserve layout space before the image loads.

Brand marks are the one exception. The header monogram and the footer logo are not photography and have no role, so they MAY render outside the primitive. They SHALL still declare their dimensions, so layout space is reserved before they load, and SHALL carry alternative text or a decorative marking.

#### Scenario: An image is placed on a page

- **WHEN** any image other than a brand mark is added to a storefront surface
- **THEN** it is rendered through the shared image primitive with a declared aspect ratio and role

#### Scenario: A brand mark is placed in the header or footer

- **WHEN** the header monogram or the footer logo renders
- **THEN** it declares its width and height
- **AND** it carries alternative text or is marked decorative

#### Scenario: An image is still loading

- **WHEN** an image has not yet loaded
- **THEN** its layout space is already reserved and no content shifts when it arrives

#### Scenario: An image fails to load

- **WHEN** an image cannot be fetched
- **THEN** its reserved space is preserved and its alternative text is available

### Requirement: Navigation is destination-led

Primary navigation SHALL present at most five top-level destinations. On this storefront those destinations SHALL be Home, Shop, Categories, About and Contact.

An individual product type SHALL be presented as a filter on the shop surface, not as a top-level item. Categories MAY be one top-level destination provided it is an index whose entries resolve to the shop surface's type filter.

Utility destinations — search, wishlist and bag — SHALL be presented separately from the primary list and SHALL NOT count against the cap of five. Where one is presented by icon alone it SHALL carry an accessible name.

The header SHALL present the business-supplied SA monogram with the brand name. Below 640px the monogram SHALL stand alone, with the name visually hidden. The monogram SHALL be decorative; the brand name is the home link's accessible name at every width.

#### Scenario: A customer opens the storefront

- **WHEN** the site header renders
- **THEN** it presents at most five top-level items: Home, Shop, Categories, About, Contact
- **AND** no individual product type appears among them
- **AND** the SA monogram sits with the brand name

#### Scenario: A customer opens the storefront on a phone

- **WHEN** the site header renders below 640px
- **THEN** the SA monogram shows without the brand name
- **AND** the home link's accessible name is still the brand name

#### Scenario: A customer wants to browse by product type

- **WHEN** a customer wants to browse rings specifically
- **THEN** product type is available as a filter on the shop surface

#### Scenario: A utility destination is presented by icon alone

- **WHEN** search, wishlist or bag renders without a visible text label
- **THEN** it carries an accessible name, and it is not counted against the five-item cap

## ADDED Requirements

### Requirement: The footer leads with the full logo

The footer's brand column SHALL present the business-supplied full logo in place of the brand name as text, with the brand name as its alternative text. Where no full logo is supplied, the column SHALL present the brand name as text.

#### Scenario: The footer renders with the full logo supplied

- **WHEN** the site footer renders
- **THEN** its brand column shows the full logo
- **AND** the logo's alternative text is the brand name
