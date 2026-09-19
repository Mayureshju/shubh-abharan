## ADDED Requirements

### Requirement: A product may belong to brand-owned occasions

A product SHALL be permitted to declare membership of zero, one, or several occasions. Occasion names, slugs and descriptions SHALL be sourced from the supplied brand record and MUST NOT be invented by the catalog.

An occasion SHALL be an editorial grouping independent of category and of collection: a product may belong to an occasion without belonging to a collection, and an occasion may contain products of any category.

A product that declares no occasion membership SHALL remain reachable through the shop surface and search.

#### Scenario: An occasion listing renders

- **WHEN** an occasion listing renders
- **THEN** it includes exactly the products declaring membership of that occasion

#### Scenario: A product belongs to no occasion

- **WHEN** a product declares no occasion membership
- **THEN** it remains reachable through the shop surface and search
- **AND** no occasion listing lists it

#### Scenario: A membership names an unknown occasion

- **WHEN** a product declares membership of an occasion absent from the brand record
- **THEN** the catalog is reported as invalid before the storefront is built

## MODIFIED Requirements

### Requirement: Money is represented as integer minor units with a currency

A price SHALL be represented as an integer amount in the currency's minor unit together with an ISO 4217 currency code drawn from the closed set `GBP`, `EUR`, `USD`, and `INR`. Prices MUST NOT be stored as floating-point numbers or as preformatted strings.

Price SHALL be carried by the variant, because configuration affects cost. A product's displayed price SHALL be derived from its variants: the lowest variant price, presented as a range or "from" price when its variants differ.

Formatting a price for display SHALL happen at the point of rendering through one shared formatter. The formatter SHALL use a locale pinned to the price's currency so server and client render the same string. No component SHALL format a price itself.

#### Scenario: A price is displayed

- **WHEN** any surface displays a price
- **THEN** it is formatted by the shared formatter using the price's own currency code

#### Scenario: An INR price is displayed

- **WHEN** a variant carries an INR amount
- **THEN** the shared formatter presents it in Indian numbering
- **AND** the string is identical on the server and after hydration

#### Scenario: A product's variants are priced differently

- **WHEN** a product's variants carry differing prices
- **THEN** the product's displayed price is derived from the lowest variant price and indicates that variants differ

#### Scenario: Cart totals are calculated

- **WHEN** cart line amounts are summed
- **THEN** the arithmetic is performed on integer minor units with no rounding error

### Requirement: The model has no field for ratings, reviews, discounts or scarcity

The catalog model MUST NOT define a field for a rating, a review, a review count, a testimonial, a compare-at price, a discount percentage, a sale flag, a stock count, a countdown, a bestseller marker, a customer count, a new-arrival flag, a featured flag, or a published date used as merchandising.

New arrivals and featured membership SHALL be expressed as brand-owned slug lists, not as fields on the product. Introducing any forbidden field SHALL require amending this specification first. An automated check SHALL fail the build when a field bearing one of these meanings appears in catalog data or catalog types.

#### Scenario: A surface attempts to show social proof

- **WHEN** any storefront surface attempts to render a rating or review count
- **THEN** no such field exists on the product and the value cannot be rendered

#### Scenario: A discount field is added to catalog code

- **WHEN** a compare-at price or discount field is introduced into the catalog module
- **THEN** the project's check command fails and names the offending field

#### Scenario: New arrivals are requested as a product flag

- **WHEN** a surface attempts to read an `isNew` or similar flag from a product
- **THEN** no such field exists and membership is taken from the brand record instead
