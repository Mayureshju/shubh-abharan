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
  src: "/images/hero-worn.jpg",
  position: "72% 40%",
  crop: "figure at three-quarter, jewellery on the collarbone, empty ground to the left for overlay type",
  alt: "A woman in a lilac silk saree stands before lavender drapery and sprays of lisianthus, wearing a gold kundan necklace with emerald drops, matching chandbali earrings and a maang tikka, one hand at her collarbone.",
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
  src: "/images/collection-v2.jpg",
  crop: "necklace filling the right half of a split, cream ground, centre-weighted",
  alt: "A floral gold kundan collar with a central pendant, laid on an ivory marble slab beside a fold of lilac silk and scattered lilac petals.",
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
  alt: "Close view of a gold ring, its granulated bezel closed by hand around a deep red garnet cabochon, resting on lilac silk.",
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
  alt: "A woman seated in a lilac silk saree with a plum border in a lamp-lit room, wearing a gold kundan necklace and stacked bangles, a sunlit ivory wall on the left.",
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
    src: "/images/category-necklaces-v2.jpg",
    crop: "necklace centred on cream ground, circular crop",
    alt: "A circular gold kundan necklace with pearl drops, centred on ivory marble beside lilac silk and lisianthus.",
  },
  ring: {
    role: "macro",
    aspect: "1/1",
    src: "/images/category-rings-v2.jpg",
    crop: "rings centred on cream ground, circular crop",
    alt: "A gold kundan ring on ivory marble, with lilac silk and lisianthus behind it.",
  },
  bracelet: {
    role: "worn",
    aspect: "1/1",
    src: "/images/category-bracelets-v2.jpg",
    crop: "bracelet centred on cream ground, circular crop",
    alt: "A pair of gold kundan bangles on ivory marble beside a fold of lilac silk.",
  },
  earring: {
    role: "detail",
    aspect: "1/1",
    src: "/images/category-earrings-v2.jpg",
    crop: "earrings centred on cream ground, circular crop",
    alt: "A pair of gold kundan chandbali earrings, laid on ivory marble among lisianthus and lilac silk.",
  },
  pendant: {
    role: "macro",
    aspect: "1/1",
    src: "/images/category-pendants.jpg",
    crop: "pendant centred on cream ground, circular crop",
    alt: "A round gold kundan pendant on a fine chain, resting on ivory marble over lilac silk.",
  },
} satisfies Readonly<Partial<Record<Category, EditorialPlate>>>;

/**
 * Second and third hero frames. Same sitting, same jewellery as `HERO_PLATE` —
 * a different pose, not a different piece. Forced onto the hero's dual aspect
 * so the viewport band does not collapse.
 */
export const HERO_TWO_PLATE: EditorialPlate = {
  role: "worn",
  aspect: "4/5",
  aspectMd: "16/9",
  src: "/images/hero-2.jpg",
  position: "68% 40%",
  crop: "figure at three-quarter toward camera, jewellery on the collarbone, empty ground to the left for overlay type",
  alt: "A woman in a lilac silk saree looks toward the camera, wearing a gold kundan necklace with emerald drops, matching chandbali earrings and a maang tikka, one hand at her collarbone.",
};

export const HERO_THREE_PLATE: EditorialPlate = {
  role: "worn",
  aspect: "4/5",
  aspectMd: "16/9",
  src: "/images/hero-3.jpg",
  position: "72% 38%",
  crop: "figure in three-quarter profile, full collar visible, empty ground to the left for overlay type",
  alt: "A woman in a lilac silk saree, seated in a plum velvet armchair in three-quarter profile, wearing a gold kundan necklace with emerald drops and matching chandbali earrings.",
};

/**
 * Hero slider frames. Three portraits from the same sitting so the jewellery
 * does not change between slides.
 */
export const HERO_SLIDE_PLATES = {
  hero: HERO_PLATE,
  heroTwo: HERO_TWO_PLATE,
  heroThree: HERO_THREE_PLATE,
} satisfies Record<"hero" | "heroTwo" | "heroThree", EditorialPlate>;

/**
 * The same floral kundan collar as `COLLECTION_PLATE`, two further frames —
 * one more frontal on lilac silk, one on aubergine velvet for the split.
 */
export const COLLECTION_TWO_PLATE: EditorialPlate = {
  role: "macro",
  aspect: "4/5",
  aspectMd: "5/4",
  src: "/images/collection-2.jpg",
  crop: "floral kundan collar filling the frame on lilac silk",
  alt: "A gold kundan necklace with emerald stones and pearl drops, photographed frontally on lilac silk beside ivory marble.",
};

export const COLLECTION_THREE_PLATE: EditorialPlate = {
  role: "macro",
  aspect: "4/5",
  aspectMd: "5/4",
  src: "/images/collection-3.jpg",
  crop: "floral kundan collar filling the frame on aubergine velvet",
  alt: "A gold kundan necklace with emerald stones and pearl drops, laid across deep aubergine velvet.",
};

/** Collection split: dark-marble frame first, then the two cream-marble frames. */
export const COLLECTION_SLIDES: readonly EditorialPlate[] = [
  COLLECTION_THREE_PLATE,
  COLLECTION_PLATE,
  COLLECTION_TWO_PLATE,
];

/**
 * Stacked bangles for the fifth type still. Same metalwork as the bracelet
 * plate; a different arrangement so Bracelets and Bangles do not share a frame.
 */
export const BANGLES_PLATE: EditorialPlate = {
  role: "macro",
  aspect: "1/1",
  src: "/images/category-bangles.jpg",
  crop: "three stacked gold kundan bangles centred on an ivory cushion, circular crop",
  alt: "Three stacked gold kundan bangles with emerald stones, on an ivory cushion over lilac silk.",
};

export const OCCASION_PLATES = {
  wedding: {
    role: "worn",
    aspect: "4/5",
    src: "/images/hero-worn.jpg",
    position: "72% 40%",
    crop: "bridal set worn against lavender drapery",
    alt: "A woman in a lilac silk saree wearing a gold kundan necklace, chandbali earrings and a maang tikka.",
  },
  festive: {
    role: "macro",
    aspect: "4/5",
    src: "/images/collection-v2.jpg",
    crop: "kundan collar on marble",
    alt: "A floral gold kundan collar with a central pendant, laid on ivory marble.",
  },
  everyday: {
    role: "macro",
    aspect: "4/5",
    src: "/images/category-pendants.jpg",
    crop: "pendant on a fine chain",
    alt: "A round gold kundan pendant on a fine chain, resting on ivory marble over lilac silk.",
  },
} satisfies Record<string, EditorialPlate>;
