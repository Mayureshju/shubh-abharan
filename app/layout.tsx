import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { brand, resolve } from "@/lib/brand";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { CartProvider } from "@/components/cart/CartProvider";

/** Official Fontshare files, unsubsetted. Gambarino is Regular only. */
const gambarino = localFont({
  src: "./fonts/Gambarino-Regular.woff2",
  variable: "--font-gambarino",
  weight: "400",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

/** Switzer variable covers 100–900. Body uses 400, caption and prices use 500. */
const switzer = localFont({
  src: "./fonts/Switzer-Variable.woff2",
  variable: "--font-switzer",
  weight: "100 900",
  display: "swap",
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  title: resolve(brand.name, "brand name"),
  description: resolve(brand.legalName, "brand description"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-surface="paper"
      className={`${gambarino.variable} ${switzer.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <AuthProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
