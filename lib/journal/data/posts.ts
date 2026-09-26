/**
 * The only place journal posts are authored.
 *
 * Copy names what the photograph shows. These three pieces are development
 * content recorded in BRAND-INPUTS.md — not a CMS.
 */

import type { JournalPost } from "../types";

export const posts: readonly JournalPost[] = [
  {
    slug: "kundan-collar-on-marble",
    title: "A collar on marble",
    excerpt: "A floral kundan collar and its pendant, laid on ivory marble beside a fold of lilac silk.",
    publishedOn: "2026-09-12",
    image: {
      role: "macro",
      aspect: "4/5",
      aspectMd: "5/4",
      src: "/images/collection-v2.jpg",
      crop: "kundan collar filling a still-life frame",
      alt: "A floral gold kundan collar with a central pendant, laid on an ivory marble slab beside a fold of lilac silk and scattered lilac petals.",
    },
    body: [
      "The collar sits on an ivory marble slab. Floral kundan work fills the frame, its pendant rests just below, and a fold of lilac silk holds the right edge.",
      "This is a still life of one piece, not a catalogue of many. The photograph is the same frame the homepage uses for the Modern Classics split — the necklace as an object, centre-weighted, no wearer.",
    ],
  },
  {
    slug: "chandbali-on-cream-marble",
    title: "Chandbalis, paired",
    excerpt: "A pair of gold kundan chandbali earrings, laid on ivory marble among lisianthus and lilac silk.",
    publishedOn: "2026-09-08",
    image: {
      role: "detail",
      aspect: "1/1",
      src: "/images/category-earrings-v2.jpg",
      crop: "pair of chandbalis centred on ivory marble",
      alt: "A pair of gold kundan chandbali earrings, laid on ivory marble among lisianthus and lilac silk.",
    },
    body: [
      "The earrings are photographed as a pair, not as a single drop cropped tight. The ivory marble and the lilac silk behind them are the same ground as the necklace stills.",
      "A circular crop on the homepage type index takes this square frame. The article keeps the square, so the pair stays whole.",
    ],
  },
  {
    slug: "kundan-in-lamplight",
    title: "Kundan in lamplight",
    excerpt: "Necklace and stacked bangles worn in a lamp-lit room, beside a sunlit ivory wall.",
    publishedOn: "2026-09-02",
    image: {
      role: "worn",
      aspect: "4/5",
      aspectMd: "16/9",
      src: "/images/campaign.jpg",
      position: "60% 50%",
      crop: "figure in a lit interior, jewellery at the nape and wrist",
      alt: "A woman seated in a lilac silk saree with a plum border in a lamp-lit room, wearing a gold kundan necklace and stacked bangles, a sunlit ivory wall on the left.",
    },
    body: [
      "The campaign frame turns the wearer into profile. The necklace sits at the collarbone; bangles stack at the wrist and catch the lamp. The sunlit ivory wall on the left is the ground the closing statement uses for type.",
      "Nothing in the frame is a workshop claim. It is one seated figure, one interior, the jewellery that is actually on her.",
    ],
  },
];
