"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/lib/actions/admin-catalog";

export function DeleteProductButton({ slug, name, redirectTo }: { slug: string; name: string; redirectTo?: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      className="admin-btn admin-btn-sm admin-btn-danger"
      disabled={pending}
      aria-label={`Delete ${name}`}
      onClick={() => {
        if (!window.confirm(`Delete "${name}"? This cannot be undone. To hide it instead, turn off "Visible on store".`)) return;
        startTransition(async () => {
          await deleteProduct(slug);
          if (redirectTo) router.push(redirectTo);
          else router.refresh();
        });
      }}
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
