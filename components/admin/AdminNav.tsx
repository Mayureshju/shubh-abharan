"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Simple outline icons, admin only (the storefront keeps its own icon set).
const ICONS: Record<string, string> = {
  dashboard: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  orders: "M6 7h12l-1 13H7L6 7zM9 7a3 3 0 0 1 6 0",
  products: "M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM4 7.5l8 4.5 8-4.5M12 12v9",
  categories: "M3 6h7l2 2h9v11H3z",
  collections: "M4 5h16v4H4zM6 9v10h12V9M10 13h4",
  coupons: "M3 12V4h8l10 10-8 8L3 12zM7.5 8.5h.01",
  priceRules: "M4 18l6-6 4 4 6-8M16 8h4v4",
  delivery: "M2 6h12v10H2zM14 10h4l3 3v3h-7M6 19a2 2 0 1 0 0-.01M17 19a2 2 0 1 0 0-.01",
  reports: "M5 20V10M12 20V4M19 20v-7",
  tags: "M4 9h16M4 15h16M10 3L8 21M16 3l-2 18",
};

type NavLink = readonly [label: string, href: string, icon: string];

export const NAV: readonly { group: string; links: readonly NavLink[] }[] = [
  {
    group: "Main",
    links: [
      ["Dashboard", "/admin", "dashboard"],
      ["Orders", "/admin/orders", "orders"],
      ["Reports", "/admin/reports", "reports"],
    ],
  },
  {
    group: "Catalog",
    links: [
      ["Products", "/admin/products", "products"],
      ["Categories", "/admin/categories", "categories"],
      ["Tags", "/admin/tags", "tags"],
      ["Collections", "/admin/collections", "collections"],
    ],
  },
  {
    group: "Operations",
    links: [
      ["Coupons", "/admin/coupons", "coupons"],
      ["Price rules", "/admin/price-rules", "priceRules"],
      ["Delivery", "/admin/delivery", "delivery"],
    ],
  },
];

const ALL = NAV.flatMap((section) => section.links);

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="admin-nav">
      {NAV.map((section) => (
        <div key={section.group} className="admin-nav-group">
          <p className="admin-nav-label">{section.group}</p>
          <ul>
            {section.links.map(([label, href, icon]) => (
              <li key={href}>
                <Link href={href} aria-current={isActive(pathname, href) ? "page" : undefined}>
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                    <path d={ICONS[icon]} />
                  </svg>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function AdminBreadcrumb() {
  const pathname = usePathname();
  const section = ALL.filter(([, href]) => href !== "/admin").find(([, href]) => pathname.startsWith(href));
  const detail = section && pathname !== section[1];
  return (
    <nav aria-label="Breadcrumb">
      <ol className="admin-crumbs">
        <li>
          {section ? <Link href="/admin">Admin</Link> : <span aria-current="page">Dashboard</span>}
        </li>
        {section && (
          <li>
            {detail ? (
              <Link href={section[1]}>{section[0]}</Link>
            ) : (
              <span aria-current="page">{section[0]}</span>
            )}
          </li>
        )}
        {detail && (
          <li>
            <span aria-current="page">{pathname.endsWith("/new") ? "New" : "Details"}</span>
          </li>
        )}
      </ol>
    </nav>
  );
}
