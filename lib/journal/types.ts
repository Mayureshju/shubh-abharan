/**
 * Authored journal posts. Separate from the catalog — a post is not a product.
 */

import type { PlateProps } from "@/components/editorial/Plate";

export type JournalImage = PlateProps & { readonly alt: string };

export interface JournalPost {
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  /** ISO date, YYYY-MM-DD. */
  readonly publishedOn: string;
  readonly image: JournalImage;
  readonly body: readonly [string, ...string[]];
}
