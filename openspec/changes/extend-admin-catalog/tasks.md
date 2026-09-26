## 1. Model

- [x] 1.1 Add Tag model; add seoTitle/seoDescription to Product, Category, Tag
- [x] 1.2 Seed backfills Tag records from existing product/category tags

## 2. Media

- [x] 2.1 Add @aws-sdk/client-s3 and an S3 client helper
- [x] 2.2 Upload route stores to S3 with type/size validation
- [x] 2.3 Allow the bucket host in next/image remotePatterns

## 3. Admin

- [x] 3.1 Per-size variant rows (size, price, sale, stock) and saveProduct support
- [x] 3.2 Multi-file image upload with preview, remove, reorder
- [x] 3.3 Tag and collection pickers, active flag, care, SEO section in product editor
- [x] 3.4 Tags admin page and saveTag action; nav link
- [x] 3.5 Category SEO fields and tag picker

## 4. Storefront

- [x] 4.1 Product metadata uses SEO fields with fallbacks and OG image
- [x] 4.2 Shop metadata uses category/tag SEO fields
- [x] 4.3 Tag filter shows tag names

## 5. Verify

- [x] 5.1 Lint, slop check, build
- [ ] 5.2 Browser check of editor, upload, per-size price on PDP

## Notes

- Typecheck previously ran out of memory: `modelOf` in `lib/db/models.ts` called `mongoose.model<T>()` generically. Replaced with a cast; `tsc` now completes and the pre-existing type errors it had been hiding (checkout readonly lines, order pricing/payment optionality, action return types, Clerk webhook request type, price-rule enums) are fixed.
- Admin coupon and price-rule tables displayed fixed amounts in paise as rupees; corrected.
