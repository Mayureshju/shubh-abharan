## ADDED Requirements

### Requirement: Catalog reads are served from the commerce store

The catalog access surface SHALL read products, categories, and collections from the commerce store. Local fixture modules MAY seed the store and MUST NOT be imported by user interface components.

Display-order listing for a category SHALL follow that category's stored product order, then any products assigned to the category but missing from the order. Price sorting SHALL use the pricing resolver's payable amount, not the raw list price alone.

#### Scenario: The shop lists a category in display order

- **WHEN** the shop lists a category with no explicit sort
- **THEN** products appear in the category's stored product order

#### Scenario: A UI component needs products

- **WHEN** a page renders a listing
- **THEN** it awaits the catalog access surface
- **AND** it does not import fixture modules

### Requirement: New, featured, and tag listing are first-class reads

The access surface SHALL be able to list products by `isNew`, by `isFeatured`, and by tag. Homepage merchandising MAY use these reads instead of or in addition to brand slug lists.

#### Scenario: Featured products are requested

- **WHEN** featured products are listed
- **THEN** the result contains products whose featured flag is true
- **AND** inactive or missing products are omitted
