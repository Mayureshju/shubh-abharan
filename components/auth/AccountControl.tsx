"use client";

import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { BagIcon } from "@/components/ui/icons";
import { clerkConfigured } from "./configured";

export function AccountControl({
  overlay,
  placement = "header",
}: {
  overlay?: boolean;
  /** Menu copy is the phone path; the header copy is hidden below 640px. */
  placement?: "header" | "menu";
}) {
  const signInClass =
    placement === "menu"
      ? "inline-flex min-h-11 items-center text-caption uppercase"
      : "hidden min-h-11 items-center text-caption uppercase sm:inline-flex";

  if (!clerkConfigured()) {
    return (
      <Link
        href="/account/orders"
        className={
          "min-h-11 items-center text-caption uppercase " +
          (placement === "header" ? "hidden sm:inline-flex" : "inline-flex") +
          (overlay ? " text-paper" : "")
        }
      >
        Orders
      </Link>
    );
  }
  return (
    <span className={"inline-flex items-center gap-3" + (overlay ? " text-paper" : "")}>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button type="button" className={signInClass}>
            Sign in
          </button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        {/* Text link from 640px in the header. Below that it would push the
            menu button off a 390px bar, so phones reach Orders from the menu. */}
        <Link
          href="/account/orders"
          className={
            placement === "menu"
              ? "inline-flex min-h-11 items-center text-caption uppercase"
              : "hidden min-h-11 items-center text-caption uppercase sm:inline-flex"
          }
        >
          Orders
        </Link>
        {placement === "header" ? (
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
        ) : null}
      </Show>
    </span>
  );
}
