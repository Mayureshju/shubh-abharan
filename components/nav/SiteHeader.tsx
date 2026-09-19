"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { brand, isSupplied } from "@/lib/brand";
import { Button } from "@/components/ui/Button";
import { buttonClass } from "@/components/ui/buttonClass";
import { BagIcon, MenuIcon, SearchIcon, WishlistIcon } from "@/components/ui/icons";
import { NavOverlay } from "./NavOverlay";

/**
 * Destination-led, capped at five. Collections live in the footer.
 * Utility icons are separate and do not count against the cap.
 */

const TOP_LEVEL = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/types" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

const UTILITY = [
  { label: "Search", href: "/search", Icon: SearchIcon },
  { label: "Wishlist", href: "/wishlist", Icon: WishlistIcon },
  { label: "Bag", href: "/cart", Icon: BagIcon },
] as const;

if (TOP_LEVEL.length > 5) {
  throw new Error("Primary navigation is capped at five top-level items.");
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        frame = 0;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <header
        data-scrolled={scrolled || undefined}
        className={
          "sticky top-0 z-10 bg-surface text-on-surface " +
          "transition-[padding,border-color] duration-[var(--duration-quick)] ease-[var(--ease-out)] " +
          "border-b " +
          (scrolled ? "border-line py-3" : "border-transparent py-5")
        }
      >
        <div className="page-gutter grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 lg:grid-cols-[1fr_auto_1fr]">
          <Link href="/" className="inline-flex min-h-11 items-center gap-2">
            {isSupplied(brand.wordmarkSrc) ? (
              // Decorative: the adjacent name is the accessible label.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brand.wordmarkSrc} alt="" width={36} height={36} className="size-9" />
            ) : null}
            <span className="font-display text-body">
              {isSupplied(brand.name) ? brand.name : "[BRAND NAME]"}
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {TOP_LEVEL.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center text-caption hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-1">
            {UTILITY.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className={buttonClass("icon")}
              >
                <item.Icon />
              </Link>
            ))}
            <Button
              ref={menuButtonRef}
              variant="icon"
              className="lg:hidden"
              aria-label="Open navigation"
              aria-expanded={navOpen}
              onClick={() => setNavOpen(true)}
            >
              <MenuIcon />
            </Button>
          </div>
        </div>
      </header>

      <NavOverlay
        open={navOpen}
        onClose={() => setNavOpen(false)}
        collections={brand.collections}
        links={TOP_LEVEL}
      />
    </>
  );
}
