/**
 * Extra development merchandise so listings, filters and pagination can be
 * exercised. Photography is the existing shoot in `public/images/`. Prices
 * are sample INR, same status as `merchandise.ts`. Structural fixtures stay
 * unfilled in `products.ts`.
 */

import { asProductId, asVariantId } from "../types.ts";
import type {
  Availability,
  Money,
  Product,
  ProductImage,
  ProductImages,
  ProductVariant,
  VariantAxis,
} from "../types.ts";

function inr(rupees: number): Money {
  return { amount: rupees * 100, currency: "INR" };
}

type StillId =
  | "necklace"
  | "collar"
  | "collarFront"
  | "collarVelvet"
  | "polkiNecklace"
  | "polkiPendantNecklace"
  | "emeraldChandbali"
  | "pearlChandbali"
  | "emeraldRings"
  | "polkiRing"
  | "redCabochon"
  | "emeraldBangles"
  | "bangleCushion"
  | "emeraldPendant"
  | "emeraldChain"
  | "polkiPendant"
  | "bridal"
  | "worn"
  | "campaign";

const STILLS: Record<
  StillId,
  {
    src: string;
    alt: string;
    crop: string;
    aspect: string;
    role: Exclude<ProductImage["role"], "scale">;
    material: string;
    description: string;
    tags: readonly string[];
    occasions: readonly string[];
    position?: string;
  }
