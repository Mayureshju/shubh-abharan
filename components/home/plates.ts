import type { PlateProps } from "@/components/editorial/Plate";
import type { Category } from "@/lib/catalog";

/**
 * The homepage's editorial photography — every frame on the page that is not a
 * catalog product image.
 *
 * Declared here rather than inline in the sections so that the shoot brief is
 * one list rather than seven files, and so the matching `## Homepage` table in
 * BRAND-INPUTS.md has something to mirror.
 *
 * Each frame carries the prompt id it was generated from. The photography is
 * currently produced by `scripts/generate-images.mjs`, which holds the prompt
 * for each of these ids; replacing a frame with a commissioned photograph is an
 * edit to `src` and `alt` here and nothing else.
 *
 * `alt` describes the photograph that is actually on disk. It is rewritten
 * alongside any replacement `src`, because alternative text has to describe the
 * frame as shot, not the frame as briefed.
 *
 * `crop` stays declared even where a `src` exists: it is the brief the frame
 * was shot to, it is what `Plate` falls back to showing if the file goes
 * missing, and it is what a re-shoot is measured against.
 */

type EditorialPlate = PlateProps & { readonly alt: string };

/**
 * The hero frame. The only plate on the site declaring two aspect ratios: a
 * landscape band is 156px tall on a 390px phone, and a 4/5 portrait is 2400px
 * tall on a 1920px desktop. See design.md — Decision 10.
 *
 * `position` is load-bearing rather than cosmetic. The figure stands in the
 * right half of a 3:2 frame against empty travertine, which is the composition
 * the wide crop needs; a centred 4/5 crop at phone width would cut her at the
 * shoulder. Biasing the crop window right keeps the same photograph working at
 * both ratios.
 */
export const HERO_PLATE: EditorialPlate = {
  role: "worn",
  aspect: "4/5",
  aspectMd: "16/9",
  src: "/images/hero.jpg",
  position: "72% 40%",
  crop: "figure at three-quarter, jewellery on the collarbone, empty ground to the left for overlay type",
  alt: "A woman in an emerald silk saree stands against palm foliage, wearing a gold kundan necklace with emerald drops, matching chandbali earrings and a maang tikka, one hand at her collarbone.",
};

/**
 * The collection frame. A collection story is its own photograph, not the
 * first product shot in the collection — sourcing it from the collection's
 * contents would leave this section with nothing to render while
 * `brand.collections` is empty. See design.md — Decision 8.
 */
export const COLLECTION_PLATE: EditorialPlate = {
  role: "macro",
  aspect: "4/5",
  aspectMd: "5/4",
  src: "/images/collection.jpg",
  crop: "necklace filling the right half of a split, cream ground, centre-weighted",
  alt: "A gold kundan necklace with emerald stones and pearl drops, laid across cream marble beside a fold of emerald silk.",
};

/**
 * The detail frame. Set on the ink band, where a single lit object against a
 * near-black ground is the only thing in the field. Square because the subject
 * is one piece and the frame has no second element to balance.
 */
export const DETAIL_PLATE: EditorialPlate = {
  role: "detail",
  aspect: "1/1",
  src: "/images/detail.jpg",
  crop: "one piece filling the frame against dark ground, bezel and granulation legible",
  alt: "Close view of a gold disc, its granulated and twisted-wire bezel closed by hand around a deep red garnet cabochon, the surface finely scratched from wear.",
};

/**
 * The closing frame. Wide at every width — it is the last thing on the page and
 * has the whole viewport to itself, so it needs no second ratio.
 */
export const CAMPAIGN_PLATE: EditorialPlate = {
  role: "worn",
  aspect: "4/5",
  aspectMd: "16/9",
  src: "/images/campaign.jpg",
  position: "60% 50%",
  crop: "figure turned away in a lit interior, the piece at the nape, long light across the wall",
  alt: "A woman seated in an emerald and maroon silk saree in a lamp-lit interior, wearing a gold kundan necklace, stacked bangles and rings, looking toward empty stone wall on the left.",
};

/**
 * One frame per product type, keyed by the catalog's own `Category` union so a
 * type cannot be listed on the homepage that the shop cannot filter to.
 *
 * The aspect ratios are deliberately all different. Five identical frames in a
 * row is the composition the product-card requirement rejects for listings, and
 * it reads the same way here; varying the ratio is what makes this an index
 * rather than a card grid. The ratios are also not arbitrary — each one is the
 * shape its subject actually occupies. A hanging earring is tall, a wrist
 * entering from the frame edge is wide, a group of rings on stone is square.
 */
export const CATEGORY_PLATES = {
  necklace: {
    role: "macro",
    aspect: "1/1",
    src: "/images/category-necklaces.jpg",
    crop: "necklace centred on cream ground, circular crop",
    alt: "A circular gold kundan necklace with emerald drops, centred on cream marble beside emerald silk.",
  },
  ring: {
    role: "macro",
    aspect: "1/1",
    src: "/images/category-rings.jpg",
    crop: "rings centred on cream ground, circular crop",
    alt: "Two stacked gold rings set with emeralds and uncut diamonds, centred on cream linen.",
  },
  bracelet: {
    role: "worn",
    aspect: "1/1",
    src: "/images/category-bracelets.jpg",
    crop: "bracelet centred on cream ground, circular crop",
    alt: "A pair of gold kundan bangles with emerald stones, resting on emerald and cream silk.",
  },
  earring: {
    role: "detail",
    aspect: "1/1",
    src: "/images/category-earrings.jpg",
    crop: "earrings centred on cream ground, circular crop",
    alt: "A pair of gold chandbali earrings with emerald drops, laid on cream marble against emerald silk.",
  },
  pendant: {
    role: "macro",
    aspect: "1/1",
    src: "/images/category-pendants.jpg",
    crop: "pendant centred on cream ground, circular crop",
    alt: "A gold kundan pendant with an emerald drop on a fine chain, resting on cream silk.",
  },
} satisfies Readonly<Partial<Record<Category, EditorialPlate>>>;
