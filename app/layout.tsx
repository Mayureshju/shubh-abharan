import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { brand, resolve } from "@/lib/brand";
import { SiteHeader } from "@/components/nav/SiteHeader";
import { SiteFooter } from "@/components/nav/SiteFooter";

/**
 * Two typefaces, two roles, named by the mood board. Loaded through
 * `next/font/google` so the files are self-hosted at build time.
 */
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

/**
 * Brand values come from lib/brand.ts and are unfilled until the business
 * supplies them — see BRAND-INPUTS.md. An unfilled value renders as a marked
 * placeholder rather than an invented default.
 */
export const metadata: Metadata = {
  title: resolve(brand.name, "brand name"),
  description: resolve(brand.legalName, "brand description"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-surface="paper"
      className={`${playfair.variable} ${montserrat.variable} h-full`}
    >
      {/*
        The shell is mounted once here, not per route: header, one main
        landmark, footer. A route contributes only its own content, and never
        its own header, footer or second main — see
        specs/storefront/app-shell. This layout stays a server component; the
        header is a client component rendered as a child of it.
      */}
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
