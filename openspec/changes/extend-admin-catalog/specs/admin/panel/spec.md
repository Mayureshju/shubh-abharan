## ADDED Requirements

### Requirement: Admin manages tags

The admin panel SHALL list tags and let an admin create and edit a tag's name, slug, SEO title, SEO description, and active flag.

#### Scenario: An admin creates a tag

- **WHEN** an admin saves a new tag named "Rose gold" without a slug
- **THEN** a tag with slug `rose-gold` exists
- **AND** it is selectable in the product and category editors

### Requirement: Product editor covers the full product record

The product editor SHALL edit name, slug, category, tags, collections, new/featured/active flags, material line, description, care, pricing (single or per size), images (multi-upload, alt text, role, order), and SEO fields.

#### Scenario: An admin uploads several images at once

- **WHEN** an admin selects three image files
- **THEN** three image rows appear with previews
- **AND** the saved product keeps the order shown in the editor
