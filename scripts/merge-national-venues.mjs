import fs from 'node:fs';

const DATA_PATH = new URL('../data/venues.json', import.meta.url);
const LAST_VERIFIED = '2026-05-06';
const SOURCE_NOTE = '公式URL・設備情報は要確認';

const regionOrder = [
  '東京',
  '神奈川',
  '関東',
  '北海道・東北',
  '甲信越・北陸',
  '東海',
  '関西',
  '中国・四国',
  '九州・沖縄',
];

const areaToSlug = [
  ['池袋', 'ikebukuro'],
  ['巣鴨', 'sugamo'],
  ['高田馬場', 'takadanobaba'],
  ['渋谷', 'shibuya'],
  ['新宿', 'shinjuku'],
  ['東高円寺', 'higashi-koenji'],
  ['高円寺', 'koenji'],
  ['下北沢', 'shimokitazawa'],
  ['青山', 'aoyama'],
  ['大塚', 'otsuka'],
  ['西荻', 'nishiogi'],
  ['初台', 'hatsudai'],
  ['恵比寿', 'ebisu'],
  ['豊洲', 'toyosu'],
  ['赤羽', 'akabane'],
  ['五反田', 'gotanda'],
  ['日本橋', 'nihonbashi'],
  ['北とぴあ', 'kita-topia'],
  ['大久保', 'okubo'],
  ['横浜', 'yokohama'],
  ['新横浜', 'shinyokohama'],
  ['川崎', 'kawasaki'],
  ['小田原', 'odawara'],
  ['浦和', 'urawa'],
  ['さいたま', 'saitama'],
  ['熊谷', 'kumagaya'],
  ['川口', 'kawaguchi'],
  ['柏', 'kashiwa'],
  ['本八幡', 'motoyawata'],
  ['水戸', 'mito'],
  ['宇都宮', 'utsunomiya'],
  ['栃木県', 'tochigi'],
  ['仙台', 'sendai'],
  ['郡山', 'koriyama'],
  ['山形', 'yamagata'],
  ['秋田', 'akita'],
  ['八戸', 'hachinohe'],
  ['札幌', 'sapporo'],
  ['新潟', 'niigata'],
  ['長野', 'nagano'],
  ['富山', 'toyama'],
  ['金沢', 'kanazawa'],
  ['名古屋', 'nagoya'],
  ['今池', 'imaike'],
  ['岐阜', 'gifu'],
  ['長良川', 'nagaragawa'],
  ['静岡', 'shizuoka'],
  ['浜松', 'hamamatsu'],
  ['京都', 'kyoto'],
  ['心斎橋', 'shinsaibashi'],
  ['大阪', 'osaka'],
  ['梅田', 'umeda'],
  ['なんば', 'namba'],
  ['寺田町', 'teradacho'],
  ['アメリカ村', 'americamura'],
  ['神戸', 'kobe'],
  ['姫路', 'himeji'],
  ['なら', 'nara'],
  ['岡山', 'okayama'],
  ['広島', 'hiroshima'],
  ['周南', 'shunan'],
  ['徳島', 'tokushima'],
  ['高知', 'kochi'],
  ['福岡', 'fukuoka'],
  ['熊本', 'kumamoto'],
  ['鹿児島', 'kagoshima'],
  ['指宿', 'ibusuki'],
];

const aliasGroups = [
  ['池袋EDGE', ['EDGE ikebukuro', 'EDGE Ikebukuro']],
  ['池袋BlackHole', ['BlackHole']],
  ['横浜BAYSIS', ['BAYSIS']],
  ['巣鴨獅子王', ['Live House 獅子王']],
  ['WWW X', ['Shibuya WWW X']],
  ['WWW', ['Shibuya WWW', 'Shibuya WWW / WWW']],
  ['GORILLA HALL OSAKA', ['GORILLA HALL']],
  ['Electric Lady Land', ['E.L.L.']],
  ['名古屋THE BOTTOM LINE', ['名古屋 THE BOTTOM LINE', '名古屋ボトムライン', 'THE BOTTOM LINE']],
  ['心斎橋CLAPPER', ['アメリカ村 CLAPPER']],
  ['広島SECOND CRUTCH', ['広島セカンドクラッチ', 'SECOND CRUTCH']],
  ['大塚 Live House Hearts+', ['Live House Hearts+']],
  ['大塚 Live House Hearts NEXT', ['Live House Hearts NEXT', '大塚 Live House Hearts Next']],
  ['SHIBUYA THE GAME', ['渋谷 THE GAME']],
  ['渋谷REX', ['SHIBUYA REX']],
  ['WildSide Tokyo', ['WildSideTokyo']],
  ['池袋グローバルリングシアター', ['池袋西口公園野外劇場 グローバルリングシアター', '池袋グローバルリンク']],
];

