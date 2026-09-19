#!/usr/bin/env node
/**
 * Catalog integrity — the things the compiler cannot check.
 *
 * TypeScript already guarantees shape: a product has at least one image and at
 * least one variant (non-empty tuples), a `scale` image carries its dimension,
 * a category and a variant axis come from closed unions, and no forbidden
 * field exists on the types. What it cannot see is whether the *references*
 * between records resolve — a collection slug that matches nothing, a set
 * naming a component that was deleted, two variants describing the same
 * configuration.
 *
 * This script loads the fixture modules directly. Node strips the types, which
 * is why lib/catalog/data/*.ts import with explicit .ts specifiers: Node's ESM
 * resolver, unlike the bundler's, requires the extension.
 *
 * Adding a test runner to assert facts about a handful of hand-authored
 * literals would be a dependency, a config file and a CI step. This is the
 * whole check.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { products } from "../lib/catalog/data/products.ts";
import { collections } from "../lib/catalog/data/collections.ts";
import { brand } from "../lib/brand.ts";

const CATALOG_ROOT = join("lib", "catalog");
const EXTENSIONS = new Set([".ts", ".tsx"]);

/**
 * Field names the model may never carry. Rule 8 of DESIGN-SYSTEM.md is enforced
 * by the types not declaring these; this is the tripwire for someone adding one
 * back. Matched as whole identifiers against comment-stripped source, so a
 * forbidden word in prose — this file's own list included — is documentation.
 */
const FORBIDDEN_FIELDS = [
  "rating",
  "ratings",
  "review",
  "reviews",
  "reviewCount",
  "compareAt",
  "compareAtPrice",
  "discount",
  "salePrice",
  "stockCount",
  "stockLevel",
  "countdown",
  "badge",
  "badges",
  "bestseller",
];

const findings = [];

function fail(where, message) {
  findings.push({ where, message });
}

/* -------------------------------------------------------------------------- */
/* Referential integrity                                                       */
/* -------------------------------------------------------------------------- */

function checkUniqueness() {
  const seen = (label, values, where) => {
    const counts = new Map();
    for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
    for (const [value, count] of counts) {
      if (count > 1) fail(where, `${label} "${value}" is used by ${count} records — it must be unique.`);
    }
  };

  seen("product slug", products.map((p) => p.slug), "lib/catalog/data/products.ts");
  seen("product id", products.map((p) => p.id), "lib/catalog/data/products.ts");
  seen("collection slug", collections.map((c) => c.slug), "lib/catalog/data/collections.ts");
  seen(
    "variant id",
    products.flatMap((p) => p.variants.map((v) => v.id)),
    "lib/catalog/data/products.ts",
  );
}

function checkReferences() {
  const productSlugs = new Set(products.map((p) => p.slug));
  const collectionSlugs = new Set(collections.map((c) => c.slug));
  const occasionSlugs = new Set(brand.occasions.map((o) => o.slug));

  for (const product of products) {
    const where = `product "${product.slug}"`;

    for (const slug of product.collections) {
      if (!collectionSlugs.has(slug)) {
        fail(
          where,
          `declares membership of collection "${slug}", which is not in the brand record. ` +
            `Collections come from brand.collections — see BRAND-INPUTS.md.`,
        );
      }
    }

    for (const slug of product.occasions ?? []) {
      if (!occasionSlugs.has(slug)) {
        fail(
          where,
          `declares membership of occasion "${slug}", which is not in the brand record. ` +
            `Occasions come from brand.occasions — see BRAND-INPUTS.md.`,
        );
      }
    }

    for (const slug of product.componentSlugs ?? []) {
      if (!productSlugs.has(slug)) fail(where, `names component product "${slug}", which does not exist.`);
    }

    for (const slug of product.relatedSlugs ?? []) {
      if (!productSlugs.has(slug)) fail(where, `names related product "${slug}", which does not exist.`);
    }

    if (product.componentSlugs !== undefined && product.category !== "set") {
      fail(where, `declares componentSlugs but its category is "${product.category}", not "set".`);
    }
  }

  for (const collection of collections) {
    for (const slug of collection.productSlugs) {
      if (!productSlugs.has(slug)) {
        fail(`collection "${collection.slug}"`, `orders product "${slug}", which does not exist.`);
      }
    }
  }

  for (const [label, slugs] of [
    ["new arrivals", brand.homepage.newArrivalSlugs],
    ["featured", brand.homepage.featuredSlugs],
  ]) {
    for (const slug of slugs) {
      if (!productSlugs.has(slug)) {
        fail(`brand.homepage ${label}`, `names product "${slug}", which does not exist.`);
      }
    }
  }
}

