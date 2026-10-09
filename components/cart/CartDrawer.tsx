"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { BagLines } from "@/components/cart/BagLines";
import { useBagQuote } from "@/components/cart/useBagQuote";
import { Button } from "@/components/ui/Button";
import { buttonClass } from "@/components/ui/buttonClass";
import { CloseIcon } from "@/components/ui/icons";
import { ModalDialog } from "@/components/ui/ModalDialog";
import { formatMoney } from "@/lib/catalog/money";
import type { CartLineInput } from "@/lib/commerce/quote";

const NONE: CartLineInput[] = [];

/**
 * The bag, opened over the page after Add to bag. The bag has already
 * changed when this opens — the drawer only presents it (motion-language:
 * state changes are never blocked by animation).
 */
export function CartDrawer() {
  const { lines, count, setQuantity, remove, drawerOpen, closeDrawer } = useCart();
  // Priced only while open; a closed drawer costs no server call.
  const { quote } = useBagQuote(drawerOpen ? lines : NONE);

  return (
    <ModalDialog open={drawerOpen} onClose={closeDrawer} label="Bag" placement="drawer">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-title">
          Bag{count > 0 ? <span className="ml-2 text-body text-muted">({count})</span> : null}
        </h2>
        <Button variant="icon" aria-label="Close bag" onClick={closeDrawer}>
          <CloseIcon />
        </Button>
      </div>

      {lines.length === 0 ? (
        <p className="mt-6 text-body text-muted">
          The bag is empty.{" "}
          <Link href="/shop" className={buttonClass("inline")} onClick={closeDrawer}>
            Continue shopping
          </Link>
        </p>
      ) : (
        <>
          <div className="-mx-1 mt-4 min-h-0 flex-1 overflow-y-auto px-1">
            <BagLines
              lines={lines}
              quote={quote}
              onQuantity={setQuantity}
              onRemove={remove}
              onNavigate={closeDrawer}
              compact
            />
          </div>

          <div className="pt-5">
            {quote?.error ? <p className="mb-3 text-body text-muted">{quote.error}</p> : null}
            <dl className="flex items-baseline justify-between text-body">
              <dt>Subtotal</dt>
              <dd>{quote?.ok ? formatMoney({ amount: quote.subtotal, currency: "INR" }) : "—"}</dd>
            </dl>
            <p className="mt-1 text-caption text-muted">Delivery and codes are applied at checkout.</p>
            <p className="mt-4">
              <Link href="/checkout" className={`${buttonClass("primary")} w-full`} onClick={closeDrawer}>
                Checkout
              </Link>
            </p>
            <p className="mt-2 text-center">
              <Link href="/cart" className={buttonClass("inline")} onClick={closeDrawer}>
                View bag
              </Link>
            </p>
          </div>
        </>
      )}
    </ModalDialog>
  );
}
