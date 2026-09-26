import type { Metadata } from "next";
import Link from "next/link";
import { TypeStills, TYPE_INDEX } from "@/components/home/typeIndex";
import { listCategories } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Categories",
};

export default async function TypesPage() {
  const categories = await listCategories();
  const photographed = new Set(TYPE_INDEX.map((entry) => entry.category));
  const extra = categories.filter((category) => !photographed.has(category.slug));

  return (
    <section className="page-gutter py-tight">
      <p className="text-caption uppercase tracking-[0.22em] text-accent">Shop by category</p>
      <h1 className="mt-3 text-title">Categories</h1>
      <div className="mt-tight">
        <TypeStills heading="h2" />
      </div>
      {extra.length > 0 ? (
        <ul className="mt-tight divide-y divide-line">
          {extra.map((category) => (
            <li key={category.slug} className="py-4">
              <Link href={`/shop?category=${category.slug}`} className="text-body hover:underline">
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
