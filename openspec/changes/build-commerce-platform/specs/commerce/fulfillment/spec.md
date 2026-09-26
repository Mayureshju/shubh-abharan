## Purpose

Defines delivery areas by pincode, per-area charges, and the order amount after which delivery is free.

## ADDED Requirements

### Requirement: Checkout requires a served pincode

A checkout address SHALL include a pincode. The pincode MUST match an active delivery area. An unmatched pincode SHALL block placement and MUST NOT invent a charge.

#### Scenario: A served pincode is entered

- **WHEN** the pincode belongs to an active delivery area
- **THEN** that area's charge is the shipping amount before free-delivery rules

#### Scenario: An unserved pincode is entered

- **WHEN** the pincode matches no active delivery area
- **THEN** checkout is blocked
- **AND** no shipping charge is quoted as if delivery were available

### Requirement: Free delivery after a configured amount

When store settings declare a free-delivery minimum and the discounted subtotal is greater than or equal to that amount, shipping SHALL be zero. When the minimum is unset, area charges always apply.

#### Scenario: Subtotal meets the threshold

- **WHEN** free delivery is configured at 500000 paise
- **AND** discounted subtotal is 500000 paise or more
- **THEN** shipping is zero

#### Scenario: Subtotal is below the threshold

- **WHEN** free delivery is configured at 500000 paise
- **AND** discounted subtotal is 499900 paise
- **THEN** shipping is the delivery area charge

#### Scenario: No threshold is configured

- **WHEN** free-delivery minimum is unset
- **THEN** shipping is the delivery area charge regardless of subtotal
