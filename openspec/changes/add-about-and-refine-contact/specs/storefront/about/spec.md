## Purpose

Defines the About page so the brand can be introduced from supplied facts and real photographs, with every unsupplied fact visibly marked rather than written for the business.

## ADDED Requirements

### Requirement: About is composed only from supplied brand fields

The About page SHALL render the brand name, story, founding year, place of business, materials vocabulary and reasons from the brand record. An unsupplied story, founding year, place of business, metal list, stone list or place of manufacture SHALL render as a marked placeholder. A policy SHALL render only when supplied. The page MUST NOT invent a founder, a date, a location, a workshop, a material, a process, a certification or a customer count.

#### Scenario: Story has not been supplied

- **WHEN** the brand record carries no story paragraphs
- **THEN** the story section renders a marked placeholder in place of the copy
- **AND** no substitute story is shown

#### Scenario: Story has been supplied

- **WHEN** the brand record carries story paragraphs
- **THEN** each paragraph renders as given, in order

#### Scenario: Materials have not been supplied

- **WHEN** the metals, stones or place of manufacture are unsupplied
- **THEN** each renders as a marked placeholder in the materials list

#### Scenario: A policy has not been supplied

- **WHEN** a hallmarking or care policy is unsupplied
- **THEN** no row for it is rendered

### Requirement: About copy describes what its photographs show

Copy on the About page that is not a supplied brand value SHALL name only what is visible in the photograph beside it. It MUST NOT describe a technique, a hand process, or a stone identity the photograph cannot show.

#### Scenario: The materials section is inspected

- **WHEN** the materials section copy is read beside its photograph
- **THEN** every noun in it can be pointed at in the frame
- **AND** it makes no claim about how the piece was made

### Requirement: About has one heading and a varied composition

The About page SHALL expose exactly one top-level heading, the brand name, with section headings descending without skipping. Adjacent sections SHALL differ in surface, column count, alignment or image scale. The page SHALL spend the `display` role at most once and MUST NOT run a staggered entrance sequence.

#### Scenario: Heading structure

- **WHEN** the page outline is inspected
- **THEN** one `h1` carries the brand name
- **AND** story, materials and reasons are `h2` sections

#### Scenario: The reasons list

- **WHEN** the brand record carries reasons
- **THEN** they render as an ordered list differing in composition from the homepage's icon row
