## Context

See proposal.md for motivation. The state of the code this design builds on:

- **Shop grid.** `.shop-set` spans every fourth card across four of six columns. `ProductListing` cycles image roles, which pulls landscape lifestyle frames into cards. Every product still is a 2048×2048 square.
- **PDP gallery.** It stacks every image at its declared aspect, with no thumbnails, zoom or lightbox.
- **Add to bag.** It always `router.push("/cart")`. No drawer exists. `check-slop` already allowlists a `CartDrawer.tsx`, and the motion spec already describes one.
- **Checkout requires a session in three places:**
  - Both place-order actions call `requireCustomer()`.
  - `Order.clerkUserId` is required.
  - The only order view filters by `clerkUserId`.
- **Checkout address.** It collects one address with city and state. The address is checked with hand-written emptiness tests. zod 4 is installed but unused.
- **Delivery data.** `add-india-delivery-mapping` (in flight) replaces delivery areas with a pincode directory. `quoteCart` returns `deliveryAreaName` as "City, State", or null when unserved.
- **Bag persistence.** The bag is `localStorage` (`shubha-bag`). Sync to the account runs once per page load, keyed on the env key rather than the session, so sign-in through the modal never merges, and a reload can merge twice.
- **Constraints.** Every image goes through `Plate`. Every overlay goes through `ModalDialog`. Buttons come only from `buttonClass`, with one `primary` per view. Shadows, gradients, `rounded-full` and backdrop blur are rejected by `check-slop`.

## Goals / Non-Goals

**Goals:**

- One square frame for every listing card and every gallery slide.
- A magnifier that never loads its large image on touch devices, and never re-renders React on pointer move.
- A guest order needs no account system, only a per-order secret.
- One validation schema shared by the browser and the server.
- Existing orders, admin screens and the payment webhook keep working without a data migration.

**Non-Goals:**

- A second dialog primitive, a gesture library, or an image-zoom dependency.
- Deriving the receiver's city and state as stored fields. The quote already names "City, State" from the pincode.
- Changing COD status semantics (`paid` + `pending_collection`). The confirmation page states the customer-facing truth from the payment method.

## Decisions

### Decision 1 — Listings share one square grid

`.shop-set` becomes two columns, then three from 1024px. Every child spans one column, and the `nth-child` span rules are deleted. `ProductListing` renders every card with the 1:1 `portrait` frame and the `macro` role, which selects the square still. Collections and the wishlist reuse `.shop-set`. The card stacks name over price below 768px so a 2-up phone card does not crush its price.

Rejected: reuse `.featured-set`. It is a swipe rail on phones, and listings must be 2-up on phones.

Rejected: keep spans and equalise heights. The holes and the scale mismatch are what the business objected to.

### Decision 2 — The gallery is a scroll-snap row with thumbnails

The main frame is a horizontal CSS scroll-snap row of square `Plate cover` slides. Swipe and trackpad scrolling are native. Thumbnails call `scrollTo`, and the global reduced-motion rule already forces `scroll-behavior: auto`. The current index is `round(scrollLeft / clientWidth)`, read on scroll and throttled to one read per animation frame.

Rejected: a single frame swapped by state. It needs hand-written touch handling for swipe.

Rejected: the homepage `CollectionSlider` drag pattern. It is built for autoplaying crossfades, not inspection.

### Decision 3 — The lens is a second Plate inside a round clip

On the first `pointerenter`, and only when `(hover: hover) and (pointer: fine)` matches, the gallery mounts a 180px `rounded-pill` clip with a gold hairline. The clip holds a decorative `Plate cover` of the current image, sized to 2.5× the frame. Pointer moves write `translate` values to the clip and its inner layer through refs inside `requestAnimationFrame`, with no React state per move.

Using `Plate` keeps the one-image-path rule and lets `next/image` pick a large source for `sizes="140vw"`. Touch devices never mount it, so they never download it.

The lens is not a child of `.plate-zoom`, so the listing hover-scale rule cannot apply to it.

Rejected: CSS `background-image` from `getImageProps`. It is a second image path outside `Plate`.

Rejected: zoom inside the frame. The business chose the lens.

### Decision 4 — Full-screen view and bag drawer reuse ModalDialog

The full-screen image view is `ModalDialog` with `overlay` placement. It shows the image at its declared aspect rather than the square gallery crop, fitted to the viewport with container units. It has previous/next controls, arrow-key navigation, and `CloseIcon`. Pinch zoom is the browser's own.

The bag drawer adds a third placement, `drawer`: a right-hand full-height panel up to 26rem wide, entering with 24px of x travel. `MotionConfig reducedMotion="user"` already reduces that to opacity.

The dialog backdrop moves from the retired green to `ink` at 45%.

