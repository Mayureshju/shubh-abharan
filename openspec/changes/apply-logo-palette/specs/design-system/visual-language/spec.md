## RENAMED Requirements

- FROM: `### Requirement: The colour system is cream, royal green, charcoal and gold`
- TO: `### Requirement: The colour system is ivory, aubergine, lilac and soft gold`

## MODIFIED Requirements

### Requirement: The colour system is ivory, aubergine, lilac and soft gold

The system SHALL define these colour tokens, named for structural role with the logo hex recorded beside each:

- `paper` — Ivory `#FAF6EF`, the default surface
- `charcoal` — Charcoal `#1A1A1A`, body text on paper
- `ink` — Aubergine `#372849`, the inverted surface
- `graphite` — Plum-grey `#403A45`, muted text on paper
- `graphite-inverse` — Lilac-mist `#CDC7D5`, muted text on ink
- `gold` — Soft gold `#C6A264`, rules, outlines and icons
- `lavender` — Logo lilac `#AE96DA`, the primary fill and selected states
- `lilac` — Deep lilac `#6D5398`, accent text on paper

`paper`, `charcoal`, `graphite` and `graphite-inverse` SHALL hold chroma at or below 0.02. `ink`, `gold`, `lavender` and `lilac` MAY exceed that ceiling and SHALL be named in the contrast script's exemption list with their reason. No other token above the ceiling SHALL exist.

`gold` MAY sit in the warm-metal hue band. No unnamed token SHALL.

Accent text SHALL use the surface-relative `accent` token, which resolves to `lilac` on paper and `gold` on ink. `gold` SHALL NOT be used as text on `paper`. `lavender` SHALL carry `charcoal` text. Brand colours SHALL be flat; no gradient SHALL use them.

#### Scenario: Lavender is used as a fill

- **WHEN** the `primary` action is filled with lavender
- **THEN** its label is charcoal
- **AND** the pairing measures at or above 4.5:1

#### Scenario: An unnamed chromatic token is added

- **WHEN** a token other than `ink`, `gold`, `lavender` or `lilac` exceeds chroma 0.02
- **THEN** the build fails

#### Scenario: Accent text on either surface

- **WHEN** an eyebrow is set in `text-accent`
- **THEN** it renders deep lilac on paper and gold on ink
- **AND** both measure at or above 4.5:1
