import Link from "next/link";
import { brand, isSupplied, placeholder } from "@/lib/brand";
import type { Category } from "@/lib/catalog";

/**
 * Caption type throughout. Columns whose entries are all unsupplied do not
 * render. Social is omitted until URLs are supplied.
 */

const TYPES = [
  { category: "necklace", label: "Necklaces" },
  { category: "ring", label: "Rings" },
  { category: "bracelet", label: "Bracelets" },
  { category: "earring", label: "Earrings" },
  { category: "pendant", label: "Pendants" },
] as const satisfies readonly { category: Category; label: string }[];

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

const POLICY_LINKS = [
  { key: "shipping", label: "Shipping", href: "/shipping" },
  { key: "returns", label: "Returns", href: "/returns" },
  { key: "care", label: "Care", href: "/care" },
  { key: "warranty", label: "Repairs", href: "/warranty" },
] as const;

function Column({
  heading,
  links,
}: {
  heading: string;
  links: readonly { label: string; href: string }[];
}) {
  if (links.length === 0) return null;

  return (
    <div>
      <h2 className="text-caption text-gold">{heading}</h2>
      <ul className="mt-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex min-h-11 items-center text-caption hover:text-gold"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const policies = POLICY_LINKS.filter((link) => isSupplied(brand.policies[link.key]));

  return (
    <footer data-surface="ink" className="mt-breath pt-tight pb-tight">
      <div className="page-gutter border-t border-line pt-tight">
        <div className="grid gap-tight md:grid-cols-2 md:gap-x-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="flex items-center gap-2 font-display text-title text-gold">
              {isSupplied(brand.wordmarkSrc) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={brand.wordmarkSrc} alt="" width={36} height={36} className="size-9" />
              ) : null}
              {isSupplied(brand.name) ? brand.name : placeholder("brand name")}
            </p>

            {isSupplied(brand.footerStatement) ? (
              <p className="mt-3 text-caption text-muted">{brand.footerStatement}</p>
            ) : null}
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-tight md:col-span-2 md:grid-cols-3 md:gap-x-8 lg:col-span-7 lg:col-start-6"
          >
            <Column heading="Quick Links" links={QUICK_LINKS} />
            <Column
              heading="Categories"
              links={TYPES.map((type) => ({
                label: type.label,
                href: `/shop?category=${type.category}`,
              }))}
            />
            {policies.length > 0 ? <Column heading="Legal" links={policies} /> : null}
          </nav>
        </div>

        <div className="mt-tight flex flex-col gap-2 border-t border-line pt-6 text-caption text-muted md:flex-row md:justify-between">
          <p>
            {isSupplied(brand.contactEmail)
              ? brand.contactEmail
              : `${placeholder("contact email")} — unfilled, see BRAND-INPUTS.md`}
          </p>
        </div>
      </div>
    </footer>
  );
}
