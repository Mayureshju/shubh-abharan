## Purpose

Defines how the storefront moves — the motion token set, the single scroll-reveal mechanism, orchestration and travel budgets, interaction feedback, scroll behaviour, and the reduced-motion contract. Motion here is a system with limits, not a per-component decision.

## ADDED Requirements

### Requirement: Motion uses a fixed token set

The system SHALL define exactly four motion durations and exactly two easing curves, and every animation and transition SHALL use one of each.

The durations SHALL be scoped by purpose:

| Token | Purpose |
| --- | --- |
| `instant` | focus rings, toggles, immediate state changes |
| `quick` | hover and small property transitions |
| `base` | drawers, overlays, image crossfades, section reveals |
| `slow` | page and hero entrance orchestration only |

The easing curves SHALL be an entrance curve with a long deceleration and a symmetric curve for elements that travel and stop. Linear easing is permitted only for opacity crossfades.

No component SHALL introduce a bespoke duration or easing value.

#### Scenario: A component animates

- **WHEN** any element transitions or animates
- **THEN** its duration is one of the four defined tokens and its easing is one of the defined curves

#### Scenario: A bespoke timing is introduced

- **WHEN** a component declares a duration or easing value not present in the token set
- **THEN** the change is rejected and an existing token is used

### Requirement: Reveal travel and hover scale are budgeted

Scroll-triggered reveals SHALL translate no more than 16px. Hover scale on imagery SHALL NOT exceed 1.03 and SHALL use the `base` duration or longer.

#### Scenario: A reveal is authored

- **WHEN** a section reveal is implemented
- **THEN** its translation distance is between 0 and 16px
- **AND** it uses a defined duration token

#### Scenario: A product image is hovered

- **WHEN** a pointer hovers a product image on a device that supports hover
- **THEN** the image scales by no more than 1.03 over at least the `base` duration

### Requirement: A single scroll-reveal mechanism exists

The system SHALL provide exactly one scroll-triggered reveal mechanism, and all scroll-triggered animation in the storefront SHALL go through it. Components MUST NOT implement their own scroll observers or reveal logic.

A reveal SHALL fire at most once per element per page load.

#### Scenario: A section reveals on scroll

- **WHEN** a section enters the viewport for the first time
- **THEN** it reveals once through the shared reveal mechanism
- **AND** it does not re-animate on subsequent scrolls past it

#### Scenario: Content is never scrolled to

- **WHEN** a revealed element is present in the document but is never scrolled into view
- **THEN** its content remains present and readable to assistive technology and to search indexing

### Requirement: Orchestration is budgeted per route

Each route SHALL contain at most one orchestrated staggered sequence. Every other reveal on that route SHALL animate as a single unit or as at most two groups.

Per-element staggering across an entire page is prohibited.

#### Scenario: A route defines its entrance

- **WHEN** a route renders its entrance choreography
- **THEN** at most one staggered sequence plays
- **AND** all remaining sections reveal as whole units or as two groups

#### Scenario: Every element on a page animates independently

- **WHEN** a page staggers each individual element into view
- **THEN** the page fails motion review and the reveals are consolidated into section-level units

### Requirement: State changes are never blocked by animation

The system SHALL apply state changes immediately and animate only the presentation of that change. Adding an item to the cart, applying a filter, selecting a variant, or navigating SHALL take effect without waiting for an animation to complete.

#### Scenario: An item is added to the bag

- **WHEN** a customer adds an item to the bag
- **THEN** the cart state updates immediately and the updated count is readable
- **AND** any accompanying drawer or confirmation animation plays over the already-updated state

#### Scenario: A customer interrupts an animation

- **WHEN** a customer triggers a second action while an animation is still playing
- **THEN** the second action takes effect immediately without waiting for the first animation to finish

### Requirement: Interaction feedback is defined for every interactive state

Every interactive control SHALL define its hover, focus-visible, active, disabled, and pending presentation. Feedback for a state change SHALL be perceivable without relying on colour alone.

A control performing an asynchronous action SHALL communicate its pending state and SHALL NOT accept duplicate submissions while pending.

#### Scenario: An asynchronous control is activated

- **WHEN** a customer activates a control that performs an asynchronous action
- **THEN** the control presents a pending state
- **AND** repeated activation while pending does not trigger duplicate actions

#### Scenario: A control is focused by keyboard

- **WHEN** a control receives keyboard focus
- **THEN** a focus indicator is visible against both the `paper` and `ink` surfaces

### Requirement: Native scroll behaviour is preserved

The system MUST NOT override, intercept, or smooth the browser's native scrolling. Scroll-linked effects SHALL be read-only observers of scroll position.

Parallax SHALL be applied only to decorative imagery, SHALL NOT exceed 8% of element travel, and MUST NOT be applied to text, controls, or any element a customer must read or activate.

#### Scenario: A customer scrolls the page

- **WHEN** a customer scrolls with a wheel, trackpad, touch, keyboard, or scrollbar drag
- **THEN** the browser's native scrolling behaviour, momentum, and position are unchanged

#### Scenario: A parallax effect is applied

- **WHEN** parallax is applied to an element
- **THEN** that element is decorative imagery, its travel is 8% or less, and no essential text or control moves with it

#### Scenario: Scroll-linked effects cannot run

- **WHEN** scroll-linked animation is unavailable or fails
- **THEN** all content renders in its final, readable position

### Requirement: Reduced motion preserves feedback

When a customer has requested reduced motion, the system SHALL remove translation, scale, and parallax, and SHALL reduce remaining transitions to opacity at a single short duration.

Reduced motion MUST NOT remove feedback or state communication. Drawers and overlays SHALL still open and close, cart counts SHALL still update visibly, focus indicators SHALL remain, and pending states SHALL still be communicated.

#### Scenario: Reduced motion is requested and the cart drawer opens

- **WHEN** a customer with reduced motion enabled adds an item to the bag
- **THEN** the cart drawer appears without sliding travel
- **AND** the cart count updates visibly and the drawer receives focus

#### Scenario: Reduced motion is requested and a page loads

- **WHEN** a customer with reduced motion enabled loads any route
- **THEN** all content is immediately present and readable with no entrance translation or stagger
- **AND** the visual hierarchy of the page is unchanged
