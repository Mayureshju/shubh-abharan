## Purpose

Defines authored journal posts as storefront editorial content — separate from the product catalog — so the homepage can present the latest three stories and each story has a durable article URL.

## ADDED Requirements

### Requirement: Journal posts are authored records with a public slug

A journal post SHALL carry a unique slug, a title, an excerpt, a publication date, at least one photograph, and a body of authored paragraphs. Posts SHALL be the sole place journal copy is authored. The catalog MUST NOT grow a blog field.

The three posts presented on the homepage SHALL be the three latest by publication date. A homepage with fewer than one post SHALL omit the journal section.

#### Scenario: The homepage asks for latest posts

- **WHEN** three or more journal posts are authored
- **THEN** the homepage receives the three with the latest publication dates

#### Scenario: No posts are authored

- **WHEN** the journal has no posts
- **THEN** the homepage omits the journal section

### Requirement: Each post is reachable at a journal article URL

Each authored post SHALL be reachable at `/journal/{slug}`. The article SHALL present the title, the publication date, the photograph, and the body.

A request for a slug that does not exist SHALL render the storefront's not-found response rather than an error page.

#### Scenario: A customer opens a journal article

- **WHEN** a customer opens `/journal/{slug}` for an authored post
- **THEN** the article presents that post's title, date, photograph and body

#### Scenario: A journal slug does not exist

- **WHEN** a customer opens `/journal/{slug}` for a slug with no post
- **THEN** the storefront presents a not-found response

### Requirement: Journal copy is specific and does not invent commerce claims

Journal body copy SHALL describe what its photograph shows or a measurable craft fact. It MUST NOT invent reviews, certifications, prices, or scarcity, and MUST NOT use generic luxury filler in place of a subject.

#### Scenario: A post is authored against a campaign plate

- **WHEN** a journal post uses a campaign photograph
- **THEN** its copy names what is in that frame or a craft fact about the work shown
- **AND** it does not include a rating, a discount, or an unsupported material claim