Rejected: a hand-rolled drawer. DESIGN-SYSTEM forbids a second dialog wrapper.

### Decision 5 — Guest orders are reached by a per-order token

Every order stores `accessToken = randomBytes(24).toString("base64url")`. The confirmation route `/order/[id]?t=<token>` looks the order up by `_id` and `accessToken`. It is a server component with `robots: noindex` and `referrer: no-referrer`.

`clerkUserId` becomes optional. When a session exists, the order is still linked, and `/account/orders` keeps working.

`markRazorpayVerified` no longer needs a session. It is gated by the Razorpay HMAC and the order's stored `razorpayOrderId`. The webhook remains the source of truth for `paid`, and already looks orders up by `razorpayOrderId`.

Rejected: guest accounts or lookup by phone. Both need an identity system or an OTP channel the store does not have.

### Decision 6 — Receiver lives in shippingAddress; billing is new

The receiver is the shipping address, so it stays in `shippingAddress`. The address text goes in `line1`, and city and state are left empty. Old orders, admin search, the admin order card and reports read unchanged. `billing{name,phone,address}` and `giftMessage` are new fields.

Rejected: a new `receiver` sub-document. It would force a migration or dual reads everywhere `shippingAddress` is read.

### Decision 7 — One zod schema, flat payload

`lib/commerce/checkout-schema.ts` imports only zod, so it runs in the browser, the server action, and a plain `node` check script. The payload is always a full billing block plus a full receiver block. When "Deliver to my billing address" is selected, the client copies billing into receiver before validating, so the schema needs no conditional branches. Phones are normalised (strip `+91`, spaces and dashes) inside the schema, so the stored value is the canonical ten digits.

### Decision 8 — One placeOrder action

`placeRazorpayOrder` and `placeCodOrder` were about 80% identical, and both need the same guest, billing and receiver changes. They fold into `placeOrder({ method, lines, details, couponCode })`, which:

1. Validates the details.
2. Reads the optional session.
3. Re-quotes on the server.
4. Requires a served receiver pincode.
5. Creates the order.
6. Creates the Razorpay order only for that method.

The COD-enabled check uses the same default as the quote (`codEnabled !== false`).

### Decision 9 — Bag sync keys on the signed-in user

`CartPersistence` reads `useAuth()`, and only mounts under `ClerkProvider`. A `localStorage` marker `shubha-bag-owner` records whose account the browser bag mirrors:

- **New user ID:** merge the local lines into the account bag once, then set the marker.
- **Same user ID:** load the account bag.
- **No user and marker set:** sign-out. Clear the local bag and the marker.

Saves run only after the sync for the current user.

Rejected: a `sessionStorage` flag. It survives sign-out in the same tab and never re-arms on sign-in.

### Decision 10 — Shared bag quote and lines

The drawer, `/cart` and checkout all price the bag through `previewQuote`. A `useBagQuote(lines, { coupon, pincode })` hook owns the cancellation.

`BagLines` renders lines for the drawer and `/cart`, with a −/+ stepper (minimum 1) and Remove. This replaces the number input, which deleted the line when cleared.

The PDP delivery check calls `previewQuote` with the one chosen line and the pincode. It reuses the directory lookup and the free-delivery rule with no new server code.

## Risks / Trade-offs

- [Guest COD orders are unauthenticated and could be spammed] → Admin can cancel. Add phone OTP or rate limiting if it happens. Not built speculatively.
- [The token is in the URL] → `noindex`, `no-referrer`, 192-bit token, and nothing sensitive beyond the order itself.
- [Each Pay attempt creates a new pending order and Razorpay order] → The button stays pending until success, dismissal or failure, which removes double clicks. Abandoned `pending_payment` orders remain visible to admin.
- [No email or SMS receipt] → The confirmation page says to keep its link. Messaging needs a provider the store does not have.
- [Lifestyle crops are soft above about 1.4×] → The magnifier shows what the photograph holds. Square stills (2048px) stay sharp at 2.5× on standard displays.
- [Clerk modal sign-in may redirect] → The checkout draft is kept in `sessionStorage` and restored, and cleared after an order is placed.
- [The uniform grid trades editorial variety on listings for comparability] → Editorial variety stays on the homepage and journal surfaces.

## Migration Plan

No data migration:

- Existing orders keep `clerkUserId` and `shippingAddress`.
- New optional fields read as absent.
- An existing order has no `accessToken`, so it has no confirmation page. It remains readable in `/account/orders` and admin.

Archive order matters. `commerce/fulfillment` is also modified by `add-india-delivery-mapping`, and this delta copies that change's text, so archive it first. Earlier changes with mismatched MODIFIED headers (see `clone-shubha-moodboard`) should be repaired before any archive.

Rollback is a revert of the code. Orders placed as guests would then be unreachable through account pages, but remain visible in admin.
