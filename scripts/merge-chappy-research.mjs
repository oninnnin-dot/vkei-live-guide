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

function normalizeUrl(url) {
  if (!url) return "";
  try {
    const normalized = new URL(url);
    normalized.searchParams.delete("utm_source");
    normalized.searchParams.delete("utm_medium");
    normalized.searchParams.delete("utm_campaign");
    return `${normalized.origin}${normalized.pathname}${normalized.search || ""}`;
  } catch {
    return String(url).trim();
  }
}

function dedupeSourceLinks(links) {
  const exact = new Map();

  for (const link of links || []) {
    if (!link || typeof link !== "object") continue;
    const source = {
      ...link,
      label: String(link.label || "").trim(),
      url: normalizeUrl(link.url || ""),
      type: link.type || "unknown"
    };
    if (!source.label && !source.url) continue;

    const key = [source.url, source.label, source.type].join("|");
    const existing = exact.get(key);
    exact.set(key, {
      ...existing,
      ...source,
      checkedAt: source.checkedAt || existing?.checkedAt
    });
  }

  const byNameAndType = new Map();
  for (const source of exact.values()) {
    const key = [source.label, source.type].join("|");
    const existing = byNameAndType.get(key);
    if (!existing || (!existing.url && source.url)) {
      byNameAndType.set(key, source);
    }
  }

  return [...byNameAndType.values()];
}

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
    if (key === "sourceLinks") {
      venue.sourceLinks = dedupeSourceLinks([
        ...(venue.sourceLinks ?? []),
        ...(Array.isArray(value) ? value : [])
      ]);
      continue;
    }
    venue[key] = value;
  }
  applied.push(patch.slug);
}

fs.writeFileSync(baseFile, JSON.stringify(baseVenues, null, 2) + "\n", "utf8");

console.log(`applied: ${applied.length}`);
if (missing.length) {
  console.warn(`missing slugs: ${missing.join(", ")}`);
}
