#!/usr/bin/env node
/**
 * Generates the site's editorial photography through OpenRouter.
 *
 * This is a content-workflow tool, not application code — nothing in `app/`,
 * `components/` or `lib/` imports it, and the storefront never calls a model at
 * request time. It exists so the shoot brief declared in
 * `components/home/plates.ts` and `BRAND-INPUTS.md` can be satisfied before the
 * business has commissioned a real shoot, and so each frame is reproducible
 * from a prompt kept under version control.
 *
 * Every prompt is derived from the two art-direction prompts in
 * SHUBHA-BRAND-DIRECTION.md. Changing a frame means changing its prompt here.
 *
 * The key is read from `.env` at the repo root and is never written to disk,
 * logged, or embedded in output. There is no credential in this file.
 *
 *   node scripts/generate-images.mjs            # only frames not yet on disk
 *   node scripts/generate-images.mjs --force    # regenerate everything
 *   node scripts/generate-images.mjs hero       # one frame by id
 */

import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const MODEL = "google/gemini-3-pro-image";

/**
 * The model's default output is about 1.1MP — 1264px on the long edge — which
 * the full-bleed frames upscale past on any desktop and badly on a 2x display.
 * "2K" returns ~2528px instead. "4K" is rejected by this model.
 */
const IMAGE_SIZE = "2K";
const OUT_DIR = join("public", "images");

/** Wider than any frame is served at 2x on a 1920 viewport; larger is dead weight. */
const MAX_WIDTH = 2400;

/** Shared direction. Appended to every prompt so the set reads as one shoot. */
const HOUSE_STYLE =
  "Realistic campaign photography for a premium Indian jewellery house named Shubha Abharan. " +
  "Emerald and deep green silk, cream marble, warm gold kundan and polki jewellery, " +
  "soft daylight, tactile materials, real metal reflection and gemstone facets, " +
  "shallow depth of field, subtle film grain, slight natural imperfection. " +
  "Wherever a person or a part of one appears, she is the same South Asian woman with warm " +
  "deep brown skin, so the whole set reads as one shoot with one model. " +
  "Absolutely no text, no lettering, no logo, no watermark, no signature, " +
  "no artificial sparkle or lens flare, no CGI or plastic render look, " +
  "no floating objects, no neon, no gradient background.";

/**
 * Aspect ratios are requested rather than cropped afterwards: `Plate` renders
 * with `object-cover`, so a frame shot at the wrong ratio loses its composition
 * at the edges instead of being letterboxed.
 */
/**
 * Product-card stills. Category frames are shot for a circular CSS crop on the
 * type index — some models return an actual circular vignette, which then sits
 * in a square card as a round photograph. These eight are the catalog's card
 * photographs: full-bleed 1:1, marble to every corner, no mask.
 */
const PRODUCT_CARD_STILL =
  "Square 1:1 full-bleed catalog photograph for a product card. " +
  "The picture must fill all four corners of the square — marble or silk must reach the edges. " +
  "Forbidden: circular vignette, round mask, white or empty corners, oval crop, " +
  "round marble disc used as a circular frame, circular studio sweep. " +
  "Set: a rectangular cream marble slab and a fold of emerald green silk, " +
  "soft daylight from camera-left, camera looking slightly down, same colour grade as the house. " +
  "Jewellery centred, occupying most of the square. No person. No text. No logo.";

