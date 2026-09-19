## RENAMED Requirements

- FROM: `### Requirement: The colour system is warm-neutral with one supplied brand colour`
- TO: `### Requirement: The colour system is cream, royal green, charcoal and gold`

## MODIFIED Requirements

### Requirement: The colour system is cream, royal green, charcoal and gold

The system SHALL define these colour tokens, named for structural role with the mood-board hex recorded beside each:

- `paper` — Cream `#FAF8F3`, the default surface
- `charcoal` — Charcoal `#1A1A1A`, body text on paper
- `ink` — Royal Green `#0F3D33`, the inverted surface
- `graphite` — Deep Brown `#3B2F2F`, muted text on paper
- `graphite-inverse` — a warm cream-grey under chroma 0.02, muted text on ink
- `gold` — Gold `#D4AF37`, the accent

`paper`, `charcoal` and `graphite` SHALL hold chroma at or below 0.02. `ink` and `gold` MAY exceed that ceiling and SHALL be named in the contrast script's exemption list with their reason. No other token above the ceiling SHALL exist.

`gold` MAY sit in the warm-metal hue band. No unnamed token SHALL.

`gold` SHALL NOT be used as body text on `paper` (that pairing fails 4.5:1). On the `primary` fill it SHALL carry `charcoal` text. On the inverted surface it MAY be used as a rule, icon, or outline.

The inverted surface SHALL be royal green, not charcoal. Paper foreground SHALL be charcoal, not green.

#### Scenario: Gold is used as a fill

- **WHEN** the `primary` action is filled with gold
- **THEN** its label is charcoal
- **AND** the pairing measures at or above 4.5:1

#### Scenario: An unnamed chromatic token is added

- **WHEN** a token other than `ink` or `gold` exceeds chroma 0.02
- **THEN** the build fails

#### Scenario: Gold is set as body text on cream

- **WHEN** running text on paper is coloured gold
- **THEN** the pairing is rejected; charcoal or graphite is used instead

### Requirement: Typography uses a bimodal four-role scale

The system SHALL define exactly four typographic roles — `display`, `title`, `body`, and `caption` — and all text SHALL be set in one of them.

The scale MUST be bimodal: `display` is substantially larger than `title`, and `caption` is substantially smaller than `body`, with no intermediate steps filling the gaps. `body` SHALL be the only role intended for sustained reading.

A storefront page body MAY use all four roles. `display` SHALL appear at most twice per page.

#### Scenario: Text is rendered

- **WHEN** any text node is rendered in the storefront
- **THEN** it resolves to exactly one of the four defined typographic roles

#### Scenario: A page overuses the display role

- **WHEN** a page renders the `display` role more than twice
- **THEN** the page fails visual review and is recomposed rather than granted an exception

### Requirement: Two typefaces with distinct roles

The system SHALL use exactly two typefaces: Playfair Display for the `display` and `title` roles, and Montserrat for `body` and `caption`.

Neither typeface SHALL be a system default stack (`Arial`, `Helvetica`, `Roboto`, or an unstyled `system-ui` fallback) in normal operation.

#### Scenario: Fonts load successfully

- **WHEN** a page renders with both typefaces available
- **THEN** display and title text is set in Playfair Display, and body and caption text is set in Montserrat

### Requirement: Border and surface language uses pill, circle and frame radii

The system SHALL define three radius tokens besides the input radius: `pill` (full round, for CTAs and circular stills), `frame` (for inset photographic panels), and `input` (2px, for form fields). Surfaces that are neither a CTA, a category still, the lotus mark, nor an inset photographic panel SHALL remain square.

`box-shadow` SHALL NOT be used to elevate content. Shadow is permitted only on overlay surfaces that float above the page.

#### Scenario: A primary action is styled

- **WHEN** a `primary` or `quiet` button is rendered
- **THEN** it uses the pill radius

#### Scenario: A category still is styled

- **WHEN** a homepage type index still is rendered
- **THEN** it is cropped to a circle using the pill radius on a square frame

#### Scenario: A product card is styled

- **WHEN** a product card is rendered
- **THEN** it has square corners and no drop shadow

### Requirement: Anti-generic constraints are enforceable

The system SHALL enforce the following constraints across all storefront surfaces.

1. No CSS gradient, except a single-direction scrim over photography where overlay text would otherwise fail contrast. The scrim MAY use royal green or black and MAY exceed 35% opacity when that is what the overlay heading requires. It SHALL be marked `slop-check: allow scrim`.
2. No `backdrop-filter`.
3. No `box-shadow` on content surfaces (overlays excepted).
4. Pill and circle radius only on CTAs, category stills, and the lotus mark; frame radius only on inset photographic panels; 2px on form inputs; square elsewhere. `rounded-full` SHALL NOT be written — the `pill` token is the round geometry.
5. Metal colour is permitted only as the named `gold` token.
6. `display` at most twice per page. All four type roles MAY appear on the homepage.
7. At most one orchestrated staggered sequence per route.
8. Product data carries no rating, review, badge, compare-at price, or stock-countdown field.
9. Running copy longer than two lines SHALL NOT be centre-aligned. Centred section titles and centred category labels of one or two lines MAY.
10. Every section MUST differ from each adjacent section in at least one of: column count, alignment, image scale, or surface.
11. Primary navigation carries at most five top-level items.
12. At most twelve icons site-wide, from one source, at one stroke weight.
13. Brand and product copy SHOULD carry a measurable fact or a photographable noun. Mood-board sentences the business supplied MAY be retained as recorded exceptions in the brand input record rather than rewritten.

#### Scenario: Overlay text sits on photography

- **WHEN** heading text is placed over a photograph
- **THEN** a marked scrim is applied if the photograph alone cannot meet the contrast floor
- **AND** the heading remains visible with scripting disabled

#### Scenario: A third display is proposed on the homepage

- **WHEN** a third `display` role is added under `components/home/`
- **THEN** the slop check fails