const archiveNames = new Set([
  '池袋CYBER',
  '高田馬場AREA',
  '新宿RUIDO.K4',
  '目黒鹿鳴館',
  '横浜CLUB24',
]);

const rows = [];
const add = (region, prefecture, area, names) => {
  for (const entry of names) {
    rows.push(typeof entry === 'string' ? { name: entry, region, prefecture, area } : { region, prefecture, area, ...entry });
  }
};

add('東京', '東京都', '池袋', [
  '池袋グローバルリングシアター',
  '池袋EDGE',
  '池袋BlackHole',
  '池袋LiveGarage Adm',
  '池袋RED-Zone ANERIS',
]);
add('東京', '東京都', '巣鴨', ['巣鴨獅子王']);
add('東京', '東京都', '高田馬場', ['高田馬場CLUB PHASE']);
add('東京', '東京都', '渋谷', [
  '渋谷REX',
  'SHIBUYA THE GAME',
  '渋谷近未来会館',
  '渋谷Star lounge',
  'SHIBUYA CYCLONE',
  '渋谷GUILTY',
  '渋谷ストリームホール',
  '渋谷音楽堂',
  'Spotify O-EAST',
  'Spotify O-WEST',
  'WWW',
  'WWW X',
  'SPACE ODD',
  'Club Malcolm',
]);
add('東京', '東京都', '新宿', ['新宿LOFT', '新宿ReNY', 'Zepp Shinjuku', 'WildSide Tokyo', '大久保HOT SHOT', 'GT LIVE TOKYO']);
add('東京', '東京都', '高円寺', ['東高円寺二万電圧', 'KOENJI HIGH', 'ShowBoat']);
add('東京', '東京都', '下北沢', ['下北沢ReG', '下北沢シャングリラ', '下北沢LIVEHOLIC']);
add('東京', '東京都', '青山', ['青山RizM', '青山 月見ル君想フ']);
add('東京', '東京都', '大塚', ['大塚 Live House Hearts+', '大塚 Live House Hearts NEXT']);
add('東京', '東京都', '西荻', ['西荻BETTYROOM']);
add('東京', '東京都', '初台', ['初台The DOORS']);
add('東京', '東京都', '恵比寿', ['恵比寿ザ・ガーデンホール', 'LIQUIDROOM']);
add('東京', '東京都', '豊洲', ['豊洲PIT']);
add('東京', '東京都', '羽田', ['Zepp Haneda']);
add('東京', '東京都', '赤羽', ['赤羽ReNY alpha']);
add('東京', '東京都', '五反田', ['BLAZE GOTANDA']);
add('東京', '東京都', '日本橋', ['日本橋三井ホール']);
add('東京', '東京都', '王子', ['北とぴあ ドームホール']);

add('神奈川', '神奈川県', '横浜', [
  'Music Lab.濱書房',
  '横浜BAYSIS',
  '横浜CLUB SENSATION',
  '新横浜NEW SIDE BEACH!!',
  '横浜ReNY beta',
  'F.A.D YOKOHAMA',
  'KT Zepp Yokohama',
]);
add('神奈川', '神奈川県', '川崎', ['川崎Serbian Night', 'CLUB CITTA’']);
add('神奈川', '神奈川県', '小田原', ['LIVE HOUSE 小田原姿麗人']);

