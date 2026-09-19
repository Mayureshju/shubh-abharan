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
    excerpt: "Gold kundan, emerald stones and pearl drops laid on cream stone beside a fold of silk.",
    publishedOn: "2026-09-12",
    image: {
      role: "macro",
      aspect: "4/5",
      aspectMd: "5/4",
      src: "/images/collection.jpg",
      crop: "kundan collar filling a still-life frame",
      alt: "A gold kundan necklace with emerald stones and pearl drops, laid across cream marble beside a fold of emerald silk.",
    },
    body: [
      "The collar sits almost square on cream marble. Floral kundan work fills the frame; pearl drops hang into the lower third, and a fold of emerald silk holds the right edge.",
      "This is a still life of one piece, not a catalogue of many. The photograph is the same frame the homepage uses for the Modern Classics split — the necklace as an object, centre-weighted, no wearer.",
    ],
  },
  {
    slug: "chandbali-on-cream-marble",
    title: "Chandbalis, paired",
    excerpt: "A pair of gold chandbali earrings with emerald drops, laid on cream marble against emerald silk.",
    publishedOn: "2026-09-08",
    image: {
      role: "detail",
      aspect: "1/1",
      src: "/images/category-earrings.jpg",
      crop: "pair of chandbalis centred on cream ground",
      alt: "A pair of gold chandbali earrings with emerald drops, laid on cream marble against emerald silk.",
    },
    body: [
      "The earrings are photographed as a pair, not as a single drop cropped tight. Each chandbali carries an emerald drop; the cream marble and the silk behind them are the same ground as the necklace stills.",
      "A circular crop on the homepage type index takes this square frame. The article keeps the square, so the pair stays whole.",
    ],
  },
  {
    slug: "kundan-in-lamplight",
    title: "Kundan in lamplight",
    excerpt: "Necklace, stacked bangles and rings worn in a lamp-lit interior, against empty stone wall.",
    publishedOn: "2026-09-02",
    image: {
      role: "worn",
      aspect: "4/5",
      aspectMd: "16/9",
      src: "/images/campaign.jpg",
      position: "60% 50%",
      crop: "figure in a lit interior, jewellery at the nape and wrist",
      alt: "A woman seated in an emerald and maroon silk saree in a lamp-lit interior, wearing a gold kundan necklace, stacked bangles and rings, looking toward empty stone wall on the left.",
    },
    body: [
      "The campaign frame turns the wearer away from the camera. The necklace sits at the nape; bangles stack at the wrist; rings catch the lamp. Empty stone wall on the left is the ground the closing statement uses for type.",
      "Nothing in the frame is a workshop claim. It is one seated figure, one interior, the jewellery that is actually on her.",
    ],
  },
];
