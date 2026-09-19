## Purpose

Defines the storefront homepage as an authored editorial composition — its narrative section order, how it selects the collection and products it presents, how it behaves while brand copy and photography are unsupplied, its motion and responsive contracts, and the composition scores it must satisfy to be accepted.

## ADDED Requirements

### Requirement: The homepage presents a fixed editorial narrative

The homepage SHALL present five authored sections inside the main landmark, in this order and with these purposes:

| Order | Section | Purpose |
| --- | --- | --- |
| 1 | Hero | The primary visual statement: dominant photography, the page's top-level heading, one primary action. |
| 2 | Collection | One named collection presented as a story — a large image against a short passage of running copy and a link into that collection. |
| 3 | Selection | A curated set of products presented as cards linking to their detail pages. |
| 4 | Scale | One piece presented at true size in a generous empty field with its measured dimension. |
| 5 | Statement | A closing brand statement and one secondary action into the shop. No image. |

The homepage MUST NOT present a section whose only content is decorative, and MUST NOT repeat a section's composition elsewhere on the page to fill vertical space.

#### Scenario: The homepage renders

- **WHEN** a customer opens the homepage
- **THEN** the five sections render in the stated order inside one main landmark
- **AND** no additional marketing, statistics, testimonial, certification or badge section is present

#### Scenario: A section would carry no content

- **WHEN** a section has neither supplied content nor a declared structural placeholder to render
- **THEN** the page is recomposed rather than filling the section with decoration

### Requirement: Adjacent sections differ and vertical rhythm is non-uniform

Every section SHALL differ from each adjacent section in at least one of: column count, text alignment, image scale, or surface.

The joins between sections SHALL NOT be uniform. At least one `tight` join SHALL be present and no two `breath` joins SHALL be adjacent. The join between the final section and the footer is a `breath` join fixed by the footer itself; the join entering the final section SHALL therefore NOT be `breath`.

#### Scenario: The composition is reviewed

- **WHEN** the homepage's sections are inspected pairwise
- **THEN** each adjacent pair differs in column count, alignment, image scale, or surface
- **AND** no two adjacent sections share all four

#### Scenario: The rhythm is scored

- **WHEN** the homepage's section joins are listed in order, including the footer join
- **THEN** at least one join is `tight`
- **AND** no two adjacent joins are both `breath`

#### Scenario: Every join is given the same value

- **WHEN** the homepage applies one identical rhythm to every section join
- **THEN** it fails visual review and its rhythm is re-scored before acceptance

### Requirement: The homepage spends three typographic roles

The homepage body SHALL use exactly three of the four typographic roles: `display`, `body` and `caption`. The `title` role SHALL NOT appear on the homepage.

The `display` role SHALL appear exactly twice: once as the page's top-level heading in the Hero, and once as the closing statement. The closing statement is not a document heading and SHALL NOT be marked up as one.

Section headings SHALL be set in the `caption` role and marked up at the heading level the document structure requires.

#### Scenario: Typographic roles are counted

- **WHEN** the rendered homepage body is inspected
- **THEN** exactly three typographic roles are in use
- **AND** the `display` role appears exactly twice

#### Scenario: The closing statement is reached by a screen reader

- **WHEN** a screen reader reaches the closing statement
- **THEN** it is announced as ordinary text, not as a heading

#### Scenario: A fourth role is introduced

- **WHEN** a section is authored using the `title` role
- **THEN** the change is rejected and the section is set in one of the three roles the page already spends

### Requirement: The Hero is a single visual statement with one primary action

The Hero SHALL present one dominant photographic frame, the page's single top-level heading, and at most one action in the `primary` presentation. It MUST NOT present a second competing call to action, a badge, a statistic, or a decorative graphic element.

Where heading text is placed over photography, it SHALL meet its required contrast ratio against the underlying image, using a single-direction scrim at 35% opacity or less only where the photograph alone cannot.

#### Scenario: The Hero renders

- **WHEN** the Hero renders
- **THEN** it presents one photographic frame, one top-level heading, and no more than one `primary` action

#### Scenario: Heading text overlays photography

- **WHEN** the Hero's heading is placed over its photograph
- **THEN** the heading meets its contrast floor against the image
- **AND** any scrim applied is a single-direction black at 35% opacity or less

#### Scenario: A second call to action is proposed

