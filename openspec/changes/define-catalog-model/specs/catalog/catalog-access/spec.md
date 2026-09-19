## Purpose

Defines who owns product data and how the storefront reaches it — the single asynchronous read surface, the derivations that feed cards, listings, search and related products, and the rules that let local fixture data be replaced by a commerce API without rewriting any user interface component.

## ADDED Requirements

### Requirement: The catalog is the sole owner of product shape

Product, variant, image, collection, price and availability shapes SHALL be defined in exactly one place. No component, page, route handler or test SHALL declare its own product shape, redeclare a catalog field, or extend a product object with a field the catalog does not define.

A component needing a value the catalog does not carry SHALL have that value added to the catalog model — which requires amending the product model specification — rather than computing or inventing it locally.

#### Scenario: A component needs product data

- **WHEN** a component renders product information
- **THEN** it consumes the catalog's product type
- **AND** declares no product field of its own

#### Scenario: A component needs a value the model lacks

- **WHEN** a surface requires a product value absent from the model
- **THEN** the model is extended through a specification change
- **AND** the component does not derive or invent the value locally

#### Scenario: Two surfaces show the same product

- **WHEN** a product appears on a collection page and on its detail page
- **THEN** both render from the same product object with no divergent definition

### Requirement: Catalog reads happen through one asynchronous access surface

All catalog reads SHALL go through a single named access surface exposing operations to fetch a product by slug, list products with filter and sort criteria, fetch a collection with its products, and resolve a set of products by identifier.

Every operation SHALL be asynchronous, whether or not the current data source requires it, so that a remote source can be substituted without changing a caller's signature or control flow.

Components MUST NOT import fixture modules directly.

#### Scenario: A page loads a product

- **WHEN** a product detail page renders
- **THEN** it awaits the access surface's fetch-by-slug operation

#### Scenario: A requested product does not exist

- **WHEN** a fetch is made for a slug absent from the catalog
- **THEN** the operation resolves to an explicit not-found result
- **AND** the caller renders a not-found response rather than an error page

#### Scenario: The data source is replaced

- **WHEN** local fixture data is replaced by a commerce API behind the access surface
- **THEN** no user interface component is modified
- **AND** the operations keep their existing names, parameters and return shapes

### Requirement: Presentation inputs are derived from the product, not authored beside it

Each presentation surface SHALL obtain its inputs by deriving them from a product object through a named derivation. Preformatted display values — a formatted price, a material line, a chosen image — MUST NOT be authored as separate data alongside the product.

A derivation SHALL take the product and the surface's own presentation choices, such as the image role a layout wants, and return only what that surface renders.

#### Scenario: A product card is rendered

- **WHEN** a listing renders a product card
- **THEN** the card's inputs are derived from the product and the layout's requested image role
- **AND** no formatted price or material string is stored in catalog data

#### Scenario: A layout varies its cards

- **WHEN** a listing varies image role, aspect ratio or grid span across its cards
- **THEN** it does so by passing different presentation choices to the derivation
- **AND** the underlying product data is unchanged

### Requirement: Filtering and sorting operate only on declared model fields

Listing operations SHALL support filtering by category, by collection membership, by variant axis value, by availability, and by price range. They SHALL support sorting by price ascending, price descending, and the catalog's declared display order.

Every filter and sort criterion SHALL resolve against a field the product model declares. A criterion with no backing field MUST NOT exist.

Sorting by price SHALL use the product's derived lowest variant price and SHALL place products with no supplied price last, in declared display order, rather than treating an absent price as zero.

#### Scenario: A customer filters by finish

- **WHEN** a customer filters by a value on the finish axis
- **THEN** the results are products having at least one variant declaring that value

#### Scenario: A customer sorts by price

- **WHEN** a customer sorts a listing by price ascending
- **THEN** products are ordered by their lowest variant price
- **AND** products with no supplied price appear last in declared display order

#### Scenario: A popularity sort is requested

- **WHEN** a sort by popularity, rating or bestseller rank is requested
- **THEN** no such field exists in the model and the option is not offered

### Requirement: Search matches declared product text only

Search SHALL match a customer's query against a product's name, category, collection names, supplied material line, supplied description and supplied attribute values. It MUST NOT match against generated, inferred or placeholder text.

Search SHALL be case-insensitive and SHALL match on partial words. A query matching no product SHALL return an empty result that the caller can distinguish from an error.

#### Scenario: A customer searches for a material

- **WHEN** a customer searches for a term appearing in a product's supplied material line
- **THEN** that product appears in the results

#### Scenario: A product has unsupplied values

