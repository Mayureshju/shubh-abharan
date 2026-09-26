## 1. Dependencies and database

- [x] 1.1 Add mongoose, @clerk/nextjs, razorpay, and zod
- [x] 1.2 Add Mongo connection singleton from MONGO_URI
- [x] 1.3 Add mongoose models for Category, Product, Collection, Coupon, PriceRule, DeliveryArea, Settings, User, Cart, Wishlist, Order, ProcessedEvent
- [x] 1.4 Add idempotent seed from existing catalog fixtures, brand collections, and default settings/delivery

## 2. Catalog contract

- [x] 2.1 Extend product types for tags, isNew, isFeatured, isSize, sizes, salePrice, and string category slugs
- [x] 2.2 Allow salePrice in check-catalog; keep rating/stock/badge forbidden
- [x] 2.3 Map Mongo documents to catalog Product/Collection types
- [x] 2.4 Point the catalog repository at Mongo; honour category and collection productOrder
- [x] 2.5 Add the pricing resolver (list, hike, sale) and use it for lowest payable price

## 3. Identity and shell

- [x] 3.1 Clerk provider, proxy.ts, and env-based keys
- [x] 3.2 Role helper and admin gate
- [x] 3.3 Clerk webhook user upsert
- [x] 3.4 Move storefront chrome into (storefront) route group; add admin layout

## 4. Admin catalog

- [x] 4.1 Admin category CRUD with tags and product reorder
- [x] 4.2 Admin product CRUD with images, size axis, sale, flags, tags
- [x] 4.3 Admin collection CRUD with product reorder
- [x] 4.4 Local image upload to public/uploads

## 5. Operations config

- [x] 5.1 Admin coupons
- [x] 5.2 Admin price-hike rules
- [x] 5.3 Admin delivery areas and settings (free-delivery min, COD)

## 6. Cart and checkout

- [x] 6.1 Cart and wishlist client persistence plus signed-in merge
- [x] 6.2 Server quote (prices, coupon, pincode shipping, free threshold)
- [x] 6.3 Checkout UI, Razorpay order create/verify, capture webhook
- [x] 6.4 COD path when enabled
- [x] 6.5 Customer account order history
- [x] 6.6 Wire PDP add-to-bag and size selector

## 7. Orders, reports, storefront wiring

- [x] 7.1 Admin order list and status transitions
- [x] 7.2 Admin reports from live aggregations
- [x] 7.3 Shop filters from live categories; homepage new/featured flags
- [x] 7.4 Sale/compare typography on cards and PDP without sale pills

## 8. Verify

- [x] 8.1 npx tsc --noEmit and catalog check
- [x] 8.2 Curl seed/checkout/admin paths against the existing dev server
- [x] 8.3 Browser pass of shop, PDP size, cart, admin, and reports