add('関東', '埼玉県', '埼玉', ['Live House Hearts', '浦和ナルシス', 'HEAVEN’S ROCKさいたま新都心 VJ-3', 'HEAVEN’S ROCK熊谷 VJ-1', '川口リリア・フカガワみらいホール']);
add('関東', '千葉県', '千葉', ['柏PALOOZA', 'Livehouse DOMe Kashiwa', '本八幡Route Fourteen', '柏Thumb Up']);
add('関東', '茨城県', '水戸', ['水戸LIGHT HOUSE', 'club SONIC mito']);
add('関東', '栃木県', '栃木', ['HEAVEN’S ROCK宇都宮 2/3 VJ-4', '栃木県総合文化センター メインホール']);
add('関東', '山梨県', '甲府', ['KAZOO HALL']);

add('北海道・東北', '宮城県', '仙台', ['仙台MACANA', '仙台ROCKATERIA', '仙台Rensa', '仙台space Zero', '仙台darwin', '仙台BAR TAKE']);
add('北海道・東北', '福島県', '郡山', ['郡山HIP SHOT JAPAN', '郡山シャープナイン', '郡山CLUB #9']);
add('北海道・東北', '山形県', '山形', ['山形ミュージック昭和セッション']);
add('北海道・東北', '秋田県', '秋田', ['秋田クラブスウィンドル']);
add('北海道・東北', '青森県', '八戸', ['八戸フォーミー']);
add('北海道・東北', '北海道', '札幌', ['札幌BESSIE HALL', '札幌Crazy Monkey', '札幌SPiCE', '札幌PENNY LANE24', '札幌SPIRITUAL LOUNGE']);

add('甲信越・北陸', '新潟県', '新潟', ['新潟GOLDEN PIGS RED STAGE', '新潟CLUB RIVERST']);
add('甲信越・北陸', '長野県', '長野', ['長野CLUB JUNK BOX', { name: 'Live&Bar Radius', sourceNotes: ['公式URL・設備情報は要確認', '所在地・分類要確認'] }]);
add('甲信越・北陸', '富山県', '富山', ['富山SOUL POWER']);
add('甲信越・北陸', '石川県', '金沢', ['金沢AZ', '金沢gate Black']);

add('東海', '愛知県', '名古屋', ['名古屋THE BOTTOM LINE', 'NAGOYA ReNY limited', 'HOLIDAY NEXT NAGOYA', '名古屋MUSIC FARM', '今池CLUB 3STAR', 'Electric Lady Land', 'ell.FITS ALL', 'ell.SIZE', 'RAD HALL', 'DIAMOND HALL']);
add('東海', '岐阜県', '岐阜', ['岐阜Club-G', '岐阜CLUB ROOTS', '岐阜CASPER', '長良川国際会議場 メインホール']);
add('東海', '静岡県', '静岡', ['静岡UMBER', '浜松窓枠', '浜松FORCE']);
add('東海', '三重県', '四日市', ['CLUB CHAOS']);

add('関西', '京都府', '京都', ['京都MOJO', '京都FANJ']);
add('関西', '大阪府', '大阪', ['Yogibo HOLY MOUNTAIN', 'GORILLA HALL OSAKA']);
add('関西', '大阪府', '心斎橋', ['心斎橋CLAPPER', '心斎橋soma', '心斎橋BIGCAT', '心斎橋FANJ', 'OSAKA MUSE', '大阪RUIDO']);
add('関西', '大阪府', '梅田', ['梅田CLUB QUATTRO', '梅田Zeela', '梅田BANGBOO']);
add('関西', '大阪府', 'なんば', ['なんばHatch']);
add('関西', '大阪府', '天王寺', ['ROCKTOWN']);
add('関西', '大阪府', '大阪', ['club MERCURY', 'MUSE BOX', 'LIVE HOUSE Rumio', 'LIVE HOUSE JUZA', 'LIVE HOUSE Pangea', '寺田町Fireloop', 'アメリカ村BEYOND', 'アメリカ村DROP', 'Bigtwin Diner SHOVEL']);
add('関西', '兵庫県', '神戸', ['live music club PADOMA', '神戸VARIT.', '神戸太陽と虎', 'Harbor Studio']);
add('関西', '兵庫県', '姫路', ['姫路Beta']);
add('関西', '奈良県', '奈良', ['EVANS CASTLE HALL', 'なら100年会館 大ホール']);

