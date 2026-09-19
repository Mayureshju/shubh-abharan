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
   * One line in the footer's brand column. Optional: unsupplied, the line is
   * omitted rather than placeheld, because the footer is where this system
   * drops an affordance it has no content for.
   */
  footerStatement: BrandField;

  /** Why-choose columns. Empty omits the section. */
  reasons: readonly Reason[];

  /** Collections — capped at five. */
  collections: readonly Collection[];

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
