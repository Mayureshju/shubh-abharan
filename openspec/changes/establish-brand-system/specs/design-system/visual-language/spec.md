## Purpose

Defines the storefront's visual language — brand direction, typography, colour, spacing, surface and border treatment, editorial layout rules, and the enforceable constraints that keep the design specific to this jewelry brand rather than generic. Every later storefront capability derives its appearance from this one.

## ADDED Requirements

### Requirement: Brand inputs are supplied, never invented

The system SHALL source all brand-owned values — brand name, wordmark, voice, collection names, materials vocabulary, prices, policies, and claims — from a brand input record supplied by the business. The system MUST NOT fabricate brand claims, materials, certifications, reviews, ratings, prices, availability, or policies.

Where a brand input has not yet been supplied, the system SHALL render a neutral placeholder that is visibly identifiable as unfilled, and MUST NOT present that placeholder as finished brand content.

#### Scenario: A brand value has been supplied

- **WHEN** the brand input record contains a value for the brand name
- **THEN** that value is rendered wherever the brand name appears, and no alternative or invented name exists anywhere in the interface

#### Scenario: A brand value is missing

- **WHEN** the brand input record has no value for a required field
- **THEN** a neutral, clearly-marked placeholder is rendered in its place
- **AND** no invented substitute value is generated

#### Scenario: Trust content is requested

- **WHEN** any surface would display a review, rating, certification, scarcity indicator, or guarantee
- **THEN** it is rendered only from supplied brand data, and is omitted entirely when no such data exists

### Requirement: Typography uses a bimodal four-role scale

The system SHALL define exactly four typographic roles — `display`, `title`, `body`, and `caption` — and all text SHALL be set in one of them.

The scale MUST be bimodal: `display` is substantially larger than `title`, and `caption` is substantially smaller than `body`, with no intermediate steps filling the gaps. `body` SHALL be the only role intended for sustained reading.

A single page body SHALL use at most three of the four roles, and `display` SHALL appear at most twice per page.

#### Scenario: Text is rendered

- **WHEN** any text node is rendered in the storefront
- **THEN** it resolves to exactly one of the four defined typographic roles
- **AND** no ad-hoc font size outside the scale is applied

#### Scenario: A page overuses the display role

- **WHEN** a page renders the `display` role more than twice
- **THEN** the page fails visual review and is recomposed rather than granted an exception

### Requirement: Two typefaces with distinct roles

The system SHALL use exactly two typefaces: one high-contrast display serif and one neutral grotesque. The display serif SHALL be restricted to the `display` and `title` roles; the grotesque SHALL carry `body` and `caption`.

Neither typeface SHALL be a system default stack (`Arial`, `Helvetica`, `Roboto`, or an unstyled `system-ui` fallback) in normal operation.

#### Scenario: Fonts load successfully

- **WHEN** a page renders with both typefaces available
- **THEN** display and title text is set in the display serif, and body and caption text is set in the grotesque

#### Scenario: Fonts are still loading

- **WHEN** a page renders before font files have loaded
- **THEN** text remains visible in a metric-compatible fallback
- **AND** no visible layout shift occurs when the real faces arrive

#### Scenario: Fonts fail to load

- **WHEN** font files cannot be fetched
- **THEN** the page remains fully readable and navigable in the fallback stack

### Requirement: The colour system is achromatic and metal is never a colour

The system SHALL define its colour tokens as an achromatic set only: a paper surface, an ink foreground, a graphite mid-tone, and a hairline value derived from ink at low opacity.

No token, utility, or component style SHALL express a metal or gem tone — gold, brass, rose gold, silver, or gemstone colour — as a colour value. Metal and gem colour SHALL enter the interface exclusively through photography.

#### Scenario: A metal tone is introduced as a colour

- **WHEN** a colour value in the warm-metal or gem range is added to tokens, utilities, or component styles
- **THEN** the change is rejected, and the intent is satisfied with photography or an achromatic token instead

#### Scenario: Chroma appears on a page

- **WHEN** a rendered page displays any saturated colour
- **THEN** that colour originates from a photograph, not from a token or style declaration

### Requirement: Exactly two surfaces

The system SHALL define exactly two surfaces — `paper` (default) and `ink` (inverted). No third surface, tinted panel, or card background SHALL be introduced.

Content SHALL NOT be placed on a surface that differs from its section background purely for visual separation; separation is achieved with spacing, hairline rules, or image scale.

#### Scenario: A section needs visual separation