add('中国・四国', '岡山県', '岡山', ['岡山IMAGE', 'Live stage Ark']);
add('中国・四国', '広島県', '広島', ['広島SECOND CRUTCH']);
add('中国・四国', '山口県', '周南', ['周南RISING HALL']);
add('中国・四国', '徳島県', '徳島', ['徳島club GRINDHOUSE']);
add('中国・四国', '香川県', '高松', ['TOONICE']);
add('中国・四国', '高知県', '高知', ['CARAVANSARY', '高知X-pt.']);

add('九州・沖縄', '福岡県', '福岡', ['INSA', 'LIVE HOUSE Queblick', '福岡DRUM Be-1', 'graf', 'LiveHouse 秘密', 'Livehouse&Club PEACE']);
add('九州・沖縄', '熊本県', '熊本', ['熊本B.9 V1', '熊本城ホール メインホール']);
add('九州・沖縄', '鹿児島県', '鹿児島', ['鹿児島CAPARVO HALL', '指宿市民会館']);
add('九州・沖縄', '沖縄県', '那覇', ['output']);

add('東京', '東京都', '新宿', [{ name: '新宿RUIDO.K4', status: 'closed' }]);
add('東京', '東京都', '池袋', [{ name: '池袋CYBER', status: 'closed' }]);
add('東京', '東京都', '高田馬場', [{ name: '高田馬場AREA', status: 'closed' }]);
add('東京', '東京都', '目黒', [{ name: '目黒鹿鳴館', status: 'closed' }]);
add('神奈川', '神奈川県', '横浜', [{ name: '横浜CLUB24', status: 'closed' }]);

const normalize = (value = '') =>
  String(value)
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[！!]/g, '')
    .replace(/[＋+]/g, 'plus')
    .replace(/[・.\s　／/]/g, '')
    .replace(/osaka/g, '大阪')
    .replace(/shibuya/g, '渋谷')
    .replace(/ikebukuro/g, '池袋');

const canonicalByAlias = new Map();
for (const [canonical, aliases] of aliasGroups) {
  canonicalByAlias.set(normalize(canonical), canonical);
  for (const alias of aliases) canonicalByAlias.set(normalize(alias), canonical);
}

const canonicalName = (name) => canonicalByAlias.get(normalize(name)) ?? name;

const aliasFor = (name) => {
  const canonical = canonicalName(name);
  const group = aliasGroups.find(([groupName]) => groupName === canonical);
  return group ? group[1] : [];
};