- **WHEN** a second `primary` action is added to the Hero
- **THEN** it is rejected and demoted to a secondary presentation or removed

### Requirement: The presented collection is selected by declared order

The Collection section SHALL present the first collection in the brand record's declared display order. The homepage MUST NOT rank, score, or otherwise infer which collection to feature.

When the brand record supplies no collections, the section SHALL render its structure with a marked unfilled state in place of the collection's name and description, rather than being omitted from the page.

#### Scenario: Collections have been supplied

- **WHEN** the brand record supplies one or more collections
- **THEN** the Collection section presents the first in declared display order, with its name, its supplied description and a link to that collection

#### Scenario: No collections have been supplied

- **WHEN** the brand record supplies no collections
- **THEN** the Collection section still renders, showing a clearly-marked unfilled state where the collection name and description would appear
- **AND** the page's section order, rhythm and composition are unchanged

#### Scenario: A collection is added to the brand record

- **WHEN** collections are supplied for the first time
- **THEN** the Collection section presents real content through a data change alone, with no change to the page's composition

### Requirement: The presented product set carries no ranking or merchandising claim

The Selection section SHALL draw its products from the catalog's declared display order. The homepage MUST NOT present products as bestselling, trending, popular, recommended, new, discounted, or scarce, and MUST NOT derive an ordering from any such notion.

Products presented on the homepage SHALL render through the shared product card and SHALL carry no rating, review, badge, discount flag, label or scarcity indicator.

#### Scenario: The Selection renders

- **WHEN** the Selection section renders its products
- **THEN** their order is the catalog's declared display order
- **AND** no product carries a rating, review, badge, discount flag, label or scarcity indicator

#### Scenario: A ranked framing is proposed

- **WHEN** a heading or label frames the set as bestselling, trending, or most popular
- **THEN** it is rejected, because no supplied data supports the claim

#### Scenario: The set is presented as a listing

- **WHEN** four or more products render in the Selection
- **THEN** their presentation varies in image role, aspect ratio or grid span
- **AND** they do not render as a uniform repeating row of identically-sized cards

### Requirement: Editorial imagery is declared by role, crop and aspect

Every photographic frame the homepage introduces that is not a catalog product image SHALL be declared with an image role, an aspect ratio, an intended crop and alternative text, and SHALL render through the shared image primitive.

While photography is unsupplied, each frame SHALL render the system's neutral placeholder stating its role, intended crop and aspect, so that the composition remains reviewable. The set of declared frames SHALL be recorded in the brand input record as the photography the business must supply.

#### Scenario: Photography is unsupplied

- **WHEN** the homepage renders with no photography supplied
- **THEN** each editorial frame reserves its declared aspect and states its role, intended crop and aspect ratio
- **AND** no frame is hidden, collapsed, or replaced with a decorative fill

#### Scenario: Photography is supplied

- **WHEN** real photography is supplied for a declared frame
- **THEN** it replaces the placeholder through a data change alone, with no change to the page's composition

#### Scenario: The shoot is briefed

- **WHEN** the business is asked what photography the homepage needs
- **THEN** every frame the homepage declares is listed in the brand input record with its role, crop and aspect

### Requirement: The homepage renders no unsupplied value as finished content

Every brand-owned string the homepage renders — including its heading, its closing statement, the presented collection's name and description, and every product name, price and material line — SHALL come from the supplied record or render as a visibly marked placeholder.

The homepage MUST NOT invent brand copy, product copy, materials, prices, policies, claims, or availability in order to appear complete.

#### Scenario: Brand copy is unsupplied

- **WHEN** the brand record supplies no heading or closing statement
- **THEN** the homepage renders clearly-marked placeholders in their place
- **AND** neither reads as finished brand copy

#### Scenario: Brand copy is supplied

- **WHEN** the heading and closing statement are supplied
- **THEN** they render wherever those values appear, through a data change alone

#### Scenario: Copy is authored

- **WHEN** a sentence of brand copy is written for the homepage
- **THEN** it contains either a measurable fact or a physically photographable noun, or it is rejected

### Requirement: The homepage spends the route's single orchestrated sequence on the Hero

The homepage SHALL contain exactly one orchestrated staggered entrance, and it SHALL belong to the Hero. Every other section SHALL reveal as a single unit through the shared scroll-reveal mechanism.

