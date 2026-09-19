## MODIFIED Requirements

### Requirement: Filtering and sorting operate only on declared model fields

Listing operations SHALL support filtering by category, by collection membership, by occasion membership, by variant axis value, by availability, and by price range. They SHALL support sorting by price ascending, price descending, and the catalog's declared display order.

Every filter and sort criterion SHALL resolve against a field the product model declares. A criterion with no backing field MUST NOT exist.

Sorting by price SHALL use the product's derived lowest variant price and SHALL place products with no supplied price last, in declared display order, rather than treating an absent price as zero.

Brand-owned merchandising lists — new arrivals and featured — SHALL be resolved through the catalog access surface as products in the declared slug order. A slug that does not resolve SHALL be dropped from the result and SHALL fail the project's catalog check.

#### Scenario: A customer filters by product type

- **WHEN** a customer filters the shop surface by a product type
- **THEN** the results are exactly the products declaring that category

#### Scenario: A customer filters by occasion

- **WHEN** a listing is requested for an occasion slug
- **THEN** the results are exactly the products declaring membership of that occasion

#### Scenario: A customer sorts by price

- **WHEN** a customer sorts a listing by price ascending
- **THEN** products are ordered by their lowest variant price
- **AND** products with no supplied price appear last in declared display order

#### Scenario: A merchandising list is resolved

- **WHEN** the homepage requests products for a brand-owned slug list
- **THEN** the access surface returns those products in the list's order
- **AND** products whose slugs are absent from the list are not returned

#### Scenario: A popularity sort is requested

- **WHEN** a sort by popularity, rating or bestseller rank is requested
- **THEN** no such field exists in the model and the option is not offered

### Requirement: Local catalog data is structurally complete and semantically unfilled

Until a commerce backend exists, the catalog SHALL be backed by local data modules that are the sole place product records are authored.

That data SHALL be structurally complete — real slugs and identifiers, real categories, real collection and occasion memberships, real variant axes, and images declaring real roles, aspects and intended crops — so that every storefront surface can be built and reviewed against it.

Structural fixture records SHALL keep every brand-owned value absent until the business supplies it.

Merchandisable sample records MAY carry development prices, material lines, descriptions, and photography when those values are enumerated in the project's brand input document as development content. They MUST NOT invent certifications, reviews, compare-at prices, or scarcity. Replacing sample records with business-supplied inventory SHALL be a data change only.

#### Scenario: A storefront surface is built before photography and copy exist

- **WHEN** a listing or detail page is built against structural fixture data
- **THEN** its layout, ordering, filtering and variant behaviour are fully exercisable
- **AND** every unsupplied brand-owned value renders as a marked placeholder

#### Scenario: A reviewer inspects fixture data

- **WHEN** a reviewer reads a structural fixture record
- **THEN** no price, material, description or care instruction appears that the business did not supply

#### Scenario: Development merchandise is authored

- **WHEN** merchandisable sample products carry development prices and photography
- **THEN** those values are listed in the brand input document as development content
- **AND** no homepage surface presents a structural fixture unless its slug is on a brand-owned list

### Requirement: Catalog data integrity is verified by the project's check command

The project's check command SHALL verify the catalog's referential and structural integrity and SHALL fail when it is violated.

It SHALL verify that product and collection slugs are unique, that product and variant identifiers are unique, that every declared collection membership names a collection in the brand record, that every declared occasion membership names an occasion in the brand record, that every brand-owned merchandising slug resolves to a product, that every component product of a set resolves, that every explicitly declared related product resolves, that every product carries at least one variant and at least one image, that no two variants of a product share an axis-value combination, and that no forbidden field name appears in catalog data or types.

#### Scenario: A collection membership is misspelled

- **WHEN** a product declares membership of a collection absent from the brand record
- **THEN** the check command fails and names the product and the unknown collection

#### Scenario: An occasion membership is misspelled

- **WHEN** a product declares membership of an occasion absent from the brand record
- **THEN** the check command fails and names the product and the unknown occasion

#### Scenario: A merchandising slug is unknown

- **WHEN** a brand-owned new-arrival or featured list names a slug absent from the catalog
- **THEN** the check command fails and names the slug

#### Scenario: The catalog is well-formed

- **WHEN** catalog data satisfies every integrity rule
- **THEN** the check command passes with no output beyond its result
