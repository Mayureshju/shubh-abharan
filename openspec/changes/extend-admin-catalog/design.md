## Decisions

1. **Per-size pricing reuses variants.** `VariantSchema` already carries `price`, `salePrice`, `availability`, and the storefront resolves price per variant. One variant per size; existing variant keys are preserved by matching `options.size` so carts keep resolving.
2. **Tags are referenced by slug.** `product.tags` / `category.tags` stay string arrays holding Tag slugs, so the existing `?tag=` filter (slug-shaped) is unchanged. Tag records supply display names and SEO.
3. **S3 public-read URLs.** `https://<bucket>.s3.<region>.amazonaws.com/products/<uuid>.<ext>`, immutable cache headers. Signed URLs rejected: they expire and defeat image caching. `next.config` whitelists the bucket host for `next/image`.
4. **Upload validation at the trust boundary.** Admin-only; jpeg/png/webp/avif; ≤ 10 MB; server-generated key.

## Non-goals

Per-size SKU/quantity inventory, image resizing, deleting orphaned S3 objects, bulk import.
