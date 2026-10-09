## RENAMED Requirements

- FROM: `### Requirement: Product cards are role-driven and variable`
- TO: `### Requirement: Product cards share one square frame in listings`

## MODIFIED Requirements

### Requirement: Product cards share one square frame in listings

The product card SHALL render from product data — image, name, price, and a material line — using the product's primary square still.

Within a product listing (shop, collection, wishlist), every card SHALL present its image in the same 1:1 frame at the same column width, so customers compare pieces at one scale. Editorial sections outside product listings MAY still vary scale and span.

The card SHALL NOT display ratings, reviews, badges, discount flags, or scarcity indicators.

#### Scenario: A listing renders multiple products

- **WHEN** a product listing renders four or more products
- **THEN** every card's image frame is square and the same width as the other cards in its row
- **AND** no card spans more columns than another

#### Scenario: A card renders product information

- **WHEN** a product card renders
- **THEN** it shows the image, name, price, and material line
- **AND** displays no rating, review count, badge, discount flag, or scarcity indicator

#### Scenario: A card is activated

- **WHEN** a customer activates a product card by pointer or keyboard
- **THEN** it navigates to that product's detail page
