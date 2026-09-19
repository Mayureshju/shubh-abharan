import Link from "next/link";
import { brand, isSupplied } from "@/lib/brand";

/**
 * Caption type throughout, separated by hairline rules. The newsletter is one
 * line, not a boxed card — there is no third surface to box it on.
 *
 * Policy links render only where the business has supplied that policy.
 * A missing policy omits its link rather than approximating one.
 */

const POLICY_LINKS = [
  { key: "shipping", label: "Shipping", href: "/shipping" },
  { key: "returns", label: "Returns", href: "/returns" },
  { key: "care", label: "Care", href: "/care" },
] as const;

export function SiteFooter() {
  const policies = POLICY_LINKS.filter((link) => isSupplied(brand.policies[link.key]));

  return (
    <footer data-surface="ink" className="mt-breath page-gutter pt-tight pb-tight">
      <div className="border-t border-line pt-tight">
        <div className="flex flex-col gap-tight md:flex-row md:justify-between">
          <div>
            <p className="text-caption uppercase tracking-[0.18em]">
              {isSupplied(brand.name) ? brand.name : "[BRAND NAME]"}
            </p>
            {isSupplied(brand.placeOfBusiness) ? (
              <p className="mt-2 text-caption uppercase text-muted">{brand.placeOfBusiness}</p>
            ) : null}
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-2">
            <Link href="/collections" className="inline-flex min-h-11 items-center text-caption uppercase hover:underline underline-offset-4">
              Collections
            </Link>
            <Link href="/shop" className="inline-flex min-h-11 items-center text-caption uppercase hover:underline underline-offset-4">
              Shop
            </Link>
            {policies.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="inline-flex min-h-11 items-center text-caption uppercase hover:underline underline-offset-4"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {isSupplied(brand.contactEmail) ? (
          <p className="mt-tight border-t border-line pt-6 text-caption uppercase text-muted">
            {brand.contactEmail}
          </p>
        ) : (
          <p className="mt-tight border-t border-line pt-6 text-caption uppercase text-muted">
            [CONTACT EMAIL] &mdash; unfilled, see BRAND-INPUTS.md
          </p>
        )}
      </div>
    </footer>
  );
}