function checkVariants() {
  for (const product of products) {
    const where = `product "${product.slug}"`;

    if (product.variants.length === 0) fail(where, "has no variant. Every product carries at least one.");
    if (product.images.length === 0) fail(where, "has no image. Every product carries at least one.");

    const declared = new Map(product.options.map((option) => [option.axis, new Set(option.values)]));
    const combinations = new Set();

    for (const variant of product.variants) {
      const chosen = Object.keys(variant.options);

      for (const axis of declared.keys()) {
        if (!chosen.includes(axis)) {
          fail(where, `variant "${variant.id}" declares no value on the "${axis}" axis.`);
        }
      }

      for (const [axis, value] of Object.entries(variant.options)) {
        const values = declared.get(axis);
        if (values === undefined) {
          fail(where, `variant "${variant.id}" uses axis "${axis}", which the product does not declare.`);
        } else if (!values.has(value)) {
          fail(
            where,
            `variant "${variant.id}" uses "${value}" on the "${axis}" axis, which is not among that axis's declared values.`,
          );
        }
      }

      // Axis order must not distinguish two otherwise identical configurations.
      const key = Object.entries(variant.options)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([axis, value]) => `${axis}=${value}`)
        .join("|");

      if (combinations.has(key)) {
        fail(where, `two variants share the configuration ${key === "" ? "(no axes)" : key}.`);
      }
      combinations.add(key);
    }

    for (const option of product.options) {
      if (option.values.length === 0) fail(where, `declares the "${option.axis}" axis with no values.`);
    }
  }
}

/* -------------------------------------------------------------------------- */
/* Forbidden fields                                                            */
/* -------------------------------------------------------------------------- */

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

/** Blanks comments while preserving line numbers — same rule as check-slop.mjs. */
function stripComments(source) {
  const withoutBlocks = source.replace(/\/\*[\s\S]*?\*\//g, (match) => match.replace(/[^\n]/g, " "));

  return withoutBlocks
    .split("\n")
    .map((line) => {
      const trimmed = line.trimStart();
      return trimmed.startsWith("//") || trimmed.startsWith("*") ? "" : line;
    })
    .join("\n");
}

function checkForbiddenFields() {
  const pattern = new RegExp(`\\b(${FORBIDDEN_FIELDS.join("|")})\\b`, "i");

  for (const file of walk(CATALOG_ROOT)) {
    const lines = stripComments(readFileSync(file, "utf8")).split("\n");

    lines.forEach((line, index) => {
      const match = pattern.exec(line);
      if (match === null) return;
      fail(
        `${file}:${index + 1}`,
        `forbidden field "${match[1]}". The catalog has no rating, review, compare-at, discount, ` +
          `scarcity or badge field — see DESIGN-SYSTEM.md rule 8. Amend ` +
          `specs/catalog/product-model before adding one.`,
      );
    });
  }
}

/* -------------------------------------------------------------------------- */

checkUniqueness();
checkReferences();
checkVariants();
checkForbiddenFields();

if (findings.length === 0) {
  console.log(
    `check-catalog: pass — ${products.length} product(s), ${collections.length} collection(s), all references resolve.`,
  );
  process.exit(0);
}

for (const finding of findings) {
  console.error(`\n${finding.where}`);
  console.error(`  ${finding.message}`);
}

console.error(`\ncheck-catalog: ${findings.length} finding(s).`);
process.exit(1);
