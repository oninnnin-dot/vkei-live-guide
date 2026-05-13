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

const failures = [];

const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

for (const slug of prioritySlugs) {
  const venue = venueBySlug.get(slug);
  assert(venue, `${slug} is missing from data/venues.json`);
  if (!venue) continue;
  assert(venue.lockerInfo, `${slug} is missing lockerInfo`);
  assert(venue.cloakInfo, `${slug} is missing cloakInfo`);
  assert(venue.practicalSummary, `${slug} is missing practicalSummary`);
  assert(Array.isArray(venue.sourceLinks) && venue.sourceLinks.length > 0, `${slug} is missing sourceLinks`);
}

const blackHole = venueBySlug.get('ikebukuro-blackhole');
assert(blackHole?.lockerInfo?.venueLockerStatus === 'none', '池袋BlackHole lockerInfo.venueLockerStatus must be none');
assert(blackHole?.cloakInfo?.cloakStatus === 'none', '池袋BlackHole cloakInfo.cloakStatus must be none');

const phase = venueBySlug.get('takadanobaba-club-phase');
assert(phase?.lockerInfo?.venueLockerStatus === 'none', '高田馬場CLUB PHASE lockerInfo.venueLockerStatus must be none');
assert(phase?.cloakInfo?.cloakStatus === 'available', '高田馬場CLUB PHASE cloakInfo.cloakStatus must be available');

const science = venueBySlug.get('shinjuku-club-science');
assert(science?.nearbyInfo?.convenienceStores?.length >= 3, '新宿club SCIENCE must have at least 3 convenience stores');
assert(String(science?.nearbyInfo?.nightSafety ?? '').includes('歌舞伎町'), '新宿club SCIENCE nightSafety must mention 歌舞伎町');

const otoyoko = venueBySlug.get('ueno-otokoyokocho');
assert(otoyoko?.lockerInfo?.venueLockerStatus === 'none', '上野音横丁 lockerInfo.venueLockerStatus must be none');
assert(otoyoko?.cloakInfo?.cloakStatus === 'available', '上野音横丁 cloakInfo.cloakStatus must be available');

if (failures.length > 0) {
  console.error('priority-10 verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('priority-10 verification passed');