const slugify = (name, used) => {
  let text = name;
  for (const [from, to] of areaToSlug) text = text.replaceAll(from, ` ${to} `);
  text = text
    .replace(/[’']/g, '')
    .replace(/[＋+]/g, ' plus ')
    .replace(/&/g, ' and ')
    .replace(/#/g, ' number ')
    .replace(/[!.]/g, ' ')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  if (!text) text = `venue-${used.size + 1}`;
  let slug = text;
  let i = 2;
  while (used.has(slug)) {
    slug = `${text}-${i}`;
    i += 1;
  }
  used.add(slug);
  return slug;
};

const classifyType = (name, status) => {
  if (status === 'closed') return 'closed_archive';
  if (name.includes('グローバルリングシアター')) return 'outdoor_stage';
  if (/Zepp|PIT|CLUB CITTA|なんばHatch|DIAMOND HALL|BIGCAT|LIQUIDROOM|EX THEATER|CLUB QUATTRO|GORILLA HALL|Spotify O-EAST/i.test(name)) return 'large_livehouse';
  if (/ガーデンホール|三井ホール|北とぴあ|文化センター|市民会館|会館|メインホール|大ホール|HALL$/i.test(name) && !/BESSIE HALL|RAD HALL|CAPARVO HALL/i.test(name)) return 'hall';
  if (/ReNY|WWW X|WWW|O-WEST|ストリームホール|PENNY LANE24|Rensa|BOTTOM LINE|Electric Lady Land|BLAZE GOTANDA|NEW SIDE BEACH|PALOOZA|DRUM Be-1/i.test(name)) return 'mid_livehouse';
  if (/Live House|Livehouse|LIVE HOUSE|CLUB|RUIDO|LOFT|ReG|CYCLONE|REX|EDGE|BlackHole|獅子王|二万電圧|Hearts|CLAPPER|soma|VARIT|MACANA|Crazy Monkey|INSA|Queblick|graf|MUSE|FANJ|MOJO|HOT SHOT|SPiCE|JUNK BOX|GOLDEN PIGS|RIVERST|SOUL POWER|AZ|gate Black|MUSIC FARM|3STAR|ell\.|UMBER|窓枠|FORCE|CHAOS|Zeela|BANGBOO|MERCURY|JUZA|Pangea|Fireloop|BEYOND|DROP|PADOMA|太陽と虎|Beta|IMAGE|Ark|GRINDHOUSE|TOONICE|CARAVANSARY|X-pt|CAPARVO|output|姿麗人|ナルシス|LIGHT HOUSE|SONIC|KAZOO/i.test(name)) return 'small_livehouse';
  return 'unknown';
};

const scaleFor = (type, name) => {
  if (type === 'closed_archive') return 'unknown';
  if (type === 'large_livehouse') return 'large';
  if (type === 'hall') return /ドームホール|小ホール/i.test(name) ? 'mid' : 'large';
  if (type === 'mid_livehouse') return 'mid';
  if (type === 'small_livehouse') return /ReNY|BOTTOM LINE|PENNY LANE24|Rensa|PALOOZA|NEW SIDE BEACH/i.test(name) ? 'small-mid' : 'small';
  if (type === 'outdoor_stage' || type === 'event_space') return 'mid';
  return 'unknown';
};

const affinityFor = (type, status) => {
  if (status === 'closed') return 'unknown';
  if (type === 'small_livehouse' || type === 'mid_livehouse') return 'medium';
  if (type === 'large_livehouse' || type === 'hall') return 'medium';
  return 'unknown';
};

const useTypeFor = (type, status) => {
  if (status === 'closed') return 'unknown';
  if (type === 'large_livehouse' || type === 'hall') return 'large_scale';
  if (type === 'outdoor_stage' || type === 'event_space') return 'release_event';
  if (type === 'small_livehouse' || type === 'mid_livehouse') return 'vkei_occasional';
  return 'unknown';
};

const areaGroupFor = (region, prefecture, area) =>
  [region, prefecture, area]
    .filter(Boolean)
    .join('_')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '_')
    .replace(/^_+|_+$/g, '');

const existing = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
const usedSlugs = new Set(existing.map((venue) => venue.slug));
const byCanonical = new Map();

for (const venue of existing) {
  const names = [venue.name, ...(venue.aliases ?? [])].map(canonicalName);
  for (const name of names) byCanonical.set(normalize(name), venue);
}

const ensureArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);
const union = (...lists) => [...new Set(lists.flat().filter(Boolean))];

const defaultVenue = (spec) => {
  const status = spec.status ?? (archiveNames.has(canonicalName(spec.name)) ? 'closed' : 'active');
  const venueType = spec.venueType ?? classifyType(spec.name, status);
  const venueScale = spec.venueScale ?? scaleFor(venueType, spec.name);
  const vkeiAffinity = spec.vkeiAffinity ?? affinityFor(venueType, status);
  const minorVkeiFriendly = spec.minorVkeiFriendly ?? (status === 'active' && (venueType === 'small_livehouse' || venueType === 'mid_livehouse'));
  const vkeiUseType = spec.vkeiUseType ?? useTypeFor(venueType, status);
  const closed = status === 'closed';
  const notes = ensureArray(spec.sourceNotes ?? SOURCE_NOTE);
  if (venueType === 'unknown' && !notes.includes('分類要確認')) notes.push('分類要確認');
  return {
    slug: spec.slug,
    name: spec.name,
    aliases: spec.aliases ?? [],
    prefecture: spec.prefecture ?? '',
    region: spec.region ?? '',
    area: spec.area ?? '',
    areaGroup: spec.areaGroup ?? areaGroupFor(spec.region, spec.prefecture, spec.area),
    status,
    venueType,
    venueScale,
    vkeiAffinity,
    minorVkeiFriendly,
    sourceConfidence: closed ? 'verified_or_historical' : 'partially_verified',
    sourceType: 'ticket_site_or_user_list',
    sourceMemo: '全国会場マスターとして追加。公演情報は掲載しない。',
    grokSuggested: false,
    currentUseNote: closed ? '閉館済み・過去会場として扱う。現役会場一覧には表示しない。' : 'V系ライブで使われることがある会場として、会場名・地域・分類のみ登録。',
    vkeiUseType,
    priority: closed ? 'D' : 'C',
    station: '',
    walkMinutes: null,
    officialUrl: '',
    lastVerifiedAt: LAST_VERIFIED,
    showInVenueList: !closed,
    archiveOnly: closed,
    beginnerFriendly: 3,
    soloFriendly: 3,
    lockerRisk: 3,
    returnDifficulty: 3,
    nightSafetyNote: '夜の帰り道は駅までのルートを事前確認推奨。',
    lockerNote: 'ロッカー・クローク・駅ロッカーは公演や時期によって変わるため事前確認推奨。',
    baggageNote: '遠征荷物や大きい荷物は、駅ロッカー、クローク、宿泊先預けを候補にしてください。',
    convenienceNote: '周辺コンビニは事前に地図アプリで確認推奨。',
    waitingNote: '開場前の待機は近隣迷惑にならないよう、会場・主催案内に従ってください。',
    rainNote: '雨の日は待機場所と荷物の防水を事前確認推奨。',
    returnNote: '終演後の終電、乗り換え、夜行バス時刻は事前確認推奨。',
    beginnerNote: '初参戦では会場名、入口、最寄り駅、ロッカーの候補を事前確認してください。',
    ticketSearchLinks: [],
    sourceNotes: notes,
    tips: [],
    warnings: [
      '会場設備・ロッカー・クローク・ドリンク代・再入場・撮影可否は、公演や時期によって変わる場合があります。',
      '最新情報は必ず会場公式・主催者告知・チケットサイト・当日案内で確認してください。',
    ],
    preCheckItems: ['チケット', '整理番号', 'ドリンク代', 'ロッカー/クローク', '再入場', '撮影可否', '物販', '終演後の帰り'],
    lockerStrategy: '会場ロッカーだけに頼らず、駅ロッカーやクローク有無を事前に確認してください。',
    cloakStrategy: 'クローク運用は公演ごとに有無、受付時間、料金、袋サイズが変わる場合があります。',
    baggageStrategy: '大きい荷物はフロアへ持ち込まず、預け先を先に決めてください。',
    drinkStrategy: 'ドリンク代は現金指定の可能性もあるため、入場前に少額紙幣と小銭を残してください。',
    entryStrategy: '整理番号、集合場所、呼び出し方法、開場時間は公演ごとに確認してください。',
    merchStrategy: '物販後は荷物が増えやすいため、物販用バッグと預け先を先に決めてください。',
    returnStrategy: '終演後は混雑や終電に備え、駅までのルートと帰宅手段を事前確認してください。',
    soloStrategy: '一人参戦では待機場所、立ち位置、帰り道を先に決めておくと安心です。',
    beginnerStrategy: '初めての会場は入口、整列場所、ドリンク代、荷物の扱いを先に確認してください。',
    cashNote: '現金が必要になる場合があります。少額紙幣と小銭を分けて持つと安心です。',
    coinNote: 'ロッカー利用に100円玉が必要な場合があります。',
    restroomNote: 'トイレの場所と混みやすい時間は会場ごとに違います。',
    signalNote: '電子チケットは入場前に表示確認し、スマホ充電を確保してください。',
    stairsNote: '階段や狭い通路ではスタッフ案内に従って移動してください。',
    neighborhoodNote: '会場前や近隣店舗前で長時間たまらないよう注意してください。',
    photographyNote: '撮影、録音、録画は公式許可がある場合のみ行ってください。',
    reentryNote: '再入場可否は公演ごとに変わります。入場前にトイレ、飲み物、荷物整理を済ませてください。',
    lastTipVerifiedAt: LAST_VERIFIED,
    tipTags: [],
  };
};

for (const raw of rows) {
  const name = canonicalName(raw.name);
  const spec = {
    ...raw,
    name,
    aliases: union(raw.aliases ?? [], aliasFor(name), raw.name !== name ? [raw.name] : []),
  };
  const key = normalize(name);
  const existingVenue = byCanonical.get(key);
  const defaults = defaultVenue({ ...spec, slug: existingVenue?.slug ?? slugify(name, usedSlugs) });
  const target = existingVenue ?? defaults;

  if (!existingVenue) existing.push(target);

  target.name = name;
  target.aliases = union(target.aliases ?? [], defaults.aliases);
  target.prefecture = target.prefecture || defaults.prefecture;
  target.region = target.region || defaults.region;
  target.area = target.area || defaults.area;
  target.areaGroup = target.areaGroup || defaults.areaGroup;
  target.venueType = target.venueType && target.venueType !== 'unknown' ? target.venueType : defaults.venueType;
  target.venueScale = target.venueScale && target.venueScale !== 'unknown' ? target.venueScale : defaults.venueScale;
  target.vkeiAffinity = target.vkeiAffinity && target.vkeiAffinity !== 'unknown' ? target.vkeiAffinity : defaults.vkeiAffinity;
  target.minorVkeiFriendly = typeof target.minorVkeiFriendly === 'boolean' ? target.minorVkeiFriendly : defaults.minorVkeiFriendly;
  target.vkeiUseType = target.vkeiUseType && target.vkeiUseType !== 'unknown' ? target.vkeiUseType : defaults.vkeiUseType;
  target.sourceConfidence = target.sourceConfidence || defaults.sourceConfidence;
  target.sourceType = target.sourceType || defaults.sourceType;
  target.sourceMemo = target.sourceMemo || defaults.sourceMemo;
  target.currentUseNote = target.currentUseNote || defaults.currentUseNote;
  target.priority = target.priority || defaults.priority;
  target.station = target.station ?? defaults.station;
  target.walkMinutes = target.walkMinutes ?? defaults.walkMinutes;
  target.officialUrl = target.officialUrl ?? defaults.officialUrl;
  target.lastVerifiedAt = target.lastVerifiedAt || defaults.lastVerifiedAt;
  target.showInVenueList = typeof target.showInVenueList === 'boolean' ? target.showInVenueList : defaults.showInVenueList;
  target.archiveOnly = typeof target.archiveOnly === 'boolean' ? target.archiveOnly : defaults.archiveOnly;
  target.beginnerFriendly = target.beginnerFriendly ?? defaults.beginnerFriendly;
  target.soloFriendly = target.soloFriendly ?? defaults.soloFriendly;
  target.lockerRisk = target.lockerRisk ?? defaults.lockerRisk;
  target.returnDifficulty = target.returnDifficulty ?? defaults.returnDifficulty;
  target.nightSafetyNote = target.nightSafetyNote || defaults.nightSafetyNote;
  target.lockerNote = target.lockerNote || defaults.lockerNote;
  target.baggageNote = target.baggageNote || defaults.baggageNote;
  target.convenienceNote = target.convenienceNote || defaults.convenienceNote;
  target.waitingNote = target.waitingNote || defaults.waitingNote;
  target.rainNote = target.rainNote || defaults.rainNote;
  target.returnNote = target.returnNote || defaults.returnNote;
  target.beginnerNote = target.beginnerNote || defaults.beginnerNote;
  target.ticketSearchLinks = target.ticketSearchLinks ?? defaults.ticketSearchLinks;
  target.sourceNotes = union(ensureArray(target.sourceNotes), defaults.sourceNotes);
  target.tips = target.tips ?? defaults.tips;
  target.warnings = target.warnings ?? defaults.warnings;
  target.preCheckItems = target.preCheckItems ?? defaults.preCheckItems;
  target.lockerStrategy = target.lockerStrategy || defaults.lockerStrategy;
  target.cloakStrategy = target.cloakStrategy || defaults.cloakStrategy;
  target.baggageStrategy = target.baggageStrategy || defaults.baggageStrategy;
  target.drinkStrategy = target.drinkStrategy || defaults.drinkStrategy;
  target.entryStrategy = target.entryStrategy || defaults.entryStrategy;
  target.merchStrategy = target.merchStrategy || defaults.merchStrategy;
  target.returnStrategy = target.returnStrategy || defaults.returnStrategy;
  target.soloStrategy = target.soloStrategy || defaults.soloStrategy;
  target.beginnerStrategy = target.beginnerStrategy || defaults.beginnerStrategy;
  target.cashNote = target.cashNote || defaults.cashNote;
  target.coinNote = target.coinNote || defaults.coinNote;
  target.restroomNote = target.restroomNote || defaults.restroomNote;
  target.signalNote = target.signalNote || defaults.signalNote;
  target.stairsNote = target.stairsNote || defaults.stairsNote;
  target.neighborhoodNote = target.neighborhoodNote || defaults.neighborhoodNote;
  target.photographyNote = target.photographyNote || defaults.photographyNote;
  target.reentryNote = target.reentryNote || defaults.reentryNote;
  target.lastTipVerifiedAt = target.lastTipVerifiedAt || defaults.lastTipVerifiedAt;
  target.tipTags = union(target.tipTags ?? [], defaults.tipTags);

  if (archiveNames.has(name) || raw.status === 'closed') {
    target.status = 'closed';
    target.venueType = 'closed_archive';
    target.showInVenueList = false;
    target.archiveOnly = true;
    target.priority = 'D';
    target.sourceConfidence = 'verified_or_historical';
    target.sourceNotes = union(target.sourceNotes, ['閉館済み・過去会場として扱うため現役一覧には表示しない。']);
  } else {
    target.status = target.status || 'active';
    target.showInVenueList = target.status === 'active' ? target.showInVenueList !== false : false;
  }

  byCanonical.set(key, target);
  for (const alias of target.aliases) byCanonical.set(normalize(alias), target);
}

const fallbackRegion = (venue) => {
  if (venue.areaGroup?.includes('kanagawa') || venue.area === '横浜' || venue.area === '川崎') return ['神奈川', '神奈川県'];
  if (
    venue.areaGroup?.includes('tokyo') ||
    ['渋谷', '原宿', '下北沢', '池袋', '新宿', '中野坂上', 'お台場', '中目黒', '上野', '大田区', '町田', '五反田', '目黒'].includes(venue.area)
  ) return ['東京', '東京都'];
  return ['', ''];
};

for (const venue of existing) {
  venue.aliases = ensureArray(venue.aliases);
  venue.sourceNotes = ensureArray(venue.sourceNotes);
  venue.tips = venue.tips ?? [];
  venue.warnings = venue.warnings ?? [
    '会場設備・ロッカー・クローク・ドリンク代・再入場・撮影可否は、公演や時期によって変わる場合があります。',
    '最新情報は必ず会場公式・主催者告知・チケットサイト・当日案内で確認してください。',
  ];
  venue.preCheckItems = venue.preCheckItems ?? ['チケット', '整理番号', 'ドリンク代', 'ロッカー/クローク', '再入場', '撮影可否', '物販', '終演後の帰り'];
  venue.tipTags = venue.tipTags ?? [];
  const [region, prefecture] = fallbackRegion(venue);
  venue.region = venue.region || region;
  venue.prefecture = venue.prefecture || prefecture;
  venue.areaGroup = venue.areaGroup || areaGroupFor(venue.region, venue.prefecture, venue.area);
  if (!venue.sourceNotes.includes(SOURCE_NOTE) && venue.sourceConfidence === 'partially_verified') venue.sourceNotes.push(SOURCE_NOTE);
}

existing.sort((a, b) => {
  const archiveA = a.archiveOnly ? 1 : 0;
  const archiveB = b.archiveOnly ? 1 : 0;
  if (archiveA !== archiveB) return archiveA - archiveB;
  const regionA = regionOrder.indexOf(a.region);
  const regionB = regionOrder.indexOf(b.region);
  if (regionA !== regionB) return (regionA === -1 ? 99 : regionA) - (regionB === -1 ? 99 : regionB);
  return String(a.name).localeCompare(String(b.name), 'ja');
});

fs.writeFileSync(DATA_PATH, `${JSON.stringify(existing, null, 2)}\n`);
console.log(`Merged ${rows.length} venue specs. Total venues: ${existing.length}`);
