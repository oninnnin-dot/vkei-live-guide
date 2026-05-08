import fs from 'node:fs';

const venues = JSON.parse(fs.readFileSync('data/venues.json', 'utf8'));
const venueBySlug = new Map(venues.map((venue) => [venue.slug, venue]));

const prioritySlugs = [
  'ikebukuro-edge',
  'ikebukuro-blackhole',
  'shibuya-rex',
  'takadanobaba-club-phase',
  'sugamo-shishio',
  'higashi-koenji-20000v',
  'wildside-tokyo',
  'shimokitazawa-shangrila',
  'music-lab-hamashobo',
  'yokohama-baysis',
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

const baysis = venueBySlug.get('yokohama-baysis');
assert(baysis?.lockerInfo?.venueLockerStatus === 'available', '横浜BAYSIS lockerInfo.venueLockerStatus must be available');
assert(String(baysis?.lockerInfo?.lockerCountText ?? '').includes('18'), '横浜BAYSIS lockerInfo.lockerCountText must include 18');

if (failures.length > 0) {
  console.error('priority-10 verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('priority-10 verification passed');
