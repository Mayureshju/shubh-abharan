import { connectDb } from "@/lib/db/connect";
import {
  CouponModel,
  DeliveryAreaModel,
  ProductModel,
  SettingsModel,
  type CouponDoc,
  type ProductDoc,
} from "@/lib/db/models";
import { mapProduct } from "@/lib/catalog/mapDoc";
import { resolveVariantPrice, type HikeRule } from "@/lib/pricing/resolve";
import { PriceRuleModel, type PriceRuleDoc } from "@/lib/db/models";
import type { Money, Product } from "@/lib/catalog/types";
import { toPlain } from "@/lib/plain";

export type CartLineInput = {
  readonly productId: string;
  readonly variantId: string;
  readonly quantity: number;
};

export type QuotedLine = {
  readonly productId: string;
  readonly variantId: string;
  readonly slug: string;
  readonly name: string;
  readonly sizeLabel: string | null;
  readonly imageSrc: string | null;
  readonly quantity: number;
  readonly unitPayable: Money;
  readonly lineTotal: number;
  readonly eligible: boolean;
};

export type QuoteResult = {
  readonly ok: boolean;
  readonly error: string | null;
  readonly lines: readonly QuotedLine[];
  readonly subtotal: number;
  readonly discount: number;
  readonly shipping: number;
  readonly shippingWaived: boolean;
  readonly total: number;
  readonly currency: "INR";
  readonly couponCode: string | null;
  readonly deliveryAreaName: string | null;
  readonly codEnabled: boolean;
};

function toHike(doc: PriceRuleDoc): HikeRule {
  return {
    type: doc.type as HikeRule["type"],
    value: doc.value,
    startsAt: doc.startsAt,
    endsAt: doc.endsAt,
    isActive: doc.isActive,
    scope: doc.scope as HikeRule["scope"],
    categorySlugs: doc.categorySlugs ?? [],
    productSlugs: doc.productSlugs ?? [],
    excludeOnSale: doc.excludeOnSale,
  };
}

function couponApplies(coupon: CouponDoc, product: Product): boolean {
  const products = coupon.productSlugs ?? [];
  const categories = coupon.categorySlugs ?? [];
  if (products.length === 0 && categories.length === 0) return true;
  if (products.includes(product.slug)) return true;
  if (categories.includes(product.category)) return true;
  return false;
}

