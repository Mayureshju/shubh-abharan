"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { NavOverlay } from "@/components/nav/NavOverlay";
import { brand } from "@/lib/brand";

/**
 * Specimen-only trigger. SiteHeader exposes the overlay from a control that is
 * hidden at desktop widths; this makes the open state reviewable at any width.
 */
export function OverlayDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="quiet" onClick={() => setOpen(true)}>
        Open navigation overlay
      </Button>
      <NavOverlay
        open={open}
        onClose={() => setOpen(false)}
        collections={brand.collections}
        links={[
          { label: "Collections", href: "/collections" },
          { label: "Shop", href: "/shop" },
          { label: "About", href: "/about" },
        ]}
      />
    </>
  );
}
