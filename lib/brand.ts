/**
 * The single boundary for brand-owned values.
 *
 * Every field is `string | null` unless it is a supplied list. `null` means the
 * business has not supplied the value yet, and the UI renders a visibly marked
 * placeholder for it. There is deliberately no default string anywhere in this
 * module: no code path can produce a brand value the business did not provide.
 *
 * Fill these in alongside BRAND-INPUTS.md at the repo root.
 */

export type BrandField = string | null;

export interface Reason {
  readonly title: string;
  readonly body: string;
}

export interface Occasion {
  slug: string;
  name: string;
  /** One line on the destination tile, when supplied. */
  description: BrandField;
}

export interface HeroSlide {
  /**
   * Key into the homepage slide plates. The photograph is declared in
   * `components/home/plates.ts`, not here — this record owns the copy.
   */
  readonly plate: "hero" | "campaign" | "collection" | "detail";
  readonly eyebrow: BrandField;
  /**
   * Overlay title for slides after the first. The first slide uses the brand
   * name as the page heading and ignores this field.
   */
  readonly heading: BrandField;
  readonly support: BrandField;
  readonly ctaLabel: BrandField;
  readonly ctaHref: string;
}

export interface HomepageMerchandising {
  /** Product slugs, editorial order. Empty omits the section. */
  readonly newArrivalSlugs: readonly string[];
  /** Product slugs, editorial order. Empty omits the section. */
  readonly featuredSlugs: readonly string[];
}

export interface Brand {
  /** Identity */
  name: BrandField;
  legalName: BrandField;
  /** Path to a single-colour SVG wordmark with no embedded live text. */
  wordmarkSrc: BrandField;
  foundedYear: BrandField;
  placeOfBusiness: BrandField;

  /** Voice */
  voiceNotes: readonly string[];

  /**
   * Homepage copy. Mood-board sentences supplied 2026-09-20. Several do not
   * satisfy the measurable-fact copy rule; the exception is recorded in
   * BRAND-INPUTS.md rather than being rewritten here.
   */
  heroEyebrow: BrandField;
  heroSupport: BrandField;
  heroStatement: BrandField;
  closingSupport: BrandField;
  closingStatement: BrandField;

  /**
   * Campaign frames after the first inherit overlay copy from this list.
   * Slide 0 is the existing hero photograph; its heading is the brand name.
   */
  heroSlides: readonly HeroSlide[];

  /**
   * One line in the footer's brand column. Optional: unsupplied, the line is
   * omitted rather than placeheld, because the footer is where this system
   * drops an affordance it has no content for.
   */
  footerStatement: BrandField;

  /** Why-choose columns. Empty omits the section. */
  reasons: readonly Reason[];

  /** Collections — capped at five. */
  collections: readonly Collection[];

  /** Occasions — capped at three. Empty omits the homepage section. */
  occasions: readonly Occasion[];

  /** Homepage product rails. Empty lists omit their section. */
  homepage: HomepageMerchandising;

  /** Materials vocabulary used in card material lines and spec tables. */
  materials: MaterialsVocabulary;

  /** Policy facts. A null policy means the surface showing it is omitted. */
  policies: Policies;

  /** Contact shown to customers. */
  contactEmail: BrandField;
  contactAddress: BrandField;
}

export interface Collection {
  slug: string;
  name: string;
  /** Secondary heading on the featured split, when supplied. */
  tagline: BrandField;
  /** One line. */
  description: BrandField;
}

export interface MaterialsVocabulary {
  metals: readonly string[];
  finishes: readonly string[];
  stones: readonly string[];
  /** e.g. { width: 'mm', stone: 'ct' } */
  dimensionUnits: Readonly<Record<string, string>>;
  madeIn: BrandField;
}

export interface Policies {
  shipping: BrandField;
  returns: BrandField;
  warranty: BrandField;
  care: BrandField;
  hallmarking: BrandField;
}

/**
 * The live brand record.
 *
 * Values marked as mood-board copy were supplied with the board on 2026-09-20.
 */
