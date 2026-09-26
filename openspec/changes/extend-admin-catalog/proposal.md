## Why

The admin product editor cannot express a real jewellery catalog: every size shares one price and stock, tags are free text with no identity or SEO, catalog pages have no SEO title/description, and uploads are written to local disk that does not survive a deploy.

## What Changes

- Each size of a sized product carries its own list price, sale price, and stock status.
- **Tag** becomes a persisted record (slug, name, SEO title, SEO description, active). Products and categories reference tags by slug.
- Products, categories, and tags carry optional `seoTitle` and `seoDescription`; storefront metadata uses them with name/description fallbacks.
- Admin image upload stores files in S3 (public-read bucket URL) with type and size validation. Supersedes `build-commerce-platform` design decision 9 (local `public/uploads`).
- Product editor gains multi-file upload with preview and reorder, tag and collection pickers, an active toggle, and an SEO section. New admin Tags page.

## Capabilities

### Modified Capabilities

- `catalog/product-model`: Tag entity, SEO fields, per-size variant pricing and stock, S3-hosted images.
- `admin/panel`: Tags CRUD, richer product editor, S3 upload.

## Impact

- New dependency `@aws-sdk/client-s3`. Env: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET_NAME`.
- Bucket policy must allow public `s3:GetObject` on `products/*`.
- Seed backfills Tag records from existing tag strings.
