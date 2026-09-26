import type { Metadata } from "next";
import Link from "next/link";
import { placeholder, resolve } from "@/lib/brand";
import { listCollections } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Collections",
};

export default async function CollectionsPage() {
  const collections = await listCollections();
  return (
    <section className="page-gutter py-tight">
      <p className="text-caption uppercase tracking-[0.22em] text-accent">Collections</p>
      <h1 className="mt-3 text-title">Collections</h1>

      {collections.length > 0 ? (
        <ul className="mt-tight grid gap-tight md:grid-cols-2">
          {collections.map((collection) => (
            <li key={collection.slug} className="border-t border-line pt-6">
              <h2 className="mt-3 text-title">
                <Link
                  href={`/collections/${collection.slug}`}
                  className="hover:underline underline-offset-8 focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  {collection.name}
                </Link>
              </h2>
              <p className="mt-4 max-w-measure text-body text-muted">
                {resolve(collection.description, "collection description")}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-tight text-body text-muted">
          {placeholder("collection names")} — unfilled, see BRAND-INPUTS.md
        </p>
      )}
    </section>
  );
}
