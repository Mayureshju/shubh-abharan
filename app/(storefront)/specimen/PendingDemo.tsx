"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Demonstrates that state changes are not blocked by animation and that a
 * pending control refuses repeat activation while keeping focus.
 */
export function PendingDemo() {
  const [count, setCount] = useState(0);
  const [pending, setPending] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button
        variant="primary"
        pending={pending}
        pendingLabel="Adding to bag"
        onClick={() => {
          setCount((value) => value + 1);
          setPending(true);
          window.setTimeout(() => setPending(false), 1200);
        }}
      >
        Add to bag
      </Button>
      <p className="text-caption uppercase text-muted" aria-live="polite">
        Bag ({count}) &mdash; increments on the first click; repeat clicks while
        pending are refused
      </p>
    </div>
  );
}
