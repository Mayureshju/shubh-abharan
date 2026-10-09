## ADDED Requirements

### Requirement: Listings are a uniform square grid

The shop, collection pages, and the wishlist SHALL lay out product cards in one uniform grid. It SHALL have two columns below 1024px and three columns from 1024px. Every card SHALL occupy exactly one column. The grid SHALL leave no empty cell before its last row.

#### Scenario: The shop renders on a desktop

- **WHEN** the shop renders eight products at 1440px
- **THEN** the products present three per row in square frames of equal size
- **AND** only the last row may be partially filled

#### Scenario: The shop renders on a phone

- **WHEN** the shop renders at 390px
- **THEN** the products present two per row in square frames of equal size

#### Scenario: A collection page renders

- **WHEN** a collection page lists its products
- **THEN** it uses the same grid as the shop, without filter chrome
