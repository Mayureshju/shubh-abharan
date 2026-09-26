import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Plate } from "@/components/editorial/Plate";
import { formatPublishedOn, getPost, listPosts } from "@/lib/journal";

export async function generateStaticParams() {
  const posts = await listPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return { title: post?.title ?? "Journal" };
}

export default async function JournalArticlePage({ params }: PageProps<"/journal/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article className="page-gutter py-tight">
      <p className="text-caption uppercase tracking-[0.22em] text-accent">
        {formatPublishedOn(post.publishedOn)}
      </p>
      <h1 className="mt-3 max-w-measure text-title">{post.title}</h1>
      <p className="mt-4 max-w-measure text-body text-muted">{post.excerpt}</p>

      <div className="mt-tight overflow-hidden rounded-frame md:max-w-3xl">
        <Plate {...post.image} sizes="(min-width: 768px) 48rem, 100vw" priority />
      </div>

      <div className="mt-tight max-w-measure space-y-4">
        {post.body.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="text-body">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
