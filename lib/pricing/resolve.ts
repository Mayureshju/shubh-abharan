import type { Money } from "@/lib/catalog/types";

export type HikeRule = {
  readonly type: "percent_hike" | "fixed_hike";
  readonly value: number;
  readonly startsAt: Date;
  readonly endsAt: Date;
  readonly isActive: boolean;
  readonly scope: "all" | "categories" | "products";
  readonly categorySlugs: readonly string[];
  readonly productSlugs: readonly string[];
  readonly excludeOnSale: boolean;
};

export type ResolvedPrice = {
  readonly payable: Money | null;
  readonly compare: Money | null;
};

function inWindow(rule: HikeRule, at: Date): boolean {
  return at >= rule.startsAt && at <= rule.endsAt;
}

function inScope(rule: HikeRule, productSlug: string, categorySlug: string): boolean {
  if (rule.scope === "all") return true;
  if (rule.scope === "categories") return rule.categorySlugs.includes(categorySlug);
  return rule.productSlugs.includes(productSlug);
}

export function hikedListPrice(
  list: Money,
  sale: Money | null | undefined,
  rules: readonly HikeRule[],
  productSlug: string,
  categorySlug: string,
  at: Date,
): Money {
  let amount = list.amount;
  for (const rule of rules) {
    if (!rule.isActive || !inWindow(rule, at) || !inScope(rule, productSlug, categorySlug)) continue;
    if (rule.excludeOnSale && sale != null) continue;
    if (rule.type === "percent_hike") {
      amount = Math.round(amount * (1 + rule.value / 100));
    } else {
      amount += rule.value;
    }
  }
  return { amount, currency: list.currency };
}

export function resolveVariantPrice(
  list: Money | null | undefined,
  sale: Money | null | undefined,
  rules: readonly HikeRule[],
  productSlug: string,
  categorySlug: string,
  at: Date = new Date(),
): ResolvedPrice {
  if (list == null) return { payable: null, compare: null };
  const hiked = hikedListPrice(list, sale ?? null, rules, productSlug, categorySlug, at);
  if (sale != null && sale.amount < hiked.amount) {
    return { payable: { amount: sale.amount, currency: sale.currency }, compare: hiked };
  }
  return { payable: hiked, compare: null };
}
