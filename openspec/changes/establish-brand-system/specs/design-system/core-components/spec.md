## Purpose

Defines the reusable building blocks every storefront page composes from — the button system, the image primitive through which all imagery is rendered, the product card, the navigation and footer contracts, and the internal specimen surface used to verify the system before pages are built on it.

## ADDED Requirements

### Requirement: The button system has a fixed set of variants

The system SHALL provide exactly four button presentations: `primary` (the single strongest action on a view), `quiet` (secondary actions), `inline` (a text-level action within running copy), and `icon` (an icon-only control).

Each variant SHALL define rest, hover, focus-visible, active, disabled, and pending presentations. Buttons SHALL be square-cornered and MUST NOT use pill geometry or full-round radius.

A view SHALL present at most one `primary` button.

#### Scenario: A view defines its actions

- **WHEN** a view renders its interactive actions
- **THEN** at most one action uses the `primary` presentation
- **AND** every other action uses `quiet`, `inline`, or `icon`

#### Scenario: A button performs an asynchronous action

- **WHEN** a button triggers an asynchronous action
- **THEN** it presents a pending state and rejects repeat activation until the action settles

#### Scenario: A button is disabled

- **WHEN** a button is disabled
- **THEN** it is perceivably distinct from its rest state by more than colour alone
- **AND** its purpose remains readable to assistive technology

### Requirement: All imagery renders through a single image primitive

Every image in the storefront SHALL be rendered through one shared image primitive. Components MUST NOT render raw image elements directly.

The primitive SHALL require a declared aspect ratio, a declared role, and alternative text or an explicit decorative marking. It SHALL reserve layout space before the image loads.

#### Scenario: An image is placed on a page

- **WHEN** any image is added to a storefront surface
- **THEN** it is rendered through the shared image primitive with a declared aspect ratio and role

#### Scenario: An image is still loading

- **WHEN** an image has not yet loaded
- **THEN** its layout space is already reserved and no content shifts when it arrives

#### Scenario: An image fails to load

- **WHEN** an image cannot be fetched
- **THEN** its reserved space is preserved and its alternative text is available

### Requirement: Images declare a scale role

The image primitive SHALL require each image to declare exactly one role: `macro`, `scale`, `worn`, or `detail`.

- `macro` — the piece fills or exceeds the viewport, showing surface and manufacture.
- `scale` — the piece is shown at or near true size within a generous empty field, accompanied by its measured dimension.
- `worn` — the piece is shown on the body in human context.
- `detail` — a supporting close view of a specific feature.

Layouts SHALL request images by role rather than by position, so that composition remains consistent as the catalog grows.

#### Scenario: A layout requests imagery

- **WHEN** a page section needs a product image
- **THEN** it requests the image by role
- **AND** renders the piece's image carrying that role

#### Scenario: A product lacks an image for a requested role

- **WHEN** no image with the requested role exists for a product
- **THEN** the layout falls back to a defined alternate role or omits the slot
- **AND** the section composition remains intact with no broken or empty frame

#### Scenario: A true-scale image is displayed

- **WHEN** an image with the `scale` role is rendered
- **THEN** its measured dimension is displayed alongside it

### Requirement: Development placeholders are neutral and identifiable

Where real photography is not yet available, the image primitive SHALL render a neutral placeholder that states its role, intended crop, and aspect ratio.

Placeholders MUST be visually identifiable as unfinished and MUST NOT be presented as real brand or product photography. Replacing a placeholder with real photography SHALL require only a change to image data, not a change to component code.

#### Scenario: Photography has not been supplied

- **WHEN** a product has no real photography
- **THEN** a neutral placeholder is rendered stating its role, crop, and aspect ratio

#### Scenario: Real photography becomes available

- **WHEN** real photography is supplied for a product
- **THEN** it replaces the placeholder through a data change alone, with no component modification

### Requirement: Product cards are role-driven and variable

The product card SHALL render from product data — image, name, price, and a material line — and SHALL derive its presentation from the declared role of its image rather than from a fixed template.

Cards SHALL support varied aspect ratios and varied grid spans within a single listing. A listing MUST NOT render as a uniform repeating row of identically-sized cards.

The card SHALL NOT display ratings, reviews, badges, discount flags, or scarcity indicators.

#### Scenario: A listing renders multiple products

- **WHEN** a listing renders four or more products
- **THEN** the listing varies aspect ratio or grid span across its cards
- **AND** does not present every card at identical size in a repeating row

#### Scenario: A card renders product information

- **WHEN** a product card renders
- **THEN** it shows the image, name, price, and material line
- **AND** displays no rating, review count, badge, discount flag, or scarcity indicator

#### Scenario: A card is activated

- **WHEN** a customer activates a product card by pointer or keyboard
- **THEN** it navigates to that product's detail page

### Requirement: Navigation is collection-led

Primary navigation SHALL present named collections as its main axis. Product type — ring, necklace, earring, and similar — SHALL be presented as a filter on the shop surface, not as top-level navigation.

Primary navigation SHALL carry at most five top-level items. Secondary destinations SHALL be reached through progressive disclosure rather than being listed at once.

#### Scenario: A customer opens the storefront

- **WHEN** the site header renders
- **THEN** it presents at most five top-level items, with named collections as the primary axis

#### Scenario: A customer wants to browse by product type

- **WHEN** a customer wants to browse rings specifically
- **THEN** product type is available as a filter on the shop surface

### Requirement: Navigation and footer contracts are defined with full states

The system SHALL define the header, navigation overlay, and footer as contracts specifying their content slots, responsive presentation, scrolled state, open and closed states, focus behaviour, and dismissal behaviour.

When the navigation overlay is open, focus SHALL be contained within it, the underlying page SHALL NOT scroll, and the overlay SHALL be dismissible by both keyboard and pointer. On dismissal, focus SHALL return to the control that opened it.

#### Scenario: The navigation overlay is opened

- **WHEN** a customer opens the navigation overlay
- **THEN** focus moves into the overlay and is contained there
- **AND** the page behind it does not scroll

#### Scenario: The navigation overlay is dismissed

- **WHEN** a customer dismisses the overlay by keyboard or pointer
- **THEN** the overlay closes and focus returns to the control that opened it

#### Scenario: The page is scrolled

- **WHEN** a customer scrolls past the top of a page
- **THEN** the header adopts its scrolled presentation without obscuring content or shifting layout

### Requirement: An internal specimen surface renders the full system

The system SHALL provide an internal specimen surface rendering every design token and every component state defined by this design system: the full type scale in both typefaces, the colour and surface tokens, the spacing scale and all three section rhythms, every button variant in every state, the image primitive in all four roles including placeholders, and the product card in its supported presentations.

The specimen surface SHALL be excluded from search indexing and SHALL NOT be linked from customer-facing navigation.

#### Scenario: The design system is reviewed

- **WHEN** a reviewer opens the specimen surface
- **THEN** every token and every component state defined by this system is visible on one surface

#### Scenario: A new component state is added

- **WHEN** a component gains a new variant or state
- **THEN** the specimen surface renders that state

#### Scenario: A search engine crawls the site

- **WHEN** a crawler requests the specimen surface
- **THEN** it is marked as excluded from indexing and is unreachable from customer-facing navigation
