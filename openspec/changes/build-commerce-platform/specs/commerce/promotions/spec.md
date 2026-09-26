## Purpose

Defines coupon codes that reduce a quote — percent, fixed amount, or free shipping — with windows, limits, and optional product or category targeting.

## ADDED Requirements

### Requirement: One coupon applies per order

A quote SHALL accept at most one coupon code. The coupon SHALL be recalculated on the server from its type, value, minimum subtotal, window, remaining usage, per-user limit, and targeting. Invalid or ineligible codes SHALL be rejected with a reason the customer can act on.

#### Scenario: A valid percent coupon is applied

- **WHEN** an active percent coupon within its window is applied to an eligible subtotal
- **THEN** the discount equals that percent of the eligible subtotal, in integer minor units

#### Scenario: A coupon is expired

- **WHEN** a code whose window has ended is applied
- **THEN** the quote is rejected for that code
- **AND** no discount is taken

#### Scenario: A second code is sent

- **WHEN** a quote already has a coupon and another code is supplied
- **THEN** only one coupon remains on the quote

### Requirement: Targeting and limits are enforced

When a coupon names products or categories, it SHALL discount only matching lines. When a usage limit or per-user limit is reached, the code SHALL be refused.

#### Scenario: A category-targeted coupon

- **WHEN** a coupon targets rings and the bag contains a ring and a necklace
- **THEN** only the ring line is discounted

#### Scenario: Usage is exhausted

- **WHEN** a coupon's usage count has reached its limit
- **THEN** applying it is refused
