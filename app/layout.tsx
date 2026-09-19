import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { brand, resolve } from "@/lib/brand";

/**
 * Two typefaces, two roles. Both self-hosted under the ITF Free Font License
 * v2.0, which permits self-hosting but prohibits subsetting and format
 * conversion — the woff2 files are used exactly as distributed.
 *
 * `adjustFontFallback` generates a metric-matched fallback so the swap to the
 * real face produces no layout shift. The fallback stack exists only for the
 * load-failure path, never for normal operation.
 */
const gambarino = localFont({
  src: "./fonts/Gambarino-Regular.woff2",
  variable: "--font-gambarino",
  display: "swap",
  weight: "400",
  style: "normal",
  adjustFontFallback: "Times New Roman",
  fallback: ["Iowan Old Style", "Georgia", "serif"],
});

const switzer = localFont({
  src: "./fonts/Switzer-Variable.woff2",
  variable: "--font-switzer",
  display: "swap",
  weight: "100 900",
  style: "normal",
  adjustFontFallback: "Arial",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
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
      className={`${gambarino.variable} ${switzer.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
