/**
 * Development merchandise — not business-supplied inventory.
 *
 * Names, crops and material lines describe what is already in
 * `public/images/`. Prices are sample INR figures recorded in BRAND-INPUTS.md.
 * Replacing a record with a real SKU is an edit here and in that table.
 *
 * Structural fixtures stay in `products.ts` and stay unfilled.
 */

import { asProductId, asVariantId } from "../types.ts";
import type { Money, Product } from "../types.ts";

function inr(rupees: number): Money {
  return { amount: rupees * 100, currency: "INR" };
}

export const merchandise: readonly Product[] = [
  {
    id: asProductId("p_merch_necklace_kundan"),
    slug: "emerald-drop-kundan-necklace",
    name: "Emerald-drop kundan necklace",
    category: "necklace",
    options: [],
    variants: [
      {
        id: asVariantId("v_merch_necklace_kundan"),
        options: {},
        price: inr(85000),
        availability: "available",
      },
    ],
    images: [
      {
        role: "macro",
        aspect: "1/1",
        src: "/images/product-necklace.jpg",
        crop: "kundan necklace with emerald drops, square marble still",
        alt: "A circular gold kundan necklace with emerald drops, laid on ivory marble beside a fold of lilac silk.",
      },
      {
        role: "worn",
        aspect: "4/5",
        src: "/images/hero-worn.jpg",
        position: "72% 40%",
        crop: "necklace on the collarbone against lavender drapery",
        alt: "A woman in a lilac silk saree wearing a gold kundan necklace with emerald drops.",
      },
    ],
    collections: ["modern-classics"],
    occasions: ["wedding", "festive"],
    materialLine: "Kundan-set necklace with emerald drops",
    description:
      "A circular kundan necklace with emerald drops, photographed on ivory marble beside a fold of lilac silk.",
    care: null,
  },
  {
    id: asProductId("p_merch_collar"),
    slug: "floral-kundan-collar",
    name: "Floral kundan collar",
    category: "necklace",
    options: [],
    variants: [
      {
        id: asVariantId("v_merch_collar"),
        options: {},
        price: inr(125000),
        availability: "available",
      },
    ],
    images: [
      {
        role: "macro",
        aspect: "1/1",
        src: "/images/product-collar.jpg",
        crop: "floral kundan collar on ivory marble, square still",
        alt: "A gold kundan collar with emerald stones and pearl drops, laid on ivory marble beside lilac silk.",
      },
    ],
    collections: ["modern-classics"],
    occasions: ["festive", "wedding"],
    materialLine: "Kundan collar with emerald stones and pearl drops",
    description:
      "A floral kundan collar with a central pendant, pearl drops and emerald stones, laid on ivory marble.",
    care: null,
  },
  {
    id: asProductId("p_merch_chandbali"),
    slug: "chandbali-earrings",
    name: "Chandbali earrings",
    category: "earring",
    options: [],
    variants: [
      {
        id: asVariantId("v_merch_chandbali"),
        options: {},
        price: inr(42000),
        availability: "available",
      },
    ],
    images: [
      {
        role: "macro",
        aspect: "1/1",
        src: "/images/product-earrings.jpg",
        crop: "pair of chandbalis on ivory marble, square still",
        alt: "A pair of gold chandbali earrings with emerald drops, laid on ivory marble over lilac silk.",
      },
      {
        role: "worn",
        aspect: "4/5",
        src: "/images/hero-worn.jpg",
        position: "80% 35%",
        crop: "chandbali at the ear against lavender drapery",
        alt: "A woman in a lilac silk saree wearing matching chandbali earrings.",
      },
    ],
    collections: ["modern-classics"],
    occasions: ["wedding"],
    materialLine: "Chandbali earrings with emerald drops",
    description:
      "A pair of gold chandbali earrings with emerald drops, laid on ivory marble over lilac silk.",
    care: null,
    relatedSlugs: ["emerald-drop-kundan-necklace", "emerald-silk-bridal-set"],
  },
  {
    id: asProductId("p_merch_pendant_drop"),
    slug: "emerald-drop-pendant",
    name: "Emerald-drop pendant",
    category: "pendant",
    options: [],
    variants: [
      {
        id: asVariantId("v_merch_pendant_drop"),
        options: {},
        price: inr(28000),
        availability: "available",
      },
    ],
    images: [
      {
        role: "macro",
        aspect: "1/1",
        src: "/images/product-pendant.jpg",
        crop: "kundan pendant with emerald drop on ivory marble, square still",
        alt: "A gold kundan pendant with an emerald drop on a fine chain, resting on ivory marble beside lilac silk.",
      },
    ],
    collections: [],
    occasions: ["everyday"],
    materialLine: "Kundan pendant with an emerald drop",
    description:
      "A gold kundan pendant with an emerald drop on a fine chain, resting on ivory marble.",
    care: null,
    relatedSlugs: ["chain-and-pendant"],
  },
  {
    id: asProductId("p_merch_rings"),
    slug: "stacked-emerald-rings",
    name: "Stacked emerald rings",
    category: "ring",
    options: [{ axis: "size", values: ["[SIZE A]", "[SIZE B]", "[SIZE C]"] }],
    variants: [
      {
        id: asVariantId("v_merch_rings_a"),
        options: { size: "[SIZE A]" },
        price: inr(36000),
        availability: "available",
      },
      {
        id: asVariantId("v_merch_rings_b"),
        options: { size: "[SIZE B]" },
        price: inr(36000),
        availability: "available",
      },
      {
        id: asVariantId("v_merch_rings_c"),
        options: { size: "[SIZE C]" },
        price: inr(36000),
        availability: "made-to-order",
      },
    ],
    images: [
      {
        role: "macro",
        aspect: "1/1",
        src: "/images/product-rings.jpg",
        crop: "gold ring on ivory marble, square still",
        alt: "A gold ring set with an emerald and uncut diamonds, on ivory marble among lilac silk and lisianthus.",
      },
    ],
    collections: ["modern-classics"],
    occasions: ["festive"],
    materialLine: "Gold-toned rings with emeralds and uncut diamonds",
    description:
      "Two stacked gold rings set with emeralds and uncut diamonds, photographed on ivory marble.",
    care: null,
  },
  {
    id: asProductId("p_merch_bangles"),
    slug: "kundan-bangles",
    name: "Kundan bangles",
    category: "bracelet",
    options: [],
    variants: [
      {
        id: asVariantId("v_merch_bangles"),
        options: {},
        price: inr(54000),
        availability: "available",
      },
    ],
    images: [
      {
        role: "macro",
        aspect: "1/1",
        src: "/images/product-bangles.jpg",
        crop: "pair of kundan bangles on ivory marble, square still",
        alt: "A pair of gold kundan bangles with emerald stones, resting on ivory marble beside lilac silk.",
      },
      {
        role: "worn",
        aspect: "4/5",
        src: "/images/campaign.jpg",
        position: "70% 55%",
        crop: "stacked bangles on the wrist in lamplight",
        alt: "Stacked gold bangles worn with a lilac silk saree in a lamp-lit room.",
      },
    ],
    collections: [],
    occasions: ["festive", "wedding"],
    materialLine: "Kundan bangles with emerald stones",
    description:
      "A pair of gold kundan bangles with emerald stones, resting on ivory marble beside lilac silk.",
    care: null,
    relatedSlugs: ["emerald-silk-bridal-set", "stacked-emerald-rings"],
  },
  {
    id: asProductId("p_merch_bridal_set"),
    slug: "emerald-silk-bridal-set",
    name: "Emerald silk bridal set",
    category: "set",
    options: [],
    variants: [
      {
        id: asVariantId("v_merch_bridal_set"),
        options: {},
        price: inr(165000),
        availability: "made-to-order",
      },
    ],
    images: [
      {
        role: "worn",
        aspect: "4/5",
        src: "/images/hero-worn.jpg",
        position: "72% 40%",
        crop: "necklace, chandbalis and maang tikka worn against lavender drapery",
        alt: "A woman in a lilac silk saree wearing a gold kundan necklace with emerald drops, matching chandbali earrings and a maang tikka.",
      },
      {
        role: "macro",
        aspect: "1/1",
        src: "/images/product-bridal-set.jpg",
        crop: "necklace and chandbalis laid on ivory marble, square still",
        alt: "A gold kundan necklace with emerald drops and matching chandbali earrings, laid on ivory marble over lilac silk.",
      },
    ],
    collections: ["modern-classics"],
    occasions: ["wedding"],
    componentSlugs: ["emerald-drop-kundan-necklace", "chandbali-earrings"],
    materialLine: "Necklace, chandbalis and maang tikka as worn",
    description:
      "Necklace, matching chandbali earrings and a maang tikka, photographed in lilac silk against lavender drapery.",
    care: null,
    relatedSlugs: ["floral-kundan-collar", "kundan-bangles"],
  },
  {
    id: asProductId("p_merch_chain_pendant"),
    slug: "chain-and-pendant",
    name: "Chain and pendant",
    category: "pendant",
    options: [{ axis: "length", values: ["[LENGTH A]", "[LENGTH B]"] }],
    variants: [
      {
        id: asVariantId("v_merch_chain_a"),
        options: { length: "[LENGTH A]" },
        price: inr(18000),
        availability: "available",
      },
      {
        id: asVariantId("v_merch_chain_b"),
        options: { length: "[LENGTH B]" },
        price: inr(18000),
        availability: "available",
      },
    ],
    images: [
      {
        role: "macro",
        aspect: "1/1",
        src: "/images/product-chain.jpg",
        crop: "pendant on a fine chain, ivory marble, square still",
        alt: "A gold kundan pendant with an emerald drop on a fine chain, looping across ivory marble over lilac silk.",
      },
      {
        role: "detail",
        aspect: "1/1",
        src: "/images/detail.jpg",
        crop: "close bezel work",
        alt: "Close view of a gold ring, its granulated bezel closed by hand around a deep red garnet cabochon, resting on lilac silk.",
      },
    ],
    collections: [],
    occasions: ["everyday"],
    materialLine: "Pendant on a fine chain",
    description:
      "A pendant on a fine chain, photographed on ivory marble — close enough for daily wear.",
    care: null,
    relatedSlugs: ["emerald-drop-pendant"],
  },
];