const PRODUCT_CARD_FRAMES = [
  {
    id: "product-necklace",
    aspect: "1:1",
    prompt:
      `${PRODUCT_CARD_STILL} ` +
      "Subject: a circular gold kundan necklace with emerald drops, laid flat on the marble. " +
      "The necklace is round; the photograph is not.",
  },
  {
    id: "product-collar",
    aspect: "1:1",
    prompt:
      `${PRODUCT_CARD_STILL} ` +
      "Subject: a floral gold kundan collar with emerald stones, uncut diamonds and pearl drops, " +
      "laid across the marble so the central pendant is visible.",
  },
  {
    id: "product-earrings",
    aspect: "1:1",
    prompt:
      `${PRODUCT_CARD_STILL} ` +
      "Subject: a pair of gold chandbali earrings with emerald drops, laid as a pair on the marble.",
  },
  {
    id: "product-pendant",
    aspect: "1:1",
    prompt:
      `${PRODUCT_CARD_STILL} ` +
      "Subject: a gold kundan pendant with an emerald drop on a short chain, resting on the marble. " +
      "Do not place it on a round stone.",
  },
  {
    id: "product-rings",
    aspect: "1:1",
    prompt:
      `${PRODUCT_CARD_STILL} ` +
      "Subject: two stacked gold rings with emerald and uncut-diamond settings, sitting on the marble.",
  },
  {
    id: "product-bangles",
    aspect: "1:1",
    prompt:
      `${PRODUCT_CARD_STILL} ` +
      "Subject: a pair of gold kundan bangles with emerald stones, overlapping on the marble.",
  },
  {
    id: "product-bridal-set",
    aspect: "1:1",
    prompt:
      `${PRODUCT_CARD_STILL} ` +
      "Subject: the bridal set laid out — circular gold kundan necklace with emerald drops and " +
      "the matching pair of chandbali earrings, together on the marble.",
  },
  {
    id: "product-chain",
    aspect: "1:1",
    prompt:
      `${PRODUCT_CARD_STILL} ` +
      "Subject: a longer fine gold chain with the same kundan pendant and emerald drop, " +
      "the chain looping across the marble so the piece reads as a chain-and-pendant, not a stud.",
  },
];

const FRAMES = [
  {
    id: "hero",
    aspect: "16:9",
    prompt:
      "Jewellery campaign portrait for an overlay hero. South Asian woman in three-quarter profile, " +
      "emerald green silk saree, wearing an ornate gold kundan necklace with emerald drops and matching " +
      "chandbali earrings and a maang tikka, one hand near the collarbone. Lush foliage behind her. " +
      "She is placed in the right half of a wide 16:9 frame so the left third is softer darker foliage " +
      "that can hold overlay typography. Natural skin texture, no retouched plastic skin, no direct " +
      "eye contact with camera.",
  },
  {
    id: "hero-2",
    aspect: "16:9",
    prompt:
      "Same sitting as the hero frame: the same South Asian woman, same emerald green silk saree, " +
      "same gold kundan necklace with emerald drops, same chandbali earrings, same maang tikka, " +
      "same palm foliage. She turns slightly toward the camera, right hand still at the collarbone. " +
      "Wide 16:9, figure in the right half, darker foliage on the left for overlay type. No text.",
  },
  {
    id: "hero-3",
    aspect: "16:9",
    prompt:
      "Same sitting as the hero frame: the same woman, same jewellery, same saree, same foliage. " +
      "Three-quarter profile looking left, necklace fully visible, no hand on the collar. " +
      "Wide 16:9, figure in the right half, darker foliage on the left. No text.",
  },
  {
    id: "collection",
    aspect: "5:4",
    prompt:
      "Jewellery still life, almost square. A large ornate gold and pearl necklace — a floral kundan " +
      "collar with a central pendant — filling most of the frame on a cream marble slab. " +
      "Warm side light, the piece centred so a circular or rectangular crop keeps the necklace intact. " +
      "No person. No text.",
  },
  {
    id: "collection-2",
    aspect: "4:3",
    prompt:
      "The same floral gold kundan collar with emerald stones, uncut diamonds and pearl drops as the " +
      "collection frame, photographed more frontally on cream marble with a fold of emerald silk. " +
      "No person. No text.",
  },
  {
    id: "collection-3",
    aspect: "4:3",
    prompt:
      "The same floral gold kundan collar with emerald stones, uncut diamonds and pearl drops as the " +
      "collection frame, now laid on dark green marble so the piece fills the frame. No person. No text.",
  },
  {
    id: "detail",
    aspect: "1:1",
    prompt:
      "Extreme macro of a single piece of handmade gold jewellery: granulation and fine twisted " +
      "wire work around a deep red garnet cabochon, the bezel visibly set by hand. " +
      "Shot against near-black espresso-brown ground so the metal is the only lit thing in frame. " +
      "Focus on the stone's edge, the rest falling away. Dust and micro-scratches visible — " +
      "this is a worked object, not a render.",
  },
  {
    id: "campaign",
    aspect: "16:9",
    prompt:
      "Wide cinematic campaign frame. A South Asian woman seated, seen from the side, wearing " +
      "stacked gold bangles, rings and a heavy necklace, emerald and maroon silk around her. " +
      "Dark festive interior, warm lamp light. She occupies the right half so the left can hold " +
      "overlay typography. Intimate, still, unposed. No text.",
  },
  {
    id: "category-necklaces",
    aspect: "1:1",
    prompt:
      "Square product still life on a soft cream ground. An ornate gold necklace arranged in a " +
      "circle, perfectly centred so a circular crop keeps the whole piece. Soft even light, no person.",
  },
  {
    id: "category-rings",
    aspect: "1:1",
    prompt:
      "Square product still life on a soft cream ground. Two or three gold rings stacked or grouped " +
      "dead-centre so a circular crop keeps them. Soft even light, no person.",
  },
  {
    id: "category-bracelets",
    aspect: "1:1",
    prompt:
      "Square product still life on a soft cream ground. A pair of gold bangles centred so a " +
      "circular crop keeps them. Soft even light, no person.",
  },
  {
    id: "category-earrings",
    aspect: "1:1",
    prompt:
      "Square product still life on a soft cream ground. A pair of gold chandbali or jhumka earrings " +
      "centred so a circular crop keeps both. Soft even light, no person.",
  },
  {
    id: "category-pendants",
    aspect: "1:1",
    prompt:
      "Square product still life on a soft cream ground. A single gold pendant on a short chain, " +
      "centred so a circular crop keeps the whole piece. Soft even light, no person.",
  },
  {
    id: "category-bangles",
    aspect: "1:1",
    prompt:
      "Square product still life on a soft cream ground. Three stacked gold kundan bangles with " +
      "emerald stones, perfectly centred so a circular crop keeps the stack. Soft even light, no person.",
  },
  ...PRODUCT_CARD_FRAMES,
];

