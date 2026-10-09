## ADDED Requirements

### Requirement: Add-ons are read apart from product listings

Every product listing SHALL exclude add-ons:

- the shop, with its filters and sorts
- search
- occasion and collection pages
- derived and declared related products
- homepage merchandising, including the new and featured flag reads

The access surface SHALL offer a separate read that returns the active add-ons in the order they were created.

Reads of a single product by slug or identifier, and reads of products by identifier, SHALL still return add-ons. A product page, a bag line, a wishlist entry and an order can then still resolve one.

#### Scenario: The shop lists every piece

- **WHEN** the shop lists every active product
- **THEN** no add-on is among them

#### Scenario: A customer searches for an add-on

- **WHEN** a customer searches for a word that only an add-on's name contains
- **THEN** the search returns no results

#### Scenario: A bag line names an add-on

- **WHEN** an add-on is read by its identifier
- **THEN** it is returned

#### Scenario: The add-ons are read

- **WHEN** the add-on read runs while one of three add-ons is inactive
- **THEN** the two active add-ons are returned in creation order
