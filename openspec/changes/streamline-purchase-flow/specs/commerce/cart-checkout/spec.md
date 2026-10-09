## MODIFIED Requirements

### Requirement: Signed-out bags merge on sign-in

A signed-out visitor's bag SHALL persist in the browser. Signing in SHALL merge those lines into the account bag once for that sign-in, summing quantities for the same variant. Reloading or navigating while still signed in MUST NOT merge again. After the merge, the browser bag and the account bag SHALL hold the same lines. Signing out SHALL clear the browser's copy of the account bag.

#### Scenario: A visitor signs in with a local bag

- **WHEN** a signed-out visitor holding two lines signs in
- **THEN** those lines are present on the account bag
- **AND** duplicate variant identifiers are combined by summing quantity

#### Scenario: A signed-in customer reloads

- **WHEN** a signed-in customer whose bag holds one line at quantity 1 reloads the page
- **THEN** the bag still holds that line at quantity 1

#### Scenario: A customer signs out

- **WHEN** a signed-in customer signs out
- **THEN** the browser bag is empty
- **AND** the account bag is unchanged for their next sign-in

## ADDED Requirements

### Requirement: Guests can check out without an account

Checkout SHALL accept orders from visitors with no session, by Razorpay or by cash on delivery when offered. A signed-in customer's order SHALL be linked to their identity. A guest order SHALL have no identity link.

Checkout SHALL offer sign-in as an option that keeps the customer on the checkout page with their entered details intact. It MUST NOT require sign-in.

#### Scenario: A guest places a cash-on-delivery order

- **WHEN** a visitor with no session completes checkout with cash on delivery
- **THEN** an order is created without an identity link
- **AND** the visitor is shown that order's confirmation page

#### Scenario: A customer signs in during checkout

- **WHEN** a visitor fills billing details and then signs in from checkout
- **THEN** checkout remains open with the billing details still filled
- **AND** the order they place is linked to their identity

### Requirement: Checkout collects billing and receiver details

Checkout SHALL collect:

- **Billing:** name, phone, and address.
- **Receiver:** pincode, name, phone, address, and an optional gift message.

"Deliver to my billing address" SHALL be selected by default. While it is selected, the receiver's name, phone and address SHALL be the billing values, and the customer SHALL only supply the receiver pincode. Clearing it SHALL reveal the receiver's own name, phone and address fields.

The server SHALL validate every field and MUST reject an order that fails validation:

- **Names:** 2 to 80 characters.
- **Phones:** ten-digit Indian mobile numbers, accepted with or without a +91 prefix, spaces or dashes.
- **Addresses:** 5 to 300 characters.
- **Pincode:** six digits, not starting with zero.
- **Gift message:** at most 200 characters.

A failed field SHALL be identified next to that field.

#### Scenario: A self-buyer checks out

- **WHEN** a customer fills billing details, leaves "Deliver to my billing address" selected, and enters a served pincode
- **THEN** the order's receiver has the billing name, phone and address with that pincode

#### Scenario: A gift is sent to someone else

- **WHEN** a customer clears "Deliver to my billing address", enters a different receiver, and writes a gift message
- **THEN** the order stores the billing person, the receiver, and the gift message separately

#### Scenario: A phone number is malformed

- **WHEN** the billing phone has nine digits
- **THEN** no order is created
- **AND** the phone field shows what is wrong

#### Scenario: A phone number carries a country prefix

- **WHEN** the billing phone is entered as "+91 98765 43210"
- **THEN** it is accepted and stored as "9876543210"

### Requirement: Placing an order leads to a private confirmation page

Every order SHALL receive an unguessable access token at placement. After placement the customer SHALL be shown a confirmation page addressed by the order identifier and that token. It SHALL show the order number, the items, the totals, the receiver, the gift message, the billing person, and a payment status message that matches the order's payment method and status.

The confirmation page MUST NOT render for a wrong or missing token. It MUST NOT be indexed by search engines. It MUST NOT send its address as a referrer.

#### Scenario: A guest opens their confirmation

- **WHEN** a guest opens the confirmation address they were sent to after placing an order
- **THEN** the order number, items, totals, receiver and billing details are shown

#### Scenario: The token is wrong

- **WHEN** the confirmation address is opened with a different token
- **THEN** a not-found response is returned
- **AND** no order detail is revealed

#### Scenario: A cash-on-delivery order is confirmed

- **WHEN** a cash-on-delivery order's confirmation renders
- **THEN** it states the amount to pay on delivery
- **AND** it does not state that payment was received

### Requirement: Adding to the bag opens the bag drawer

Adding an item to the bag from a product page SHALL open a bag drawer on the same page. The drawer SHALL list the bag's lines with image, name, size, price and quantity controls. It SHALL show the subtotal, a primary action to check out, and a link to the full bag page. The site header SHALL show the bag's item count on every page.

#### Scenario: A customer adds an item

- **WHEN** a customer adds a piece to the bag
- **THEN** the drawer opens with focus inside it, listing that piece
- **AND** the header bag count includes it

#### Scenario: A customer closes the drawer

- **WHEN** a customer presses Escape in the bag drawer
- **THEN** the drawer closes and the product page is where they left it