> = {
  necklace: {
    src: "/images/product-necklace.jpg",
    alt: "A circular gold kundan necklace with emerald drops, laid on ivory marble beside a fold of lilac silk.",
    crop: "kundan necklace with emerald drops, square marble still",
    aspect: "1/1",
    role: "macro",
    material: "Kundan-set necklace with emerald drops",
    description: "A circular kundan necklace with emerald drops, photographed on ivory marble beside lilac silk.",
    tags: ["kundan", "emerald"],
    occasions: ["wedding"],
  },
  collar: {
    src: "/images/product-collar.jpg",
    alt: "A gold kundan collar with emerald stones and pearl drops, laid on ivory marble beside lilac silk.",
    crop: "floral kundan collar on ivory marble, square still",
    aspect: "1/1",
    role: "macro",
    material: "Kundan collar with emerald stones and pearl drops",
    description: "A floral kundan collar with pearl drops and emerald stones, laid on ivory marble.",
    tags: ["kundan", "emerald", "pearl"],
    occasions: ["festive"],
  },
  collarFront: {
    src: "/images/collection-2.jpg",
    alt: "A floral kundan collar with emerald stones and pearl drops, photographed frontally on ivory marble with lilac silk.",
    crop: "kundan collar, frontal on ivory marble",
    aspect: "4/3",
    role: "macro",
    material: "Kundan collar with emerald stones and pearl drops",
    description: "The floral kundan collar, photographed frontally on ivory marble with a fold of lilac silk.",
    tags: ["kundan", "emerald", "pearl"],
    occasions: ["festive"],
  },
  collarVelvet: {
    src: "/images/collection-3.jpg",
    alt: "A floral kundan collar with emerald stones and pearl drops, laid on deep aubergine velvet.",
    crop: "kundan collar filling the frame on aubergine velvet",
    aspect: "4/3",
    role: "macro",
    material: "Kundan collar with emerald stones and pearl drops",
    description: "The floral kundan collar, laid on deep aubergine velvet.",
    tags: ["kundan", "emerald", "pearl"],
    occasions: ["wedding"],
  },
  polkiNecklace: {
    src: "/images/category-necklaces-v2.jpg",
    alt: "A gold polki necklace with pearl drops, arranged on ivory silk and marble with lilac lisianthus.",
    crop: "polki necklace with pearl drops, square still",
    aspect: "1/1",
    role: "macro",
    material: "Polki necklace with pearl drops",
    description: "A gold polki necklace with pearl drops, photographed on ivory silk and marble.",
    tags: ["kundan", "polki", "pearl"],
    occasions: ["wedding"],
  },
  polkiPendantNecklace: {
    src: "/images/collection-v2.jpg",
    alt: "A gold polki necklace with a circular pendant and pearl drops, on a marble slab beside lilac silk.",
    crop: "polki necklace with pendant on marble",
    aspect: "1/1",
    role: "macro",
    material: "Polki necklace with a pendant and pearl drops",
    description: "A gold polki necklace with a circular pendant, photographed on marble beside lilac silk.",
    tags: ["kundan", "polki", "pearl"],
    occasions: ["festive"],
  },
  emeraldChandbali: {
    src: "/images/product-earrings.jpg",
    alt: "A pair of gold chandbali earrings with emerald drops, laid on ivory marble over lilac silk.",
    crop: "pair of emerald chandbalis on ivory marble",
    aspect: "1/1",
    role: "macro",
    material: "Chandbali earrings with emerald drops",
    description: "A pair of gold chandbali earrings with emerald drops, laid on ivory marble.",
    tags: ["kundan", "emerald"],
    occasions: ["wedding"],
  },
  pearlChandbali: {
    src: "/images/category-earrings-v2.jpg",
    alt: "A pair of gold chandbali earrings with polki stones and pearl drops, on marble beside lilac lisianthus.",
    crop: "pearl chandbalis on marble, square still",
    aspect: "1/1",
    role: "macro",
    material: "Chandbali earrings with polki stones and pearl drops",
    description: "A pair of gold chandbali earrings with pearl drops, photographed on marble.",
    tags: ["kundan", "polki", "pearl"],
    occasions: ["festive"],
  },
  emeraldRings: {
    src: "/images/product-rings.jpg",
    alt: "Stacked gold rings set with emeralds and uncut diamonds, on ivory marble among lilac silk.",
    crop: "stacked emerald rings on ivory marble",
    aspect: "1/1",
    role: "macro",
    material: "Gold-toned rings with emeralds and uncut diamonds",
    description: "Stacked gold rings set with emeralds and uncut diamonds, photographed on ivory marble.",
    tags: ["emerald"],
    occasions: ["festive"],
  },
  polkiRing: {
    src: "/images/category-rings-v2.jpg",
    alt: "A gold ring set with polki stones and two pearls, on a marble slab with lilac silk in the foreground.",
    crop: "polki and pearl ring on marble",
    aspect: "1/1",
    role: "macro",
    material: "Gold ring with polki stones and pearls",
    description: "A gold ring set with polki stones and two pearls, photographed on marble.",
    tags: ["polki", "pearl"],
    occasions: ["everyday"],
  },
  redCabochon: {
    src: "/images/detail.jpg",
    alt: "Close view of a gold ring, a beaded gold border around a domed deep-red cabochon, resting on lilac silk.",
    crop: "close bezel work around a red cabochon",
    aspect: "1/1",
    role: "macro",
    material: "Gold ring with a deep-red cabochon",
    description: "A gold ring with a beaded border around a domed deep-red cabochon, photographed on lilac silk.",
    tags: ["gold"],
    occasions: ["everyday"],
  },
  emeraldBangles: {
    src: "/images/product-bangles.jpg",
    alt: "A pair of gold kundan bangles with emerald stones, resting on ivory marble beside lilac silk.",
    crop: "pair of kundan bangles on ivory marble",
    aspect: "1/1",
    role: "macro",
    material: "Kundan bangles with emerald stones",
    description: "A pair of gold kundan bangles with emerald stones, resting on ivory marble.",
    tags: ["kundan", "emerald"],
    occasions: ["festive"],
  },
  bangleCushion: {
    src: "/images/category-bangles.jpg",
    alt: "Three stacked gold bangles set with emeralds and white stones, resting on an ivory cushion.",
    crop: "emerald bangle stack on an ivory cushion",
    aspect: "1/1",
    role: "macro",
    material: "Stacked gold bangles with emerald stones",
    description: "Three stacked gold bangles set with emeralds, photographed on an ivory cushion.",
    tags: ["kundan", "emerald"],
    occasions: ["wedding"],
  },
  emeraldPendant: {
    src: "/images/product-pendant.jpg",
    alt: "A gold kundan pendant with an emerald drop on a fine chain, resting on ivory marble beside lilac silk.",
    crop: "kundan pendant with emerald drop on ivory marble",
    aspect: "1/1",
    role: "macro",
    material: "Kundan pendant with an emerald drop",
    description: "A gold kundan pendant with an emerald drop on a fine chain, resting on ivory marble.",
    tags: ["kundan", "emerald"],
    occasions: ["everyday"],
  },
  emeraldChain: {
    src: "/images/product-chain.jpg",
    alt: "A gold kundan pendant with an emerald drop on a fine chain, looping across ivory marble over lilac silk.",
    crop: "pendant on a fine chain, ivory marble",
    aspect: "1/1",
    role: "macro",
    material: "Pendant on a fine chain",
    description: "A pendant on a fine chain, photographed looping across ivory marble.",
    tags: ["kundan", "emerald"],
    occasions: ["everyday"],
  },
  polkiPendant: {
    src: "/images/category-pendants.jpg",
    alt: "An oval gold polki pendant on a fine chain, on a marble slab beside lilac lisianthus.",
    crop: "polki pendant on a chain, marble slab",
    aspect: "1/1",
    role: "macro",
    material: "Polki pendant on a fine chain",
    description: "An oval gold polki pendant on a fine chain, photographed on marble.",
    tags: ["polki"],
    occasions: ["everyday"],
  },
  bridal: {
    src: "/images/product-bridal-set.jpg",
    alt: "A gold kundan necklace with emerald drops and matching chandbali earrings, laid on ivory marble over lilac silk.",
    crop: "necklace and chandbalis laid on ivory marble",
    aspect: "1/1",
    role: "macro",
    material: "Necklace and matching chandbali earrings",
    description: "A kundan necklace with emerald drops and matching chandbali earrings, laid on ivory marble.",
    tags: ["kundan", "emerald"],
    occasions: ["wedding"],
  },
  worn: {
    src: "/images/hero-worn.jpg",
    alt: "A woman in a lilac silk saree wearing a gold kundan necklace with emerald drops, matching chandbali earrings and a maang tikka.",
    crop: "necklace and chandbalis worn against lavender drapery",
    aspect: "4/5",
    role: "worn",
    material: "Necklace, chandbalis and maang tikka as worn",
    description: "Necklace, matching chandbali earrings and a maang tikka, worn in lilac silk.",
    tags: ["kundan", "emerald"],
    occasions: ["wedding"],
    position: "72% 40%",
  },
  campaign: {
    src: "/images/campaign.jpg",
    alt: "Stacked gold bangles worn with a lilac silk saree in a lamp-lit room.",
    crop: "stacked bangles on the wrist in lamplight",
    aspect: "4/5",
    role: "worn",
    material: "Stacked gold bangles as worn",
    description: "Stacked gold bangles worn with lilac silk in a lamp-lit room.",
    tags: ["kundan"],
    occasions: ["festive"],
    position: "70% 55%",
  },
};

