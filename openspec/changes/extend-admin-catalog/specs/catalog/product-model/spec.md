## ADDED Requirements

### Requirement: Tags are admin-authored records

A tag SHALL be a persisted record with a unique slug, a name, optional SEO title and SEO description, and an active flag. Products and categories SHALL reference tags by slug.

#### Scenario: A product is tagged from the tag list

- **WHEN** an admin selects an existing tag on a product and saves
- **THEN** the product stores that tag's slug
- **AND** a shop listing filtered by that slug includes the product

### Requirement: Catalog records carry SEO fields

Products, categories, and tags SHALL carry optional `seoTitle` and `seoDescription`. Storefront page metadata SHALL use them when present and fall back to the record's name and description otherwise.

#### Scenario: A product has an SEO title

- **WHEN** a product page renders for a product with an SEO title
- **THEN** the document title is the SEO title

#### Scenario: A product has no SEO fields

- **WHEN** a product page renders for a product without SEO fields
- **THEN** the document title is the product name
- **AND** the meta description is the product description when present

### Requirement: Each size carries its own price and stock

When a product has sizes, each size SHALL be a variant with its own list price, optional sale price, and stock status (`available`, `made-to-order`, `sold-out`). A sale price MUST be lower than its list price.

#### Scenario: Sizes are priced differently

- **WHEN** a ring has size 6 at ₹10,000 and size 9 at ₹12,000
- **THEN** selecting size 9 on the product page shows ₹12,000

#### Scenario: A size is sold out

- **WHEN** one size is marked sold-out
- **THEN** that size cannot be added to the bag

### Requirement: Product images are hosted in object storage

Uploaded product images SHALL be stored in the configured S3 bucket and referenced by public URL. Uploads MUST be restricted to admins, to jpeg/png/webp/avif, and to at most 10 MB.

#### Scenario: A non-image is uploaded

- **WHEN** an admin uploads a text file
- **THEN** the upload is rejected with a 400 and nothing is stored