export async function quoteCart(
  lines: readonly CartLineInput[],
  options: { couponCode?: string; pincode?: string; clerkUserId?: string } = {},
): Promise<QuoteResult> {
  await connectDb();
  const settings = await SettingsModel.findOne({ key: "store" }).lean();
  const codEnabled = settings?.codEnabled !== false;
  if (lines.length === 0) {
    return finish({
      ok: false,
      error: "Bag is empty.",
      lines: [],
      subtotal: 0,
      discount: 0,
      shipping: 0,
      shippingWaived: false,
      total: 0,
      currency: "INR",
      couponCode: null,
      deliveryAreaName: null,
      codEnabled,
    });
  }

  const now = new Date();
  const ruleDocs = await PriceRuleModel.find({
    isActive: true,
    startsAt: { $lte: now },
    endsAt: { $gte: now },
  }).lean();
  const rules = ruleDocs.map((doc) => toHike(doc as PriceRuleDoc));

  const quoted: QuotedLine[] = [];
  for (const line of lines) {
    const doc = await ProductModel.findOne({ key: line.productId, isActive: true }).lean();
    if (!doc) {
      return emptyError("A piece in the bag is no longer listed.", codEnabled);
    }
    const product = mapProduct(doc as ProductDoc, rules, now);
    const variant = product.variants.find((entry) => entry.id === line.variantId);
    if (!variant) {
      return emptyError("A selected size is no longer offered.", codEnabled);
    }
    const payable = variant.payablePrice ?? variant.price;
    if (!payable) {
      return emptyError(`${product.name} has no price.`, codEnabled);
    }
    const quantity = Math.max(1, Math.floor(line.quantity));
    quoted.push({
      productId: String(product.id),
      variantId: String(variant.id),
      slug: product.slug,
      name: product.name,
      sizeLabel: variant.options.size ?? null,
      imageSrc: product.images[0]?.src ?? null,
      quantity,
      unitPayable: { amount: payable.amount, currency: payable.currency },
      lineTotal: payable.amount * quantity,
      eligible: true,
    });
  }

  let subtotal = quoted.reduce((sum, line) => sum + line.lineTotal, 0);
  let discount = 0;
  let couponCode: string | null = null;

  if (options.couponCode) {
    const coupon = await CouponModel.findOne({
      code: options.couponCode.trim().toUpperCase(),
    }).lean();
    if (!coupon || !coupon.isActive) {
      return fail("That code is not valid.", quoted, subtotal, codEnabled);
    }
    if (coupon.startsAt && now < coupon.startsAt) {
      return fail("That code is not active yet.", quoted, subtotal, codEnabled);
    }
    if (coupon.endsAt && now > coupon.endsAt) {
      return fail("That code has ended.", quoted, subtotal, codEnabled);
    }
    if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
      return fail("That code has reached its limit.", quoted, subtotal, codEnabled);
    }
    if (coupon.minSubtotal != null && subtotal < coupon.minSubtotal) {
      return fail("The bag does not meet this code's minimum.", quoted, subtotal, codEnabled);
    }

    const productDocs = await ProductModel.find({
      key: { $in: quoted.map((line) => line.productId) },
    }).lean();
    const products = productDocs.map((doc) => mapProduct(doc as ProductDoc, rules, now));

    let eligible = 0;
    const marked = quoted.map((line) => {
      const product = products.find((entry) => entry.id === line.productId);
      const applies = product ? couponApplies(coupon as CouponDoc, product) : false;
      if (applies) eligible += line.lineTotal;
      return { ...line, eligible: applies };
    });

    if (coupon.type === "percent") {
      discount = Math.round(eligible * (coupon.value / 100));
    } else if (coupon.type === "fixed") {
      discount = Math.min(coupon.value, eligible);
    }
    couponCode = coupon.code;
    quoted.splice(0, quoted.length, ...marked);
  }

  const afterDiscount = Math.max(0, subtotal - discount);
  let shipping = 0;
  let shippingWaived = false;
  let deliveryAreaName: string | null = null;

  const pin = options.pincode?.trim();
  if (pin) {
    const area = await DeliveryAreaModel.findOne({
      isActive: true,
      pincodes: pin,
    }).lean();
    if (!area) {
      return finish({
        ok: false,
        error: "This pincode is not in a served delivery area.",
        lines: quoted,
        subtotal,
        discount,
        shipping: 0,
        shippingWaived: false,
        total: afterDiscount,
        currency: "INR",
        couponCode,
        deliveryAreaName: null,
        codEnabled,
      });
    }
    deliveryAreaName = area.name;
    shipping = area.charge.amount;
    const threshold = settings?.freeDeliveryMin ?? null;
    const freeShippingCoupon = couponCode
      ? await CouponModel.findOne({ code: couponCode, type: "free_shipping", isActive: true }).lean()
      : null;
    if (freeShippingCoupon || (threshold != null && afterDiscount >= threshold)) {
      shipping = 0;
      shippingWaived = true;
    }
  }

  return finish({
    ok: true,
    error: null,
    lines: quoted,
    subtotal,
    discount,
    shipping,
    shippingWaived,
    total: afterDiscount + shipping,
    currency: "INR",
    couponCode,
    deliveryAreaName,
    codEnabled,
  });
}

function fail(error: string, lines: QuotedLine[], subtotal: number, codEnabled: boolean): QuoteResult {
  return finish({
    ok: false,
    error,
    lines,
    subtotal,
    discount: 0,
    shipping: 0,
    shippingWaived: false,
    total: subtotal,
    currency: "INR",
    couponCode: null,
    deliveryAreaName: null,
    codEnabled,
  });
}

function emptyError(error: string, codEnabled: boolean): QuoteResult {
  return fail(error, [], 0, codEnabled);
}

function finish(quote: QuoteResult): QuoteResult {
  return toPlain(quote);
}
