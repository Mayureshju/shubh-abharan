## Purpose

Defines the contact page so customers can read supplied contact facts and send a message without inventing an email, address, phone, hours, or a mail backend.

## ADDED Requirements

### Requirement: Contact details come only from supplied brand fields

The contact page SHALL present the brand's contact email through the same supplied-or-placeholder path as the rest of the storefront. The contact address SHALL render only when it has been supplied. The page MUST NOT invent a phone number, opening hours, appointment offer, map, or place of business.

#### Scenario: Contact email has not been supplied

- **WHEN** the brand record carries no contact email
- **THEN** the page renders a marked placeholder for the email
- **AND** it does not substitute an invented address

#### Scenario: Contact address has not been supplied

- **WHEN** the brand record carries no contact address
- **THEN** no address line is rendered
- **AND** no placeholder address occupies the space

#### Scenario: Contact email has been supplied

- **WHEN** the brand record carries a contact email
- **THEN** that email is shown as given

### Requirement: The contact form does not pretend to send mail

The contact page SHALL present a message form with the customer's name, reply email, and message. Submitting the form SHALL open a mail composition to the supplied contact email when one exists. When no contact email has been supplied, submit SHALL acknowledge that the message was not sent and MUST NOT claim delivery or a forthcoming reply.

The form MUST NOT post to an application endpoint. It MUST NOT display invented support hours or a ticket number.

#### Scenario: A customer submits the form with a supplied contact email

- **WHEN** a customer submits a complete message and a contact email has been supplied
- **THEN** the storefront opens a mail composition addressed to that email, carrying the message

#### Scenario: A customer submits the form with no supplied contact email

- **WHEN** a customer submits a complete message and no contact email has been supplied
- **THEN** the page states that the message was not sent
- **AND** it does not claim that a reply will follow
