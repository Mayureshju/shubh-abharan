## Purpose

Defines the canonical shape of everything the storefront sells — products, variants, images, prices, availability, attributes, categories and collections — so that one product object can drive product cards, collection pages, search, product detail, cart and wishlist without any surface inventing a field.

## ADDED Requirements

### Requirement: Catalog entities carry a stable identity separate from their slug

Every product, variant and collection SHALL carry an opaque, stable identifier that is unique within the catalog and is never reused for a different entity.

Products and collections SHALL additionally carry a human-readable slug used as their public URL segment. Slugs SHALL be lowercase, hyphen-separated, unique within their entity type, and SHALL NOT encode the identifier.

Persisted customer selections — cart lines and wishlist entries — SHALL reference entities by identifier, never by slug, so that renaming a product does not invalidate a saved selection.

#### Scenario: A product is addressed by URL

- **WHEN** a customer opens a product detail page
- **THEN** the product is located by its slug
- **AND** the slug is lowercase and hyphen-separated

#### Scenario: A product slug changes

- **WHEN** a product's slug is changed in catalog data
- **THEN** previously saved cart lines and wishlist entries still resolve to that product
- **AND** the entity's identifier is unchanged

#### Scenario: Two entities are given the same slug

- **WHEN** catalog data contains two products sharing a slug
- **THEN** the catalog is reported as invalid and the condition is surfaced before the storefront is built

### Requirement: Every product declares exactly one category from a closed set

Each product SHALL declare exactly one category drawn from a closed, enumerated set covering the pieces the business sells: ring, necklace, pendant, earring, bracelet, and set.

Category SHALL be the axis used for type filtering on the shop surface. Category MUST NOT be presented as top-level navigation.

A product in the `set` category SHALL be permitted to reference the products that compose it. Those references SHALL resolve to products present in the catalog.

#### Scenario: A customer filters by product type

- **WHEN** a customer filters the shop surface by a product type
- **THEN** the results are exactly the products declaring that category

#### Scenario: A category outside the set is used

- **WHEN** catalog data declares a category not in the enumerated set
- **THEN** the data fails to typecheck and cannot be built

#### Scenario: A set is displayed

- **WHEN** a product in the `set` category declares component products
- **THEN** each referenced product resolves to a product in the catalog

### Requirement: Collections are an editorial axis independent of category

A collection SHALL be a named, slugged editorial grouping with an optional one-line description. A product SHALL be permitted to belong to zero, one, or several collections, and a collection SHALL declare the order in which its products are presented.

Collection names, slugs and descriptions SHALL be sourced from the supplied brand record and MUST NOT be invented by the catalog.

A product's collection membership SHALL be independent of its category: a collection may contain products of any category.

#### Scenario: A collection page renders

- **WHEN** a collection page renders
- **THEN** its products appear in the order the collection declares
- **AND** products of differing categories may appear together

#### Scenario: A product belongs to no collection

- **WHEN** a product declares no collection membership
- **THEN** it remains reachable through the shop surface and search
- **AND** no collection page lists it

#### Scenario: A membership names an unknown collection

- **WHEN** a product declares membership of a collection absent from the brand record
- **THEN** the catalog is reported as invalid before the storefront is built

### Requirement: Products carry an ordered image set with declared roles

A product SHALL carry an ordered list of images. Each image SHALL declare exactly one of the roles defined by the design system — `macro`, `scale`, `worn`, `detail` — together with an aspect ratio and either alternative text or an explicit decorative marking.

List order SHALL be the authoritative presentation order. The first image SHALL be the product's primary image, the second its secondary image, and the full list its gallery; there SHALL be no separate primary or secondary field that could disagree with the order.

An image declaring the `scale` role SHALL carry its measured dimension.

A surface requesting an image by role SHALL receive the first image in order carrying that role, or, where none exists, the product's primary image.

#### Scenario: A listing requests a product's primary image

- **WHEN** a listing renders a product card
- **THEN** it receives the first image in the product's image order

#### Scenario: A surface requests a role the product lacks

- **WHEN** a surface requests a `worn` image for a product having none
- **THEN** it receives the product's primary image
- **AND** the composition renders with no empty or broken frame

#### Scenario: A scale image omits its dimension

- **WHEN** catalog data declares a `scale` image without a measured dimension
- **THEN** the data fails to typecheck and cannot be built

#### Scenario: A product has no photography yet

- **WHEN** a product's images declare role, aspect and intended crop but no source file
- **THEN** each renders as the design system's marked placeholder
- **AND** supplying the source file later requires a data change only

### Requirement: Purchasable configuration is represented by variants

Every product SHALL carry at least one variant. A variant SHALL represent one purchasable configuration and SHALL be the unit added to the cart.

A product SHALL declare its variant axes from a closed, enumerated set — `size`, `length`, `finish`, `metal` — together with the ordered values offered on each axis. Each variant SHALL declare one value for every axis the product declares, and no two variants SHALL declare the same combination of values.

A product offering no choice SHALL carry exactly one variant declaring no axes.

#### Scenario: A ring is offered in several sizes and finishes

- **WHEN** a product declares a `size` axis and a `finish` axis
- **THEN** each of its variants declares exactly one size value and one finish value
- **AND** no two variants share the same size and finish pairing

