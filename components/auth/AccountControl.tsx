"use client";

import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { clerkConfigured } from "./configured";

const ORDERS_LINK = "inline-flex min-h-11 items-center text-caption uppercase";

export function AccountControl({ overlay }: { overlay?: boolean }) {
  if (!clerkConfigured()) {
    return (
      <Link href="/account/orders" className={ORDERS_LINK + (overlay ? " text-paper" : "")}>
        Orders
      </Link>
    );
  }
  return (
    <span className={"inline-flex items-center gap-3" + (overlay ? " text-paper" : "")}>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button type="button" className="inline-flex min-h-11 items-center text-caption uppercase">
            Sign in
          </button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <Link href="/account/orders" className={ORDERS_LINK}>
          Orders
        </Link>
        <UserButton />
      </Show>
    </span>
  );
}
