"use client";

import { useAuth } from "@clerk/nextjs";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { CartLineInput } from "@/lib/commerce/quote";
import { loadRemoteCart, mergeRemoteCart, saveRemoteCart } from "@/lib/actions/cart";

/**
 * The bag lives in localStorage and is read through useSyncExternalStore: the
 * server renders an empty bag, the client swaps in the stored one after
 * hydration without a mismatch, and other tabs stay in step via `storage`.
 */

const STORAGE = "shubha-bag";
/** Whose account bag the browser bag mirrors. See CartPersistence. */
const OWNER = "shubha-bag-owner";
const EMPTY: CartLineInput[] = [];

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedLines: CartLineInput[] = EMPTY;

function readStored(): CartLineInput[] {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE);
  } catch {
    return EMPTY;
  }
  // Same string, same array: useSyncExternalStore needs a stable snapshot.
  if (raw === cachedRaw) return cachedLines;
  cachedRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cachedLines = Array.isArray(parsed) ? (parsed as CartLineInput[]) : EMPTY;
  } catch {
    cachedLines = EMPTY;
  }
  return cachedLines;
}

function writeStored(next: CartLineInput[]) {
  try {
    window.localStorage.setItem(STORAGE, JSON.stringify(next));
  } catch {
    // Storage refused (private mode, quota): the bag stays as it was.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const noSubscribe = () => () => {};

function update(change: (current: CartLineInput[]) => CartLineInput[]) {
  writeStored(change(readStored()));
}

type CartContextValue = {
  /** False on the server and during hydration, when the bag is not yet known. */
  ready: boolean;
  lines: CartLineInput[];
  /** Total pieces across lines, for the header count. */
  count: number;
  add: (line: CartLineInput) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(subscribe, readStored, () => EMPTY);
  const ready = useSyncExternalStore(noSubscribe, () => true, () => false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const add = useCallback((line: CartLineInput) => {
    update((current) =>
      current.some((entry) => entry.variantId === line.variantId)
        ? current.map((entry) =>
            entry.variantId === line.variantId
              ? { ...entry, quantity: entry.quantity + line.quantity }
              : entry,
          )
        : [...current, line],
    );
  }, []);

  const setQuantity = useCallback((variantId: string, quantity: number) => {
    update((current) =>
      quantity < 1
        ? current.filter((entry) => entry.variantId !== variantId)
        : current.map((entry) => (entry.variantId === variantId ? { ...entry, quantity } : entry)),
    );
  }, []);

  const remove = useCallback((variantId: string) => {
    update((current) => current.filter((entry) => entry.variantId !== variantId));
  }, []);

  const clear = useCallback(() => writeStored([]), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const value = useMemo(
    () => ({
      ready,
      lines,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      add,
      setQuantity,
      remove,
      clear,
      drawerOpen,
      openDrawer,
      closeDrawer,
    }),
    [ready, lines, add, setQuantity, remove, clear, drawerOpen, openDrawer, closeDrawer],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? <CartPersistence lines={lines} /> : null}
    </CartContext.Provider>
  );
}

/**
 * Mirrors the browser bag to the signed-in account. Mounted only when Clerk is
 * configured, so useAuth always has its provider.
 *
 * The OWNER marker makes the merge happen once per sign-in: a new user merges
 * the local lines into their account bag; the same user on a later load reads
 * the account bag back (a second merge would double every quantity); signing
 * out clears the browser copy.
 */
function CartPersistence({ lines }: { lines: CartLineInput[] }) {
  const { isLoaded, userId } = useAuth();
  const [syncedFor, setSyncedFor] = useState<string | null>(null);
  const linesRef = useRef(lines);

  useEffect(() => {
    linesRef.current = lines;
  }, [lines]);

  useEffect(() => {
    if (!isLoaded) return;
    const owner = window.localStorage.getItem(OWNER);

    if (!userId) {
      if (owner) {
        window.localStorage.removeItem(OWNER);
        writeStored([]);
      }
      return;
    }

    let cancelled = false;
    const sync = owner === userId ? loadRemoteCart() : mergeRemoteCart(linesRef.current);
    sync
      .then((next) => {
        if (cancelled) return;
        window.localStorage.setItem(OWNER, userId);
        writeStored(next);
        setSyncedFor(userId);
      })
      .catch(() => {
        // Account sync failed: keep the browser bag; the next load retries.
      });
    return () => {
      cancelled = true;
    };
  }, [isLoaded, userId]);

  useEffect(() => {
    // The marker check stops a stale `syncedFor` from saving an empty bag over
    // the account bag when the same user signs back in before the merge lands.
    if (!userId || syncedFor !== userId) return;
    if (window.localStorage.getItem(OWNER) !== userId) return;
    void saveRemoteCart(lines);
  }, [lines, userId, syncedFor]);

  return null;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used within CartProvider");
  return value;
}
