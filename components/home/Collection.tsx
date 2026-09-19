import Link from "next/link";
import { Plate } from "@/components/editorial/Plate";
import { Reveal } from "@/components/primitives/Reveal";
import { buttonClass } from "@/components/ui/buttonClass";
import { ArrowIcon } from "@/components/ui/icons";
import { brand, placeholder, resolve } from "@/lib/brand";
import { getCollection } from "@/lib/catalog";
import { COLLECTION_PLATE } from "./plates";

/**
 * Featured collection as a royal-green split. Name, tagline and description
 * come from the brand record. The catalog read is only to confirm the slug.
 */

export async function Collection({ className }: { className?: string }) {
  const [featured] = brand.collections;
  const entry = featured ? await getCollection(featured.slug) : null;
  const name = featured ? featured.name : placeholder("collection name");
  const tagline = featured ? resolve(featured.tagline, "collection tagline") : placeholder("collection tagline");
  const description = featured
    ? resolve(featured.description, "collection description")
    : `${placeholder("collection description")} — unfilled, see BRAND-INPUTS.md`;

  return (
    <Reveal as="section" className={className}>
      <div className="page-gutter">
        <div className="overflow-hidden rounded-frame md:grid md:grid-cols-2">
          <div data-surface="ink" className="flex flex-col justify-center px-8 py-normal md:px-12 lg:px-16">
            <p className="text-caption uppercase tracking-[0.22em] text-gold">Featured collection</p>
            <h2 className="mt-4 text-title text-paper">
              {name}
              <span className="mt-1 block">{tagline}</span>
            </h2>
            <p className="mt-4 max-w-measure text-body text-muted">{description}</p>
            {entry ? (
              <p className="mt-tight">
                <Link href={`/collections/${entry.collection.slug}`} className={buttonClass("quiet")}>
                  Explore Collection
                  <ArrowIcon />
                </Link>
              </p>
            ) : null}
          </div>
          <div>
            <Plate {...COLLECTION_PLATE} sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
        </div>
      </div>
    </Reveal>
  );
}