- **WHEN** a product's material line has not been supplied
- **THEN** its rendered placeholder text is not searchable
- **AND** the product is still matched by its name and category

#### Scenario: A query matches nothing

- **WHEN** a query matches no product
- **THEN** an empty result is returned and the surface presents an explicit no-results state

### Requirement: Related products are explicit or derived from shared collections

A product SHALL be permitted to declare an ordered list of related products explicitly. Where it does, that list SHALL be used exactly as declared.

Where no explicit list is declared, related products SHALL be derived as other products sharing a collection with the subject product, falling back to other products sharing its category. The subject product SHALL never appear among its own related products, and the result SHALL be capped at a fixed count.

Where neither a shared collection nor a shared category yields any product, an empty result SHALL be returned and the calling surface SHALL omit its related-products section rather than render an empty one.

#### Scenario: A product declares related products

- **WHEN** a product declares an explicit related list
- **THEN** exactly those products are returned, in the declared order

#### Scenario: A product declares no related products

- **WHEN** a product declares no explicit related list
- **THEN** other products sharing one of its collections are returned, capped at the fixed count
- **AND** the subject product is not among them

#### Scenario: No related products can be found

- **WHEN** neither a shared collection nor a shared category yields another product
- **THEN** an empty result is returned and the related-products section is omitted

### Requirement: Cart and wishlist reference catalog entities by identifier

A cart line SHALL reference a variant identifier and a quantity, and SHALL NOT copy product name, price, image or material into itself. A wishlist entry SHALL reference a product identifier and, where the customer made one, a variant identifier.

Display values for a cart line or wishlist entry SHALL be resolved from the catalog at render time, so that a change to catalog data is reflected without migrating stored selections.

A stored reference that no longer resolves SHALL be reported to the calling surface as unresolved and MUST NOT be rendered with substituted or remembered values.

#### Scenario: A cart line renders

- **WHEN** a cart line renders
- **THEN** its name, price, image and availability are resolved from the catalog by variant identifier

#### Scenario: A product's price changes

- **WHEN** a product's price changes in catalog data
- **THEN** existing cart lines reflect the new price with no migration of stored data

#### Scenario: A stored reference no longer resolves

- **WHEN** a stored cart line references a variant absent from the catalog
- **THEN** the line is reported as unresolved
- **AND** no remembered name, price or image is rendered in its place

### Requirement: Local catalog data is structurally complete and semantically unfilled

Until a commerce backend exists, the catalog SHALL be backed by local data modules that are the sole place product records are authored.

That data SHALL be structurally complete — real slugs and identifiers, real categories, real collection memberships, real variant axes, and images declaring real roles, aspects and intended crops — so that every storefront surface can be built and reviewed against it.

Every brand-owned value within it SHALL be absent until the business supplies it, and the values the business must supply SHALL be enumerated in the project's brand input document alongside the existing brand-level fields.

Local data MUST NOT contain invented prices, invented material vocabulary, invented product descriptions, invented care instructions, invented availability, or lifestyle copy presented as brand voice.

#### Scenario: A storefront surface is built before photography and copy exist

- **WHEN** a listing or detail page is built against local catalog data
- **THEN** its layout, ordering, filtering and variant behaviour are fully exercisable
- **AND** every unsupplied brand-owned value renders as a marked placeholder

#### Scenario: A reviewer inspects local data

- **WHEN** a reviewer reads the local catalog data
- **THEN** no price, material, description, care instruction or availability claim appears that the business did not supply

#### Scenario: The business supplies product values

- **WHEN** the business supplies a product's prices, materials and descriptions
- **THEN** those values are entered in the local data modules and the brand input document
- **AND** no component changes

### Requirement: Catalog data integrity is verified by the project's check command

The project's check command SHALL verify the catalog's referential and structural integrity and SHALL fail when it is violated.

It SHALL verify that product and collection slugs are unique, that product and variant identifiers are unique, that every declared collection membership names a collection in the brand record, that every component product of a set resolves, that every explicitly declared related product resolves, that every product carries at least one variant and at least one image, that no two variants of a product share an axis-value combination, and that no forbidden field name appears in catalog data or types.

#### Scenario: A collection membership is misspelled

- **WHEN** a product declares membership of a collection absent from the brand record
- **THEN** the check command fails and names the product and the unknown collection

#### Scenario: A product is authored without a variant

- **WHEN** catalog data contains a product with no variant
- **THEN** the check command fails and names the product

#### Scenario: The catalog is well-formed

- **WHEN** catalog data satisfies every integrity rule
- **THEN** the check command passes with no output beyond its result
