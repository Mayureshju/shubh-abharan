import Link from "next/link";
import { requireAdmin } from "@/lib/auth/roles";
import { AdminBreadcrumb, AdminNav } from "@/components/admin/AdminNav";
import { AccountControl } from "@/components/auth/AccountControl";
import "./admin.css";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="admin">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-brand">
          Store admin
        </Link>
        <AdminNav />
      </aside>
      <div className="admin-body">
        <header className="admin-topbar">
          <AdminBreadcrumb />
          <div className="admin-topbar-actions">
            <Link href="/" className="admin-btn" target="_blank" rel="noreferrer">
              View store ↗
            </Link>
            <AccountControl />
          </div>
        </header>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
