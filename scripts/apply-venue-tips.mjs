import fs from 'node:fs';

const filePath = new URL('../data/venues.json', import.meta.url);
const venues = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const today = '2026-05-05';

const preCheckItems = ['チケット', '整理番号', 'ドリンク代', 'ロッカー/クローク', '再入場', '撮影可否', '物販', '終演後の帰り'];

const ticketSearchLinks = [
  { label: 'イープラスで探す', url: 'https://eplus.jp/' },
  { label: 'ローチケで探す', url: 'https://l-tike.com/' },
  { label: 'LivePocketで探す', url: 'https://livepocket.jp/' },
  { label: 'TIGETで探す', url: 'https://tiget.net/' },
];

const tip = (category, title, body, confidence = 'general', sourceType = 'summary') => ({
  category,
  title,
  body,
  confidence,
  sourceType,
  lastVerifiedAt: today,
});

const baseTips = [
  tip('baggage', '荷物は最小限にする', '小箱や混雑公演では大きい荷物が動きづらさにつながります。大きい荷物はロッカー、クローク、駅ロッカーへ預け、フロアに置かない前提で準備してください。'),
  tip('locker', 'ロッカーとクロークを事前確認する', '会場ロッカーがあっても数、利用開始タイミング、支払い方法、再利用可否は変わる場合があります。遠征や物販予定がある場合は駅ロッカーも候補に入れてください。'),
  tip('drink', 'ドリンク代用の現金を残す', '現金のみの会場や公演に備えて、ドリンク代用に1,000円札と小銭を残しておくと安心です。'),
  tip('entry', '整理番号と整列場所を確認する', '整理番号は座席指定ではなく入場順の目安です。開場前の整列場所や呼び出し方法は公演ごとに確認してください。'),
  tip('photography', '撮影・録音ルールを確認する', '撮影、録音、録画は公式に許可されている場合だけにします。出演者ごとに扱いが違う場合もあるため、当日の案内を優先してください。'),
];

const defaultWarnings = [
  '会場設備・ロッカー・クローク・ドリンク代・再入場・撮影可否は、公演や時期によって変わる場合があります。',
  '最新情報は必ず会場公式・主催者告知・チケットサイト・当日案内で確認してください。',
];

const defaultFields = (venue) => ({
  tips: baseTips,
  warnings: defaultWarnings,
  preCheckItems,
  lockerStrategy: venue.lockerNote || '会場ロッカーだけに頼らず、駅ロッカーやクローク運用も事前に確認してください。',
  cloakStrategy: 'クローク運用は公演ごとに有無、受付時間、料金、袋サイズが変わる場合があります。主催・会場案内を確認してください。',
  baggageStrategy: venue.baggageNote || '大きい荷物は持ち込まず、身につけられる小さめバッグにまとめると動きやすくなります。',
  drinkStrategy: 'ドリンク代は現金指定の可能性もあるため、入場前に1,000円札と小銭を残しておくと安心です。',
  entryStrategy: '整理番号、集合場所、呼び出し方法、開場時間は公演ごとに確認してください。初めての会場は入口まで地図アプリで確認しておくと安心です。',
  merchStrategy: '物販後は荷物が増えやすいため、購入予定がある日は物販用バッグと預け先を先に決めてください。',
  returnStrategy: venue.returnNote || '終演後は駅までの導線と終電を事前に確認してください。',
  soloStrategy: venue.soloNote || '一人参戦では、開場前の待機場所、入場後の立ち位置、終演後の帰り道を先に決めておくと落ち着いて動けます。',
  beginnerStrategy: venue.beginnerNote || '初参戦では、チケット、整理番号、ドリンク代、荷物、撮影可否、帰り道を事前に確認してください。',
  cashNote: 'ドリンク代、ロッカー、クローク、物販で現金が必要になる場合があります。少額紙幣と小銭を分けて持つと安心です。',
  coinNote: 'ロッカー利用に100円玉が必要な場合があります。キャッシュレス前提にせず小銭も用意してください。',
  restroomNote: venue.venueScale === 'small' ? '小箱はトイレが少ない場合があります。開演直前や終演後の混雑を見込んで早めに済ませてください。' : 'トイレの場所と混みやすい時間は会場ごとに違います。入場前に済ませる選択肢も持ってください。',
  signalNote: venue.venueType === 'small_livehouse' ? '地下やビル内の会場では電波が弱い場合があります。電子チケットは入場前に表示確認してください。' : '通信状況は会場や混雑で変わります。電子チケットと充電残量を事前確認してください。',
  stairsNote: '階段や狭い通路では立ち止まらず、スタッフ案内に従って移動してください。',
  neighborhoodNote: venue.nightSafetyNote || '会場周辺で長時間溜まらず、整列開始までは近隣迷惑にならない場所で時間調整してください。',
  photographyNote: '撮影、録音、録画は公式許可がある場合のみ行ってください。許可範囲は公演や出演者ごとに異なる場合があります。',
  reentryNote: '再入場可否は公演ごとに変わります。不可の場合に備えて、入場前にトイレ、飲み物、荷物整理を済ませてください。',
  lastTipVerifiedAt: today,
  tipTags: buildDefaultTags(venue),
});

