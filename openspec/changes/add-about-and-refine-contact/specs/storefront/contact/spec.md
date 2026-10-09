## MODIFIED Requirements

### Requirement: Contact details come only from supplied brand fields

The contact page SHALL present the brand's contact email through the same supplied-or-placeholder path as the rest of the storefront. The contact address, phone number, WhatsApp number and social profile links SHALL each render only when supplied. A supplied phone number SHALL be a `tel:` link and a supplied WhatsApp number SHALL be a `wa.me` link. The page MUST NOT invent a phone number, opening hours, appointment offer, map, or place of business.

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

#### Scenario: Phone, WhatsApp or social have not been supplied

- **WHEN** the brand record carries no phone number, WhatsApp number or social links
- **THEN** no row for that channel is rendered
- **AND** no placeholder occupies its space

#### Scenario: Phone and WhatsApp have been supplied

- **WHEN** the brand record carries a phone number and a WhatsApp number
- **THEN** each is shown as given and links to a call or a WhatsApp chat respectively

### Requirement: The contact form does not pretend to send mail

The contact page SHALL present a message form with the customer's name, reply email, an enquiry topic, an optional order number shown for order enquiries, and a message. Submitting the form SHALL open a mail composition to the supplied contact email when one exists, carrying the topic, the order number when given, the reply email and the message. When no contact email has been supplied, submit SHALL acknowledge that the message was not sent and MUST NOT claim delivery or a forthcoming reply. A note explaining that sending opens the customer's email app SHALL render only when a contact email is supplied.

The form MUST NOT post to an application endpoint, and it MUST NOT submit before its script has loaded. It MUST NOT display invented support hours or a ticket number.

#### Scenario: A customer submits the form with a supplied contact email

- **WHEN** a customer submits a complete message and a contact email has been supplied
- **THEN** the storefront opens a mail composition addressed to that email, carrying the message

#### Scenario: A customer submits the form with no supplied contact email

- **WHEN** a customer submits a complete message and no contact email has been supplied
- **THEN** the page states that the message was not sent
- **AND** it does not claim that a reply will follow

#### Scenario: A customer submits an incomplete form

- **WHEN** a required field is empty or the reply email is malformed
- **THEN** each invalid field shows an inline message linked to it
- **AND** focus moves to the first invalid field
- **AND** no mail composition opens

#### Scenario: A customer chooses an order enquiry

- **WHEN** the customer selects the order topic
- **THEN** an optional order number field is shown
