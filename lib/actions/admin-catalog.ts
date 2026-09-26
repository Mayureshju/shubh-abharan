"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectDb } from "@/lib/db/connect";
import {
  CategoryModel,
  CollectionModel,
  CouponModel,
  PriceRuleModel,
  ProductModel,
  TagModel,
} from "@/lib/db/models";
import { requireAdmin } from "@/lib/auth/roles";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function slugs(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string") return [];
  return value
    .split(/[\n,]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function tags(value: FormDataEntryValue | null): string[] {
  return slugs(value).map((entry) => entry.toLowerCase());
}

function text(value: FormDataEntryValue | null): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

const STOCK = new Set(["available", "made-to-order", "sold-out"]);

function rupeesToPaise(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const rupees = Number(value);
  if (!Number.isFinite(rupees)) return null;
  return Math.round(rupees * 100);
}

export async function saveCategory(formData: FormData) {
  await requireAdmin();
  await connectDb();
  const existing = String(formData.get("existingSlug") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "") || name);
  if (!name || !slug) return;
  const productOrder = slugs(formData.get("productOrder"));
  await CategoryModel.findOneAndUpdate(
    { slug: existing || slug },
    {
      $set: {
        slug,
        name,
        tags: formData.getAll("tags").map(String),
        productOrder,
        seoTitle: text(formData.get("seoTitle")),
        seoDescription: text(formData.get("seoDescription")),
        isActive: formData.get("isActive") !== "false",
      },
    },
    { upsert: true, new: true },
  );
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidatePath("/types");
  return;
}

export async function saveCollection(formData: FormData) {
  await requireAdmin();
  await connectDb();
  const existing = String(formData.get("existingSlug") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "") || name);
  if (!name || !slug) return;
  const productOrder = slugs(formData.get("productOrder"));
  await CollectionModel.findOneAndUpdate(
    { slug: existing || slug },
    {
      $set: {
        slug,
        name,
        description: String(formData.get("description") ?? "").trim() || null,
        tags: tags(formData.get("tags")),
        productOrder,
        isActive: formData.get("isActive") !== "false",
      },
    },
    { upsert: true },
  );
  revalidatePath("/admin/collections");
  revalidatePath("/collections");
  return;
}

export async function saveProduct(formData: FormData) {
  await requireAdmin();
  await connectDb();
  const existingSlug = String(formData.get("existingSlug") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "") || name);
  const categorySlug = String(formData.get("categorySlug") ?? "").trim();
  const back = `/admin/products/${existingSlug || "new"}`;
  const fail = (message: string): never => redirect(`${back}?error=${encodeURIComponent(message)}`);
  if (!name || !slug || !categorySlug) fail("Name and category are required.");

  const existing = existingSlug
    ? await ProductModel.findOne({ slug: existingSlug })
    : await ProductModel.findOne({ slug });
  if (!existingSlug && existing) fail(`A product with slug "${slug}" already exists.`);
  const key = existing?.key ?? `p_${randomUUID()}`;
  const isSize = formData.get("isSize") === "on" || formData.get("isSize") === "true";

  type Row = { size: string | null; price: number | null; sale: number | null; stock: string };
  const rows: Row[] = isSize
    ? formData
        .getAll("variantSize")
        .map((size, index) => ({
          size: String(size).trim(),
          price: rupeesToPaise(formData.getAll("variantPrice")[index] ?? null),
          sale: rupeesToPaise(formData.getAll("variantSale")[index] ?? null),
          stock: String(formData.getAll("variantStock")[index] ?? "available"),
        }))
        .filter((row) => row.size !== "")
    : [
        {
          size: null,
          price: rupeesToPaise(formData.get("price")),
          sale: rupeesToPaise(formData.get("salePrice")),
          stock: String(formData.get("availability") ?? "available"),
        },
      ];
  if (isSize && rows.length === 0) fail("Add at least one size, or turn off sizes.");
  const sizes = rows.flatMap((row) => (row.size ? [row.size] : []));
  if (new Set(sizes).size !== sizes.length) fail("Each size must be listed once.");
  for (const row of rows) {
    const label = row.size ? `Size ${row.size}` : "Product";
    if (row.price == null) fail(`${label}: list price is required.`);
    if (row.sale != null && row.price != null && row.sale >= row.price) {
      fail(`${label}: sale price must be lower than the list price.`);
    }
  }

  const inr = (amount: number | null) => (amount == null ? null : { amount, currency: "INR" as const });
  const variants = rows.map((row) => {
    const prior = row.size
      ? existing?.variants.find((variant) => variant.options?.size === row.size)
      : existing?.variants[0];
    return {
      key: prior?.key ?? (row.size ? `v_${key}_${slugify(row.size)}` : `v_${key}`),
      sku: prior?.sku ?? undefined,
      options: row.size ? { size: row.size } : {},
      price: inr(row.price),
      salePrice: inr(row.sale),
      availability: STOCK.has(row.stock) ? row.stock : "available",
    };
  });

  const srcs = formData.getAll("imageSrc").map(String);
  const alts = formData.getAll("imageAlt").map(String);
  const roles = formData.getAll("imageRole").map(String);
  const images = srcs
    .map((src, index) => ({
      role: roles[index] || "macro",
      src: src.trim() || undefined,
      alt: alts[index]?.trim() || name,
      aspect: "1/1",
    }))
    .filter((image) => image.src);

  await ProductModel.findOneAndUpdate(
    { slug: existingSlug || slug },
    {
      $set: {
        key,
        slug,
        name,
        categorySlug,
        tags: formData.getAll("tags").map(String),
        newArrival: formData.get("isNew") === "on",
        isFeatured: formData.get("isFeatured") === "on",
        isSize,
        sizes,
        options: isSize ? [{ axis: "size", values: sizes }] : [],
        variants,
        images: images.length > 0 ? images : [{ role: "macro", aspect: "1/1", alt: name }],
        collections: formData.getAll("collections").map(String),
        materialLine: text(formData.get("materialLine")),
        description: text(formData.get("description")),
        care: text(formData.get("care")),
        seoTitle: text(formData.get("seoTitle")),
        seoDescription: text(formData.get("seoDescription")),
        isActive: formData.get("isActive") === "on",
      },
    },
    { upsert: true },
  );

  if (existing && existing.categorySlug !== categorySlug) {
    await CategoryModel.updateOne({ slug: existing.categorySlug }, { $pull: { productOrder: existing.slug } });
  }
  await CategoryModel.updateOne({ slug: categorySlug }, { $addToSet: { productOrder: slug } });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath(`/products/${slug}`);
  redirect(`/admin/products/${slug}?saved=1`);
}

