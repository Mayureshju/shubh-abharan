"use server";

import { quoteCart, type CartLineInput } from "@/lib/commerce/quote";

export async function previewQuote(lines: CartLineInput[], couponCode?: string, pincode?: string) {
  return quoteCart(lines, { couponCode, pincode });
}
