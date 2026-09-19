#!/usr/bin/env node
/**
 * Verifies the colour tokens against the contrast floors in
 * specs/design-system/responsive-accessibility — "Contrast and non-colour encoding".
 *
 * Tokens are authored in OKLCH. This converts OKLCH -> OKLab -> linear sRGB,
 * which is already the space WCAG relative luminance is defined in, then
 * reports the ratio for every text/surface pairing the system uses.
 *
 * Run: node scripts/contrast.mjs
 */

/** OKLCH (L 0..1, C, H degrees) -> linear sRGB triplet, clamped to gamut. */
function oklchToLinearSrgb(L, C, H) {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => Math.min(1, Math.max(0, v)));
}

/** WCAG 2.x relative luminance from linear sRGB. */
function luminance([r, g, b]) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(fg, bg) {
  const a = luminance(oklchToLinearSrgb(...fg));
  const b = luminance(oklchToLinearSrgb(...bg));
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/** Linear sRGB -> #rrggbb, for reference only. Tokens stay authored in OKLCH. */
function hex(fg) {
  const enc = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
  return (
    "#" +
    oklchToLinearSrgb(...fg)
      .map((v) => Math.round(enc(v) * 255).toString(16).padStart(2, "0"))
      .join("")
  );
}

/** Composite a token over a surface at `alpha` and return the result in linear sRGB. */
function over(fg, bg, alpha) {
  const f = oklchToLinearSrgb(...fg);
  const b = oklchToLinearSrgb(...bg);
  return f.map((v, i) => v * alpha + b[i] * (1 - alpha));
}

function contrastLinear(fgLinear, bg) {
  const a = luminance(fgLinear);
  const b = luminance(oklchToLinearSrgb(...bg));
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

// ---------------------------------------------------------------------------
// Tokens. Chroma ceiling is 0.02 — see design.md, decision 2.
// ---------------------------------------------------------------------------
const CHROMA_CEILING = 0.02;

export const TOKENS = {
  paper: [0.96, 0.006, 85],
  ink: [0.18, 0.008, 85],
  graphite: [0.52, 0.008, 85],
  "graphite-inverse": [0.68, 0.008, 85],
};

const HAIRLINE_ALPHA = 0.14;

// Pairings the system actually renders, with the floor each must clear.
const CHECKS = [
  ["ink on paper", TOKENS.ink, TOKENS.paper, 4.5],
  ["graphite on paper", TOKENS.graphite, TOKENS.paper, 4.5],
  ["paper on ink", TOKENS.paper, TOKENS.ink, 4.5],
  ["graphite-inverse on ink", TOKENS["graphite-inverse"], TOKENS.ink, 4.5],
  // Control boundaries and focus indicators use ink / paper, never hairline.
  ["ink boundary on paper", TOKENS.ink, TOKENS.paper, 3],
  ["paper boundary on ink", TOKENS.paper, TOKENS.ink, 3],
];

function main() {
  let failed = 0;
  const rows = [];

  for (const [name, token] of Object.entries(TOKENS)) {
    const chroma = token[1];
    if (chroma > CHROMA_CEILING) {
      console.error(`FAIL  ${name}: chroma ${chroma} exceeds ceiling ${CHROMA_CEILING}`);
      failed++;
    }
  }

  for (const [label, fg, bg, floor] of CHECKS) {
    const ratio = contrast(fg, bg);
    const ok = ratio >= floor;
    if (!ok) failed++;
    rows.push([ok ? "pass" : "FAIL", label, ratio.toFixed(2), `>= ${floor}`]);
  }

  // Hairline is decorative only — reported, never asserted against a text floor.
  const hairOnPaper = contrastLinear(over(TOKENS.ink, TOKENS.paper, HAIRLINE_ALPHA), TOKENS.paper);
  rows.push(["info", `hairline on paper (ink @ ${HAIRLINE_ALPHA})`, hairOnPaper.toFixed(2), "decorative"]);

  const w = Math.max(...rows.map((r) => r[1].length));
  for (const [status, label, ratio, floor] of rows) {
    console.log(`${status.padEnd(5)} ${label.padEnd(w)}  ${ratio.padStart(6)}:1  ${floor}`);
  }

  console.log("\nhex reference (for inspection only — tokens are authored in OKLCH):");
  for (const [name, t] of Object.entries(TOKENS)) {
    console.log(`  ${name.padEnd(17)} ${hex(t)}  oklch(${(t[0] * 100).toFixed(1)}% ${t[1]} ${t[2]})`);
  }

  if (failed > 0) {
    console.error(`\n${failed} contrast/chroma check(s) failed.`);
    process.exit(1);
  }
  console.log("\nAll contrast and chroma checks pass.");
}

if (import.meta.url === `file://${process.argv[1]}`) main();
