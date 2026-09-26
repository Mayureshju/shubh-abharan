## Purpose

Defines cart and wishlist persistence, checkout quoting, Razorpay and cash-on-delivery payment, order snapshots, and customer order history.

## ADDED Requirements

### Requirement: The bag stores variant lines by identifier

A cart line SHALL reference a variant identifier and a quantity. Display name, image, and price SHALL resolve from the catalog at quote time for an open cart, and SHALL be snapshotted onto the order at placement.

#### Scenario: A customer adds a sized ring

- **WHEN** a customer adds a size-bearing variant to the bag
- **THEN** the bag contains that variant identifier and quantity
- **AND** the line does not store a copied price as the source of truth

### Requirement: Signed-out bags merge on sign-in

A signed-out visitor's bag SHALL persist in the browser. Signing in SHALL merge those lines into the account bag, summing quantities for the same variant.

#### Scenario: A visitor signs in with a local bag

- **WHEN** a signed-out visitor holding two lines signs in
- **THEN** those lines are present on the account bag
- **AND** duplicate variant identifiers are combined by summing quantity

### Requirement: Checkout recomputes the quote on the server

Placing an order SHALL recompute subtotal, discounts, shipping, and total from catalog prices, active hike rules, one coupon, delivery area, and the free-delivery threshold. A client-supplied total MUST NOT be charged.

#### Scenario: A client sends a lower total

- **WHEN** checkout is requested with a client-supplied total lower than the server quote
- **THEN** the charged amount is the server quote
- **AND** the client-supplied total is ignored

### Requirement: Razorpay capture is the source of truth for card and UPI payment

For Razorpay, the server SHALL create a payment order from the recomputed total. Browser verification MAY confirm the session for user experience. Fulfilment of paid status SHALL occur when a verified payment-captured webhook arrives, and that handling SHALL be idempotent.

#### Scenario: Payment is captured

- **WHEN** a verified payment-captured notification arrives for an order
- **THEN** the order status is paid
- **AND** a duplicate notification does not create a second order or double-charge

#### Scenario: The browser closes before returning

- **WHEN** payment is captured but the browser never returns to the storefront
- **THEN** the order still becomes paid from the notification

### Requirement: Cash on delivery is optional

Cash on delivery SHALL be offered only when store settings enable it. A COD order SHALL be created as confirmed without a Razorpay capture, with payment method cash on delivery.

#### Scenario: COD is enabled

- **WHEN** COD is enabled and the customer chooses it
- **THEN** an order is created without a Razorpay capture
- **AND** the payment method is cash on delivery

#### Scenario: COD is disabled

- **WHEN** COD is not enabled
- **THEN** checkout does not offer cash on delivery

### Requirement: Customers can read their orders

A signed-in customer SHALL be able to list their own orders and open a single order by identifier. They MUST NOT read another customer's orders.

#### Scenario: A customer opens order history

- **WHEN** a signed-in customer requests their orders
- **THEN** only orders for that identity are returned
