#!/usr/bin/env node
/**
 * Catches the anti-generic rules that the Tailwind theme cannot.
 *
 * globals.css clears the colour, radius, type, shadow and blur namespaces, so
 * `bg-blue-600`, `rounded-2xl`, `text-sm`, `shadow-lg` and `backdrop-blur-sm`
 * do not compile at all. What survives are Tailwind's *static* utilities,
 * which have no backing theme namespace and cannot be removed that way, plus
 * raw CSS written by hand. Those are what this script polices.
 *
 * It also asserts that the motion tokens in lib/motion.ts still match the
 * custom properties in app/globals.css.
 *
 * Escape hatch: a line carrying `slop-check: allow <reason>` is skipped. Use it
 * for the one permitted gradient — a single-direction black scrim at 35% or
 * less over photography where text contrast fails without it.
 *
 * Run: node scripts/check-slop.mjs
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const ROOTS = ["app", "components", "lib"];
const EXTENSIONS = new Set([".ts", ".tsx", ".css", ".js", ".jsx", ".mjs"]);
const ALLOW = /slop-check:\s*allow/i;

/** Files permitted to carry a shadow: overlay surfaces that float above the page. */
const OVERLAY_FILES = [
  join("components", "nav", "NavOverlay.tsx"),
  join("components", "cart", "CartDrawer.tsx"),
];