type Row = {
  slug: string;
  name: string;
  category: "necklace" | "ring" | "earring" | "bracelet" | "pendant" | "set";
  rupees: number;
  still: StillId;
  sale?: number;
  availability?: Availability;
  sizes?: readonly string[];
  lengths?: readonly string[];
  occasions?: readonly string[];
  tags?: readonly string[];
  collection?: boolean;
  secondary?: StillId;
  isNew?: boolean;
  isFeatured?: boolean;
};

const RING_SIZES = ["12", "14", "16"] as const;
const NECKLACE_LENGTHS = ["16 in", "18 in", "20 in"] as const;

const ROWS: readonly Row[] = [
  { slug: "polki-pearl-necklace", name: "Polki pearl necklace", category: "necklace", rupees: 128000, still: "polkiNecklace", collection: true, isFeatured: true },
  { slug: "polki-pearl-necklace-clasp", name: "Polki pearl necklace, clasp forward", category: "necklace", rupees: 136000, still: "polkiNecklace", availability: "sold-out" },
  { slug: "polki-pendant-necklace", name: "Polki necklace with pendant", category: "necklace", rupees: 162000, still: "polkiPendantNecklace", collection: true, isNew: true },
  { slug: "polki-pendant-necklace-silk", name: "Polki pendant necklace, silk", category: "necklace", rupees: 175000, still: "polkiPendantNecklace" },
  { slug: "emerald-drop-kundan-short", name: "Emerald-drop kundan, short", category: "necklace", rupees: 88000, still: "necklace", secondary: "worn" },
  { slug: "emerald-drop-kundan-length", name: "Emerald-drop kundan, length", category: "necklace", rupees: 92000, still: "necklace", lengths: NECKLACE_LENGTHS, availability: "made-to-order" },
  { slug: "kundan-collar-frontal", name: "Kundan collar, frontal", category: "necklace", rupees: 118000, still: "collarFront", collection: true },
  { slug: "kundan-collar-velvet", name: "Kundan collar on velvet", category: "necklace", rupees: 148000, still: "collarVelvet", collection: true, isFeatured: true },
  { slug: "floral-kundan-collar-marble", name: "Floral kundan collar, marble", category: "necklace", rupees: 125000, still: "collar" },
  { slug: "emerald-kundan-necklace-silk", name: "Emerald kundan necklace, silk", category: "necklace", rupees: 99000, still: "necklace", occasions: ["festive"] },
  { slug: "polki-pearl-choker", name: "Polki pearl choker", category: "necklace", rupees: 112000, sale: 98000, still: "polkiNecklace", occasions: ["festive"] },
  { slug: "kundan-collar-lilac", name: "Kundan collar, lilac silk", category: "necklace", rupees: 105000, still: "collar", isNew: true },

  { slug: "polki-pearl-ring", name: "Polki pearl ring", category: "ring", rupees: 36000, still: "polkiRing", sizes: RING_SIZES, isNew: true },
  { slug: "polki-pearl-ring-wide", name: "Polki pearl ring, wide band", category: "ring", rupees: 42000, still: "polkiRing", occasions: ["festive"] },
  { slug: "stacked-emerald-ring", name: "Stacked emerald ring", category: "ring", rupees: 38000, still: "emeraldRings", sizes: RING_SIZES, collection: true },
  { slug: "emerald-stack-uncut", name: "Emerald stack, uncut diamonds", category: "ring", rupees: 45500, still: "emeraldRings", occasions: ["wedding"] },
  { slug: "red-cabochon-ring", name: "Red cabochon ring", category: "ring", rupees: 28900, still: "redCabochon" },
  { slug: "red-cabochon-macro", name: "Red cabochon, macro", category: "ring", rupees: 31200, sale: 26800, still: "redCabochon" },
  { slug: "emerald-ring-pair", name: "Emerald ring pair", category: "ring", rupees: 48000, still: "emeraldRings", sizes: RING_SIZES },
  { slug: "polki-ring-marble", name: "Polki ring, marble", category: "ring", rupees: 33800, still: "polkiRing", isNew: true },
  { slug: "emerald-ring-to-order", name: "Emerald ring, made to order", category: "ring", rupees: 52000, still: "emeraldRings", availability: "made-to-order", occasions: ["wedding"] },
  { slug: "polki-pearl-ring-last", name: "Polki pearl ring, last sitting", category: "ring", rupees: 41000, still: "polkiRing", availability: "sold-out" },

  { slug: "pearl-chandbali", name: "Pearl chandbali", category: "earring", rupees: 26500, still: "pearlChandbali", collection: true, isNew: true, occasions: ["wedding"] },
  { slug: "pearl-drop-chandbali", name: "Pearl-drop chandbali", category: "earring", rupees: 29200, sale: 24800, still: "pearlChandbali" },
  { slug: "emerald-chandbali-pair", name: "Emerald chandbali pair", category: "earring", rupees: 32000, still: "emeraldChandbali" },
  { slug: "emerald-chandbali-silk", name: "Emerald chandbali, silk", category: "earring", rupees: 35600, still: "emeraldChandbali", occasions: ["festive"] },
  { slug: "pearl-chandbali-day", name: "Pearl chandbali, day", category: "earring", rupees: 21400, still: "pearlChandbali", occasions: ["everyday"] },
  { slug: "emerald-drop-chandbali", name: "Emerald-drop chandbali", category: "earring", rupees: 24000, still: "emeraldChandbali" },
  { slug: "pearl-chandbali-last", name: "Pearl chandbali, last pair", category: "earring", rupees: 27800, still: "pearlChandbali", availability: "sold-out" },
  { slug: "emerald-chandbali-to-order", name: "Emerald chandbali, made to order", category: "earring", rupees: 38400, still: "emeraldChandbali", availability: "made-to-order" },

  { slug: "emerald-bangle-stack", name: "Emerald bangle stack", category: "bracelet", rupees: 54000, still: "bangleCushion", secondary: "campaign", collection: true },
  { slug: "emerald-bangles-cushion", name: "Emerald bangles, cushion", category: "bracelet", rupees: 58000, still: "bangleCushion", occasions: ["wedding"] },
  { slug: "kundan-bangle-pair", name: "Kundan bangle pair", category: "bracelet", rupees: 46000, still: "emeraldBangles" },
  { slug: "kundan-bangles-marble", name: "Kundan bangles, marble", category: "bracelet", rupees: 49500, sale: 42000, still: "emeraldBangles", occasions: ["wedding"] },
  { slug: "emerald-bangle-trio", name: "Emerald bangle trio", category: "bracelet", rupees: 64000, still: "bangleCushion", isFeatured: true },
  { slug: "kundan-bangles-silk", name: "Kundan bangles, lilac silk", category: "bracelet", rupees: 43200, still: "emeraldBangles", occasions: ["everyday"] },
  { slug: "emerald-bangles-held", name: "Emerald bangles, held", category: "bracelet", rupees: 56000, still: "bangleCushion", availability: "unavailable" },
  { slug: "kundan-bangles-last", name: "Kundan bangles, last pair", category: "bracelet", rupees: 44800, still: "emeraldBangles", availability: "sold-out" },

  { slug: "polki-oval-pendant", name: "Polki oval pendant", category: "pendant", rupees: 14800, still: "polkiPendant" },
  { slug: "polki-pendant-on-chain", name: "Polki pendant on a chain", category: "pendant", rupees: 17200, still: "polkiPendant" },
  { slug: "emerald-drop-pendant-marble", name: "Emerald-drop pendant, marble", category: "pendant", rupees: 19800, still: "emeraldPendant", isNew: true },
  { slug: "emerald-pendant-short-chain", name: "Emerald pendant, short chain", category: "pendant", rupees: 23600, sale: 19800, still: "emeraldPendant", occasions: ["festive"] },
  { slug: "fine-chain-emerald-pendant", name: "Fine-chain emerald pendant", category: "pendant", rupees: 12500, still: "emeraldChain" },
  { slug: "emerald-pendant-chain-loop", name: "Emerald pendant, chain loop", category: "pendant", rupees: 16800, still: "emeraldChain" },
  { slug: "polki-pendant-held", name: "Polki pendant, held", category: "pendant", rupees: 18900, still: "polkiPendant", availability: "unavailable" },

  { slug: "kundan-bridal-marble", name: "Kundan bridal set, marble", category: "set", rupees: 190000, still: "bridal", collection: true, isFeatured: true, availability: "made-to-order" },
  { slug: "kundan-bridal-lavender", name: "Kundan bridal set, lavender", category: "set", rupees: 210000, still: "bridal", secondary: "worn", collection: true },
  { slug: "emerald-bridal-set-silk", name: "Emerald bridal set, silk", category: "set", rupees: 235000, still: "bridal", availability: "made-to-order" },
  { slug: "bridal-necklace-and-chandbalis", name: "Bridal necklace and chandbalis", category: "set", rupees: 156000, sale: 142000, still: "bridal", occasions: ["festive"] },
  { slug: "emerald-bridal-festive", name: "Emerald bridal set, festive", category: "set", rupees: 178000, still: "bridal", secondary: "worn", occasions: ["festive"], isNew: true },
];

