import { SiteHeader } from "@/components/nav/SiteHeader";
import { SiteFooter } from "@/components/nav/SiteFooter";
import { CartDrawer } from "@/components/cart/CartDrawer";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="min-w-0 flex-1">
        {children}
      </main>
      <SiteFooter />
      <CartDrawer />
    </>
  );
}
