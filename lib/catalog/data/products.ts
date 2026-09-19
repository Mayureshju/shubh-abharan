/**
 * The only place product records are authored.
 *
 * These are structural specimens, not merchandise. Every record here exists to
 * exercise the model — each category, single and multi-axis variants, every
 * image role, every availability state, explicit and derived related products —
 * so that listings, filters, selectors and detail pages can be built and
 * reviewed before the business has supplied a single word or photograph.
 *
 * Nothing in this file describes a real piece:
 *
 *   - Names and slugs name the structure they demonstrate, in the same
 *     conspicuous register as /specimen. None reads as a product name.
 *   - Option values are bracketed placeholders. Ring sizes, chain lengths and
 *     finish names are brand vocabulary and belong in BRAND-INPUTS.md, so no
 *     real size or finish is invented here.
 *   - Every brand-owned value — price, material line, description, care — is
 *     null, and renders as a marked placeholder on screen.
 *   - Images declare role, aspect and intended crop but carry no `src`, so the
 *     design system's "no photography" placeholder renders. Supplying
 *     photography later is a data change here and nothing else.
 *   - `availability` is stated because the model requires it and has no safe
 *     default. It is a property of the specimen, not a claim about stock of
 *     anything the business sells.
 *
 * Replacing these with real products is an edit to this file. No component
 * changes.
 */

// Explicit .ts specifiers: scripts/check-catalog.mjs loads this module directly
// under Node's type stripping, and Node's ESM resolver requires the extension.
import { asProductId, asVariantId } from "../types.ts";
import type { Product } from "../types.ts";
import { merchandise } from "./merchandise.ts";

