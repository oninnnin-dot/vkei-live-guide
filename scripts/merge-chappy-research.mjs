#!/usr/bin/env node
import fs from "node:fs";

const baseFile = process.argv[2] || "data/venues.json";
const patchFile = process.argv[3];

if (!patchFile) {
  console.error("使い方: node scripts/merge-chappy-research.mjs data/venues.json path/to/patch.json");
  process.exit(1);
}

const protectedFields = new Set([
  "slug",
  "name",
  "area",
  "station",
  "venueType",
  "tipTags",
  "areaGroup",
  "priority"
]);

const baseVenues = JSON.parse(fs.readFileSync(baseFile, "utf8"));
const patchVenues = JSON.parse(fs.readFileSync(patchFile, "utf8"));

const bySlug = new Map(baseVenues.map((venue) => [venue.slug, venue]));
const missing = [];
const applied = [];

for (const patch of patchVenues) {
  const venue = bySlug.get(patch.slug);
  if (!venue) {
    missing.push(patch.slug);
    continue;
  }

  for (const [key, value] of Object.entries(patch)) {
    if (protectedFields.has(key)) continue;
    venue[key] = value;
  }
  applied.push(patch.slug);
}

fs.writeFileSync(baseFile, JSON.stringify(baseVenues, null, 2) + "\n", "utf8");

console.log(`applied: ${applied.length}`);
if (missing.length) {
  console.warn(`missing slugs: ${missing.join(", ")}`);
}
