"use server";

import { connectDb } from "@/lib/db/connect";
import { CartModel, WishlistModel } from "@/lib/db/models";
import { getSessionUser } from "@/lib/auth/roles";
import type { CartLineInput } from "@/lib/commerce/quote";
import { toPlain } from "@/lib/plain";

function mergeLines(current: CartLineInput[], incoming: CartLineInput[]): CartLineInput[] {
  const map = new Map<string, CartLineInput>();
  for (const line of [...current, ...incoming]) {
    const existing = map.get(line.variantId);
    if (existing) {
      map.set(line.variantId, { ...existing, quantity: existing.quantity + line.quantity });
    } else {
      map.set(line.variantId, { productId: line.productId, variantId: line.variantId, quantity: line.quantity });
    }
  }
  return [...map.values()];
}

export async function loadRemoteCart(): Promise<CartLineInput[]> {
  const user = await getSessionUser();
  if (!user) return [];
  await connectDb();
  const cart = await CartModel.findOne({ clerkUserId: user.id }).lean();
  return toPlain(
    (cart?.lines ?? []).map((line) => ({
      productId: line.productId,
      variantId: line.variantId,
      quantity: line.quantity,
    })),
  );
}

export async function saveRemoteCart(lines: CartLineInput[]) {
  const user = await getSessionUser();
  if (!user) return;
  await connectDb();
  await CartModel.findOneAndUpdate(
    { clerkUserId: user.id },
    { $set: { clerkUserId: user.id, lines } },
    { upsert: true },
  );
}

export async function mergeRemoteCart(local: CartLineInput[]): Promise<CartLineInput[]> {
  const user = await getSessionUser();
  if (!user) return local;
  await connectDb();
  const cart = await CartModel.findOne({ clerkUserId: user.id });
  const merged = mergeLines(
    (cart?.lines ?? []).map((line) => ({
      productId: line.productId,
      variantId: line.variantId,
      quantity: line.quantity,
    })),
    local,
  );
  await CartModel.findOneAndUpdate(
    { clerkUserId: user.id },
    { $set: { clerkUserId: user.id, lines: merged } },
    { upsert: true },
  );
  return toPlain(merged);
}

export async function loadRemoteWishlist() {
  const user = await getSessionUser();
  if (!user) return [];
  await connectDb();
  const list = await WishlistModel.findOne({ clerkUserId: user.id }).lean();
  return toPlain(list?.entries ?? []);
}

export async function saveRemoteWishlist(entries: { productId: string; variantId?: string }[]) {
  const user = await getSessionUser();
  if (!user) return;
  await connectDb();
  await WishlistModel.findOneAndUpdate(
    { clerkUserId: user.id },
    { $set: { clerkUserId: user.id, entries } },
    { upsert: true },
  );
}