export async function saveTag(formData: FormData) {
  await requireAdmin();
  await connectDb();
  const existing = String(formData.get("existingSlug") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "") || name);
  if (!name || !slug) return;
  await TagModel.findOneAndUpdate(
    { slug: existing || slug },
    {
      $set: {
        slug,
        name,
        seoTitle: text(formData.get("seoTitle")),
        seoDescription: text(formData.get("seoDescription")),
        isActive: formData.get("isActive") === "on",
      },
    },
    { upsert: true },
  );
  if (existing && existing !== slug) {
    // Keep product and category references pointing at the renamed tag.
    for (const model of [ProductModel, CategoryModel] as const) {
      await (model as typeof ProductModel).updateMany({ tags: existing }, { $set: { "tags.$": slug } });
    }
  }
  revalidatePath("/admin/tags");
  revalidatePath("/shop");
  redirect(`/admin/tags?slug=${slug}`);
}

export async function reorderCategoryProducts(slug: string, productOrder: string[]) {
  await requireAdmin();
  await connectDb();
  await CategoryModel.updateOne({ slug }, { $set: { productOrder } });
  revalidatePath("/shop");
  revalidatePath("/admin/categories");
}

export async function reorderCollectionProducts(slug: string, productOrder: string[]) {
  await requireAdmin();
  await connectDb();
  await CollectionModel.updateOne({ slug }, { $set: { productOrder } });
  revalidatePath(`/collections/${slug}`);
  revalidatePath("/admin/collections");
}

export async function deleteProduct(slug: string) {
  await requireAdmin();
  await connectDb();
  const product = await ProductModel.findOneAndDelete({ slug });
  if (!product) return;
  // Orders keep their own line snapshots; carts and quotes skip missing products.
  await Promise.all([
    CategoryModel.updateMany({}, { $pull: { productOrder: slug } }),
    CollectionModel.updateMany({}, { $pull: { productOrder: slug } }),
    ProductModel.updateMany({}, { $pull: { relatedSlugs: slug, componentSlugs: slug } }),
    CouponModel.updateMany({}, { $pull: { productSlugs: slug } }),
    PriceRuleModel.updateMany({}, { $pull: { productSlugs: slug } }),
  ]);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath(`/products/${slug}`);
}
