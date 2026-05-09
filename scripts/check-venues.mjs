#!/usr/bin/env node
import fs from "node:fs";

const file = process.argv[2] || "data/venues.json";
const raw = fs.readFileSync(file, "utf8");
const venues = JSON.parse(raw);

const SOURCE_CONFIDENCE = new Set(["official", "supporting_reference", "unknown"]);
const VENUE_STATUS = new Set(["active", "closed", "relocation_pending", "event_only", "unknown"]);
const LOCKER_STATUS = new Set(["available", "none", "unknown"]);
const CLOAK_STATUS = new Set(["available", "none", "unknown", "event_dependent"]);
const BANNED_PUBLIC_WORDS = ["個人ブログ", "note", "SNS", "参戦レポ", "外部会場情報", "ブログ由来", "個人解説", "転載", "引用"];

let errors = [];
let warnings = [];
const slugs = new Map();

function hasBannedWord(value) {
  const text = typeof value === "string" ? value : JSON.stringify(value ?? "");
  return BANNED_PUBLIC_WORDS.filter((word) => text.includes(word));
}

for (const [index, venue] of venues.entries()) {
  const where = venue.slug || `index:${index}`;

  if (!venue.slug) errors.push(`${where}: slug がありません`);
  if (slugs.has(venue.slug)) errors.push(`${where}: slug が重複しています`);
  slugs.set(venue.slug, true);

  const sourceConfidence = venue.sourceConfidence || "unknown";
  if (!SOURCE_CONFIDENCE.has(sourceConfidence)) {
    errors.push(`${where}: sourceConfidence が不正です: ${sourceConfidence}`);
  }

  const venueStatus = venue.venueStatus || venue.status || "unknown";
  if (!VENUE_STATUS.has(venueStatus)) {
    warnings.push(`${where}: venueStatus/status が標準外です: ${venueStatus}`);
  }

  const lockerStatus = venue.lockerInfo?.venueLockerStatus || venue.lockerInfo?.status || "unknown";
  if (!LOCKER_STATUS.has(lockerStatus)) {
    errors.push(`${where}: lockerInfo.status が不正です: ${lockerStatus}`);
  }

  const cloakStatus = venue.cloakInfo?.cloakStatus || venue.cloakInfo?.status || "unknown";
  if (!CLOAK_STATUS.has(cloakStatus)) {
    errors.push(`${where}: cloakInfo.status が不正です: ${cloakStatus}`);
  }

  const sourceLinks = venue.sourceLinks || [];
  for (const [linkIndex, link] of sourceLinks.entries()) {
    const bad = hasBannedWord(link);
    if (bad.length) {
      errors.push(`${where}: sourceLinks[${linkIndex}] に公開禁止語があります: ${bad.join(", ")}`);
    }
    const type = link.type || "unknown";
    if (!SOURCE_CONFIDENCE.has(type)) {
      errors.push(`${where}: sourceLinks[${linkIndex}].type が不正です: ${type}`);
    }
  }

  if (venueStatus === "closed") {
    const listHeadline = JSON.stringify([
      venue.practicalSummary,
      venue.baggageGuide,
      venue.cardSummary,
      venue.tipTags
    ]);
    if (/ロッカーあり|クロークあり|利用可|available/.test(listHeadline)) {
      errors.push(`${where}: closed 会場に現在利用前提の荷物案内らしき表示があります`);
    }
  }

  if (venueStatus === "relocation_pending") {
    const locker = venue.lockerInfo?.venueLockerStatus || "unknown";
    const cloak = venue.cloakInfo?.cloakStatus || "unknown";
    if (locker === "available" || cloak === "available") {
      errors.push(`${where}: relocation_pending 会場で現在利用前提の設備あり表示になっています`);
    }
  }
}

if (warnings.length) {
  console.warn("WARNINGS");
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (errors.length) {
  console.error("ERRORS");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`OK: ${venues.length} venues checked.`);
