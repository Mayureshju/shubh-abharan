## ADDED Requirements

### Requirement: Categories are admin-authored records

A category SHALL be a persisted record with a unique slug, a name, a list of tags, an ordered list of product identifiers, and an active flag. Products SHALL declare exactly one category by that record's identity. Shop type filtering SHALL use category slug.

A product in a category whose slug is `set` SHALL be permitted to reference component products present in the catalog.

#### Scenario: A customer filters by an admin-created type

- **WHEN** a customer filters the shop by a category slug
- **THEN** the results are exactly the products assigned to that category

#### Scenario: An unknown category slug is used as a filter

- **WHEN** the shop is requested with a category slug that is not an active category
- **THEN** the filter is ignored or yields an empty type listing
- **AND** the shop does not 500

### Requirement: Products and categories carry tags

Products and categories SHALL carry a list of tags. Tags are author-supplied labels used for filtering and admin organisation. The catalog MUST NOT invent tags.

#### Scenario: A product is tagged

- **WHEN** a product carries the tag `kundan`
- **THEN** a listing filtered by that tag includes the product
- **AND** a product without the tag is excluded

### Requirement: New and featured are product flags

A product SHALL carry boolean `isNew` and `isFeatured` flags. Merchandising surfaces that present new arrivals or featured pieces SHALL include products whose corresponding flag is true. These flags MUST NOT be expressed as stock, rating, or bestseller claims.

#### Scenario: Featured merchandising renders

- **WHEN** the featured surface renders
- **THEN** it lists products with `isFeatured` true
- **AND** it does not invent a bestseller ranking

### Requirement: Size is an optional product axis

A product SHALL declare whether it offers size. When it does, it SHALL carry an ordered list of size values and one purchasable variant per size. When it does not, the product detail page MUST NOT present a size selector.

#### Scenario: A ring with sizes

- **WHEN** a product declares size and the values 12, 14, 16
- **THEN** the detail page offers those sizes
- **AND** adding to the bag requires a chosen size

#### Scenario: A necklace without sizes

- **WHEN** a product does not declare size
- **THEN** the detail page has no size selector
- **AND** the bag line uses its single variant

### Requirement: Variants may carry a sale price

A variant SHALL carry a list price and MAY carry a sale price in the same currency, both integer minor units. A sale price is an authored offer, not a generated discount badge. Ratings, review counts, stock quantities, countdowns, and badge fields remain absent from the product model.

#### Scenario: A variant is on offer

- **WHEN** a variant has list price and a lower sale price
- **THEN** the pricing resolver treats the sale price as the sale input
- **AND** the product object still has no rating, stock count, or badge field

## MODIFIED Requirements

### Requirement: Every product declares exactly one category from a closed set

Each product SHALL declare exactly one category by reference to a persisted category record. Category SHALL remain the axis used for type filtering on the shop surface and MUST NOT be presented as top-level navigation.

A product in a category whose slug is `set` SHALL be permitted to reference the products that compose it. Those references SHALL resolve to products present in the catalog.

The six seeded types — ring, necklace, pendant, earring, bracelet, and set — SHALL exist after catalog seed so existing shop links keep working. Additional categories MAY be authored by an admin.

#### Scenario: A customer filters by product type

- **WHEN** a customer filters the shop surface by a product type
- **THEN** the results are exactly the products declaring that category

#### Scenario: A category outside the set is used

- **WHEN** catalog data declares a category slug with no matching category record
- **THEN** the catalog is reported as invalid for that product
- **AND** the product is not presented as belonging to an invented type

#### Scenario: A set is displayed

- **WHEN** a product in the `set` category declares component products
- **THEN** each referenced product resolves to a product in the catalog

### Requirement: Collections are an editorial axis independent of category

A collection SHALL be a named, slugged editorial grouping with an optional description, tags, and an ordered product list. A product SHALL be permitted to belong to zero, one, or several collections. Collection order SHALL be the collection record's product order.

Collection records MAY be authored by an admin. Seed MAY copy names from the brand record. The catalog MUST NOT invent collection names that the business has not authored or seeded.

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

- **WHEN** a product declares membership of a collection absent from collection records
- **THEN** the catalog is reported as invalid
