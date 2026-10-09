## MODIFIED Requirements

### Requirement: Admins configure promotions, hikes, and delivery

An admin SHALL create and update coupons, scheduled price-hike rules, the free-delivery minimum, and whether cash on delivery is offered. For delivery, an admin SHALL set the store default delivery charge, set or clear a charge per city, switch a city on or off, and switch pincodes on or off one at a time or as a pasted list. An admin SHALL be able to filter cities by state and search pincodes by number or city.

#### Scenario: An admin sets a city charge

- **WHEN** an admin saves a charge on a city
- **THEN** checkout uses that charge for the city's deliverable pincodes

#### Scenario: An admin clears a city charge

- **WHEN** an admin saves a city with an empty charge
- **THEN** checkout uses the store default charge for that city

#### Scenario: An admin switches pincodes off in bulk

- **WHEN** an admin pastes pincodes and marks them not deliverable
- **THEN** checkout blocks those pincodes
- **AND** other pincodes in the same cities are unchanged
