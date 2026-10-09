## MODIFIED Requirements

### Requirement: Checkout requires a served pincode

A checkout address SHALL include a pincode. The pincode MUST exist in the pincode directory, MUST be deliverable, and its city MUST be deliverable. Any other pincode SHALL block placement and MUST NOT invent a charge.

#### Scenario: A served pincode is entered

- **WHEN** the pincode is deliverable and its city is deliverable
- **THEN** the city's charge, or the store default charge when the city has none, is the shipping amount before free-delivery rules

#### Scenario: An unserved pincode is entered

- **WHEN** the pincode is not in the directory, or is switched off
- **THEN** checkout is blocked
- **AND** no shipping charge is quoted as if delivery were available

#### Scenario: The pincode's city is switched off

- **WHEN** the pincode is deliverable but its city is switched off
- **THEN** checkout is blocked

### Requirement: Free delivery after a configured amount

When store settings declare a free-delivery minimum and the discounted subtotal is greater than or equal to that amount, shipping SHALL be zero. When the minimum is unset, city charges always apply.

#### Scenario: Subtotal meets the threshold

- **WHEN** free delivery is configured at 500000 paise
- **AND** discounted subtotal is 500000 paise or more
- **THEN** shipping is zero

#### Scenario: Subtotal is below the threshold

- **WHEN** free delivery is configured at 500000 paise
- **AND** discounted subtotal is 499900 paise
- **THEN** shipping is the city charge

#### Scenario: No threshold is configured

- **WHEN** free-delivery minimum is unset
- **THEN** shipping is the city charge regardless of subtotal

## ADDED Requirements

### Requirement: Pincode directory covers India

The store SHALL hold every Indian pincode mapped to one city (India Post district) and one state. An imported pincode and city SHALL start deliverable. Re-importing MUST NOT change a pincode's or city's deliverable switch or a city's charge.

#### Scenario: Directory is imported

- **WHEN** the import runs on the India Post directory
- **THEN** each six-digit pincode exists once with its city and state
- **AND** each (state, city) exists as a delivery city

#### Scenario: Re-import keeps admin choices

- **WHEN** an admin has switched pincode 400001 off and the import runs again
- **THEN** 400001 is still switched off

### Requirement: Charges are set per city with a store default

Each delivery city SHALL carry an optional charge in paise. A city without a charge SHALL use the store default delivery charge.

#### Scenario: City has its own charge

- **WHEN** Mumbai's charge is 25000 paise and the default is 10000 paise
- **THEN** a Mumbai pincode is quoted 25000 paise before free-delivery rules

#### Scenario: City uses the default

- **WHEN** Pune has no charge and the default is 10000 paise
- **THEN** a Pune pincode is quoted 10000 paise before free-delivery rules
