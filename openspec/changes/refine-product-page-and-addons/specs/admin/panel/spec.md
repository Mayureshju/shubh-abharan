## MODIFIED Requirements

### Requirement: Product editor covers the full product record

The product editor SHALL edit:

- name and slug
- category, tags and collections
- the new, featured, active and add-on flags
- material line, description and care
- pricing, single or per size
- images: multi-upload, alt text, role and order
- SEO fields

The product list SHALL mark which products are add-ons.

#### Scenario: An admin uploads several images at once

- **WHEN** an admin selects three image files
- **THEN** three image rows appear with previews
- **AND** the saved product keeps the order shown in the editor

#### Scenario: An admin marks a product as an add-on

- **WHEN** an admin turns on "Add-on" for a product and saves
- **THEN** the product no longer appears in the shop
- **AND** it appears in the add-ons rail on other product pages
- **AND** the product list marks it as an add-on