function buildDefaultTags(venue) {
  const tags = new Set();
  tags.add('現金必要');
  if (venue.lockerRisk >= 4) tags.add('ロッカー注意');
  if (venue.venueScale === 'small') tags.add('トイレ少なめ');
  if (venue.soloFriendly >= 4) tags.add('ぼっち参戦向き');
  if (venue.area === '渋谷') tags.add('渋谷人混み注意');
  if (venue.area === '横浜') tags.add('遠征荷物注意');
  if (venue.venueType === 'small_livehouse') tags.add('物販後荷物注意');
  if (['新宿club SCIENCE', '新宿HEIST'].includes(venue.name)) tags.add('歌舞伎町エリア注意');
  return Array.from(tags);
}

const specific = {
  'ikebukuro-edge': {
    tipTags: ['ロッカー注意', 'クローク確認', '駅ロッカー推奨', '小箱V系', '物販後荷物注意', 'ぼっち参戦向き'],
    lockerStrategy: '会場ロッカーは当てにしすぎず、駅ロッカーまたはクローク運用を確認する。',
    cloakStrategy: 'クローク運用がある場合でも、公演ごとに受付時間・料金・袋サイズが変わる可能性があるため公式確認。',
    tips: [
      tip('locker', '駅ロッカーも候補に入れる', 'V系公演では物販後に荷物が増えやすいため、会場ロッカーだけでなく池袋駅周辺のロッカーも候補にしてください。', 'medium'),
      tip('merch', '物販後の荷物を想定する', 'グッズ購入予定がある日は、フロアに持ち込む荷物を最小限にして、購入後の預け先を先に考えておくと安心です。', 'general'),
    ],
  },
  'ikebukuro-blackhole': {
    tipTags: ['ロッカー注意', '駅ロッカー推奨', '通路狭め注意', '小箱V系', 'トイレ少なめ'],
    lockerStrategy: '会場ロッカー・クロークはない前提で考え、池袋駅周辺ロッカーを先に検討する。',
    baggageStrategy: '通路やフロアで邪魔にならないよう、荷物は身につけられる量まで減らす。',
    tips: [
      tip('baggage', '身軽さを優先する', '小箱公演では通路や立ち位置に余裕が少ない場合があります。大きいバッグは預け、小さめバッグで入る準備をしてください。', 'medium'),
    ],
  },
  'shinjuku-club-science': {
    tipTags: ['歌舞伎町エリア注意', 'クローク推奨', '貴重品注意', '地下会場', '夜道注意', '階段混雑注意'],
    baggageStrategy: 'ロッカーは数に限りがあるため、クロークまたは駅ロッカーを検討。',
    neighborhoodNote: '歌舞伎町エリアのため、終演後の帰り道と駅までのルートを事前確認。',
    signalNote: '地下会場では通信が弱く感じる場合があります。電子チケットは入口前で表示確認しておくと安心です。',
    tips: [
      tip('safety', '夜の駅ルートを先に決める', '終演後は人通りが多い一方で慣れない道だと迷いやすいため、新宿駅や新宿三丁目駅までのルートを事前に確認してください。', 'medium'),
      tip('cloak', 'クローク前提で荷物を減らす', '大きい荷物はフロアに持ち込まず、クロークや駅ロッカーを優先して検討してください。', 'medium'),
    ],
  },
  'shibuya-rex': {
    tipTags: ['ロッカー少なめ', '渋谷人混み注意', '道玄坂注意', 'ドリンク代確認', '駅ロッカー推奨'],
    lockerStrategy: 'ロッカーはあるが数が限られるため、ソールド公演や物販予定ありなら渋谷駅ロッカーも検討。',
    tips: [
      tip('locker', 'ソールド公演は預け先を早めに決める', '動員が多い公演ではロッカーが埋まりやすいため、駅ロッカーや事前の荷物整理を候補に入れてください。', 'medium'),
      tip('neighborhood', '渋谷の混雑を見込む', '周辺は人通りが多く、開場前後の移動に時間がかかる場合があります。入口までの道順を事前確認してください。', 'general'),
    ],
  },
  'shibuya-the-game': {
    tipTags: ['100円玉必要', '渋谷奥地注意', 'ロッカー確認', 'センター街混雑', '初参戦は入口確認'],
    coinNote: 'ロッカー利用時に100円玉が必要な場合があるため、事前に小銭を用意。',
    entryStrategy: '渋谷駅からやや歩くため、初参戦は地図アプリで入口まで確認。',
    tips: [
      tip('coin', '100円玉を用意しておく', 'ロッカー利用時に小銭が必要になる場合があります。渋谷到着前に100円玉を用意しておくと慌てにくいです。', 'medium'),
      tip('entry', '入口までの道順を確認する', '渋谷駅から少し歩くため、初めて行く場合は会場入口まで地図アプリで確認してください。', 'general'),
    ],
  },
  'harajuku-ruido': {
    tipTags: ['原宿混雑注意', 'ロッカー数注意', 'クローク確認', '近隣待機注意', '駅ロッカー推奨'],
    lockerStrategy: 'ロッカーはあるが数に限りがあるため、原宿駅・明治神宮前駅周辺のロッカーも候補。',
    neighborhoodNote: '竹下通り・原宿周辺は休日混雑が強いため、開場前の時間調整場所を先に決める。',
    tips: [
      tip('neighborhood', '休日の原宿混雑を見込む', '休日は駅周辺や商業エリアが混みやすいため、開場前の時間調整場所と入口までのルートを先に決めてください。', 'general'),
    ],
  },
  'shimokitazawa-shangrila': {
    tipTags: ['ロッカーあり', '中箱', '終演後混雑', '駅ロッカー併用'],
    lockerStrategy: '会場ロッカーはあるが、動員が多い日は早め利用推奨。大荷物は下北沢駅周辺ロッカーも検討。',
    returnStrategy: '終演後は駅方面の細い道や周辺飲食店の人通りで混みやすいため、帰り道を先に確認してください。',
    tips: [
      tip('return', '終演後の駅方面混雑を見込む', '終演後は駅へ向かう人の流れが重なりやすいため、終電や待ち合わせがある人は余裕を持って動いてください。', 'general'),
    ],
  },
  'takadanobaba-club-phase': {
    tipTags: ['再入場不可注意', 'クローク前提', '階段周辺待機禁止', '飲食物持込禁止', 'クローク確認'],
    reentryNote: '再入場不可のため、入場前にトイレ・荷物整理・現金確認を済ませる。',
    cloakStrategy: '会場クローク利用前提。コインロッカーはない扱いで案内。',
    lockerStrategy: 'コインロッカーはない前提で、クローク運用または駅ロッカーを確認してください。',
    tips: [
      tip('reentry', '入場前に用事を済ませる', '再入場不可の案内がある公演では、入場後に外へ出られない前提でトイレ、飲み物、荷物整理を済ませてください。', 'medium'),
      tip('cloak', 'クローク前提で準備する', 'ロッカーではなくクローク運用を想定し、預けやすい荷物量にまとめてください。', 'medium'),
    ],
  },
  'ueno-otokoyokocho': {
    tipTags: ['会場内ロッカーなし', 'クローク利用', '上野駅ロッカー', '荷物注意', '駅ロッカー推奨'],
    lockerStrategy: '店内ロッカーなし。向かいビル事務所クロークまたは上野駅周辺ロッカーを検討。',
    cloakStrategy: 'クローク利用可否、受付場所、料金、受付時間は公演ごとに公式・主催案内で確認してください。',
    tips: [
      tip('locker', '上野駅周辺ロッカーも候補にする', '会場内ロッカーが使えない前提で、遠征荷物や物販後の荷物は上野駅周辺ロッカーも検討してください。', 'medium'),
    ],
  },
  'yokohama-baysis': {
    tipTags: ['ロッカー少なめ', '関内エリア', '専用駐車場なし', '横浜遠征', '遠征荷物注意'],
    lockerStrategy: '会場ロッカー数が少ないため、遠征荷物は関内駅周辺ロッカーも検討。',
    returnStrategy: '横浜遠征の場合は、関内駅からの終電と乗換を先に確認してください。',
    tips: [
      tip('return', '横浜遠征は終電を先に見る', '東京方面へ戻る場合は乗換が増えることがあります。終演後に焦らないよう、終電とホテル候補を事前確認してください。', 'general'),
    ],
  },
  'music-lab-hamashobo': {
    tipTags: ['小箱', 'ロッカーなし注意', 'クローク確認', '関内エリア', '大荷物注意', '遠征荷物注意'],
    baggageStrategy: '小規模会場のため、大きい荷物はクロークまたは近隣ロッカーへ。キャリー持ち込みは避ける。',
    lockerStrategy: 'ロッカーなし前提で、クローク運用または関内駅周辺ロッカーを確認してください。',
    tips: [
      tip('baggage', 'キャリー持ち込みを避ける', '小規模会場では大きい荷物が動線の負担になりやすいため、遠征荷物は先に預ける前提で準備してください。', 'medium'),
    ],
  },
  'higashi-koenji-20000v': {
    tipTags: ['小箱', '地下会場', 'ロッカーなし', 'クローク確認', 'フロア密集注意', 'トイレ少なめ'],
    lockerStrategy: 'ロッカーなし前提。クロークまたは駅ロッカーを確認。',
    signalNote: '地下会場のため、電子チケットや連絡手段は入場前に確認してください。',
    tips: [
      tip('signal', '地下会場の通信に注意する', '地下では電波が不安定になる場合があります。電子チケットと集合連絡は会場に入る前に確認してください。', 'general'),
    ],
  },
  'wildside-tokyo': {
    tipTags: ['地下会場', 'ロッカー要確認', '駅ロッカー推奨', '階段混雑注意', 'トイレ少なめ'],
    lockerStrategy: 'ロッカー・クローク情報が未確認なら、駅ロッカー先行で動く。',
    stairsNote: '地下への階段や通路は混みやすいため、入退場時は立ち止まらずスタッフ案内に従ってください。',
    tips: [
      tip('stairs', '階段まわりの混雑を見込む', '地下会場は入退場時に階段や通路が混みやすいので、急がずスタッフ案内に従って動いてください。', 'general'),
    ],
  },
};

