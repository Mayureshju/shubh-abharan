"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { brand, isSupplied } from "@/lib/brand";
import { Button } from "@/components/ui/Button";
import { NavOverlay } from "./NavOverlay";

/**
 * Collection-led. Named collections are the primary axis; product type
 * (ring, necklace, earring) is a filter on /shop and is deliberately absent
 * from the top level — see the navigation requirement in
 * specs/design-system/core-components.
 *
 * Capped at five top-level items. Everything else is reached through the
 * overlay rather than listed at once.
 */

const TOP_LEVEL = [
  { label: "Collections", href: "/collections" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
] as const;

if (TOP_LEVEL.length > 5) {
  throw new Error("Primary navigation is capped at five top-level items.");
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Passive and read-only: the header observes scroll position, it never
    // intercepts or smooths scrolling.
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
          (scrolled ? "border-line py-3" : "border-transparent py-6")
        }
      >
        <div className="flex items-center justify-between gap-6 page-gutter">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center text-caption uppercase tracking-[0.18em]"
          >
            {isSupplied(brand.name) ? brand.name : "[BRAND NAME]"}
          </Link>

          {/* Desktop: inline. Mobile: everything moves into the overlay. */}
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-10">
              {TOP_LEVEL.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center text-caption uppercase hover:underline underline-offset-8"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <Button variant="inline" className="hidden md:inline-flex">
              Search
            </Button>
            <Button variant="inline" className="hidden md:inline-flex">
              Bag (0)
            </Button>
            <Button
              ref={menuButtonRef}
              variant="icon"
              className="md:hidden"
              aria-label="Open navigation"
              aria-expanded={navOpen}
              onClick={() => setNavOpen(true)}
            >
              <span aria-hidden="true">&#8801;</span>
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
