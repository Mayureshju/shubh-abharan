import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export type SessionUser = {
  id: string;
  fullName: string | null;
  primaryEmailAddress: { emailAddress?: string } | null;
  publicMetadata: Record<string, unknown>;
};

const LOCAL_DEV_USER: SessionUser = {
  id: "local-dev",
  fullName: "Local studio",
  primaryEmailAddress: { emailAddress: "studio@local" },
  publicMetadata: { role: "admin" },
};

export function clerkConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);
}

export function roleFromMetadata(metadata: Record<string, unknown> | undefined): "admin" | "customer" {
  return metadata?.role === "admin" ? "admin" : "customer";
}

export async function getSessionUser(): Promise<SessionUser | null> {
  if (!clerkConfigured()) {
    if (process.env.NODE_ENV === "production") return null;
    return LOCAL_DEV_USER;
  }
  const user = await currentUser();
  if (!user) return null;
  return {
    id: user.id,
    fullName: user.fullName,
    primaryEmailAddress: user.primaryEmailAddress,
    publicMetadata: user.publicMetadata as Record<string, unknown>,
  };
}

export async function requireCustomer() {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in");
  return user;
}

export async function isAdmin(): Promise<boolean> {
  const user = await getSessionUser();
  if (!user) return false;
  return roleFromMetadata(user.publicMetadata) === "admin";
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in");
  if (roleFromMetadata(user.publicMetadata) !== "admin") {
    redirect("/");
  }
  return user;
}
