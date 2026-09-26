"use server";

import { revalidatePath } from "next/cache";
import { connectDb } from "@/lib/db/connect";
import { CouponModel, DeliveryAreaModel, PriceRuleModel, SettingsModel } from "@/lib/db/models";
import { requireAdmin } from "@/lib/auth/roles";

function num(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function list(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string") return [];
  return value
    .split(/[\n,]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export async function saveCoupon(formData: FormData) {
  await requireAdmin();
  await connectDb();
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  if (!code) return;
  const type = String(formData.get("type") ?? "percent");
  const rawValue = num(formData.get("value")) ?? 0;
  await CouponModel.findOneAndUpdate(
    { code },
    {
      $set: {
        code,
        type,
        value: type === "fixed" ? Math.round(rawValue * 100) : rawValue,
        minSubtotal: rupeesToPaise(formData.get("minSubtotal")),
        startsAt: dateOrNull(formData.get("startsAt")),
        endsAt: dateOrNull(formData.get("endsAt")),
        usageLimit: num(formData.get("usageLimit")),
        perUserLimit: num(formData.get("perUserLimit")),
        productSlugs: list(formData.get("productSlugs")),
        categorySlugs: list(formData.get("categorySlugs")),
        isActive: formData.get("isActive") !== "false",
      },
    },
    { upsert: true },
  );
  revalidatePath("/admin/coupons");
  return;
}

export async function savePriceRule(formData: FormData) {
  await requireAdmin();
  await connectDb();
  const id = String(formData.get("id") ?? "");
  const rawScope = String(formData.get("scope") ?? "all");
  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    type: formData.get("type") === "fixed_hike" ? ("fixed_hike" as const) : ("percent_hike" as const),
    value:
      String(formData.get("type") ?? "percent_hike") === "fixed_hike"
        ? Math.round((num(formData.get("value")) ?? 0) * 100)
        : (num(formData.get("value")) ?? 0),
    startsAt: dateOrNull(formData.get("startsAt")) ?? new Date(),
    endsAt: dateOrNull(formData.get("endsAt")) ?? new Date(),
    scope: (rawScope === "categories" || rawScope === "products" ? rawScope : "all") as "all" | "categories" | "products",
    categorySlugs: list(formData.get("categorySlugs")),
    productSlugs: list(formData.get("productSlugs")),
    excludeOnSale: formData.get("excludeOnSale") === "on",
    isActive: formData.get("isActive") !== "false",
  };
  if (!payload.name) return;
  if (id) await PriceRuleModel.findByIdAndUpdate(id, { $set: payload });
  else await PriceRuleModel.create(payload);
  revalidatePath("/admin/price-rules");
  return;
}

export async function saveDeliveryArea(formData: FormData) {
  await requireAdmin();
  await connectDb();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const charge = rupeesToPaise(formData.get("charge")) ?? 0;
  const payload = {
    name,
    pincodes: list(formData.get("pincodes")),
    charge: { amount: charge, currency: "INR" },
    isActive: formData.get("isActive") !== "false",
  };
  if (!name) return;
  if (id) await DeliveryAreaModel.findByIdAndUpdate(id, { $set: payload });
  else await DeliveryAreaModel.create(payload);
  revalidatePath("/admin/delivery");
  return;
}

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  await connectDb();
  await SettingsModel.findOneAndUpdate(
    { key: "store" },
    {
      $set: {
        key: "store",
        freeDeliveryMin: rupeesToPaise(formData.get("freeDeliveryMin")),
        codEnabled: formData.get("codEnabled") === "on",
        currency: "INR",
      },
    },
    { upsert: true },
  );
  revalidatePath("/admin/settings");
  revalidatePath("/admin/delivery");
  return;
}

function dateOrNull(value: FormDataEntryValue | null): Date | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function rupeesToPaise(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const rupees = Number(value);
  if (!Number.isFinite(rupees)) return null;
  return Math.round(rupees * 100);
}