const additions = [
  {
    slug: 'takadanobaba-club-phase',
    name: '高田馬場CLUB PHASE',
    area: '高田馬場',
    areaGroup: 'tokyo_takadanobaba',
    status: 'active',
    venueType: 'mid_livehouse',
    venueScale: 'small-mid',
    vkeiAffinity: 'medium',
    minorVkeiFriendly: true,
    sourceConfidence: 'verified',
    sourceType: 'official',
    sourceMemo: '公式サイト確認済み。公演ごとの設備・入場ルールは公式確認。',
    grokSuggested: false,
    currentUseNote: 'ライブハウスとして登録。V系専用ではないが、小〜中規模公演の確認候補として扱う。',
    vkeiUseType: 'vkei_occasional',
    priority: 'B',
    station: '高田馬場駅',
    walkMinutes: 5,
    officialUrl: 'https://www.club-phase.com/',
    lastVerifiedAt: today,
    showInVenueList: true,
    archiveOnly: false,
    beginnerFriendly: 3,
    soloFriendly: 4,
    lockerRisk: 4,
    returnDifficulty: 2,
    nightSafetyNote: '高田馬場駅方面へ戻る導線を事前確認。夜も人通りはあるが、初参戦は駅までのルート確認推奨。',
    lockerNote: 'コインロッカーではなくクローク運用前提で考え、最新案内を確認。',
    baggageNote: '大きい荷物はクロークまたは駅ロッカーへ。フロア持ち込みは最小限推奨。',
    convenienceNote: '駅周辺で飲み物や現金準備を済ませると安心。',
    waitingNote: '階段やビル周辺での待機は迷惑になりやすいため、公式整列案内に従う。',
    rainNote: '雨の日は整列・待機の負担が増えるため、折りたたみ傘と防水バッグ推奨。',
    returnNote: '終演後は高田馬場駅方面の導線と終電を事前確認。',
    beginnerNote: '再入場・クローク・飲食物持込など公演ごとの注意を入場前に確認。',
    ticketSearchLinks,
    sourceNotes: ['2026-05-05時点で公式サイト確認。公演詳細は公式・主催案内を確認。'],
  },
  {
    slug: 'ueno-otokoyokocho',
    name: '上野音横丁',
    area: '上野',
    areaGroup: 'tokyo_ueno',
    status: 'active',
    venueType: 'small_livehouse',
    venueScale: 'small-mid',
    vkeiAffinity: 'medium',
    minorVkeiFriendly: true,
    sourceConfidence: 'verified',
    sourceType: 'mixed',
    sourceMemo: '公式情報とチケットサイト系会場情報を確認。設備運用は公演ごとに確認。',
    grokSuggested: false,
    currentUseNote: '上野エリアの小〜中規模ライブハウスとして登録。V系以外も含むイベント会場。',
    vkeiUseType: 'vkei_occasional',
    priority: 'B',
    station: '上野駅',
    walkMinutes: 2,
    officialUrl: 'https://athers-music.com/livehouse/otoyoko-information/',
    lastVerifiedAt: today,
    showInVenueList: true,
    archiveOnly: false,
    beginnerFriendly: 3,
    soloFriendly: 4,
    lockerRisk: 4,
    returnDifficulty: 2,
    nightSafetyNote: '上野駅周辺は人通りがあるが、終演後は駅入口と乗換を事前確認推奨。',
    lockerNote: '会場内ロッカーなし前提。クロークや上野駅周辺ロッカーを確認。',
    baggageNote: '遠征荷物や物販後の荷物は預け先を先に決める。',
    convenienceNote: '駅周辺で飲み物、現金、小銭を準備してから向かうと安心。',
    waitingNote: 'ビル周辺や道路で溜まらず、整列開始までは駅周辺で時間調整。',
    rainNote: '駅から近いが、雨天時は待機場所と荷物の防水を確認。',
    returnNote: '終演後は上野駅までの導線と終電・乗換を事前確認。',
    beginnerNote: '初参戦は会場入口とクローク運用、再入場可否を事前確認。',
    ticketSearchLinks,
    sourceNotes: ['2026-05-05時点で公式情報を確認。会場設備・公演ルールは最新案内を確認。'],
  },
];

