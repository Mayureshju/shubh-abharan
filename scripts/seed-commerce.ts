import { connectDb } from "../lib/db/connect.ts";
import {
  CategoryModel,
  CollectionModel,
  CouponModel,
  DeliveryAreaModel,
  ProductModel,
  SettingsModel,
  TagModel,
} from "../lib/db/models.ts";
import { brand } from "../lib/brand.ts";
import { products } from "../lib/catalog/data/products.ts";
import { collections } from "../lib/catalog/data/collections.ts";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "../lib/catalog/labels.ts";

async function readEnv() {
  const { readFileSync, existsSync } = await import("node:fs");
  for (const file of [".env.local", ".env"]) {
    if (!existsSync(file)) continue;
    const text = readFileSync(file, "utf8");
    for (const raw of text.split("\n")) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      const value = line.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

async function seed() {
  await readEnv();
  await connectDb();

  const featured = new Set(brand.homepage.featuredSlugs);
  const arrivals = new Set(brand.homepage.newArrivalSlugs);

  for (const slug of CATEGORY_ORDER) {
    const assigned = products.filter((product) => product.category === slug).map((product) => product.slug);
    await CategoryModel.updateOne(
      { slug },
      {
        $set: {
          slug,
          name: CATEGORY_LABELS[slug] ?? slug,
          tags: [],
          productOrder: assigned,
          isActive: true,
        },
      },
      { upsert: true },
    );
  }

  for (const collection of collections) {
    const brandEntry = brand.collections.find((entry) => entry.slug === collection.slug);
    await CollectionModel.updateOne(
      { slug: collection.slug },
      {
        $set: {
          slug: collection.slug,
          name: collection.name,
          description: typeof collection.description === "string" ? collection.description : null,
          tagline: brandEntry && typeof brandEntry.tagline === "string" ? brandEntry.tagline : null,
          tags: [],
          productOrder: [...collection.productSlugs],
          isActive: true,
        },
      },
      { upsert: true },
    );
  }

  for (const product of products) {
    const isSize = product.options.some((option) => option.axis === "size") || Boolean(product.isSize);
    const sizes = product.sizes ?? product.options.find((option) => option.axis === "size")?.values ?? [];
    await ProductModel.updateOne(
      { slug: product.slug },
      {
        $set: {
          key: product.id,
          slug: product.slug,
          name: product.name,
          categorySlug: product.category,
          tags: [...(product.tags ?? [])],
          newArrival: arrivals.has(product.slug) || Boolean(product.isNew),
          isFeatured: featured.has(product.slug) || Boolean(product.isFeatured),
          isSize,
          sizes: [...sizes],
          options: product.options.map((option) => ({ axis: option.axis, values: [...option.values] })),
          variants: product.variants.map((variant) => ({
            key: variant.id,
            sku: variant.sku,
            options: variant.options,
            price: variant.price,
            salePrice: variant.salePrice ?? null,
            availability: variant.availability,
          })),
          images: product.images.map((image) => ({
            role: image.role,
            src: image.src,
            alt: image.alt,
            aspect: image.aspect,
            crop: image.crop,
            position: image.position,
            dimension: "dimension" in image ? image.dimension : undefined,
          })),
          collections: [...product.collections],
          occasions: [...(product.occasions ?? [])],
          materialLine: product.materialLine,
          description: product.description,
          care: product.care,
          attributes: product.attributes ?? [],
          labels: product.labels ?? [],
          relatedSlugs: product.relatedSlugs ?? [],
          componentSlugs: product.componentSlugs ?? [],
          isActive: !product.slug.startsWith("fixture-"),
        },
      },
      { upsert: true },
    );
  }

  await SettingsModel.updateOne(
    { key: "store" },
    {
      $setOnInsert: {
        key: "store",
        freeDeliveryMin: 500000,
        codEnabled: true,
        currency: "INR",
      },
    },
    { upsert: true },
  );

  await DeliveryAreaModel.updateOne(
    { name: "Mumbai" },
    {
      $setOnInsert: {
        name: "Mumbai",
        pincodes: ["400001", "400002", "400003", "400004", "400005"],
        charge: { amount: 25000, currency: "INR" },
        isActive: true,
      },
    },
    { upsert: true },
  );

  await CouponModel.updateOne(
    { code: "WELCOME" },
    {
      $setOnInsert: {
        code: "WELCOME",
        type: "percent",
        value: 10,
        minSubtotal: null,
        usageLimit: null,
        perUserLimit: null,
        usedCount: 0,
        productSlugs: [],
        categorySlugs: [],
        isActive: true,
      },
    },
    { upsert: true },
  );

  // Backfill Tag records from the free-text tags products and categories carry,
  // and rewrite any non-slug tag to its slug. Existing Tag records are kept.
  const used = new Set<string>([
    ...(await ProductModel.distinct("tags")),
    ...(await CategoryModel.distinct("tags")),
  ].filter(Boolean));
  for (const raw of used) {
    const slug = raw.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!slug) continue;
    const name = raw.trim().replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    await TagModel.updateOne({ slug }, { $setOnInsert: { slug, name, isActive: true } }, { upsert: true });
    if (slug !== raw) {
      await ProductModel.updateMany({ tags: raw }, { $set: { "tags.$": slug } });
      await CategoryModel.updateMany({ tags: raw }, { $set: { "tags.$": slug } });
    }
  }

  const counts = {
    categories: await CategoryModel.countDocuments(),
    products: await ProductModel.countDocuments(),
    collections: await CollectionModel.countDocuments(),
    tags: await TagModel.countDocuments(),
  };
  console.log(`seed-commerce: categories=${counts.categories} products=${counts.products} collections=${counts.collections} tags=${counts.tags}`);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
