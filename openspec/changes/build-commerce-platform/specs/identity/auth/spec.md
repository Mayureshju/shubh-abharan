## Purpose

Defines how customers and admins authenticate, how admin access is granted, and how identity is mirrored into store records without storing passwords.

## ADDED Requirements

### Requirement: Customers and admins authenticate through the identity provider

The storefront SHALL authenticate visitors through the project's identity provider. A signed-in visitor without an admin grant SHALL be a customer. The application MUST NOT store passwords.

#### Scenario: A customer signs in

- **WHEN** a visitor completes the identity provider sign-in
- **THEN** subsequent requests carry an authenticated session
- **AND** the visitor is treated as a customer until an admin grant is present

#### Scenario: A visitor is signed out

- **WHEN** a visitor has no session
- **THEN** they MAY browse the catalog
- **AND** they MUST NOT access account orders or admin surfaces

### Requirement: Admin access is an explicit grant

Admin access SHALL be an explicit role grant on the identity record, not a client-supplied flag. Surfaces under the admin area and every catalog, order, promotion, fulfillment, or report mutation SHALL refuse non-admin sessions.

#### Scenario: An admin opens the admin area

- **WHEN** a signed-in visitor with an admin grant requests an admin surface
- **THEN** the surface is rendered

#### Scenario: A customer requests an admin surface

- **WHEN** a signed-in customer without an admin grant requests an admin surface or mutation
- **THEN** the request is denied
- **AND** catalog data is not mutated

#### Scenario: An anonymous visitor requests an admin mutation

- **WHEN** a request without a session attempts an admin mutation
- **THEN** the request is denied

### Requirement: Identity is mirrored into a store user record

Creating or updating an identity-provider user SHALL upsert a store user record keyed by the provider user identifier, carrying role, email, and display name when supplied.

#### Scenario: A new identity is created

- **WHEN** the identity provider reports a new user
- **THEN** a store user record exists for that identifier
- **AND** the role is customer unless the identity record carries an admin grant