The homepage MUST NOT stagger product cards individually, MUST NOT apply parallax, and MUST NOT introduce a duration or easing value outside the defined token set. Entrance orchestration SHALL use the `slow` duration; section reveals SHALL use `base`.

#### Scenario: The page loads

- **WHEN** a customer loads the homepage
- **THEN** one staggered entrance plays, in the Hero
- **AND** every other section reveals as a single unit

#### Scenario: Reduced motion is requested

- **WHEN** a customer with reduced motion enabled loads the homepage
- **THEN** all content is immediately present and readable with no entrance translation, scale or stagger
- **AND** the page's visual hierarchy is unchanged

#### Scenario: Scroll-triggered animation never runs

- **WHEN** a section is never scrolled into view, or the reveal mechanism fails to initialise
- **THEN** its content is present in the document and readable by assistive technology and search indexing

#### Scenario: A customer scrolls

- **WHEN** a customer scrolls the homepage by wheel, trackpad, touch, keyboard or scrollbar drag
- **THEN** native scrolling behaviour, momentum and position are unchanged

### Requirement: Mobile is an authored composition

The homepage SHALL be verified at 1920px, 1440px, 1024px, 768px and 390px, presenting no horizontal page scroll, no overlapping content and no unintended wrapping at any of them. Above 1600px the layout SHALL gain margin rather than enlarging type.

At mobile widths the homepage SHALL present editorial imagery full-bleed without side gutters, and SHALL present its product set as a horizontally scrollable rail rather than a long vertical stack. Its mobile composition SHALL be authored rather than being its desktop columns stacked in source order.

#### Scenario: The homepage is submitted as complete

- **WHEN** the homepage is submitted as done
- **THEN** it has been verified at 1920px, 1440px, 1024px, 768px and 390px
- **AND** exhibits no horizontal page scroll or overlapping content at any of them

#### Scenario: The homepage renders on a phone

- **WHEN** the homepage renders at 390px
- **THEN** its editorial imagery extends to the full viewport width with no side gutter
- **AND** its product set presents as a horizontally scrollable rail with snap points

#### Scenario: A very wide viewport is used

- **WHEN** the homepage renders above 1600px
- **THEN** margins increase and type sizes remain unchanged

#### Scenario: A customer zooms text to 200%

- **WHEN** a customer sets text zoom to 200%
- **THEN** all content remains readable and reachable with no clipped or overlapping text

### Requirement: The homepage renders server-first

The homepage SHALL render on the server, and client-side interactivity SHALL be limited to the entrance orchestration and the navigation controls the shell already owns. No section SHALL become a client component solely to animate.

The homepage MUST NOT add an animation, carousel, or UI dependency beyond those already present in the project. Its largest photographic frame SHALL be prioritised for loading and SHALL reserve its layout space before load.

#### Scenario: The page is inspected for client components

- **WHEN** the homepage's component tree is inspected
- **THEN** every section other than the Hero's entrance orchestration renders on the server

#### Scenario: The page loads on a slow connection

- **WHEN** the homepage loads
- **THEN** every image frame reserves its declared aspect before loading
- **AND** no section shifts position as images arrive

#### Scenario: A new dependency is proposed

- **WHEN** a section proposes an additional animation or carousel library
- **THEN** it is rejected and the behaviour is built from the existing motion tokens and native scrolling

### Requirement: The homepage is fully operable by keyboard

Every interactive control on the homepage — the Hero action, the collection link, each product card, and the closing action — SHALL be reachable and operable by keyboard in an order matching visual reading order, with a visible focus indicator on both surfaces.

Each product card SHALL expose a single activatable target navigating to that product's detail page. Controls SHALL present a touch target of at least 44px in both dimensions.

#### Scenario: A customer traverses the page by keyboard

- **WHEN** a customer traverses the homepage using only the keyboard
- **THEN** every interactive control is reachable in an order matching visual reading order
- **AND** the focused control is always visibly indicated

#### Scenario: A product card is activated

- **WHEN** a customer activates a product card by pointer or keyboard
- **THEN** it navigates to that product's detail page
- **AND** the card presented no second competing tab stop

#### Scenario: Controls are measured on a touch device

- **WHEN** the homepage's controls render on a touch device
- **THEN** each activatable area measures at least 44px in both dimensions