#### Scenario: A product offers no choice

- **WHEN** a product declares no variant axes
- **THEN** it carries exactly one variant
- **AND** that variant is added to the cart without a selection step

#### Scenario: An axis outside the set is used

- **WHEN** catalog data declares a variant axis not in the enumerated set
- **THEN** the data fails to typecheck and cannot be built

### Requirement: Money is represented as integer minor units with a currency

A price SHALL be represented as an integer amount in the currency's minor unit together with an ISO 4217 currency code. Prices MUST NOT be stored as floating-point numbers or as preformatted strings.

Price SHALL be carried by the variant, because configuration affects cost. A product's displayed price SHALL be derived from its variants: the lowest variant price, presented as a range or "from" price when its variants differ.

Formatting a price for display SHALL happen at the point of rendering through one shared formatter. No component SHALL format a price itself.

#### Scenario: A price is displayed

- **WHEN** any surface displays a price
- **THEN** it is formatted by the shared formatter using the price's own currency code

#### Scenario: A product's variants are priced differently

- **WHEN** a product's variants carry differing prices
- **THEN** the product's displayed price is derived from the lowest variant price and indicates that variants differ

#### Scenario: Cart totals are calculated

- **WHEN** cart line amounts are summed
- **THEN** the arithmetic is performed on integer minor units with no rounding error

### Requirement: Availability is declared per variant and carries no quantity

Each variant SHALL declare its availability as exactly one value from a closed set: `available`, `made-to-order`, `sold-out`, or `unavailable`.

The model MUST NOT carry a stock quantity, a stock threshold, or a restock date. Availability SHALL be supplied by the business as data and MUST NOT be computed, inferred, or defaulted to a favourable value.

A product SHALL be considered purchasable when at least one of its variants is `available` or `made-to-order`.

#### Scenario: A variant is sold out

- **WHEN** a variant declares `sold-out`
- **THEN** it cannot be added to the cart
- **AND** the reason is conveyed in text, not by a scarcity indicator

#### Scenario: A quantity is requested

- **WHEN** a surface attempts to display how many units remain
- **THEN** no such field exists in the model and the value cannot be rendered

#### Scenario: Availability is not supplied

- **WHEN** catalog data omits a variant's availability
- **THEN** the data fails to typecheck and cannot be built

### Requirement: Products carry supplied attributes and factual labels

A product SHALL carry an ordered list of attributes, each a supplied label and value pair, used to render the product specification table. Attribute labels and values SHALL come from the business and MUST NOT be generated from other fields.

A product SHALL be permitted to carry labels drawn from a closed, enumerated set of manufacturing facts: `made-to-order`, `one-of-a-kind`, `hallmarked`, `limited-run`. Labels SHALL be present only when the business supplies them, and their absence SHALL be the default.

Labels SHALL NOT be rendered on the product card, which the design system's product card requirement forbids from carrying badge affordances.

#### Scenario: A specification table renders

- **WHEN** a product detail page renders its specification table
- **THEN** it shows the product's supplied attributes in declared order
- **AND** shows no attribute the business did not supply

#### Scenario: A product carries a label

- **WHEN** a product declares the `hallmarked` label
- **THEN** that fact is available to the product detail surface
- **AND** no product card renders it

#### Scenario: A promotional label is attempted

- **WHEN** catalog data declares a label outside the enumerated set
- **THEN** the data fails to typecheck and cannot be built

### Requirement: The model has no field for ratings, reviews, discounts or scarcity

The catalog model MUST NOT define a field for a rating, a review, a review count, a testimonial, a compare-at price, a discount percentage, a sale flag, a stock count, a countdown, a bestseller marker, or a customer count.

Introducing any such field SHALL require amending this specification first. An automated check SHALL fail the build when a field bearing one of these meanings appears in catalog data or catalog types.

#### Scenario: A surface attempts to show social proof

- **WHEN** any storefront surface attempts to render a rating or review count
- **THEN** no such field exists on the product and the value cannot be rendered

#### Scenario: A discount field is added to catalog code

- **WHEN** a compare-at price or discount field is introduced into the catalog module
- **THEN** the project's check command fails and names the offending field

### Requirement: Brand-owned product values are nullable and never invented

Product values owned by the business — price, material line, description, and care copy — SHALL be typed as nullable. An unsupplied value SHALL be represented as absent, not as an empty string or a plausible default.

An absent value SHALL render as the design system's visibly marked placeholder, through the same brand boundary that governs brand-level values. No code path SHALL be able to produce a product price, material, description or care instruction the business did not supply.

#### Scenario: A price has not been supplied

- **WHEN** a product's variants carry no supplied price
- **THEN** every surface showing that product's price renders a visibly marked placeholder
- **AND** no substitute figure is generated

#### Scenario: A material line has not been supplied

- **WHEN** a product carries no supplied material line
- **THEN** its card and detail page render a marked placeholder in its place
- **AND** the material vocabulary is not inferred from the product's name or category

#### Scenario: A value is supplied

- **WHEN** the business supplies a product's price and material line
- **THEN** those values render wherever the product appears, with no alternative value anywhere in the interface
