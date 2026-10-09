"use client";

import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { BagIcon } from "@/components/ui/icons";
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
        {/* Text link from 640px; below that it would push the menu button off a 390px
            header, so phones reach Orders from the avatar menu. */}
        <Link
          href="/account/orders"
          className="hidden min-h-11 items-center text-caption uppercase sm:inline-flex"
        >
          Orders
        </Link>
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Link
              label="Orders"
              href="/account/orders"
              labelIcon={
                <span className="inline-flex size-4 [&>svg]:size-4">
                  <BagIcon />
                </span>
              }
            />
          </UserButton.MenuItems>
        </UserButton>
      </Show>
    </span>
  );
}
