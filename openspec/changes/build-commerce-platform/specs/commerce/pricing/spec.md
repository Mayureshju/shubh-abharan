## Purpose

Defines how a payable price is derived from list price, optional sale price, and scheduled hike rules so every surface quotes the same figure.

## ADDED Requirements

### Requirement: A single resolver produces the payable price

Payable price SHALL be computed by one resolver from the variant's list price, optional sale price, and the hike rules active at the requested instant. Product detail, cart, checkout, and admin preview SHALL use that resolver. Clients MUST NOT supply a payable amount that checkout will honour.

#### Scenario: Two surfaces quote the same variant

- **WHEN** a product detail page and a checkout quote request the same variant at the same instant
- **THEN** both payable amounts are identical

### Requirement: Scheduled hikes apply inside their window

An active hike rule whose window contains the requested instant SHALL adjust list price by its percent or fixed amount for products in its scope. Rules that exclude sale items SHALL skip variants that carry a sale price.

#### Scenario: A hike is in force

- **WHEN** an active all-catalog percent hike is in force
- **AND** a variant has a list price and no sale price
- **THEN** the payable amount is the hiked list price

#### Scenario: A hike is outside its window

- **WHEN** the requested instant is outside every hike rule window
- **THEN** no hike is applied

### Requirement: Sale price caps the payable amount

When a variant carries a sale price, the payable amount SHALL be the lesser of that sale price and the hiked list price. The compare figure shown beside it SHALL be the hiked list price when that figure is higher than payable. The storefront MUST NOT render a sale badge or pill.

#### Scenario: Sale is below hiked list

- **WHEN** a variant has sale price 8000 and hiked list 10000
- **THEN** payable is 8000
- **AND** the compare figure is 10000
- **AND** no SALE badge is shown

### Requirement: Money is integer minor units

Every stored and quoted amount SHALL be an integer in the currency's minor unit with an ISO currency code. Floating-point prices MUST NOT be persisted.

#### Scenario: A rupee price is stored

- **WHEN** a product is priced at 85000 rupees
- **THEN** the stored amount is 8500000 paise
- **AND** the currency is INR
