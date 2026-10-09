## Why

Customers who reach a piece cannot buy it easily:

- The shop grid shows cards at deliberately uneven sizes and leaves empty cells.
- The product page has no way to inspect a stone up close.
- Add to bag and wishlist navigate away from the page.
- Checkout redirects anyone without an account to sign-in and loses what they typed.

The business wants the path from landing to paid order to be short, and it wants it now, before more traffic arrives.

## What Changes

- **BREAKING** (design rule): product listings — shop, collections, wishlist — become a uniform grid of square cards. The rule that a listing must vary aspect ratio and span is replaced. Homepage editorial sections keep their varied layouts.
- The product page gains a square gallery with swipe and thumbnails, plus a round magnifier lens that follows the pointer on desktop. A full-screen view serves as the keyboard and touch equivalent, with native pinch zoom.
- The product page also gains:
  - **Buy now**: adds the piece and goes straight to checkout.
  - **Add to bag**: opens a bag drawer instead of leaving the page.
  - **Wishlist**: saves in place.
  - **Pincode delivery check**: uses the store's delivery data.
  - **Sticky action bar on phones.**
- The header bag shows the number of items.
- Checkout works for guests and for signed-in customers. Signing in happens in a modal and keeps the form.
- Checkout collects only billing details (name, phone, address) and receiver details (pincode, name, phone, address, optional gift message). A ticked "Deliver to my billing address" box means a self-buyer only adds a pincode.
- Every order gets a private confirmation page at `/order/[id]?t=<token>`. Guests can view their order there without an account.
- Signing in merges the browser bag into the account bag once. It never doubles quantities. Signing out clears the browser copy.
- **BREAKING** (data): `Order.clerkUserId` becomes optional. Orders gain `billing`, `giftMessage` and `accessToken`. The receiver stays in `shippingAddress`, so existing orders read unchanged.

## Capabilities

### New Capabilities

- `storefront/product-detail`: The product detail page's gallery, magnifier and full-screen view, purchase actions, delivery check, and phone action bar.

### Modified Capabilities

- `design-system/core-components`: The product-card requirement changes from varied aspect and span to one square frame per card in listings.
- `design-system/motion-language`: The hover-scale budget gains a carve-out for the user-directed magnifier on the product image.
- `design-system/responsive-accessibility`: On phones, product listings are a two-up grid. Related-product sets stay a rail.
- `storefront/shop`: Listings are a uniform square grid with no empty cells.
- `commerce/cart-checkout`: Adds guest checkout, the billing and receiver fields, the private confirmation page, and the bag drawer with its header count. Signed-out bags merge once per sign-in.
- `commerce/fulfillment`: The served-pincode rule applies to the receiver's pincode.
- `identity/auth`: A visitor with no session may check out and open their own confirmation page.

## Impact

**Code**

- `app/(storefront)/products/[slug]/page.tsx`, `app/(storefront)/checkout/page.tsx`, `app/(storefront)/cart/page.tsx`, `app/(storefront)/wishlist/page.tsx`, new `app/(storefront)/order/[id]/page.tsx`
- `components/product/*` (new `ProductGallery`, `DeliveryCheck`), `components/shop/ProductListing.tsx`
- `components/cart/*` (new `CartDrawer`, `BagLines`, `useBagQuote`)
- `components/ui/ModalDialog.tsx` (new `drawer` placement), `components/nav/SiteHeader.tsx`, `components/auth/AccountControl.tsx`
- `lib/actions/checkout.ts`, `lib/commerce/quote.ts`, new `lib/commerce/checkout-schema.ts`, `lib/db/models.ts`
- `app/admin/orders/*`, `components/admin/OrdersTable.tsx`
- `app/globals.css` (`.shop-set`, `.pdp-slides`), `DESIGN-SYSTEM.md`, new `scripts/check-checkout.mjs`, `package.json`

**Dependencies**

None new. zod (installed, unused until now) validates checkout. Clerk, Razorpay and Motion are already in the tree.

**Not in scope**

- Email or SMS receipts.
- Saved addresses.
- Guest order lookup by phone.
- Server-side wishlist sync.
- Per-user coupon limits.
- Cleanup of abandoned pending orders.
- `/search`.
- A second photograph on card hover.
- Shipping-time or returns copy (unsupplied in BRAND-INPUTS).
