import { SignIn } from "@clerk/nextjs";
import { clerkConfigured } from "@/lib/auth/roles";

export default function SignInPage() {
  if (!clerkConfigured()) {
    return (
      <section className="page-gutter py-tight">
        <h1 className="text-title">Sign in</h1>
        <p className="mt-4 text-body text-muted">Clerk keys are not configured.</p>
      </section>
    );
  }
  return (
    <section className="page-gutter py-tight">
      <SignIn />
    </section>
  );
}
