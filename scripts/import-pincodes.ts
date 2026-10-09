// Loads the India Post pincode directory into Pincode and DeliveryCity.
// Source: "All India Pincode Directory", data.gov.in (Government Open Data License – India).
//
//   npm run import:pincodes                        import data/india-pincodes.csv
//   npm run import:pincodes -- <file.csv>          import another directory export
//   npm run import:pincodes -- <file.csv> --out data/india-pincodes.csv
//                                                  rewrite the compact file instead of importing
//
// Columns are read by header name, so a full export and the compact file both load.
// Re-running never resets an admin's switches or charges.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { connectDb } from "../lib/db/connect.ts";
import { DeliveryCityModel, PincodeModel } from "../lib/db/models.ts";

// Misspellings and abbreviations in the directory, keyed by title-cased name.
const STATE_FIX: Record<string, string> = {
  "Andaman and Nico.in.": "Andaman and Nicobar Islands",
  Chattisgarh: "Chhattisgarh",
  "Dadra and Nagar Hav.": "Dadra and Nagar Haveli",
  Megalaya: "Meghalaya",
  Pondicherry: "Puducherry",
};
const DISTRICT_FIX: Record<string, string> = {
  Allahabad: "Prayagraj",
  "Balod Bazer": "Baloda Bazar",
  Bangalore: "Bengaluru",
  "Bijapur(Cgh)": "Bijapur",
  "Bijapur(Kar)": "Vijayapura",
  "Bilaspur Hp": "Bilaspur",
  Bilaspurcgh: "Bilaspur",
  Chandighar: "Chandigarh",
  "Devbhoomi Dwerka": "Devbhumi Dwarka",
  "Gandhi Nagar": "Gandhinagar",
  Hamirpurhp: "Hamirpur",
  Janjgirchampa: "Janjgir-Champa",
  Jhujhunu: "Jhunjhunu",
  "K.v.rangareddy": "Rangareddy",
  Kasargod: "Kasaragod",
  "Mumbai Subueban": "Mumbai Suburban",
  Pratapghar: "Pratapgarh",
  "Prayagraj Allahabad": "Prayagraj",
  "Raigarh(Mh)": "Raigad",
  "Ranga Reddy": "Rangareddy",
  Seraikelakharsawan: "Seraikela Kharsawan",
  Sriganganagar: "Sri Ganganagar",
};

type Place = { city: string; state: string };

function cells(line: string): string[] {
  const out: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted && ch === '"' && line[i + 1] === '"') {
      cell += '"';
      i++;
    } else if (ch === '"') {
      quoted = !quoted;
    } else if (ch === "," && !quoted) {
      out.push(cell);
      cell = "";
    } else {
      cell += ch;
    }
  }
  out.push(cell);
  return out;
}

function csvCell(value: string): string {
  return /[",]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function titleCase(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/(^|[\s(-])([a-z])/g, (_, before: string, letter: string) => before + letter.toUpperCase())
    .replace(/ And /g, " and ");
}

function readDirectory(file: string): Map<string, Place> {
  const [head, ...lines] = readFileSync(file, "utf8").replace(/^﻿/, "").split(/\r?\n/);
  const columns = cells(head).map((name) => name.trim().toLowerCase());
  const at = (name: string) => {
    const index = columns.indexOf(name);
    if (index === -1) throw new Error(`${file}: no "${name}" column`);
    return index;
  };
  const [pinAt, districtAt, stateAt] = [at("pincode"), at("district"), at("statename")];

  // Post offices sharing a pincode can name different districts; the one most offices name wins.
  const votes = new Map<string, Map<string, number>>();
  for (const line of lines) {
    const row = cells(line);
    const pincode = row[pinAt]?.trim() ?? "";
    const district = titleCase(row[districtAt] ?? "");
    const state = titleCase(row[stateAt] ?? "");
    if (!/^\d{6}$/.test(pincode) || !district || district === "Na" || !state) continue;
    const key = `${DISTRICT_FIX[district] ?? district}|${STATE_FIX[state] ?? state}`;
    const tally = votes.get(pincode) ?? new Map<string, number>();
    tally.set(key, (tally.get(key) ?? 0) + 1);
    votes.set(pincode, tally);
  }

  const places = new Map<string, Place>();
  for (const [pincode, tally] of votes) {
    // Sort is stable, so ties go to the district seen first.
    const [winner] = [...tally].sort((a, b) => b[1] - a[1])[0];
    const [city, state] = winner.split("|");
    places.set(pincode, { city, state });
  }
  return places;
}

async function run() {
  const args = process.argv.slice(2);
  const out = args.includes("--out") ? args[args.indexOf("--out") + 1] : null;
  const [file = "data/india-pincodes.csv"] = args.filter((arg, i) => arg !== "--out" && args[i - 1] !== "--out");
  const places = readDirectory(file);
  const entries = [...places].sort(([a], [b]) => a.localeCompare(b));
  const cities = new Map(entries.map(([, place]) => [`${place.city}|${place.state}`, place]));
  const states = new Set(entries.map(([, place]) => place.state));
  const summary = `pincodes=${entries.length} cities=${cities.size} states=${states.size}`;

  if (out) {
    const rows = entries.map(([pincode, place]) => [pincode, place.city, place.state].map(csvCell).join(","));
    writeFileSync(out, ["pincode,district,statename", ...rows, ""].join("\n"));
    console.log(`import-pincodes: wrote ${out} ${summary}`);
    return;
  }

  for (const envFile of [".env.local", ".env"]) {
    if (existsSync(envFile)) process.loadEnvFile(envFile);
  }
  await connectDb();
  for (let i = 0; i < entries.length; i += 1000) {
    await PincodeModel.bulkWrite(
      entries.slice(i, i + 1000).map(([pincode, place]) => ({
        updateOne: {
          filter: { pincode },
          update: { $set: { state: place.state, city: place.city }, $setOnInsert: { isActive: true } },
          upsert: true,
        },
      })),
    );
  }
  await DeliveryCityModel.bulkWrite(
    [...cities.values()].map((place) => ({
      updateOne: {
        filter: { state: place.state, name: place.city },
        update: { $setOnInsert: { charge: null, isActive: true } },
        upsert: true,
      },
    })),
  );
  console.log(
    `import-pincodes: read ${summary}; stored pincodes=${await PincodeModel.countDocuments()} cities=${await DeliveryCityModel.countDocuments()}`,
  );
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
