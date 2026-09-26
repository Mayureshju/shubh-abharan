## Purpose

Defines the admin area used to author catalog and operations data, reorder listings, manage orders, and read live reports.

## ADDED Requirements

### Requirement: Admins author catalog entities

An admin SHALL create, update, and deactivate categories, products, and collections. A category SHALL carry slug, name, tags, and an ordered product list. A product SHALL carry tags, list price, optional sale price, optional size axis, ordered images, and new and featured flags.

#### Scenario: An admin creates a category

- **WHEN** an admin saves a category with slug, name, and tags
- **THEN** the category is available as a shop type filter

#### Scenario: An admin marks a product featured and new

- **WHEN** an admin sets a product's featured and new flags
- **THEN** merchandising surfaces that list featured or new products include it

### Requirement: Product order per category and collection is explicit

Each category and collection SHALL store the order of its products. Admins SHALL be able to rearrange that order. Storefront listings using display order SHALL honour it.

#### Scenario: An admin rearranges a category

- **WHEN** an admin saves a new product order on a category
- **THEN** the shop listing for that category presents products in the saved order

### Requirement: Admins configure promotions, hikes, and delivery

An admin SHALL create and update coupons, scheduled price-hike rules, delivery areas with pincodes and charges, the free-delivery minimum, and whether cash on delivery is offered.

#### Scenario: An admin adds a delivery area

- **WHEN** an admin saves an area with pincodes and a charge
- **THEN** checkout uses that charge for those pincodes

### Requirement: Admins manage order status

An admin SHALL list orders and move an order through packing, shipped, delivered, cancelled, or refunded from a paid or COD-confirmed state as appropriate. Status changes MUST NOT rewrite snapshotted line prices.

#### Scenario: An admin marks an order shipped

- **WHEN** an admin sets a paid order to shipped
- **THEN** the order status is shipped
- **AND** line prices on the order are unchanged

### Requirement: Reports aggregate live orders

Admin reports SHALL compute, for a requested date range, gross merchandise value, order count, average order value, payment-method mix, top products, coupon redemptions, shipping collected, and shipping waived. Figures SHALL come from stored orders, not authored constants.

#### Scenario: A range with paid orders

- **WHEN** an admin requests reports for a range that contains paid orders
- **THEN** GMV equals the sum of those orders' totals
- **AND** average order value is GMV divided by that order count
