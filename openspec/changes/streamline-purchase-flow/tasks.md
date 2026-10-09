## 1. Uniform listing grid

- [x] 1.1 `.shop-set`: 2 columns, then 3 from 1024px; delete the `nth-child` span rules
- [x] 1.2 `ProductListing`: every card `portrait` with the macro role and one `sizes` value; drop `roleFor`
- [x] 1.3 `ProductCard`: stack name over price below 768px, clamp the material line to two lines, update the doc comment
- [x] 1.4 Wishlist page uses `.shop-set`; update the specimen product-card intent text

## 2. Dialog and bag

- [x] 2.1 `ModalDialog`: add `drawer` placement; backdrop to `ink` at 45%
- [x] 2.2 `CartProvider`: `count`, drawer open/close in context, render `CartDrawer`; bag sync keyed on the Clerk user with the `shubha-bag-owner` marker
- [x] 2.3 `useBagQuote` hook and `BagLines` (image, name, size, price, −/+ stepper, remove)
- [x] 2.4 `CartDrawer`: lines, subtotal, Checkout, View bag, empty state
- [x] 2.5 `/cart` uses `BagLines` and `useBagQuote`
- [x] 2.6 Header bag count; "Orders" link for signed-in customers

## 3. Product detail page

- [x] 3.1 `ProductGallery`: square scroll-snap slides, thumbnails, current index
- [x] 3.2 Magnifier lens (fine pointer only, mounted on first hover, ref-driven transforms)
- [x] 3.3 Full-screen view on `ModalDialog` overlay: uncropped image, previous/next, arrow keys, close
- [x] 3.4 `AddToBag`: Buy now (primary, no quantity doubling), Add to bag (quiet, opens drawer), wishlist in place, focus-visible size chips, sold-out sizes disabled and struck through
- [x] 3.5 Phone action bar fixed to the bottom with the price; page padding so nothing hides behind it
- [x] 3.6 `DeliveryCheck` via `previewQuote`; remember the pincode for checkout
- [x] 3.7 PDP page: gallery, info order, details disclosure with supplied attributes and labels

## 4. Checkout

- [x] 4.1 `lib/commerce/checkout-schema.ts` (zod): billing, receiver, gift message, phone normalisation
- [x] 4.2 Order model: optional `clerkUserId`; `billing`, `giftMessage`, `accessToken`
- [x] 4.3 `placeOrder` for both methods: validate, optional session, server quote, served pincode, token, COD default fix; `markRazorpayVerified` without a session
- [x] 4.4 `quoteCart` rejects sold-out and unavailable variants
- [x] 4.5 Checkout page: account line with modal sign-in and prefill, billing, receiver with "Deliver to my billing address", gift message, inline errors, `sessionStorage` draft, coupon disclosure, summary
- [x] 4.6 Razorpay client: script loaded once, prefill, pending until success/dismiss/failure, verify then confirmation
- [x] 4.7 `/order/[id]` confirmation page: token lookup, noindex, no-referrer, payment-status message
- [x] 4.8 Admin order detail, search and table show billing, receiver and gift message

## 5. Verify

- [x] 5.1 `scripts/check-checkout.mjs` (`node:assert` on the schema) added to `npm run check`
- [x] 5.2 Update `DESIGN-SYSTEM.md`: product-card rule, dialog placements, routes
- [ ] 5.3 `npm run check` and `npm run build`
- [ ] 5.4 Browser pass at 1440/1024/768/390: grid, gallery and lens, full-screen view by keyboard and touch, drawer, Buy now, delivery check, guest COD and Razorpay checkout, sign-in mid-checkout, reload without doubling, confirmation page, admin order, reduced motion, console clean

## Notes

- 5.3: `npm run build` passes. Every `npm run check` gate passes except lint, which still fails on two errors that predate this change and sit outside it: `app/admin/reports/page.tsx` (react-hooks/purity) and `components/home/RowSlider.tsx` (react-hooks/refs). The lint errors this change touched (cart page, CartProvider, `prefer-const` in quote.ts) are fixed.
- 5.4 verified on the production build, signed out, at 1440px and 390px:
  - **Grid:** uniform square grid on the shop and a collection page.
  - **Gallery:** thumbnails, swipe, and a 2.5× lens on the first hover.
  - **Full-screen view:** opens by keyboard; Enter, arrow keys and Escape all work, and focus returns.
  - **Phone purchase bar:** stays fixed at the bottom and clears the footer.
  - **Delivery check:** short, unknown and served pincodes; the pincode carries into checkout.
  - **Wishlist:** saves in place and moves focus.
  - **Bag drawer:** focus, count, stepper and close.
  - **Buy now:** does not double the quantity.
  - **Checkout validation:** inline errors with focus.
  - **Guest COD order:** lands on `/order/[id]?t=`, and the bag and draft are cleared.
  - **Confirmation route:** a wrong or missing token or a bad id returns 404; `noindex` and `no-referrer` are present.
  - **Stored order:** no clerkUserId; has billing, receiver, gift message and token.
- 5.4 still open:
  - Signed-in checkout (sign-in mid-checkout, a single merge, reload without doubling) needs a real account.
  - Razorpay success, dismiss and failure: the build's public key is not a Razorpay key, so Razorpay was not called.
  - Reduced motion was checked by code, not emulation.
  - Admin order page visual needs an admin session.
- QA data: guest COD order #B262DE ("QA Test Guest") exists in the development database.
