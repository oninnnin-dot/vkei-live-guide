import fs from 'node:fs';

const path = 'data/venues.json';
const venues = JSON.parse(fs.readFileSync(path, 'utf8'));
const checkedAt = '2026-05-06';

const official = (category, label, body, sourceLabel, sourceUrl, note = '') => ({
  category,
  label,
  body,
  sourceLabel,
  sourceUrl,
  sourceType: 'official',
  checkedAt,
  confidence: 'verified',
  ...(note ? { note } : {}),
});

const factsBySlug = {
  'ikebukuro-blackhole': [
    official(
      'access',
      '住所・最寄り導線',
      '公式アクセスページで、住所は東京都豊島区池袋2-3-5 曙ビルB1、池袋駅西口・C6出口より徒歩1分と案内されている。',
      '池袋BlackHole 公式アクセス',
      'https://www.black-hole.jp/contents/access.html',
    ),
    official(
      'locker',
      'ロッカー/クローク',
      '公式アクセスページで、コインロッカー・クロークはないと案内されている。',
      '池袋BlackHole 公式アクセス',
      'https://www.black-hole.jp/contents/access.html',
    ),
    official(
      'parking',
      '専用駐車場',
      '公式アクセスページで、専用駐車場はないと案内されている。',
      '池袋BlackHole 公式アクセス',
      'https://www.black-hole.jp/contents/access.html',
    ),
  ],
  'shinjuku-club-science': [
    official(
      'access',
      '最寄り駅からの所要時間',
      '公式アクセスページで、JR新宿駅東口徒歩7分、西武新宿駅南口徒歩6分、東新宿駅A1出口徒歩8分、新宿三丁目E1出口徒歩7分と案内されている。',
      '新宿club SCIENCE 公式アクセス',
      'https://club-science.com/access/',
    ),
    official(
      'access',
      '住所',
      '公式アクセスページで、住所は東京都新宿区歌舞伎町2-25-6 ホライズン・ビルディングB1Fと案内されている。',
      '新宿club SCIENCE 公式アクセス',
      'https://club-science.com/access/',
    ),
  ],
  'sugamo-shishio': [
    official(
      'access',
      '住所・入口導線',
      '公式アクセスページで、住所は東京都豊島区巣鴨2-3-3 第二福島ビルB1。巣鴨駅北口から、1階にマツキヨがある場所の横の筋を入り、ひとつ目の十字路右角の地下と案内されている。',
      '巣鴨獅子王 公式アクセス',
      'https://sugamo-cco.com/access.php',
    ),
    official(
      'parking',
      '駐車場・駐輪スペース',
      '公式アクセスページで、駐車場と駐輪スペースはないと案内されている。歩道に自転車やバイクを停めないよう注意が出ている。',
      '巣鴨獅子王 公式アクセス',
      'https://sugamo-cco.com/access.php',
    ),
    official(
      'rule',
      '飲食物の持ち込み',
      '公式アクセスページで、許可のない飲食物の持ち込みは遠慮するよう案内されている。',
      '巣鴨獅子王 公式アクセス',
      'https://sugamo-cco.com/access.php',
    ),
    official(
      'rule',
      '録音・録画機材',
      '公式アクセスページで、原則として録音・録画機材の持ち込みは遠慮するよう案内されている。必要な場合は事前申請が必要。',
      '巣鴨獅子王 公式アクセス',
      'https://sugamo-cco.com/access.php',
    ),
  ],
  'takadanobaba-club-phase': [
    official(
      'facility',
      'キャパシティ',
      '公式INFORMATIONページで、オールスタンディング300名と案内されている。',
      '高田馬場CLUB PHASE 公式INFORMATION',
      'https://www.club-phase.com/information.html',
    ),
    official(
      'drink',
      '入場時ドリンク代',
      '公式INFORMATIONページで、来場者は入場時に1ドリンク代600円が別途必要と案内されている。',
      '高田馬場CLUB PHASE 公式INFORMATION',
      'https://www.club-phase.com/information.html',
    ),
    official(
      'locker',
      'コインロッカー',
      '公式INFORMATIONページで、コインロッカーはないと案内されている。',
      '高田馬場CLUB PHASE 公式INFORMATION',
      'https://www.club-phase.com/information.html',
    ),
    official(
      'cloak',
      'クローク',
      '公式INFORMATIONページで、B1Fロビーにてクローク1袋500円、キャリーバッグ1つ500円と案内されている。',
      '高田馬場CLUB PHASE 公式INFORMATION',
      'https://www.club-phase.com/information.html',
    ),
    official(
      'rule',
      '再入場',
      '公式INFORMATIONページで、再入場はできないと案内されている。',
      '高田馬場CLUB PHASE 公式INFORMATION',
      'https://www.club-phase.com/information.html',
    ),
    official(
      'nearby',
      'ビル周辺・階段付近の滞留',
      '公式INFORMATIONページで、ビル周辺・階段付近にたまらないよう注意が出ている。',
      '高田馬場CLUB PHASE 公式INFORMATION',
      'https://www.club-phase.com/information.html',
    ),
    official(
      'rule',
      '飲食物の持ち込み',
      '公式INFORMATIONページで、店内への飲食物の持ち込みは断ると案内されている。',
      '高田馬場CLUB PHASE 公式INFORMATION',
      'https://www.club-phase.com/information.html',
    ),
  ],
  'ueno-otokoyokocho': [
    official(
      'facility',
      '収容人数',
      '公式INFORMATIONページで、ALL STANDING 200、SEATING 80と案内されている。',
      '上野音横丁 公式INFORMATION',
      'https://athers-music.com/livehouse/otoyoko-information/',
    ),
    official(
      'access',
      '上野駅からの距離',
      '公式INFORMATIONページで、上野駅から徒歩2分と案内されている。',
      '上野音横丁 公式INFORMATION',
      'https://athers-music.com/livehouse/otoyoko-information/',
    ),
    official(
      'drink',
      '1ドリンクオーダー',
      '公式INFORMATIONページで、入場者には1ドリンクオーダー600円が必要と案内されている。',
      '上野音横丁 公式INFORMATION',
      'https://athers-music.com/livehouse/otoyoko-information/',
    ),
    official(
      'rule',
      '再入場',
      '公式INFORMATIONページで、ライブ&CLUBの再入場は原則禁止と案内されている。',
      '上野音横丁 公式INFORMATION',
      'https://athers-music.com/livehouse/otoyoko-information/',
    ),
    official(
      'cloak',
      'クローク',
      '公式INFORMATIONページで、向かいビル3Fの事務所でクロークを行っていると案内されている。',
      '上野音横丁 公式INFORMATION',
      'https://athers-music.com/livehouse/otoyoko-information/',
    ),
    official(
      'locker',
      '店内コインロッカー',
      '公式INFORMATIONページで、店内にコインロッカーはないため、コインロッカーを使う場合は上野駅のコインロッカーを使うよう案内されている。',
      '上野音横丁 公式INFORMATION',
      'https://athers-music.com/livehouse/otoyoko-information/',
    ),
    official(
      'nearby',
      '店舗付近での滞留',
      '公式INFORMATIONページで、店舗付近で騒ぐこと、通行者や周辺住民の通行を妨げる行動は控えるよう案内されている。',
      '上野音横丁 公式INFORMATION',
      'https://athers-music.com/livehouse/otoyoko-information/',
    ),
  ],
  'shibuya-stream-hall': [
    official(
      'locker',
      '4F設備',
      '公式レイアウトPDFで、4Fエントランスロビーにクローク・ロッカールーム、ロッカー兼クローク、バー兼クロークが記載されている。',
      '渋谷ストリームホール 公式レイアウトPDF',
      'https://stream-hall.jp/hubfs/data/layout/setsubi_layout/RailLight_4-6F.pdf?hsLang=ja-jp',
    ),
    official(
      'facility',
      '5Fホワイエ設備',
      '公式レイアウトPDFで、5Fホワイエにバーカウンター、トイレ、喫煙室、物販スペースが記載されている。',
      '渋谷ストリームホール 公式レイアウトPDF',
      'https://stream-hall.jp/hubfs/data/layout/setsubi_layout/RailLight_4-6F.pdf?hsLang=ja-jp',
    ),
    official(
      'facility',
      '6Fホール収容人数',
      '公式レイアウトPDFで、6Fホールはスタンディング約650名、シアター273席、スクール162席と記載されている。',
      '渋谷ストリームホール 公式レイアウトPDF',
      'https://stream-hall.jp/hubfs/data/layout/setsubi_layout/RailLight_4-6F.pdf?hsLang=ja-jp',
    ),
  ],
  'shibuya-rex': [
    official(
      'access',
      '住所',
      '公式ページで、住所は東京都渋谷区道玄坂1-18-3 プレミア道玄坂ビルB1と案内されている。',
      '渋谷REX 公式ページ',
      'https://ruido.org/rex/',
    ),
    official(
      'rule',
      '公演開催状況の確認',
      '公式ページで、各公演の開催状況は来場前に主催者・出演者のホームページ等で確認するよう案内されている。',
      '渋谷REX 公式ページ',
      'https://ruido.org/rex/',
    ),
  ],
  'harajuku-ruido': [
    official(
      'access',
      '最寄り駅からの所要時間',
      '公式アクセスページで、JR原宿駅より徒歩5分、地下鉄明治神宮前駅より徒歩5分と案内されている。',
      '原宿RUIDO 公式アクセス',
      'https://ruido.org/rg/access.html',
    ),
    official(
      'access',
      '住所',
      '公式アクセスページで、住所は東京都渋谷区神宮前1-16-9 ジュマペール原宿2Fと案内されている。',
      '原宿RUIDO 公式アクセス',
      'https://ruido.org/rg/access.html',
    ),
  ],
};

const factSlugs = new Set(Object.keys(factsBySlug));

for (const venue of venues) {
  if (!factSlugs.has(venue.slug)) continue;

  const nextOfficialFacts = factsBySlug[venue.slug];
  const previousFacts = Array.isArray(venue.factChecks) ? venue.factChecks : [];
  const nonOfficialFacts = previousFacts.filter((fact) => fact.sourceType !== 'official');
  venue.factChecks = [...nonOfficialFacts, ...nextOfficialFacts];
  venue.lastVerifiedAt = checkedAt;
  venue.sourceConfidence = venue.sourceConfidence === 'social_only' ? 'partially_verified' : venue.sourceConfidence;

  if (!Array.isArray(venue.sourceNotes)) venue.sourceNotes = venue.sourceNotes ? [String(venue.sourceNotes)] : [];
  const note = '公式ページで確認した事実のみ factChecks に登録。公式で確認できない周辺施設・帰路情報は未登録。';
  if (!venue.sourceNotes.includes(note)) venue.sourceNotes.push(note);
}

fs.writeFileSync(path, `${JSON.stringify(venues, null, 2)}\n`);
console.log(`Updated official fact checks for ${factSlugs.size} venues.`);
