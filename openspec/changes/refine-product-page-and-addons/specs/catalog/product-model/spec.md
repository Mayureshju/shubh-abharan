## ADDED Requirements

### Requirement: A product may be marked as an add-on

A product SHALL carry a boolean add-on flag, false by default.

In every other respect an add-on is an ordinary product: identity, category, variants, prices, availability and images. It SHALL be bought, priced, discounted and ordered as an ordinary bag line. The flag MUST NOT be expressed as a stock, rating or bestseller claim.

#### Scenario: A product saved before the flag existed is read

- **WHEN** a product stored without the flag is read
- **THEN** it is not an add-on

#### Scenario: A bag holds an add-on

- **WHEN** a bag holds an add-on line and a coupon that applies to it
- **THEN** the add-on is priced, discounted and ordered like any other line
