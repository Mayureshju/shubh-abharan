/**
 * The single boundary for brand-owned values.
 *
 * Every field is `string | null`. `null` means the business has not supplied the
 * value yet, and the UI renders a visibly marked placeholder for it. There is
 * deliberately no default string anywhere in this module: no code path can
 * produce a brand value the business did not provide.
 *
 * Fill these in alongside BRAND-INPUTS.md at the repo root.
 */

export type BrandField = string | null;

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

  /** Collections — the primary navigation axis, capped at five. */
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
  /** One line. Must carry a measurable fact or a photographable noun. */
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
 * The live brand record. Unfilled by design — see BRAND-INPUTS.md.
 *
 * Replacing a `null` here is the only way a brand value reaches the interface.
 */
export const brand: Brand = {
  name: null,
  legalName: null,
  wordmarkSrc: null,
  foundedYear: null,
  placeOfBusiness: null,

  voiceNotes: [],

  collections: [],

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
 * an unfilled field must read as unfilled on screen, never as finished copy.
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
