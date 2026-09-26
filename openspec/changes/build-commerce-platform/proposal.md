## Why

The storefront can browse a typed catalog but cannot sell: there is no database, no customer or admin identity, no cart, no checkout, and no way for the business to author products, prices, delivery, or coupons. Mongo and Clerk are the persistence and identity layer that let the existing catalog repository become a live shop.

## What Changes

- **Clerk** authenticates customers and admins. Admin role is Clerk `publicMetadata.role = "admin"`, mirrored to Mongo. `/admin` is denied to non-admins.
- **Mongo** owns categories, products, collections, coupons, scheduled price rules, delivery areas, store settings, carts, wishlists, users, and orders.
- **BREAKING** for the catalog model: category is no longer a closed TypeScript union; tags, `isNew`, `isFeatured`, `isSize`/`sizes`, and variant `salePrice` become first-class fields. Featured/new merchandising is product flags, not only brand slug lists.
- Catalog repository reads Mongo. Fixtures seed the database once. Shop, types, collections, and PDP stay on the same async accessors.
- Admin authors catalog, reorders products per category and collection, configures coupons, date-window price hikes, delivery pincodes/charges, and a free-delivery threshold.
- Customers get cart, wishlist, checkout with Razorpay (and COD when enabled), and order history. Totals are always recomputed server-side.
- Admin manages order status and sees live order-backed reports (GMV, AOV, top products, coupon use, shipping collected vs waived).
- Storefront chrome moves into a route group so `/admin` does not inherit the editorial header/footer.

## Capabilities

### New Capabilities

- `identity/auth`: Clerk sessions, customer vs admin role, webhook user sync, route protection.
- `commerce/pricing`: List price, sale price, scheduled hike rules, and the single resolver used by PDP, cart, checkout, and admin preview.
- `commerce/cart-checkout`: Cart/wishlist persistence and merge, quote, Razorpay and COD, order snapshots, customer order history.
- `commerce/promotions`: Coupons (percent, fixed, free shipping), windows, limits, targeting.
- `commerce/fulfillment`: Delivery areas by pincode, charges, free-delivery minimum, COD toggle.
- `admin/panel`: Admin shell, catalog/ops CRUD, reorder, order status, reports.

### Modified Capabilities

- `catalog/product-model`: Admin-authored categories with slug/name/tags/product order; product tags, flags, size axis, sale price, multi-image gallery.
- `catalog/catalog-access`: Repository is Mongo-backed; listing order honours category `productOrder`; price display uses the pricing resolver.

## Impact

- **New deps:** `mongoose`, `@clerk/nextjs`, `razorpay`, `zod`.
- **New env names:** Clerk publishable/secret/webhook, Razorpay key id/secret/webhook. `MONGO_URI` already exists.
- **Code:** `lib/db`, `lib/models`, `lib/auth`, `lib/pricing`, `lib/commerce`, `app/(storefront)`, `app/admin`, `app/api`, cart/checkout/account routes, catalog type/repository/check-catalog updates.
- **Unchanged:** visual tokens, Plate, anti-slop rules against fake ratings/stock/scarcity badges. Sale renders as struck + current price, not a SALE pill.
- **Out of scope:** GST invoices, live gold-rate making charges, inventory quantities, reviews.
