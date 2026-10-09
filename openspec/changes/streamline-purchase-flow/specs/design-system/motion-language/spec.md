## MODIFIED Requirements

### Requirement: Reveal travel and hover scale are budgeted

Scroll-triggered reveals SHALL translate no more than 16px. Hover scale on imagery SHALL NOT exceed 1.03 and SHALL use the `base` duration or longer.

The product-detail magnifier is user-directed inspection, not hover scale, and is exempt from the 1.03 budget. It SHALL appear only while a fine pointer is over the product image. It SHALL track that pointer directly, with no easing and no movement of its own. It SHALL offer the full-screen image view as its keyboard and touch equivalent.

#### Scenario: A reveal is authored

- **WHEN** a section reveal is implemented
- **THEN** its translation distance is between 0 and 16px
- **AND** it uses a defined duration token

#### Scenario: A product image is hovered

- **WHEN** a pointer hovers a product image in a listing on a device that supports hover
- **THEN** the image scales by no more than 1.03 over at least the `base` duration

#### Scenario: A customer inspects a piece with the magnifier

- **WHEN** a fine pointer moves over the main image on a product detail page
- **THEN** a magnified view of the area under the pointer follows the pointer
- **AND** it disappears when the pointer leaves the image
- **AND** it never moves while the pointer is still