function loadKey() {
  const raw = readFileSync(".env", "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    if (trimmed.slice(0, eq).trim() !== "OPENROUTER_API_KEY") continue;
    return trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
  }
  throw new Error("OPENROUTER_API_KEY is not set in .env");
}

async function generate(key, frame) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      modalities: ["image", "text"],
      image_config: { aspect_ratio: frame.aspect, image_size: IMAGE_SIZE },
      messages: [{ role: "user", content: `${frame.prompt}\n\n${HOUSE_STYLE}` }],
    }),
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${await response.text()}`);
  }

  const json = await response.json();
  if (json.error) throw new Error(JSON.stringify(json.error));

  const url = json.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!url) throw new Error(`no image returned: ${JSON.stringify(json).slice(0, 400)}`);

  const [, mime, base64] = /^data:([^;]+);base64,(.+)$/.exec(url) ?? [];
  if (!base64) throw new Error("image was not returned as a data URI");

  const buffer = Buffer.from(base64, "base64");

  // Encoded to JPEG rather than stored as the returned PNG: these are
  // photographs, and a 1.6MB lossless PNG of a photograph is 8x the file for no
  // visible gain. `sharp` ships with Next and is used here only by this script —
  // if it is ever absent the original bytes are written unchanged.
  const path = join(OUT_DIR, `${frame.id}.jpg`);
  try {
    const { default: sharp } = await import("sharp");
    await sharp(buffer)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:4:4" })
      .toFile(path);
  } catch {
    writeFileSync(join(OUT_DIR, `${frame.id}.${mime === "image/jpeg" ? "jpg" : "png"}`), buffer);
  }
  return path;
}

const args = process.argv.slice(2);
const force = args.includes("--force");
const only = args.filter((arg) => !arg.startsWith("--"));

mkdirSync(OUT_DIR, { recursive: true });
const key = loadKey();

const queue = FRAMES.filter((frame) => only.length === 0 || only.includes(frame.id)).filter(
  (frame) =>
    force ||
    !["png", "jpg"].some((extension) => existsSync(join(OUT_DIR, `${frame.id}.${extension}`))),
);

if (queue.length === 0) {
  console.log("nothing to generate — pass --force to regenerate");
  process.exit(0);
}

let failed = 0;
for (const frame of queue) {
  process.stdout.write(`${frame.id.padEnd(22)} ${frame.aspect.padEnd(6)} `);
  try {
    const path = await generate(key, frame);
    const { size } = await import("node:fs").then((fs) => fs.statSync(path));
    console.log(`-> ${path} (${Math.round(size / 1024)} KB)`);
  } catch (error) {
    failed++;
    console.log(`FAILED — ${error.message.slice(0, 300)}`);
  }
}

process.exit(failed > 0 ? 1 : 0);