const fixtures: readonly Product[] = [
  {
    // Two axes: the selector, the filter and the "from" price all need this.
    id: asProductId("p_ring_multi"),
    slug: "fixture-ring-size-finish",
    name: "Fixture — ring, size and finish",
    category: "ring",
    options: [
      { axis: "size", values: ["[SIZE A]", "[SIZE B]", "[SIZE C]"] },
      { axis: "finish", values: ["[FINISH A]", "[FINISH B]"] },
    ],
    variants: [
      { id: asVariantId("v_ring_a_polished"), options: { size: "[SIZE A]", finish: "[FINISH A]" }, price: null, availability: "available" },
      { id: asVariantId("v_ring_a_brushed"), options: { size: "[SIZE A]", finish: "[FINISH B]" }, price: null, availability: "available" },
      { id: asVariantId("v_ring_b_polished"), options: { size: "[SIZE B]", finish: "[FINISH A]" }, price: null, availability: "made-to-order" },
      { id: asVariantId("v_ring_b_brushed"), options: { size: "[SIZE B]", finish: "[FINISH B]" }, price: null, availability: "sold-out" },
      { id: asVariantId("v_ring_c_polished"), options: { size: "[SIZE C]", finish: "[FINISH A]" }, price: null, availability: "made-to-order" },
      { id: asVariantId("v_ring_c_brushed"), options: { size: "[SIZE C]", finish: "[FINISH B]" }, price: null, availability: "unavailable" },
    ],
    images: [
      { role: "macro", aspect: "4/5", alt: "Fixture plate — ring, macro role", crop: "band fills frame, solder seam visible" },
      { role: "scale", aspect: "1/1", alt: "Fixture plate — ring at true size", crop: "piece small in an empty field", dimension: "[WIDTH]" },
      { role: "worn", aspect: "3/4", alt: "Fixture plate — ring worn", crop: "hand, ring in the upper third" },
      { role: "detail", aspect: "1/1", alt: "Fixture plate — ring, inner face", crop: "inner face, hallmark position" },
    ],
    collections: [],
    materialLine: null,
    description: null,
    care: null,
    attributes: [],
    labels: ["made-to-order"],
  },
  {
    // One axis, and an explicit related list — the branch that overrides derivation.
    id: asProductId("p_necklace_length"),
    slug: "fixture-necklace-length",
    name: "Fixture — necklace, length",
    category: "necklace",
    options: [{ axis: "length", values: ["[LENGTH A]", "[LENGTH B]"] }],
    variants: [
      { id: asVariantId("v_necklace_a"), options: { length: "[LENGTH A]" }, price: null, availability: "available" },
      { id: asVariantId("v_necklace_b"), options: { length: "[LENGTH B]" }, price: null, availability: "available" },
    ],
    images: [
      { role: "worn", aspect: "3/4", alt: "Fixture plate — necklace worn", crop: "collarbone, chain across frame" },
      { role: "macro", aspect: "5/4", alt: "Fixture plate — necklace, macro role", crop: "clasp fills frame" },
    ],
    collections: [],
    materialLine: null,
    description: null,
    care: null,
    relatedSlugs: ["fixture-pendant-single", "fixture-earring-finish"],
  },
  {
    // No axes at all: exactly one variant, added to the cart without a selection step.
    id: asProductId("p_pendant_single"),
    slug: "fixture-pendant-single",
    name: "Fixture — pendant, single variant",
    category: "pendant",
    options: [],
    variants: [
      { id: asVariantId("v_pendant_only"), options: {}, price: null, availability: "available" },
    ],
    images: [
      // Only one role, so a request for `worn` here falls back to primary.
      { role: "macro", aspect: "1/1", alt: "Fixture plate — pendant, macro role", crop: "pendant fills frame" },
    ],
    collections: [],
    materialLine: null,
    description: null,
    care: null,
    labels: ["one-of-a-kind", "hallmarked"],
  },
  {
    id: asProductId("p_earring_finish"),
    slug: "fixture-earring-finish",
    name: "Fixture — earring, finish",
    category: "earring",
    options: [{ axis: "finish", values: ["[FINISH A]", "[FINISH B]"] }],
    variants: [
      { id: asVariantId("v_earring_a"), options: { finish: "[FINISH A]" }, price: null, availability: "available" },
      { id: asVariantId("v_earring_b"), options: { finish: "[FINISH B]" }, price: null, availability: "sold-out" },
    ],
    images: [
      { role: "scale", aspect: "1/1", alt: "Fixture plate — earring at true size", crop: "pair small in an empty field", dimension: "[LENGTH]" },
      { role: "detail", aspect: "4/5", alt: "Fixture plate — earring, post and fitting", crop: "post and butterfly" },
    ],
    collections: [],
    materialLine: null,
    description: null,
    care: null,
  },
  {
    id: asProductId("p_bracelet_multi"),
    slug: "fixture-bracelet-length-finish",
    name: "Fixture — bracelet, length and finish",
    category: "bracelet",
    options: [
      { axis: "length", values: ["[LENGTH A]", "[LENGTH B]"] },
      { axis: "finish", values: ["[FINISH A]", "[FINISH B]"] },
    ],
    variants: [
      { id: asVariantId("v_bracelet_a_a"), options: { length: "[LENGTH A]", finish: "[FINISH A]" }, price: null, availability: "made-to-order" },
      { id: asVariantId("v_bracelet_a_b"), options: { length: "[LENGTH A]", finish: "[FINISH B]" }, price: null, availability: "made-to-order" },
      { id: asVariantId("v_bracelet_b_a"), options: { length: "[LENGTH B]", finish: "[FINISH A]" }, price: null, availability: "unavailable" },
      { id: asVariantId("v_bracelet_b_b"), options: { length: "[LENGTH B]", finish: "[FINISH B]" }, price: null, availability: "unavailable" },
    ],
    images: [
      { role: "macro", aspect: "5/4", alt: "Fixture plate — bracelet, macro role", crop: "links fill frame" },
      { role: "worn", aspect: "4/5", alt: "Fixture plate — bracelet worn", crop: "wrist, bracelet centred" },
    ],
    collections: [],
    materialLine: null,
    description: null,
    care: null,
    labels: ["limited-run"],
  },
  {
    // A set referencing its components. Both must resolve.
    id: asProductId("p_set_two"),
    slug: "fixture-set-two-components",
    name: "Fixture — set of two",
    category: "set",
    options: [],
    variants: [
      { id: asVariantId("v_set_only"), options: {}, price: null, availability: "made-to-order" },
    ],
    images: [
      { role: "scale", aspect: "5/4", alt: "Fixture plate — set at true size", crop: "both pieces laid out, small in field", dimension: "[SPREAD]" },
      { role: "macro", aspect: "1/1", alt: "Fixture plate — set, macro role", crop: "one piece fills frame" },
      { role: "worn", aspect: "3/4", alt: "Fixture plate — set worn", crop: "both pieces on the body" },
    ],
    collections: [],
    componentSlugs: ["fixture-pendant-single", "fixture-earring-finish"],
    materialLine: null,
    description: null,
    care: null,
  },
];

export const products: readonly Product[] = [...fixtures, ...merchandise];
