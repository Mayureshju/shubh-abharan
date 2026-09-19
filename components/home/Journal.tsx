import Link from "next/link";
import { Plate } from "@/components/editorial/Plate";
import { Reveal } from "@/components/primitives/Reveal";
import { latestPosts, formatPublishedOn } from "@/lib/journal";

/**
 * Three latest posts: one featured story, two compact. Empty omits.
 */

export async function Journal({ className }: { className?: string }) {
  const posts = await latestPosts(3);
  if (posts.length === 0) return null;

  const [featured, ...rest] = posts;
  if (!featured) return null;

  return (
    <Reveal as="section" className={className}>
      <div className="page-gutter">
        <div>
          <p className="text-caption uppercase tracking-[0.22em] text-gold">From the journal</p>
          <h2 className="mt-3 text-title">Three frames</h2>
        </div>

        <div className="mt-tight grid gap-tight lg:grid-cols-12 lg:gap-12">
          <article className="lg:col-span-7">
            <Link
              href={`/journal/${featured.slug}`}
              className="group block focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              <div className="plate-zoom overflow-hidden rounded-frame">
                <Plate {...featured.image} sizes="(min-width: 1024px) 55vw, 100vw" />
              </div>
              <p className="mt-4 text-caption uppercase tracking-[0.18em] text-gold">
                {formatPublishedOn(featured.publishedOn)}
              </p>
              <h3 className="mt-2 text-title group-hover:underline underline-offset-4">
                {featured.title}
              </h3>
              <p className="mt-3 max-w-measure text-body text-muted">{featured.excerpt}</p>
            </Link>
          </article>

          <div className="flex flex-col gap-tight lg:col-span-5">
            {rest.map((post) => (
              <article key={post.slug}>
                <Link
                  href={`/journal/${post.slug}`}
                  className="group grid grid-cols-[7.5rem_1fr] gap-5 sm:grid-cols-[9rem_1fr] focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  <div className="plate-zoom overflow-hidden rounded-frame">
                    <Plate {...post.image} sizes="144px" />
                  </div>
                  <div className="min-w-0 self-center">
                    <p className="text-caption uppercase tracking-[0.18em] text-gold">
                      {formatPublishedOn(post.publishedOn)}
                    </p>
                    <h3 className="mt-2 text-body group-hover:underline underline-offset-4">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-caption text-muted">{post.excerpt}</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
