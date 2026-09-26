"use client";

import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { clerkConfigured } from "./configured";

export function AccountControl({ overlay }: { overlay?: boolean }) {
  if (!clerkConfigured()) {
    return (
      <Link
        href="/account/orders"
        className={
          "inline-flex min-h-11 items-center text-caption uppercase " +
          (overlay ? "text-paper" : "")
        }
      >
        Orders
      </Link>
    );
  }
  return (
    <span className={overlay ? "text-paper" : undefined}>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button type="button" className="inline-flex min-h-11 items-center text-caption uppercase">
            Sign in
          </button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </span>
  );
}
