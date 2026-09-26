"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CloseIcon } from "@/components/ui/icons";
import { ModalDialog } from "@/components/ui/ModalDialog";
import { ShopFilters } from "./ShopFilters";
import { shopQueryKey, type ShopSearch } from "./query";

/**
 * Mobile entry to the shop GET form. The form itself is identical to the
 * desktop aside; this island only opens and closes the sheet.
 */

export function FilterSheet({
  query,
  categories,
  tags = [],
}: {
  query: ShopSearch;
  categories: readonly { slug: string; name: string }[];
  tags?: readonly { slug: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button variant="quiet" onClick={() => setOpen(true)}>
        Filter
      </Button>
      <ModalDialog open={open} onClose={() => setOpen(false)} label="Filters" placement="sheet">
        <div className="flex items-start justify-between">
          <p className="text-caption uppercase text-muted">Filters</p>
          <Button variant="icon" onClick={() => setOpen(false)} aria-label="Close filters">
            <CloseIcon />
          </Button>
        </div>
        <div className="mt-5 min-h-0 flex-1 overflow-y-auto">
          <ShopFilters
            key={shopQueryKey(query)}
            query={query}
            idPrefix="sheet"
            categories={categories}
            tags={tags}
          />
        </div>
      </ModalDialog>
    </div>
  );
}