const RULES = [
  {
    id: "rule 1 — gradients",
    pattern: /\b(linear-gradient|radial-gradient|conic-gradient)\s*\(|\bbg-(gradient-to-|linear-to-|radial\b|conic\b)/,
    message:
      "No gradient. The one exception is a single-direction black scrim at 35% opacity or less over photography — mark it `slop-check: allow scrim`.",
  },
  {
    id: "rule 2 — backdrop-filter",
    pattern: /backdrop-filter|\bbackdrop-blur\b|\bbackdrop-blur-/,
    message: "No backdrop-filter. Glassmorphism is out of the visual language.",
  },
  {
    id: "rule 3 — content shadow",
    pattern: /\bbox-shadow\b|\bshadow-\[|\bdrop-shadow-\[/,
    message:
      "Shadow is permitted only on overlay surfaces (navigation overlay, cart drawer, modal dialogs). Content depth comes from hairline rules and image scale.",
    allowIn: OVERLAY_FILES,
  },
  {
    id: "rule 4 — radius",
    pattern: /\brounded-(full\b|[strebxy]{1,2}-full\b)/,
    message:
      "Use the `pill` radius token (`rounded-pill`) for CTAs and circular stills, not the static `rounded-full` utility.",
  },
];

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (EXTENSIONS.has(entry.slice(entry.lastIndexOf(".")))) out.push(full);
  }
  return out;
}

/**
 * Blanks out comments while preserving line numbers. A forbidden token named in
 * prose — this file's own rule descriptions, or a JSDoc block explaining why a
 * pattern is banned — is documentation, not shipped CSS.
 */
function stripComments(source) {
  const withoutBlocks = source.replace(/\/\*[\s\S]*?\*\//g, (match) =>
    match.replace(/[^\n]/g, " "),
  );

  return withoutBlocks
    .split("\n")
    .map((line) => {
      const trimmed = line.trimStart();
      return trimmed.startsWith("//") || trimmed.startsWith("*") ? "" : line;
    })
    .join("\n");
}

function checkRules() {
  const findings = [];

  for (const root of ROOTS) {
    for (const file of walk(root)) {
      const rel = relative(process.cwd(), file);
      const lines = stripComments(readFileSync(file, "utf8")).split("\n");

      for (const rule of RULES) {
        if (rule.allowIn?.some((allowed) => rel.endsWith(allowed))) continue;

        lines.forEach((line, index) => {
          // Skip the rule definitions in this script and prose in comments that
          // merely name a forbidden token.
          if (!rule.pattern.test(line)) return;
          if (ALLOW.test(line)) return;
          findings.push({ rule: rule.id, file: rel, line: index + 1, text: line.trim().slice(0, 100), message: rule.message });
        });
      }
    }
  }

  return findings;
}

/**
 * Rule 6, scoped to the homepage: `display` at most twice. Title is permitted
 * for section headings on the mood-board homepage.
 *
 * ponytail: counts occurrences in source, not renders.
 */
function checkHomepageTypeBudget() {
  const homepage = existsSync(join("app", "(storefront)", "page.tsx"))
    ? join("app", "(storefront)", "page.tsx")
    : join("app", "page.tsx");
  const files = [homepage, ...walk(join("components", "home"))];
  const findings = [];
  let displays = 0;

  for (const file of files) {
    const source = stripComments(readFileSync(file, "utf8"));
    displays += source.match(/\btext-display\b/g)?.length ?? 0;
  }

  if (displays > 2) {
    findings.push(
      `the homepage renders the \`display\` role ${displays} times across app/page.tsx and components/home/. Rule 6 caps it at two — the hero heading and the closing statement.`,
    );
  }

  return findings;
}

/** design.md decision 7: six values live in two files; assert they agree. */
function checkMotionSync() {
  const ts = readFileSync(join("lib", "motion.ts"), "utf8");
  const css = readFileSync(join("app", "globals.css"), "utf8");
  const findings = [];

  for (const token of ["instant", "quick", "base", "slow"]) {
    const tsMatch = new RegExp(`\\b${token}:\\s*([0-9.]+)`).exec(ts);
    const cssMatch = new RegExp(`--duration-${token}:\\s*([0-9.]+)ms`).exec(css);

    if (!tsMatch) {
      findings.push(`lib/motion.ts is missing duration "${token}"`);
      continue;
    }
    if (!cssMatch) {
      findings.push(`app/globals.css is missing --duration-${token}`);
      continue;
    }

    const seconds = Number(tsMatch[1]);
    const ms = Number(cssMatch[1]);
    if (Math.round(seconds * 1000) !== ms) {
      findings.push(
        `motion token "${token}" is out of sync: lib/motion.ts has ${seconds}s (${seconds * 1000}ms), app/globals.css has ${ms}ms`,
      );
    }
  }

  for (const [name, cssName] of [["out", "out"], ["inOut", "inout"]]) {
    const tsMatch = new RegExp(`${name}:\\s*\\[([^\\]]+)\\]`).exec(ts);
    const cssMatch = new RegExp(`--ease-${cssName}:\\s*cubic-bezier\\(([^)]+)\\)`).exec(css);
    if (!tsMatch || !cssMatch) {
      findings.push(`easing "${name}" missing from lib/motion.ts or app/globals.css`);
      continue;
    }
    const normalise = (s) => s.split(",").map((v) => Number(v.trim())).join(",");
    if (normalise(tsMatch[1]) !== normalise(cssMatch[1])) {
      findings.push(
        `easing "${name}" is out of sync: lib/motion.ts has [${normalise(tsMatch[1])}], app/globals.css has [${normalise(cssMatch[1])}]`,
      );
    }
  }

  return findings;
}

const findings = checkRules();
const motion = checkMotionSync();
const homepage = checkHomepageTypeBudget();

if (findings.length === 0 && motion.length === 0 && homepage.length === 0) {
  console.log("check-slop: pass — no forbidden patterns, motion tokens in sync.");
  process.exit(0);
}

for (const finding of findings) {
  console.error(`\n${finding.file}:${finding.line}  [${finding.rule}]`);
  console.error(`  ${finding.text}`);
  console.error(`  ${finding.message}`);
}

for (const message of motion) {
  console.error(`\n[motion token sync]  ${message}`);
}

for (const message of homepage) {
  console.error(`\n[rule 6 — homepage type budget]  ${message}`);
}

console.error(
  `\ncheck-slop: ${findings.length + motion.length + homepage.length} finding(s).`,
);
process.exit(1);
