## MODIFIED Requirements

### Requirement: Customers and admins authenticate through the identity provider

The storefront SHALL authenticate visitors through the project's identity provider. A signed-in visitor without an admin grant SHALL be a customer. The application MUST NOT store passwords.

#### Scenario: A customer signs in

- **WHEN** a visitor completes the identity provider sign-in
- **THEN** subsequent requests carry an authenticated session
- **AND** the visitor is treated as a customer until an admin grant is present

#### Scenario: A visitor is signed out

- **WHEN** a visitor has no session
- **THEN** they MAY browse the catalog
- **AND** they MAY check out as a guest and open their own order's confirmation page through its private address
- **AND** they MUST NOT access account orders or admin surfaces
