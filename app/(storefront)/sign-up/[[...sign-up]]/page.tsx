import { SignUp } from "@clerk/nextjs";
import { clerkConfigured } from "@/lib/auth/roles";

export default function SignUpPage() {
  if (!clerkConfigured()) {
    return (
      <section className="page-gutter py-tight">
        <h1 className="text-title">Create account</h1>
        <p className="mt-4 text-body text-muted">Clerk keys are not configured.</p>
      </section>
    );
  }
  return (
    <section className="page-gutter py-tight">
      <SignUp />
    </section>
  );
}
