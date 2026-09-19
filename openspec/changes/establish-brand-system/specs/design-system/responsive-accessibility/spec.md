## Purpose

Defines how the design system behaves across viewport sizes and input methods, and the accessibility floor every storefront surface must meet. Treats mobile as a distinct authored composition rather than a narrowed desktop layout, and makes the system usable without a pointer, without motion, and without colour discrimination.

## ADDED Requirements

### Requirement: Mobile is a distinct composition

The system SHALL define mobile presentation as an authored composition, not as desktop content reflowed into a single column.

At mobile widths:

- Editorial imagery SHALL run full-bleed without side gutters.
- Collection and related-product sets SHALL present as a horizontal rail rather than a long vertical stack.
- Filters and secondary controls SHALL present as a bottom sheet rather than an inline rail.
- Primary navigation SHALL present as a full-screen overlay.

#### Scenario: An editorial section renders on a phone

- **WHEN** a section containing editorial imagery renders at a mobile width
- **THEN** the imagery extends to the full viewport width with no side gutter

#### Scenario: A set of related products renders on a phone

- **WHEN** four or more related products render at a mobile width
- **THEN** they present as a horizontally scrollable rail

#### Scenario: A desktop layout is narrowed

- **WHEN** a multi-column desktop section is rendered at a mobile width
- **THEN** its mobile presentation is an authored composition rather than its columns stacked in source order

### Requirement: Type scales asymmetrically across viewports

At mobile widths the `display` role SHALL reduce proportionally more than `body`, preserving the scale's bimodal character. The `caption` role SHALL NOT be enlarged at mobile widths to improve legibility; legibility at caption size SHALL be achieved through contrast and spacing instead.

#### Scenario: A page is viewed on a phone

- **WHEN** a page renders at a mobile width
- **THEN** `display` text is substantially reduced relative to its desktop size
- **AND** `caption` text retains its small size while meeting contrast requirements

### Requirement: Layouts are verified at defined widths

Every storefront surface SHALL be verified at 1440px, 1024px, 768px, and 390px before it is considered complete. At each width the layout SHALL present no horizontal page scroll, no overlapping content, and no unintended wrapping.

Above 1600px the layout SHALL gain margin rather than enlarging type.

#### Scenario: A surface is completed

- **WHEN** a storefront surface is submitted as done
- **THEN** it has been verified at 1440px, 1024px, 768px, and 390px
- **AND** exhibits no horizontal page scroll or overlapping content at any of them

#### Scenario: A very wide viewport is used

- **WHEN** a page renders above 1600px
- **THEN** margins increase and type sizes remain unchanged

### Requirement: Touch targets and one-hand reach

Interactive controls SHALL present a touch target of at least 44px in both dimensions, including controls whose visible label is set at `caption` size.

On mobile, the primary action of a product detail surface and the controls of any open drawer or sheet SHALL remain reachable within the lower portion of the viewport.

#### Scenario: A caption-sized control is rendered on touch

- **WHEN** a control with a `caption`-sized label renders on a touch device
- **THEN** its activatable area measures at least 44px in both dimensions

#### Scenario: A customer uses a phone one-handed

- **WHEN** a drawer or bottom sheet is open on a phone
- **THEN** its primary and dismiss controls are reachable in the lower portion of the viewport

### Requirement: Every interactive surface is keyboard operable

All interactive controls SHALL be reachable and operable by keyboard in a logical order matching visual reading order. Focus SHALL be visible at all times on both the `paper` and `ink` surfaces.

Overlay surfaces — navigation, search, cart drawer, filter sheet, and modal dialogs — SHALL contain focus while open, close on the escape key, and return focus to the control that opened them.

No interactive behaviour SHALL require hover or pointer position to be discoverable or operable.

#### Scenario: A customer navigates by keyboard only

- **WHEN** a customer traverses a page using only the keyboard
- **THEN** every interactive control is reachable in an order matching visual reading order
- **AND** the focused control is always visibly indicated

#### Scenario: An overlay is open and escape is pressed

- **WHEN** an overlay surface is open and the customer presses escape
- **THEN** the overlay closes and focus returns to the control that opened it

#### Scenario: A control reveals information on hover

- **WHEN** a control reveals additional information on hover
- **THEN** the same information is reachable by keyboard focus and on touch devices

### Requirement: Contrast and non-colour encoding

Body and caption text SHALL meet a minimum contrast ratio of 4.5:1 against its surface. Display and title text at large sizes SHALL meet at least 3:1. Interactive control boundaries and focus indicators SHALL meet at least 3:1.

Where text is placed over photography, the system SHALL guarantee the required contrast, using a single-direction scrim at 35% opacity or less only where the photograph alone cannot.

No state, status, availability, or error SHALL be communicated by colour alone.

#### Scenario: Text is placed over a photograph

- **WHEN** text is rendered over photography
- **THEN** it meets its required contrast ratio against the underlying image
- **AND** any scrim used is a single-direction black at 35% opacity or less

#### Scenario: A field is in an error state

- **WHEN** a form field enters an error state
- **THEN** the error is communicated by text as well as by colour

### Requirement: Semantic structure and assistive naming

Each page SHALL expose exactly one top-level heading and SHALL NOT skip heading levels. Headings SHALL reflect document structure rather than being chosen for visual size; typographic role and heading level are independent.

Icon-only controls SHALL carry an accessible name describing their action. Landmark regions SHALL be used for header, main content, navigation, and footer.

#### Scenario: A page is read by a screen reader

- **WHEN** a screen reader traverses a storefront page
- **THEN** exactly one top-level heading is present, no heading level is skipped, and header, navigation, main, and footer landmarks are identifiable

#### Scenario: An icon-only control is encountered

- **WHEN** a screen reader reaches an icon-only control
- **THEN** the control announces an accessible name describing its action

#### Scenario: Large text is not a heading

- **WHEN** text is set in the `display` role for visual emphasis but is not a document heading
- **THEN** it is not marked up as a heading element

### Requirement: Images carry meaningful alternatives

Every image SHALL carry either descriptive alternative text or an explicit decorative marking. Alternative text for product photography SHALL describe the piece and the view rather than repeating the product name alone.

#### Scenario: Product photography is rendered

- **WHEN** a product image is rendered
- **THEN** its alternative text describes the piece and the view shown

#### Scenario: A purely decorative image is rendered

- **WHEN** an image carries no informational content
- **THEN** it is explicitly marked decorative and is skipped by assistive technology

### Requirement: The system degrades without motion, hover, or client script

The storefront SHALL remain browsable and readable when animation is disabled, when hover is unavailable, and before client-side interactivity has initialised.

Content revealed by scroll-triggered animation SHALL be present in the document regardless of whether the animation runs.

#### Scenario: Client-side interactivity has not yet initialised

- **WHEN** a page has rendered but client-side interactivity has not yet initialised
- **THEN** content, navigation links, and product information are present and readable
- **AND** no content is hidden pending an animation

#### Scenario: A customer browses on a touch device

- **WHEN** a customer uses a device without hover capability
- **THEN** all product information and actions available on hover are reachable by tap or by navigating to the product detail surface
