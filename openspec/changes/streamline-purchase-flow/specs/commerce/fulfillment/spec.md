## MODIFIED Requirements

### Requirement: Checkout requires a served pincode

The receiver's address SHALL include a pincode. The pincode MUST exist in the pincode directory, MUST be deliverable, and its city MUST be deliverable. Any other pincode SHALL block placement and MUST NOT invent a charge. The billing address carries no pincode and SHALL NOT affect delivery.

#### Scenario: A served pincode is entered

- **WHEN** the receiver pincode is deliverable and its city is deliverable
- **THEN** the city's charge, or the store default charge when the city has none, is the shipping amount before free-delivery rules

#### Scenario: An unserved pincode is entered

- **WHEN** the receiver pincode is not in the directory, or is switched off
- **THEN** checkout is blocked
- **AND** no shipping charge is quoted as if delivery were available

#### Scenario: The pincode's city is switched off

- **WHEN** the receiver pincode is deliverable but its city is switched off
- **THEN** checkout is blocked
