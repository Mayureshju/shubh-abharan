## RENAMED Requirements

- FROM: `### Requirement: The colour system is achromatic and metal is never a colour`
- TO: `### Requirement: The colour system is warm-neutral with one supplied brand colour`

## MODIFIED Requirements

### Requirement: The colour system is warm-neutral with one supplied brand colour

The system SHALL define its surface colour tokens as a warm-neutral set only: a paper surface, an ink foreground, a mid-tone, an inverse mid-tone, and hairline values derived from the surface pair at low opacity. Every one of these SHALL hold a chroma at or below 0.02.

The system MAY additionally define **exactly one** chromatic token, and only where that colour has been supplied by the business as its brand colour. That token SHALL be named for the colour the business calls it, SHALL be recorded with its supplied value in the brand input record, and SHALL be listed by name, with its reason, in the contrast script's exemption list. Raising the chroma ceiling instead SHALL NOT be permitted — a ceiling that admits one colour by number admits every colour by number. A second chromatic token SHALL fail the build.

No token, utility, or component style SHALL express a metal or gem tone — gold, brass, rose gold, silver — as a colour value. This SHALL be enforced by hue as well as by chroma: a token carrying chroma above the ceiling with a hue in the warm-metal band SHALL fail the build whether or not it is exempt. Metal colour SHALL enter the interface exclusively through photography.

The brand colour SHALL be used sparingly and its uses SHALL be enumerable in one sentence. It MUST NOT be used as a page or section surface, as body text, or as a decorative fill.

#### Scenario: A metal tone is introduced as a colour

- **WHEN** a colour value in the warm-metal range is added to tokens, utilities, or component styles
- **THEN** the hue exclusion fails the build, and the intent is satisfied with photography or a neutral token instead

#### Scenario: The brand colour is exempted

- **WHEN** the business supplies a brand colour whose chroma exceeds the ceiling
- **THEN** it is added as a single named exemption with its reason recorded beside it
- **AND** its contrast is measured against every surface it carries text on and every surface it is placed against, and meets the floor for each

#### Scenario: A second chromatic token is proposed

- **WHEN** a second token above the chroma ceiling is added
- **THEN** the build fails, and the value is expressed with the existing brand colour, a neutral token, or photography

#### Scenario: Chroma appears on a page

- **WHEN** a rendered page displays a saturated colour
- **THEN** that colour originates from a photograph, or from the single brand token in one of its enumerated uses
