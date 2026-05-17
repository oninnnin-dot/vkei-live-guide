import type { Venue } from '@/types';

export const TOKYO_PRIORITY_SLUGS = [
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
] as const;

const GENERIC_PUBLIC_PHRASES = [
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
  'コンビニは周辺にあり',
  '荷物が多い日は駅で確認',
];

const cleanText = (value: unknown) =>
  String(value ?? '')
    .replace(/\bunknown\b/g, '確認中')
    .replaceAll('未確認', '確認中')
    .replaceAll('未調査', '確認中')
    .trim();

const isUsefulText = (value: unknown) => {
  const text = cleanText(value);
  return Boolean(text) && text !== '確認中' && !text.includes('確認中') && !GENERIC_PUBLIC_PHRASES.some((phrase) => text.includes(phrase));
};

const usefulListCount = (value: unknown) => {
  const values = Array.isArray(value) ? value : [value];
  return values.filter(isUsefulText).length;
};

const hasUsefulPlace = (venue: Venue, type: string) =>
  (venue.nearbyInfo?.places ?? []).some((place) => place.type === type && isUsefulText(place.name));

const hasPublicSource = (venue: Venue) => (venue.publicSources ?? venue.sourceLinks ?? []).length > 0;

export const getVenueInfoScore = (venue: Venue) => {
  const nearby = venue.nearbyInfo;
  let score = 0;

  if (isUsefulText(venue.practicalSummary?.headline)) score += 8;
  score += usefulListCount(venue.practicalSummary?.points) * 2;
  if (isUsefulText(nearby?.nearestExit)) score += 9;
  if (usefulListCount(nearby?.convenienceStores) > 0 || hasUsefulPlace(venue, 'convenience_store')) score += 9;
  if (isUsefulText(nearby?.waitingRule) || isUsefulText(nearby?.waitingSpot)) score += 8;
  if (usefulListCount(nearby?.stationLockers) > 0 || isUsefulText(nearby?.stationLocker) || hasUsefulPlace(venue, 'station_locker')) score += 7;
  if (usefulListCount(nearby?.restrooms) > 0 || isUsefulText(nearby?.restroomBeforeEntry) || hasUsefulPlace(venue, 'restroom')) score += 7;
  if (isUsefulText(nearby?.rainPlan) || isUsefulText(nearby?.rainShelter)) score += 7;
  if (isUsefulText(nearby?.hotDayPlan)) score += 3;
  if (isUsefulText(nearby?.coldDayPlan)) score += 3;
  if (isUsefulText(nearby?.afterShowRoute)) score += 9;
  if (isUsefulText(nearby?.nightSafety)) score += 8;
  if (isUsefulText(nearby?.soloBeginnerNote)) score += 5;
  if (isUsefulText(nearby?.tripNote)) score += 5;
  if (isUsefulText(nearby?.baggageFlow)) score += 5;

  const flow = nearby?.dayFlow;
  if (flow?.stationArrival && flow?.beforeEntry && flow?.afterShow) score += 12;
  if (flow?.baggageDrop) score += 4;
  if (flow?.entry) score += 4;
  if (flow?.lastTrainNote) score += 4;
  if (hasPublicSource(venue)) score += 6;

  if (venue.archiveOnly || (venue.venueStatus ?? venue.status) !== 'active') score -= 100;

  return score;
};

export const getRegionSortRank = (venue: Venue) => {
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

export const getAreaSortRank = (venue: Venue) => {
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

export const sortVenuesForTopPage = (venues: Venue[]) =>
  [...venues]
    .filter((venue) => TOKYO_PRIORITY_SLUGS.includes(venue.slug as (typeof TOKYO_PRIORITY_SLUGS)[number]))
    .filter((venue) => (venue.venueStatus ?? venue.status) === 'active' && venue.showInVenueList && !venue.archiveOnly)
    .sort((a, b) => TOKYO_PRIORITY_SLUGS.indexOf(a.slug as (typeof TOKYO_PRIORITY_SLUGS)[number]) - TOKYO_PRIORITY_SLUGS.indexOf(b.slug as (typeof TOKYO_PRIORITY_SLUGS)[number]));

export const sortVenuesForVenueList = (venues: Venue[]) =>
  [...venues].sort((a, b) => {
    const archiveDelta = Number(Boolean(a.archiveOnly || (a.venueStatus ?? a.status) === 'closed')) - Number(Boolean(b.archiveOnly || (b.venueStatus ?? b.status) === 'closed'));
    if (archiveDelta !== 0) return archiveDelta;

    return getVenueInfoScore(b) - getVenueInfoScore(a)
      || getRegionSortRank(a) - getRegionSortRank(b)
      || getAreaSortRank(a) - getAreaSortRank(b)
      || `${a.prefecture}${a.area}${a.name}`.localeCompare(`${b.prefecture}${b.area}${b.name}`, 'ja');
  });
