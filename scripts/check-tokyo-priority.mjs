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

const allowedPublicTypes = new Set([
  'official',
  'supporting_reference',
  'map',
  'station_official',
  'rail_official',
  'venue_database',
  'ticket_site',
  'ticket_site_or_user_list',
  'unknown',
]);
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

const cleanText = (value) =>
  String(value || '')
    .replace(/\bunknown\b/g, '確認中')
    .replaceAll('未確認', '確認中')
    .replaceAll('未調査', '確認中')
    .trim();

const isUsefulText = (value) => {
  const text = cleanText(value);
  return Boolean(text) && text !== '確認中' && !text.includes('確認中') && !genericPhrases.some((phrase) => text.includes(phrase));
};

const usefulListCount = (value) => {
  const values = Array.isArray(value) ? value : [value];
  return values.filter(isUsefulText).length;
};

const hasUsefulPlace = (venue, type) => (venue.nearbyInfo?.places || []).some((place) => place.type === type && isUsefulText(place.name));

const getVenueInfoScore = (venue) => {
  const nearby = venue.nearbyInfo || {};
  let score = 0;
  if (isUsefulText(venue.practicalSummary?.headline)) score += 8;
  score += usefulListCount(venue.practicalSummary?.points) * 2;
  if (isUsefulText(nearby.nearestExit)) score += 9;
  if (usefulListCount(nearby.convenienceStores) > 0 || hasUsefulPlace(venue, 'convenience_store')) score += 9;
  if (isUsefulText(nearby.waitingRule) || isUsefulText(nearby.waitingSpot)) score += 8;
  if (usefulListCount(nearby.stationLockers) > 0 || isUsefulText(nearby.stationLocker) || hasUsefulPlace(venue, 'station_locker')) score += 7;
  if (usefulListCount(nearby.restrooms) > 0 || isUsefulText(nearby.restroomBeforeEntry) || hasUsefulPlace(venue, 'restroom')) score += 7;
  if (isUsefulText(nearby.rainPlan) || isUsefulText(nearby.rainShelter)) score += 7;
  if (isUsefulText(nearby.afterShowRoute)) score += 9;
  if (isUsefulText(nearby.nightSafety)) score += 8;
  if (isUsefulText(nearby.soloBeginnerNote)) score += 5;
  if (isUsefulText(nearby.tripNote)) score += 5;
  if (isUsefulText(nearby.baggageFlow)) score += 5;
  if (nearby.dayFlow?.stationArrival && nearby.dayFlow?.beforeEntry && nearby.dayFlow?.afterShow) score += 12;
  if (nearby.dayFlow?.baggageDrop) score += 4;
  if (nearby.dayFlow?.entry) score += 4;
  if (nearby.dayFlow?.lastTrainNote) score += 4;
  if ((venue.publicSources || venue.sourceLinks || []).length > 0) score += 6;
  if (venue.archiveOnly || (venue.venueStatus ?? venue.status) !== 'active') score -= 100;
  return score;
};

const getRegionSortRank = (venue) => {
  if (venue.archiveOnly || (venue.venueStatus ?? venue.status) === 'closed') return 80;
  if (venue.region === '東京' || venue.prefecture === '東京') return 0;
  if (venue.prefecture === '神奈川') return 1;
  if (venue.prefecture === '千葉') return 2;
  if (venue.prefecture === '埼玉') return 3;
  if (venue.region === '関東' || ['茨城', '栃木', '群馬'].includes(venue.prefecture)) return 4;
  if (venue.region === '関西') return 5;
  if (venue.region === '東海') return 6;
  return 7;
};

const getAreaSortRank = (venue) => {
  if (getRegionSortRank(venue) !== 0) return 99;
  const areaText = `${venue.area} ${venue.areaGroup} ${venue.station} ${venue.name}`;
  if (areaText.includes('池袋')) return 0;
  if (areaText.includes('渋谷')) return 1;
  if (areaText.includes('新宿')) return 2;
  if (areaText.includes('高田馬場')) return 3;
  if (areaText.includes('下北沢')) return 4;
  if (areaText.includes('高円寺') || areaText.includes('東高円寺')) return 5;
  if (areaText.includes('巣鴨')) return 6;
  if (areaText.includes('上野')) return 7;
  return 8;
};

const venueListComparator = (a, b) => {
  const archiveDelta = Number(Boolean(a.archiveOnly || (a.venueStatus ?? a.status) === 'closed')) - Number(Boolean(b.archiveOnly || (b.venueStatus ?? b.status) === 'closed'));
  if (archiveDelta !== 0) return archiveDelta;
  return getVenueInfoScore(b) - getVenueInfoScore(a)
    || getRegionSortRank(a) - getRegionSortRank(b)
    || getAreaSortRank(a) - getAreaSortRank(b)
    || `${a.prefecture}${a.area}${a.name}`.localeCompare(`${b.prefecture}${b.area}${b.name}`, 'ja');
};

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

const topPageVenues = prioritySlugs
  .map((slug) => venueBySlug.get(slug))
  .filter(Boolean)
  .filter((venue) => (venue.venueStatus ?? venue.status) === 'active' && venue.showInVenueList && !venue.archiveOnly);
const topPageOrder = topPageVenues.map((venue) => venue.slug).join(',');
const expectedTopPageOrder = prioritySlugs.join(',');
topPageOrder === expectedTopPageOrder
  ? pass('Tokyo priority venues resolve in the requested fixed order')
  : fail(`Tokyo priority order mismatch: ${topPageOrder}`);

const indexSource = fs.readFileSync('src/pages/index.astro', 'utf8');
const venueIndexSource = fs.readFileSync('src/pages/venues/index.astro', 'utf8');
const sortSource = fs.readFileSync('src/utils/venueSort.ts', 'utf8');

indexSource.includes('sortVenuesForTopPage')
  ? pass('top page uses sortVenuesForTopPage')
  : fail('top page does not use sortVenuesForTopPage');
venueIndexSource.includes('sortVenuesForVenueList')
  ? pass('venue list uses sortVenuesForVenueList')
  : fail('venue list does not use sortVenuesForVenueList');

let lastIndex = -1;
for (const slug of prioritySlugs) {
  const currentIndex = sortSource.indexOf(`'${slug}'`);
  if (currentIndex === -1) {
    fail(`src/utils/venueSort.ts missing ${slug}`);
  } else if (currentIndex < lastIndex) {
    fail(`src/utils/venueSort.ts priority order is wrong around ${slug}`);
  } else {
    lastIndex = currentIndex;
  }
}
if (lastIndex > -1) pass('src/utils/venueSort.ts keeps the requested Tokyo priority order');

const sortedVenueList = [...venues].sort(venueListComparator);
const activeList = sortedVenueList.filter((venue) => (venue.venueStatus ?? venue.status) !== 'closed' && venue.showInVenueList && !venue.archiveOnly);
const firstThinVenue = activeList.find((venue) => getVenueInfoScore(venue) < 40);
const firstPriorityVenueRank = Math.max(...prioritySlugs.map((slug) => activeList.findIndex((venue) => venue.slug === slug)));
if (firstPriorityVenueRank >= 0 && (!firstThinVenue || firstPriorityVenueRank < activeList.indexOf(firstThinVenue))) {
  pass('venue list sorting keeps Tokyo high-density venues ahead of thin entries');
} else {
  warn('venue list sorting may allow thin entries ahead of Tokyo priority venues');
}

for (const warning of warnings) console.warn(warning);

if (errors.length > 0) {
  for (const error of errors) console.error(error);
  process.exit(1);
}

console.log(`OK: ${prioritySlugs.length} Tokyo priority venues checked.`);
