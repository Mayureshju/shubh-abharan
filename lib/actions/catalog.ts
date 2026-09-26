"use server";

import { getProductById, getProductsByIds } from "@/lib/catalog";
import type { ProductId } from "@/lib/catalog/types";
import { toPlain } from "@/lib/plain";

export async function fetchProduct(id: string) {
  const product = await getProductById(id as ProductId);
  return product ? toPlain(product) : null;
}

export async function fetchProducts(ids: string[]) {
  return toPlain(await getProductsByIds(ids as ProductId[]));
}