function plate(id: StillId): ProductImage {
  const still = STILLS[id];
  return {
    role: still.role,
    aspect: still.aspect,
    src: still.src,
    crop: still.crop,
    alt: still.alt,
    ...(still.position ? { position: still.position } : {}),
  };
}

function piece(row: Row): Product {
  const still = STILLS[row.still];
  const images = [plate(row.still), ...(row.secondary ? [plate(row.secondary)] : [])] as unknown as ProductImages;
  const axis: VariantAxis | null = row.sizes ? "size" : row.lengths ? "length" : null;
  const values = row.sizes ?? row.lengths ?? [];
  const availability = row.availability ?? "available";
  const built: ProductVariant[] = (values.length > 0 ? values : [""]).map((value, index) => ({
    id: asVariantId(values.length > 0 ? `v_sample_${row.slug}_${index}` : `v_sample_${row.slug}`),
    options: axis && value ? { [axis]: value } : {},
    price: inr(row.rupees),
    ...(row.sale !== undefined ? { salePrice: inr(row.sale) } : {}),
    availability,
  }));
  const [first, ...rest] = built;
  if (!first) throw new Error(`sample piece ${row.slug} has no variant`);

  return {
    id: asProductId(`p_sample_${row.slug}`),
    slug: row.slug,
    name: row.name,
    category: row.category,
    tags: row.tags ?? still.tags,
    ...(row.isNew ? { isNew: true } : {}),
    ...(row.isFeatured ? { isFeatured: true } : {}),
    ...(row.sizes ? { isSize: true, sizes: row.sizes } : {}),
    options: axis ? [{ axis, values }] : [],
    variants: [first, ...rest],
    images,
    collections: row.collection ? ["modern-classics"] : [],
    occasions: row.occasions ?? still.occasions,
    materialLine: still.material,
    description: still.description,
    care: null,
    ...(row.category === "set"
      ? { componentSlugs: ["emerald-drop-kundan-necklace", "chandbali-earrings"] }
      : {}),
    ...(availability === "made-to-order" ? { labels: ["made-to-order"] as const } : {}),
  };
}

export const samplePieces: readonly Product[] = ROWS.map(piece);

export const sampleCollectionSlugs: readonly string[] = samplePieces
  .filter((product) => product.collections.includes("modern-classics"))
  .map((product) => product.slug);