- **WHEN** a section must be distinguished from its neighbours
- **THEN** it is distinguished by spacing, a hairline rule, image scale, or inversion to the `ink` surface
- **AND** no intermediate tinted panel is introduced

### Requirement: Spacing uses a base scale and three named section rhythms

The system SHALL define a base spacing scale for intra-component spacing, plus exactly three named section rhythms — `tight`, `normal`, and `breath` — governing vertical space between page sections.

Section rhythm SHALL NOT be uniform down a page. A page MUST satisfy both: no two `breath` joins are adjacent, and at least one `tight` join is present.

#### Scenario: A page is composed

- **WHEN** a page's section joins are inspected
- **THEN** at least one `tight` join is present
- **AND** no two adjacent joins are both `breath`

#### Scenario: Every section uses the same spacing

- **WHEN** a page applies an identical vertical rhythm to every section join
- **THEN** the page fails visual review and its rhythm is re-scored

### Requirement: Border and surface language is square and unelevated

The system SHALL set border radius to `0` for all surfaces, images, cards, and buttons. Form inputs MAY use a maximum radius of `2px`. No other radius value SHALL exist in the system.

`box-shadow` SHALL NOT be used to elevate content. Shadow is permitted only on overlay surfaces that float above the page — the navigation overlay, the cart drawer, and modal dialogs.

Depth and separation SHALL be expressed through hairline rules, spacing, and image scale.

#### Scenario: A content card is styled

- **WHEN** a product card, editorial block, or content panel is rendered
- **THEN** it has square corners and no drop shadow

#### Scenario: An overlay is rendered

- **WHEN** the navigation overlay, cart drawer, or a modal dialog is open
- **THEN** it may carry a shadow to establish that it floats above the page

### Requirement: Measure is decoupled from container

The system SHALL constrain running text to a maximum measure of approximately 62 characters, positioned by the layout grid rather than centred in a page-wide wrapper.

Images SHALL be sized independently of the text measure and MAY extend to full grid width or full bleed.

The system MUST NOT apply a single global centred maximum-width wrapper to all page content.

#### Scenario: Text and image appear in one section

- **WHEN** a section contains both running text and an image
- **THEN** the text is capped at its measure and placed by the grid
- **AND** the image sizes independently of that measure

#### Scenario: Centred text is used

- **WHEN** a text block longer than two lines is centre-aligned
- **THEN** the composition fails visual review and is re-aligned

### Requirement: Design tokens have a single source of truth

The system SHALL define every typographic, colour, spacing, radius, and motion token in one place, and all components SHALL consume tokens from it. Component styles MUST NOT hard-code a value that a token already expresses.

#### Scenario: A component needs a spacing value

- **WHEN** a component applies spacing, colour, radius, type size, or motion timing
- **THEN** it references a defined token
- **AND** no literal value duplicating a token is written into the component

### Requirement: Anti-generic constraints are enforceable

The system SHALL enforce the following constraints across all storefront surfaces. Each is stated so it can be checked during review rather than judged by impression.

1. No CSS gradient, except a single-direction black scrim at 35% opacity or less placed over photography, and only where text contrast fails without it.
2. No `backdrop-filter`.
3. No `box-shadow` on content surfaces (overlays excepted, per the border and surface requirement).
4. Border radius `0` on surfaces, images, and buttons; `2px` maximum on form inputs.
5. No metal or gem colour value in tokens or component styles.
6. At most three typographic roles per page body; `display` at most twice per page.
7. At most one orchestrated staggered sequence per route.
8. Product data carries no rating, review, badge, compare-at price, or stock-countdown field.
9. No centre-aligned text block longer than two lines.
10. Every section MUST differ from each adjacent section in at least one of: column count, alignment, image scale, or surface.
11. Primary navigation carries at most five top-level items.
12. At most eight icons site-wide, from one source, at one stroke weight.
13. Every sentence of brand or product copy MUST contain either a measurable fact or a physically photographable noun.

#### Scenario: A section repeats its neighbour's composition

- **WHEN** a section matches an adjacent section in column count, alignment, image scale, and surface
- **THEN** the section fails review and is recomposed before the page is accepted

#### Scenario: Copy is written

- **WHEN** a sentence of brand or product copy contains neither a measurable fact nor a photographable noun
- **THEN** it is rejected and rewritten with concrete material, dimensional, or process detail

#### Scenario: A decorative effect is proposed

- **WHEN** a gradient, blur, glow, or shadow is proposed to improve a section's appearance
- **THEN** the composition, typography, spacing, or image crop is changed instead
