/**
 * The only way the storefront reaches journal data.
 *
 * Async for the same reason as the catalog repository: a later source swap
 * must not rewrite callers.
 */

import { posts } from "./data/posts";
import type { JournalPost } from "./types";

export async function listPosts(): Promise<readonly JournalPost[]> {
  return [...posts].sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));
}

export async function getPost(slug: string): Promise<JournalPost | null> {
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function latestPosts(limit = 3): Promise<readonly JournalPost[]> {
  const ordered = await listPosts();
  return ordered.slice(0, limit);
}