export const brand: Brand = {
  name: "Shubha Abharan",
  legalName: null,
  wordmarkSrc: "/brand/lotus.svg",
  foundedYear: null,
  placeOfBusiness: null,

  voiceNotes: [],

  heroEyebrow: "Timeless elegance in every detail",
  heroSupport: "Exquisite Jewellery for Every Moment of Your Life",
  heroStatement: "Shubha Abharan",
  closingSupport: "Jewellery that celebrates you.",
  closingStatement: "Because You Deserve to Shine",
  footerStatement: "Grace in Every Gem",

  heroSlides: [
    {
      plate: "hero",
      eyebrow: "Timeless elegance in every detail",
      heading: null,
      support: "Exquisite Jewellery for Every Moment of Your Life",
      ctaLabel: "Shop Now",
      ctaHref: "/shop",
    },
    {
      plate: "campaign",
      eyebrow: "Worn in lamplight",
      heading: "Kundan against silk",
      support: "Necklace, stacked bangles and rings in a lamp-lit interior.",
      ctaLabel: "Shop Now",
      ctaHref: "/shop",
    },
    {
      plate: "collection",
      eyebrow: "Still life",
      heading: "A collar on marble",
      support: "Gold kundan, emerald stones and pearl drops on cream stone.",
      ctaLabel: "Shop the collection",
      ctaHref: "/collections/modern-classics",
    },
    {
      plate: "detail",
      eyebrow: "Close work",
      heading: "Bezel and granulation",
      support: "A gold disc closed by hand around a cabochon.",
      ctaLabel: "Shop Now",
      ctaHref: "/shop",
    },
  ],

  reasons: [
    { title: "Premium Quality", body: "Crafted with the finest materials" },
    { title: "Trusted Heritage", body: "A legacy of elegance and trust" },
    { title: "Elegant Packaging", body: "Beautifully packed for every occasion" },
    { title: "Secure Shopping", body: "Safe & hassle-free experience" },
  ],

  collections: [
    {
      slug: "modern-classics",
      name: "Modern Classics",
      tagline: "Timeless Beauty",
      description:
        "Exquisite jewellery that blends tradition with contemporary elegance.",
    },
  ],

  occasions: [
    {
      slug: "wedding",
      name: "Wedding",
      description: "Necklace, chandbalis and maang tikka as worn on silk.",
    },
    {
      slug: "festive",
      name: "Festive",
      description: "Kundan collars, stacked rings and bangles on marble.",
    },
    {
      slug: "everyday",
      name: "Everyday",
      description: "A pendant on a fine chain, close enough for daily wear.",
    },
  ],

  homepage: {
    newArrivalSlugs: [
      "emerald-drop-kundan-necklace",
      "chandbali-earrings",
      "emerald-drop-pendant",
      "chain-and-pendant",
    ],
    featuredSlugs: [
      "emerald-silk-bridal-set",
      "floral-kundan-collar",
      "stacked-emerald-rings",
      "kundan-bangles",
    ],
  },

  materials: {
    metals: [],
    finishes: [],
    stones: [],
    dimensionUnits: {},
    madeIn: null,
  },

  policies: {
    shipping: null,
    returns: null,
    warranty: null,
    care: null,
    hallmarking: null,
  },

  contactEmail: null,
  contactAddress: null,
};

/**
 * Rendered in place of an unsupplied brand value. Deliberately conspicuous:
 * an unfilled field must look unfilled on screen, never as finished copy.
 */
export function placeholder(field: string): string {
  return `[${field.toUpperCase()}]`;
}

/** True when the value was supplied by the business. */
export function isSupplied(value: BrandField): value is string {
  return typeof value === "string" && value.length > 0;
}

/**
 * Resolve a brand field for display: the real value, or a marked placeholder.
 * Never returns an invented default.
 */
export function resolve(value: BrandField, field: string): string {
  return isSupplied(value) ? value : placeholder(field);
}

if (brand.occasions.length > 3) {
  throw new Error("Occasions are capped at three.");
}

if (brand.heroSlides.length > 4) {
  throw new Error("The hero slider is capped at four frames.");
}
