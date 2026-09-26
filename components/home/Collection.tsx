import Link from "next/link";
import { Reveal } from "@/components/primitives/Reveal";
import { buttonClass } from "@/components/ui/buttonClass";
import { ArrowIcon } from "@/components/ui/icons";
import { brand, placeholder, resolve } from "@/lib/brand";
import { getCollection } from "@/lib/catalog";
import { COLLECTION_SLIDES } from "./plates";
import { CollectionSlider, type CollectionSlideView } from "./CollectionSlider";

/**
 * Featured collection as a royal-green split. Name, tagline and description
 * come from the brand record. The photograph is a slider of the same necklace
 * from three frames. The catalog read is only to confirm the slug.
 */

export async function Collection({ className }: { className?: string }) {
  const [featured] = brand.collections;
  const entry = featured ? await getCollection(featured.slug) : null;
  const name = featured ? featured.name : placeholder("collection name");
  const tagline = featured
    ? resolve(featured.tagline, "collection tagline")
    : placeholder("collection tagline");
  const description = featured
    ? resolve(featured.description, "collection description")
    : `${placeholder("collection description")} — unfilled, see BRAND-INPUTS.md`;

  const slides: CollectionSlideView[] = COLLECTION_SLIDES.map((plate, index) => ({
    id: `${plate.src ?? "collection"}-${index}`,
    plate,
  }));

  return (
    <Reveal as="section" className={className}>
      <div className="md:grid md:min-h-[min(40rem,85svh)] md:grid-cols-2">
        <div
          data-surface="ink"
          className="flex flex-col justify-center px-6 py-8 md:px-12 md:py-normal lg:px-16"
        >
          <p className="text-caption uppercase tracking-[0.22em] text-accent">Featured collection</p>
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
        <CollectionSlider slides={slides} />
      </div>
    </Reveal>
  );
}
