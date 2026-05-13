import fs from 'node:fs';

const venues = JSON.parse(fs.readFileSync('data/venues.json', 'utf8'));
const venueBySlug = new Map(venues.map((venue) => [venue.slug, venue]));

const prioritySlugs = [
  'ikebukuro-blackhole',
  'ikebukuro-edge',
  'shibuya-rex',
  'takadanobaba-club-phase',
  'higashi-koenji-20000v',
  'shimokitazawa-shangrila',
  'sugamo-shishio',
  'wildside-tokyo',
  'shinjuku-club-science',
  'ueno-otokoyokocho',
];

const genericPhrases = [
  '駅周辺で時間調整する',
  '地図アプリで直前確認',
  '周辺情報は確認中です',
  '公式アクセス参照',
  '荷物が多い日は駅ロッカーかホテル預けを先に決める',
  '最寄り駅周辺ロッカーは埋まることがある',
  '入場前に駅や周辺施設で済ませる',
  '夜の帰り道は駅までのルートを事前確認推奨',
  '周辺コンビニは事前に地図アプリで確認推奨',
  '大荷物は駅側で荷物処理',
];

const privateUrlPatterns = [
  'note.com',
  'ameblo.jp',
  'hatenablog.',
  'twitter.com',
  'x.com/',
  'twstalker.com',
  'instagram.com',
  'tiktok.com',
  'detail.chiebukuro.yahoo.co.jp',
];

const allowedPublicTypes = new Set(['official', 'supporting_reference', 'unknown']);
const errors = [];
const warnings = [];

const textIncludesGenericOnly = (value) => {
  const text = String(value || '');
  if (!text) return false;
  return genericPhrases.some((phrase) => text.includes(phrase));
};

const pass = (message) => console.log(`PASS: ${message}`);
const warn = (message) => warnings.push(`WARN: ${message}`);
const fail = (message) => errors.push(`FAIL: ${message}`);

for (const slug of prioritySlugs) {
  const venue = venueBySlug.get(slug);
  if (!venue) {
    fail(`${slug} is missing`);
    continue;
  }

  const status = venue.venueStatus ?? venue.status;
  status === 'active' ? pass(`${slug} is active`) : fail(`${slug} is not active`);
  venue.showInVenueList ? pass(`${slug} showInVenueList is true`) : fail(`${slug} showInVenueList is false`);
  !venue.archiveOnly ? pass(`${slug} is not archiveOnly`) : fail(`${slug} is archiveOnly`);

  const nearby = venue.nearbyInfo || {};
  nearby.nearestExit ? pass(`${slug} has nearestExit`) : fail(`${slug} missing nearestExit`);
  Array.isArray(nearby.convenienceStores) && nearby.convenienceStores.length > 0
    ? pass(`${slug} has convenienceStores`)
    : fail(`${slug} missing convenienceStores`);
  nearby.waitingRule || nearby.waitingSpot ? pass(`${slug} has waiting rule`) : fail(`${slug} missing waitingRule/waitingSpot`);
  Array.isArray(nearby.restrooms) && nearby.restrooms.length > 0 ? pass(`${slug} has restrooms`) : warn(`${slug} missing restrooms`);
  nearby.rainPlan || nearby.rainShelter ? pass(`${slug} has rain plan`) : warn(`${slug} missing rainPlan`);
  nearby.afterShowRoute ? pass(`${slug} has afterShowRoute`) : fail(`${slug} missing afterShowRoute`);
  nearby.nightSafety ? pass(`${slug} has nightSafety`) : fail(`${slug} missing nightSafety`);
  nearby.dayFlow?.stationArrival && nearby.dayFlow?.beforeEntry && nearby.dayFlow?.afterShow
    ? pass(`${slug} has dayFlow`)
    : fail(`${slug} missing dayFlow`);

  for (const [key, value] of Object.entries(nearby)) {
    if (typeof value === 'string' && textIncludesGenericOnly(value)) {
      fail(`${slug} nearbyInfo.${key} looks generic: ${value}`);
    }
  }

  const publicSources = venue.publicSources || venue.sourceLinks || [];
  publicSources.length > 0 ? pass(`${slug} has public sources`) : fail(`${slug} missing public sources`);
  for (const source of publicSources) {
    const type = source.type || 'unknown';
    const url = String(source.url || '').toLowerCase();
    if (!allowedPublicTypes.has(type)) fail(`${slug} public source has disallowed type: ${type}`);
    if (privateUrlPatterns.some((pattern) => url.includes(pattern))) {
      fail(`${slug} public source contains private URL: ${source.url}`);
    }
  }
}

const missingPriorityResearch = [];
try {
  const priorityResearch = JSON.parse(fs.readFileSync('data/research/priority-10.json', 'utf8'));
  const researchSlugs = new Set(priorityResearch.map((venue) => venue.slug));
  for (const slug of prioritySlugs) {
    if (!researchSlugs.has(slug)) missingPriorityResearch.push(slug);
  }
} catch (error) {
  fail(`data/research/priority-10.json could not be read: ${error.message}`);
}

if (missingPriorityResearch.length > 0) {
  fail(`priority-10.json is missing: ${missingPriorityResearch.join(', ')}`);
} else {
  pass('priority-10.json contains Tokyo priority venues');
}

for (const warning of warnings) console.warn(warning);

if (errors.length > 0) {
  for (const error of errors) console.error(error);
  process.exit(1);
}

console.log(`OK: ${prioritySlugs.length} Tokyo priority venues checked.`);
