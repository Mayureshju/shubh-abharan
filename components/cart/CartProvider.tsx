"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLineInput } from "@/lib/commerce/quote";
import { loadRemoteCart, mergeRemoteCart, saveRemoteCart } from "@/lib/actions/cart";

const STORAGE = "shubha-bag";

type CartContextValue = {
  lines: CartLineInput[];
  add: (line: CartLineInput) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readLocal(): CartLineInput[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLineInput[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLineInput[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLines(readLocal());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE, JSON.stringify(lines));
  }, [lines, ready]);

  const add = useCallback((line: CartLineInput) => {
    setLines((current) => {
      const existing = current.find((entry) => entry.variantId === line.variantId);
      if (existing) {
        return current.map((entry) =>
          entry.variantId === line.variantId
            ? { ...entry, quantity: entry.quantity + line.quantity }
            : entry,
        );
      }
      return [...current, line];
    });
  }, []);

  const setQuantity = useCallback((variantId: string, quantity: number) => {
    setLines((current) =>
      quantity < 1
        ? current.filter((entry) => entry.variantId !== variantId)
        : current.map((entry) => (entry.variantId === variantId ? { ...entry, quantity } : entry)),
    );
  }, []);

  const remove = useCallback((variantId: string) => {
    setLines((current) => current.filter((entry) => entry.variantId !== variantId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(
    () => ({ lines, add, setQuantity, remove, clear }),
    [lines, add, setQuantity, remove, clear],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      {ready ? <CartPersistence lines={lines} setLines={setLines} /> : null}
    </CartContext.Provider>
  );
}

function CartPersistence({
  lines,
  setLines,
}: {
  lines: CartLineInput[];
  setLines: (lines: CartLineInput[]) => void;
}) {
  const [synced, setSynced] = useState(false);
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  useEffect(() => {
    if (!key || synced) return;
    let cancelled = false;
    const already = sessionStorage.getItem("bag-merged") === "1";
    (async () => {
      const next = already ? await loadRemoteCart() : await mergeRemoteCart(lines);
      if (!cancelled) {
        if (next.length > 0 || already) setLines(next.length > 0 ? next : lines);
        sessionStorage.setItem("bag-merged", "1");
        setSynced(true);
      }
    })().catch(() => setSynced(true));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!key || !synced) return;
    void saveRemoteCart(lines);
  }, [key, lines, synced]);

  return null;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used within CartProvider");
  return value;
}