for (const addition of additions) {
  if (!venues.some((venue) => venue.slug === addition.slug)) {
    venues.push(addition);
  }
}

for (const venue of venues) {
  const defaults = defaultFields(venue);
  const patch = specific[venue.slug] ?? {};
  const defaultTips = defaults.tips ?? [];
  const patchTips = patch.tips ?? [];
  const mergedTags = Array.from(new Set([...(defaults.tipTags ?? []), ...(patch.tipTags ?? [])]));
  Object.assign(venue, defaults, patch, {
    tips: [...defaultTips, ...patchTips],
    warnings: patch.warnings ?? defaults.warnings,
    preCheckItems: patch.preCheckItems ?? defaults.preCheckItems,
    tipTags: mergedTags,
    lastTipVerifiedAt: patch.lastTipVerifiedAt ?? defaults.lastTipVerifiedAt,
  });
}

venues.sort((a, b) => {
  const priorityOrder = { A: 0, B: 1, C: 2, D: 3 };
  const statusOrder = { active: 0, unknown: 1, closed: 2 };
  return (
    (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9) ||
    (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9) ||
    a.area.localeCompare(b.area, 'ja') ||
    a.name.localeCompare(b.name, 'ja')
  );
});

fs.writeFileSync(filePath, `${JSON.stringify(venues, null, 2)}\n`, 'utf8');
