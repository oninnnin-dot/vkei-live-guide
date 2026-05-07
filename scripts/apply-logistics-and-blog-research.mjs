import fs from 'node:fs';

const DATA_PATH = 'data/venues.json';
const CHECKED_AT = '2026-05-07';

const venues = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

const mergeUniqueByUrl = (items = []) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = `${item.url || ''}::${item.label || item.sourceName || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const mergeUniqueByTitle = (items = []) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = `${item.category || ''}::${item.title || item.label || item.sourceName || ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const source = (label, url, type = 'personal_blog') => ({
  label,
  url,
  type,
  checkedAt: CHECKED_AT,
});

const signal = (topic, summary, sourceName, sourceUrl, sourceType = 'personal_blog', confidence = 'medium') => ({
  topic,
  summary,
  sourceType,
  confidence,
  sourceName,
  sourceUrl,
  checkedAt: CHECKED_AT,
  copyrightNote: '文章コピーなし。要点のみ独自表現に変換。',
});

const comment = (category, title, commentText, action, sourceName, sourceUrl, sourceType = 'personal_blog', confidence = 'medium') => ({
  category,
  title,
  comment: commentText,
  action,
  sourceType,
  confidence,
  sourceName,
  sourceUrl,
  checkedAt: CHECKED_AT,
});

const defaultLockerInfo = (venue) => {
  const status = venue.lockerProfile?.status ?? 'unknown';
  const mappedStatus = status === 'available' ? 'available' : status === 'limited' ? 'limited' : status === 'none' ? 'none' : 'unknown';
  return {
    venueLockerStatus: mappedStatus,
    venueLockerText: venue.lockerProfile?.summary || venue.lockerNote || '会場内ロッカーは未確認。',
    lockerCountText: venue.lockerProfile?.countNote || '個数未確認。',
    beforeEntryUse: 'unknown',
    afterEntryUse: 'unknown',
    coinNeeded: 'unknown',
    largeBagFit: 'unknown',
    sourceConfidence: mappedStatus === 'unknown' ? 'unknown' : 'mixed',
    lastCheckedAt: venue.lastTipVerifiedAt || venue.lastVerifiedAt || CHECKED_AT,
  };
};

const defaultCloakInfo = (venue) => {
  const status = venue.cloakProfile?.status ?? 'unknown';
  const mappedStatus =
    status === 'available' ? 'available' :
    status === 'sometimes' ? 'event_dependent' :
    status === 'none' ? 'none' :
    'unknown';
  return {
    cloakStatus: mappedStatus,
    cloakText: venue.cloakProfile?.summary || venue.cloakStrategy || 'クローク運用は未確認。',
    priceText: venue.cloakProfile?.priceNote || '料金未確認。',
    timingText: venue.cloakProfile?.timing || '受付タイミング未確認。',
    bagTypeText: venue.cloakProfile?.bagTypeNote || '袋形式や預け方は未確認。',
    sourceConfidence: mappedStatus === 'unknown' ? 'unknown' : 'mixed',
    lastCheckedAt: venue.lastTipVerifiedAt || venue.lastVerifiedAt || CHECKED_AT,
  };
};

const defaultBaggageGuide = (venue) => ({
  smallBag: venue.baggageDecision?.tinyBag || 'スマホ・財布・チケットだけなら小さめバッグで入場。',
  backpack: venue.baggageDecision?.backpack || 'リュックはフロアで邪魔になりやすい。駅ロッカーかクロークを先に検討。',
  suitcase: venue.baggageDecision?.suitcase || 'キャリーケースは会場持ち込み非推奨。駅大型ロッカーかホテル預けを先に探す。',
  afterMerch: venue.baggageDecision?.afterMerch || '物販後に荷物が増える日は、買った後の預け先を先に決める。',
  goodTicketNumber: venue.baggageDecision?.goodTicketNumber || '良番なら荷物処理を先に終わらせ、呼び出し前に身軽にしておく。',
});

const defaultNearbyInfo = (venue) => ({
  nearestConvenienceStore: venue.convenienceNote || '周辺コンビニは未確認。駅周辺で先に飲み物を用意する。',
  stationLocker: venue.stationLockerNote || venue.lockerAlternativeNote || '駅ロッカー情報は未確認。荷物が多い日は最寄り駅で先に探す。',
  waitingSpot: venue.timeKillingNote || venue.waitingNote || '会場前に長くたまらず、整列開始まで駅周辺で時間調整する。',
  rainShelter: venue.badWeatherNote || venue.rainNote || '雨の日の逃げ場は未確認。駅や商業施設側で待てる場所を先に決める。',
  restroomBeforeEntry: venue.restroomNote || '入場前トイレは未確認。駅や商業施設で先に済ませる。',
  cashAndCoin: venue.cashNote || venue.coinNote || 'ドリンク代用の現金と小銭を残す。',
  afterShowRoute: venue.afterShowStrategy || venue.returnNote || '終演後は最寄り駅までの導線を事前に確認する。',
  nightSafety: venue.nightSafetyNote || '夜道の雰囲気は未確認。大通りと駅出口を先に決める。',
});

const defaultBlogResearch = (venue) => ({
  status: 'not_started',
  checkedAt: '',
  searchQueries: [],
  summary: `${venue.name}の個人ブログ・参戦レポ由来情報は未調査。公式情報と当日案内を優先してください。`,
  confidence: 'unknown',
});

for (const venue of venues) {
  venue.lockerInfo = venue.lockerInfo ?? defaultLockerInfo(venue);
  venue.cloakInfo = venue.cloakInfo ?? defaultCloakInfo(venue);
  venue.baggageGuide = venue.baggageGuide ?? defaultBaggageGuide(venue);
  venue.nearbyInfo = venue.nearbyInfo ?? defaultNearbyInfo(venue);
  venue.blogResearch = venue.blogResearch ?? defaultBlogResearch(venue);
  venue.dayDecisionGuide = venue.dayDecisionGuide ?? {
    baggageDay: venue.baggageGuide.backpack,
    goodNumberDay: venue.baggageGuide.goodTicketNumber,
    merchDay: venue.baggageGuide.afterMerch,
    rainyDay: venue.nearbyInfo.rainShelter,
    soloDay: venue.soloOneLine || venue.soloStrategy || '一人参戦は、待機場所と帰り道を先に決めておくと動きやすい。',
    hurryAfterShowDay: venue.nearbyInfo.afterShowRoute,
  };
}

const patches = {
  'ikebukuro-edge': {
    blogResearch: {
      status: 'researched',
      checkedAt: CHECKED_AT,
      searchQueries: [
        '池袋EDGE ロッカー クローク 参戦レポ note ブログ',
        '池袋EDGE 行き方 ロッカー クローク ブログ 参戦',
        '池袋EDGE note ロッカー クローク 参戦レポ',
        '池袋EDGE 電波 トイレ 段上 参戦レポ',
      ],
      summary: '会場DBではロッカー・クロークなし扱いが複数あり、個人noteではクローク運用があった日も確認できる。固定設備として会場内ロッカーを当てにせず、池袋駅ロッカーを先に使う動きが安全。地下会場で電波が弱いという体験談もあるため、電子チケットは入場前に表示しておく。',
      confidence: 'medium',
    },
    lockerInfo: {
      venueLockerStatus: 'none',
      venueLockerText: '複数の会場DB・参戦系記事で会場内ロッカーなし扱い。過去の外ロッカー撤去にも触れられている。',
      lockerCountText: '会場内ロッカー数はなし扱い。池袋駅構内・駅周辺ロッカーが代替候補。',
      beforeEntryUse: 'unavailable',
      afterEntryUse: 'unavailable',
      coinNeeded: 'no',
      largeBagFit: 'no',
      sourceConfidence: 'mixed',
      lastCheckedAt: CHECKED_AT,
    },
    cloakInfo: {
      cloakStatus: 'event_dependent',
      cloakText: '古い会場DBではクロークなし、近年のnoteでは500円クロークありの日がある。公演運用として見る。',
      priceText: '近年の体験記事では500円の記録あり。ただし当日案内優先。',
      timingText: '体験記事では入場後対応。開場前に預けられる前提で動かない。',
      bagTypeText: '袋形式は未確認。貴重品は手元。',
      sourceConfidence: 'mixed',
      lastCheckedAt: CHECKED_AT,
    },
    nearbyInfo: {
      nearestConvenienceStore: '南池袋・池袋駅周辺にコンビニは多い。開場直前は混みやすいので飲み物は駅側で先に買う。',
      stationLocker: '池袋駅構内、43・42番出口付近のロッカーに触れる記事あり。池袋駅は広いので、会場に近い出口だけでなく乗換側も候補にする。',
      waitingSpot: '会場前に長く固まらず、整列開始までは池袋駅・駅ビル・周辺カフェで時間調整する。',
      rainShelter: '雨の日は会場前で待ち続けない。駅地下・商業施設側で待機して、整列時間に合わせて移動する。',
      restroomBeforeEntry: 'noteではトイレ個室数に触れられているが、混雑時は会場トイレを当てにせず駅で先に済ませる。',
      cashAndCoin: 'クローク運用がある日は現金が必要になりやすい。ドリンク代と500円程度を別に残す。',
      afterShowRoute: '終演後は池袋駅の改札とロッカー回収がセット。預けたロッカーの位置をスクショしておく。',
      nightSafety: '池袋駅周辺は人通りが多い。初参戦は駅出口と帰りの改札を先に決める。',
    },
    dayDecisionGuide: {
      baggageDay: '荷物がある日は池袋駅ロッカー先行。会場で預け先を探す時間を作らない。',
      goodNumberDay: '良番ならロッカー探しで出遅れない。入場前に身軽にして入口へ。',
      merchDay: '物販で袋が増える日は、買った後に駅ロッカーへ戻すか、クロークがある日だけ会場預けにする。',
      rainyDay: '雨の日は駅・商業施設で待つ。会場前に濡れた荷物を持ったまま立たない。',
      soloDay: '一人なら駅側で待機して、整列時間になったら移動するのが楽。段上後方も候補にできる。',
      hurryAfterShowDay: '終演後に急ぐ日は、ロッカー位置と帰り改札をメモしてから入場する。',
    },
    blogSignals: [
      signal('locker', '複数の会場DBではロッカー・クロークなし扱い。近年の体験記事ではクロークありの日もあり、固定ではなく公演運用として見るのが安全。', 'ライブハウスナビ / note 池袋EDGE体験メモ', 'https://note.com/ebitama/n/nb37867990132', 'mixed', 'medium'),
      signal('locker', '池袋駅構内や近隣ロッカーを使う方がよいという案内が複数見られる。駅が大きいため、空き探しの時間を先に取る。', 'ライブ研究室', 'https://live-kenkyushitsu.com/569.html', 'personal_blog', 'medium'),
      signal('signal', '地下会場のため、電波は弱めという体験情報がある。電子チケットや地図は会場前に表示しておく。', 'ライブ研究室', 'https://live-kenkyushitsu.com/569.html', 'personal_blog', 'low'),
      signal('view', '後方段上が見やすいという体験談がある一方、公演によって物販配置などで使えない場合もある。', 'note 池袋EDGE体験メモ', 'https://note.com/ebitama/n/nb37867990132', 'note', 'low'),
    ],
    sourceLinks: [
      source('会場公式', 'https://xxxrecords.jp/edge/index.html', 'official'),
      source('ライブハウスナビ 池袋EDGE', 'https://live-house.info/toshimaku/edge.html', 'venue_database'),
      source('ライブ研究室 池袋EDGE', 'https://live-kenkyushitsu.com/569.html', 'personal_blog'),
      source('note 池袋EDGE体験メモ', 'https://note.com/ebitama/n/nb37867990132', 'note'),
      source('V系ゼンサイ 池袋EDGE', 'https://ameblo.jp/vzensai/entry-11994852767.html', 'personal_blog'),
      source('SOLITUDE-klang 池袋EDGE参戦レポ', 'https://solitude-klang.hatenablog.com/entry/2023/03/11/210904', 'personal_blog'),
    ],
  },
  'ikebukuro-blackhole': {
    blogResearch: {
      status: 'researched',
      checkedAt: CHECKED_AT,
      searchQueries: [
        '池袋BlackHole ロッカー クローク ライブハウス ブログ V系',
        '池袋BlackHole キャパ ロッカー クローク アクセス ライブハウス',
        '池袋BlackHole 初めて 参戦レポ V系 ブログ',
        '池袋BlackHole 荷物 クローク 参戦',
      ],
      summary: '会場DB・LiveFans・Supernice!でロッカーなし傾向が一致。公式PDFの過去注意事項では、足元に置けない荷物や荷物放置を禁止する運用が出ていた。C6出口から近いが、荷物が多い日は池袋駅ロッカーを先に確保する方が安全。',
      confidence: 'medium',
    },
    lockerInfo: {
      venueLockerStatus: 'none',
      venueLockerText: '会場DBとLiveFansでコインロッカーなし扱い。',
      lockerCountText: 'なし扱い。池袋駅ロッカーが代替候補。',
      beforeEntryUse: 'unavailable',
      afterEntryUse: 'unavailable',
      coinNeeded: 'no',
      largeBagFit: 'no',
      sourceConfidence: 'mixed',
      lastCheckedAt: CHECKED_AT,
    },
    cloakInfo: {
      cloakStatus: 'none',
      cloakText: '会場DBではクロークなし扱い。公演別に案内が出る場合を除き、ない前提で動く。',
      priceText: '未確認。',
      timingText: '未確認。開場前利用は当てにしない。',
      bagTypeText: '未確認。',
      sourceConfidence: 'mixed',
      lastCheckedAt: CHECKED_AT,
    },
    nearbyInfo: {
      nearestConvenienceStore: '池袋西口・C6出口周辺にコンビニは多い。飲み物は駅側で先に買う。',
      stationLocker: '池袋駅ロッカー推奨。西口側だけで埋まる場合は、乗換動線側も候補にする。',
      waitingSpot: 'C6出口から近いので、早く着きすぎたら駅周辺で待機してから向かう。',
      rainShelter: '雨の日はC6出口近くまで地下・駅側で引きつけて移動する。',
      restroomBeforeEntry: '小箱なので入場前に駅で済ませるのが無難。',
      cashAndCoin: 'ドリンク代とロッカー用IC/小銭を分けて残す。',
      afterShowRoute: '終演後はC6出口方面から池袋駅へ戻る。人流が多いので改札を先に決める。',
      nightSafety: '池袋西口側は夜も人通りが多い。繁華街に寄り道せず駅へ戻るルートを決める。',
    },
    dayDecisionGuide: {
      baggageDay: '荷物ありなら池袋駅ロッカー一択。会場クローク待ちはしない。',
      goodNumberDay: '良番は入口前で荷物を抱えない。駅で預けてからC6出口へ。',
      merchDay: '物販後に荷物が増えるなら、終演まで持てる小袋か駅ロッカー戻しを決める。',
      rainyDay: '雨の日はC6出口近くまで屋根のある動線を使い、会場前滞留を短くする。',
      soloDay: '一人参戦はC6出口・会場入口・帰り改札を先に確認すれば動きやすい。',
      hurryAfterShowDay: '急ぐ日は駅ロッカー回収を避ける量にするか、ロッカー位置をスクショしておく。',
    },
    blogSignals: [
      signal('locker', 'イベここ、LiveFans、Supernice!でロッカーなし扱いが一致。荷物は駅で処理する前提にする。', 'イベここ / LiveFans / Supernice!', 'https://evecoco.net/livehouse/2541/', 'mixed', 'medium'),
      signal('baggage', '過去の公式PDFでは、足元に置ききれない荷物や荷物放置を避ける注意が出ていた。混雑公演ほど荷物を減らす。', '池袋BlackHole 公式PDF', 'https://www.black-hole.jp/images/2018finaltime.pdf', 'official', 'low'),
      signal('access', '個人ブログではV系寄りの小箱として触れられており、ドリンクは終演後に回す動きも紹介されている。', '毎日ビール.jp', 'https://mainichibeer.jp/archives/668/', 'personal_blog', 'low'),
    ],
    sourceLinks: [
      source('会場公式アクセス', 'https://www.black-hole.jp/contents/access.html', 'official'),
      source('池袋BlackHole 公式PDF', 'https://www.black-hole.jp/images/2018finaltime.pdf', 'official'),
      source('イベここ 池袋BlackHole', 'https://evecoco.net/livehouse/2541/', 'venue_database'),
      source('LiveFans 池袋Black Hole', 'https://www.livefans.jp/venues/5107', 'venue_database'),
      source('Supernice! 池袋BlackHole', 'https://super-nice.net/%E6%9D%B1%E4%BA%AC%E9%83%BD/27395/', 'venue_database'),
      source('毎日ビール.jp 池袋BLACK HOLEレポ', 'https://mainichibeer.jp/archives/668/', 'personal_blog'),
    ],
  },
  'shibuya-rex': {
    blogResearch: {
      status: 'researched',
      checkedAt: CHECKED_AT,
      searchQueries: [
        '渋谷REX ロッカー クローク 参戦レポ ブログ',
        '渋谷REX 荷物 キャリーケース 物販',
        '渋谷REX 待機場所 雨の日 コンビニ',
        '渋谷REX 行き方 終演後 道玄坂',
      ],
      summary: '参戦系まとめでは会場ロッカー24個・300円、クローク500円の案内が見られる。キャパに対してロッカーが少ないため、渋谷駅ロッカーやクロークを保険にする判断が実用的。道玄坂の地下会場なので、初参戦は入口確認と坂道移動の余裕が大事。',
      confidence: 'medium',
    },
    lockerInfo: {
      venueLockerStatus: 'limited',
      venueLockerText: '参戦系記事ではトイレ前に小型ロッカー24個の記録あり。キャパに対して少ない。',
      lockerCountText: '24個 / 300円という体験ベース情報あり。変更の可能性あり。',
      beforeEntryUse: 'unknown',
      afterEntryUse: 'available',
      coinNeeded: 'yes',
      largeBagFit: 'no',
      sourceConfidence: 'blog_report',
      lastCheckedAt: CHECKED_AT,
    },
    cloakInfo: {
      cloakStatus: 'available',
      cloakText: '参戦系記事と公式SNS言及ではクローク500円の案内あり。整列・受付時に申し出る運用として扱う。',
      priceText: '500円の情報あり。',
      timingText: '整列・受付時に申し出る案内が確認できる。開場前単独利用は未確認。',
      bagTypeText: 'ロッカーに入らない荷物はクローク候補。貴重品は手元。',
      sourceConfidence: 'mixed',
      lastCheckedAt: CHECKED_AT,
    },
    nearbyInfo: {
      nearestConvenienceStore: '道玄坂・マークシティ周辺にコンビニは多い。坂上へ行く前に駅側で買うと戻りが少ない。',
      stationLocker: '渋谷駅はロッカーが多いが混む。東急公式の駅ロッカー情報も見て、空きと決済手段を確認する。',
      waitingSpot: '開場前は会場前に長くたまらず、渋谷マークシティ・駅周辺・カフェで時間調整する。',
      rainShelter: '雨の日は坂道移動がしんどい。マークシティ側で待って、整列時間に合わせて移動する。',
      restroomBeforeEntry: 'トイレ前ロッカー情報があるため、開場後は周辺が混みやすい。駅で先に済ませる。',
      cashAndCoin: 'ロッカー用100円玉、クローク500円、ドリンク代を別に残す。',
      afterShowRoute: '終演後は道玄坂から渋谷駅へ下る。人混みが強いので、使う路線の改札を先に決める。',
      nightSafety: '道玄坂・センター街方面は夜も混雑する。ぼっち参戦は明るい大通りで駅へ戻る。',
    },
    dayDecisionGuide: {
      baggageDay: '小ロッカー24個情報ありだが少ない。荷物ありなら渋谷駅ロッカーかクローク前提。',
      goodNumberDay: '良番ならロッカー争奪をしない。駅ロッカーかクローク利用方針を開場前に決める。',
      merchDay: '物販で荷物が増えるならクローク候補。ロッカーは小型なので服や大袋は入らない前提。',
      rainyDay: '雨の日は坂道で傘と荷物が邪魔。駅・マークシティ側で時間を潰してから向かう。',
      soloDay: '一人なら入口・階段・帰りの駅方向を先に確認。後方段差を狙うなら早めに入る。',
      hurryAfterShowDay: '急ぐ日はクローク返却と駅混雑を見込む。終演後の回収物を減らす。',
    },
    blogSignals: [
      signal('locker', '参戦系記事で小型ロッカー24個とされており、キャパ比では少ない。人気公演は駅ロッカー併用が安全。', 'ライブガイドドッグ 渋谷REX', 'https://trend-dogman.com/shibuya-rex/', 'personal_blog', 'medium'),
      signal('cloak', '公式SNS由来の案内として、全公演クローク500円という情報が紹介されている。ただし当日の案内を優先する。', 'ライブガイドドッグ 渋谷REX', 'https://trend-dogman.com/shibuya-rex/', 'mixed', 'medium'),
      signal('access', '道玄坂の地下会場なので、初参戦は駅から入口までのルートと階段を先に確認すると迷いにくい。', '渋谷REX公式 / 参戦系記事', 'https://ruido.org/rex/', 'mixed', 'medium'),
      signal('locker', '渋谷駅ロッカーは駅公式情報で位置と決済手段を確認できる。会場前で探すより駅で処理する方が動きやすい。', '東急 渋谷駅コインロッカー', 'https://www.tokyu.co.jp/railway/guide/baggage/station/TY/ty01.html', 'official', 'medium'),
    ],
    sourceLinks: [
      source('渋谷REX公式', 'https://ruido.org/rex/', 'official'),
      source('ライブガイドドッグ 渋谷REX', 'https://trend-dogman.com/shibuya-rex/', 'personal_blog'),
      source('東急 渋谷駅コインロッカー', 'https://www.tokyu.co.jp/railway/guide/baggage/station/TY/ty01.html', 'official'),
      source('渋谷REX 公式SNSミラー', 'https://www6.twstalker.com/SHIBUYA_REX', 'sns'),
    ],
  },
  'takadanobaba-club-phase': {
    blogResearch: {
      status: 'researched',
      checkedAt: CHECKED_AT,
      searchQueries: [
        '高田馬場CLUB PHASE ロッカー クローク 参戦レポ ブログ',
        '高田馬場CLUB PHASE 行き方 ブログ',
        '高田馬場CLUB PHASE 物販 荷物 クローク',
        '高田馬場CLUB PHASE 再入場 ロッカー',
      ],
      summary: '公式が最も強い会場。コインロッカーなし、B1Fロビーのクローク、キャリー預かり、再入場不可、ビル周辺・階段付近にたまらない注意が明記されている。古い会場DBや口コミと食い違う場合は公式優先。',
      confidence: 'high',
    },
    lockerInfo: {
      venueLockerStatus: 'none',
      venueLockerText: '公式INFORMATIONでコインロッカーなしと明記。',
      lockerCountText: 'なし。',
      beforeEntryUse: 'unavailable',
      afterEntryUse: 'unavailable',
      coinNeeded: 'no',
      largeBagFit: 'no',
      sourceConfidence: 'official',
      lastCheckedAt: CHECKED_AT,
    },
    cloakInfo: {
      cloakStatus: 'available',
      cloakText: '公式INFORMATIONでB1Fロビーのクローク利用案内あり。',
      priceText: '1袋500円、キャリーバッグ1つ500円と公式案内あり。',
      timingText: 'B1Fロビーで実施。受付詳細は当日案内に従う。',
      bagTypeText: '袋単位。キャリーバッグは別扱いで預けられる案内あり。',
      sourceConfidence: 'official',
      lastCheckedAt: CHECKED_AT,
    },
    nearbyInfo: {
      nearestConvenienceStore: '高田馬場駅周辺で先に飲み物を用意。店内への飲食物持ち込み不可なので入場前に飲み切る。',
      stationLocker: '会場ロッカーなし。高田馬場駅周辺ロッカーかクロークを使う。',
      waitingSpot: '公式でビル周辺・階段付近にたまらない注意あり。整列開始まで駅周辺のカフェ等で待つ。',
      rainShelter: '雨の日も階段周辺にたまらない。駅側で待って、整列案内に合わせる。',
      restroomBeforeEntry: '再入場不可なので、入場前に駅や周辺施設で済ませる。',
      cashAndCoin: 'ドリンク代600円とクローク代を現金で分けて持つ。',
      afterShowRoute: '終演後はクローク返却が重なる。急ぐ日は預ける荷物を減らすか、返却時間を見込む。',
      nightSafety: '高田馬場駅方面へ大通りで戻る。初参戦は駅までの道順を先に確認する。',
    },
    dayDecisionGuide: {
      baggageDay: '荷物ありならクローク前提。駅ロッカーを使う場合は入場前に済ませる。',
      goodNumberDay: '良番ならクローク列で焦らないよう、早めに到着して入場前チェックを終える。',
      merchDay: '物販で増える荷物はクロークへ。財布・スマホ・チケットは手元に残す。',
      rainyDay: '雨の日でも階段付近で待たない。駅側で待って整列時間に動く。',
      soloDay: '一人参戦は公式注意を守れば動きやすい。再入場不可だけ先に覚える。',
      hurryAfterShowDay: '終演後に急ぐ日はクローク返却待ちを計算。荷物が少なければ持ち込み小バッグにする。',
    },
    blogSignals: [
      signal('locker', '公式はロッカーなし・クロークあり。古いブログや会場DBのロッカー情報より公式を優先する。', '高田馬場CLUB PHASE公式INFORMATION', 'https://www.club-phase.com/information.html', 'official', 'high'),
      signal('cloak', 'V系系の参戦レポでも、以前のロッカー運用からクローク運用へ変わったという声がある。現状は公式案内のクローク前提で動く。', 'SOLITUDE-klang 高田馬場CLUB PHASE参戦レポ', 'https://solitude-klang.hatenablog.com/entry/2024/01/13/215300', 'personal_blog', 'medium'),
      signal('access', '行き方ブログでは駅からのルート確認が主題。初参戦は会場入口と帰り道を先に見ると迷いにくい。', 'レポとも 高田馬場CLUB PHASE行き方', 'https://ameblo.jp/stafftomo/entry-10196088246.html', 'personal_blog', 'low'),
      signal('waiting', '公式でビル周辺・階段付近の滞留禁止が明記されている。待機は駅側に寄せる。', '高田馬場CLUB PHASE公式INFORMATION', 'https://www.club-phase.com/information.html', 'official', 'high'),
    ],
    sourceLinks: [
      source('会場公式', 'https://www.club-phase.com/', 'official'),
      source('高田馬場CLUB PHASE公式INFORMATION', 'https://www.club-phase.com/information.html', 'official'),
      source('SOLITUDE-klang 高田馬場CLUB PHASE参戦レポ', 'https://solitude-klang.hatenablog.com/entry/2024/01/13/215300', 'personal_blog'),
      source('レポとも 高田馬場CLUB PHASE行き方', 'https://ameblo.jp/stafftomo/entry-10196088246.html', 'personal_blog'),
      source('Supernice! 高田馬場CLUB PHASE', 'https://super-nice.net/%E6%9D%B1%E4%BA%AC%E9%83%BD/3419/', 'venue_database'),
    ],
  },
  'sugamo-shishio': {
    blogResearch: {
      status: 'partial',
      checkedAt: CHECKED_AT,
      searchQueries: [
        '巣鴨獅子王 参戦レポ V系 ブログ ロッカー',
        '巣鴨獅子王 行き方 ロッカー クローク ブログ',
        '巣鴨獅子王 ライブハウス キャパ ロッカー',
        '巣鴨獅子王 トイレ 電波 階段 参戦',
      ],
      summary: '公式でキャパとアクセスは確認できるが、ロッカー・クロークの公式確定情報は見つけきれていない。個人レポでは巣鴨の街の雰囲気や駅からの動きに触れるものがあり、荷物面は駅ロッカー先行が安全。',
      confidence: 'low',
    },
    lockerInfo: {
      venueLockerStatus: 'unknown',
      venueLockerText: '会場内ロッカーの公式確認は未確認。',
      lockerCountText: '個数未確認。',
      beforeEntryUse: 'unknown',
      afterEntryUse: 'unknown',
      coinNeeded: 'unknown',
      largeBagFit: 'unknown',
      sourceConfidence: 'unknown',
      lastCheckedAt: CHECKED_AT,
    },
    cloakInfo: {
      cloakStatus: 'unknown',
      cloakText: 'クローク有無は未確認。公演ごとの案内を見る。',
      priceText: '未確認。',
      timingText: '未確認。',
      bagTypeText: '未確認。',
      sourceConfidence: 'unknown',
      lastCheckedAt: CHECKED_AT,
    },
    nearbyInfo: {
      nearestConvenienceStore: '巣鴨駅周辺で事前購入。会場前で飲み物を探すより駅側で済ませる。',
      stationLocker: '会場設備が未確認のため、荷物が多い日は巣鴨駅ロッカーを先に確認する。',
      waitingSpot: '開場前は駅周辺で待つ。会場前に長く固まらない。',
      rainShelter: '雨の日は駅近くで待機して、整列開始に合わせる。',
      restroomBeforeEntry: '小箱なので駅で先に済ませる。',
      cashAndCoin: 'ドリンク代と小銭を残す。クロークがある場合に備えて現金も残す。',
      afterShowRoute: '巣鴨駅へ戻る導線は短い。終電がある日は山手線だけでなく乗換も見ておく。',
      nightSafety: '巣鴨は比較的落ち着いた雰囲気だが、夜は駅までの道を先に確認する。',
    },
    dayDecisionGuide: {
      baggageDay: 'ロッカー未確認なので駅ロッカー先行。リュック以上は会場に持ち込まない。',
      goodNumberDay: '良番なら荷物確認に時間を使わない。駅で預けてから向かう。',
      merchDay: '物販で荷物が増えるなら、終演まで持つ量に絞るか駅ロッカーへ戻す。',
      rainyDay: '雨の日は駅周辺で待機。会場前待機を短くする。',
      soloDay: 'ぼっち参戦は巣鴨駅からの入口目印を先に確認すると不安が減る。',
      hurryAfterShowDay: '急ぐ日は山手線の乗車位置とロッカー位置を先に決める。',
    },
    blogSignals: [
      signal('access', '個人ブログでは初めて行く箱として、山手線で巣鴨へ向かう動きや街の雰囲気に触れている。初参戦は駅からの導線確認が効く。', 'takepunks DISCOVERY BLOG', 'https://blog.takepunks.com/32829/', 'personal_blog', 'low'),
      signal('facility', '公式ABOUTでオールスタンディング最大160名の小箱規模を確認。荷物を減らす判断につながる。', '巣鴨獅子王公式ABOUT', 'https://www.sugamo-cco.com/about.php', 'official', 'high'),
    ],
    sourceLinks: [
      source('巣鴨獅子王公式', 'https://sugamo-cco.com/', 'official'),
      source('巣鴨獅子王公式ABOUT', 'https://www.sugamo-cco.com/about.php', 'official'),
      source('巣鴨獅子王公式ACCESS', 'https://sugamo-cco.com/access.php', 'official'),
      source('takepunks 巣鴨獅子王参戦レポ', 'https://blog.takepunks.com/32829/', 'personal_blog'),
      source('iFLYER 巣鴨獅子王', 'https://iflyer.tv/en/venue/8867/about/', 'venue_database'),
    ],
  },
  'higashi-koenji-20000v': {
    blogResearch: {
      status: 'partial',
      checkedAt: CHECKED_AT,
      searchQueries: [
        '東高円寺二万電圧 ロッカー クローク 参戦レポ ブログ',
        '東高円寺二万電圧 待機場所 雨の日',
        '東高円寺二万電圧 行き方 ライブハウス',
        '東高円寺二万電圧 荷物 クローク',
      ],
      summary: '会場DBでロッカーなし・クローク500円の情報があり、公式アクセスでは駅出口から近いことを確認。参戦レポは音量・地下小箱感の言及が中心で、荷物はロッカーなし前提で駅側処理が安全。',
      confidence: 'medium',
    },
    lockerInfo: {
      venueLockerStatus: 'none',
      venueLockerText: '会場DBではコインロッカーなし扱い。',
      lockerCountText: 'なし扱い。',
      beforeEntryUse: 'unavailable',
      afterEntryUse: 'unavailable',
      coinNeeded: 'no',
      largeBagFit: 'no',
      sourceConfidence: 'blog_report',
      lastCheckedAt: CHECKED_AT,
    },
    cloakInfo: {
      cloakStatus: 'available',
      cloakText: '会場DBでクローク500円の情報あり。現在の運用は当日案内優先。',
      priceText: '500円情報あり。',
      timingText: '受付タイミングは未確認。',
      bagTypeText: '袋形式未確認。貴重品は手元。',
      sourceConfidence: 'blog_report',
      lastCheckedAt: CHECKED_AT,
    },
    nearbyInfo: {
      nearestConvenienceStore: '東高円寺駅周辺で先に飲み物を用意。会場前で買い足す前提にしない。',
      stationLocker: '駅ロッカーは事前確認。ロッカーなし前提なので、リュック以上は先に預ける。',
      waitingSpot: '公式アクセスは駅出口から近いが、会場前に長く待たず駅周辺で時間調整する。',
      rainShelter: '雨の日は駅側で待つ。地下会場前で濡れた荷物を抱えない。',
      restroomBeforeEntry: '小箱・地下会場として駅で先に済ませる。',
      cashAndCoin: 'クローク代情報があるため500円玉か千円札を残す。',
      afterShowRoute: '終演後は東高円寺駅へ戻る。急ぐ日は出口と改札を先に確認する。',
      nightSafety: '住宅街寄りの小道で迷わないよう、夜は大通りと駅出口を決めて戻る。',
    },
    dayDecisionGuide: {
      baggageDay: 'ロッカーなし前提。駅ロッカーかクロークで処理する。',
      goodNumberDay: '良番ならクローク受付時間で焦らないよう早めに到着。',
      merchDay: '物販後の袋は終演まで持てる量に絞る。大きい物販はクローク候補。',
      rainyDay: '駅近だが会場前待機は短く。雨具より荷物防水を優先。',
      soloDay: '一人参戦は駅出口から会場入口までを先に確認。地下入口を見落とさない。',
      hurryAfterShowDay: '終演後に急ぐ日はクローク返却待ちを見込み、駅までの戻りを先に確認。',
    },
    blogSignals: [
      signal('locker', '会場DBではロッカーなし・クローク500円。ロッカーを当てにせずクロークか駅側処理で組む。', 'Supernice! 東高円寺二万電圧', 'https://super-nice.net/%E6%9D%B1%E4%BA%AC%E9%83%BD/3171/', 'mixed', 'medium'),
      signal('access', '公式アクセスでは東高円寺駅2番出口から近い。近い分、早く着きすぎたら駅側で待つ。', '東高円寺二万電圧公式ACCESS', 'https://den-atsu.com/access/', 'official', 'high'),
      signal('sound', '参戦レポでは音量が強い小箱としての印象が語られている。耳栓も選択肢。', 'LAZY SMOKEY DAMN!', 'https://lsdblog.seesaa.net/article/497563386.html', 'personal_blog', 'low'),
    ],
    sourceLinks: [
      source('東高円寺二万電圧公式ACCESS', 'https://den-atsu.com/access/', 'official'),
      source('Supernice! 東高円寺二万電圧', 'https://super-nice.net/%E6%9D%B1%E4%BA%AC%E9%83%BD/3171/', 'venue_database'),
      source('東高円寺二万電圧参戦レポ Ameba', 'https://ameblo.jp/yosu-ko1taisei2charmy3/entry-11987234488.html', 'personal_blog'),
      source('LAZY SMOKEY DAMN! 東高円寺二万電圧レポ', 'https://lsdblog.seesaa.net/article/497563386.html', 'personal_blog'),
    ],
  },
  'wildside-tokyo': {
    blogResearch: {
      status: 'researched',
      checkedAt: CHECKED_AT,
      searchQueries: [
        'WildSide Tokyo ロッカー クローク 新宿御苑前 ライブハウス',
        'WildSide Tokyo キャパ ロッカー クローク ライブハウスナビ',
        'WildSide Tokyo V系 参戦レポ ブログ',
        'WildSide Tokyo 行き方 ブログ ライブハウス',
      ],
      summary: '古い会場ナビではロッカーなし、ロッカー業者の記事では2017年に会場内へコインロッカー設置、別紹介記事ではロッカー利用可という情報がある。情報が割れるため「少数/要現地確認」とし、遠征荷物は駅側に逃がすのが安全。新宿御苑前・新宿三丁目からのアクセス記事が複数ある。',
      confidence: 'medium',
    },
    lockerInfo: {
      venueLockerStatus: 'limited',
      venueLockerText: '古い会場ナビではなし、ロッカー業者記事では会場内設置情報あり。現在数は未確認のため少数扱い。',
      lockerCountText: '個数未確認。現地・公式確認が必要。',
      beforeEntryUse: 'unknown',
      afterEntryUse: 'unknown',
      coinNeeded: 'yes',
      largeBagFit: 'unknown',
      sourceConfidence: 'mixed',
      lastCheckedAt: CHECKED_AT,
    },
    cloakInfo: {
      cloakStatus: 'unknown',
      cloakText: 'クロークの常設情報は未確認。',
      priceText: '未確認。',
      timingText: '未確認。',
      bagTypeText: '未確認。',
      sourceConfidence: 'unknown',
      lastCheckedAt: CHECKED_AT,
    },
    nearbyInfo: {
      nearestConvenienceStore: '新宿御苑前・新宿三丁目側で先に買う。会場周辺は飲食店もあるが、開場直前の買い足しは避ける。',
      stationLocker: '新宿三丁目・新宿御苑前周辺ロッカーも候補。遠征荷物は駅側で処理。',
      waitingSpot: '新宿御苑前・新宿三丁目側のカフェや飲食店で時間調整。会場入口前に長く固まらない。',
      rainShelter: '雨の日は駅出口近くや新宿三丁目側で待機してから移動する。',
      restroomBeforeEntry: '地下会場なので入場前に駅やカフェで済ませる。',
      cashAndCoin: 'コインロッカー利用の可能性があるため小銭/ICを用意。ドリンク代も現金を残す。',
      afterShowRoute: '新宿御苑前か新宿三丁目へ戻る。新宿駅まで歩く場合は夜道と疲労を見込む。',
      nightSafety: '新宿エリアだが歌舞伎町中心ではない。新宿駅へ歩く場合は大通りを選ぶ。',
    },
    dayDecisionGuide: {
      baggageDay: '会場ロッカー情報が割れるので、荷物ありなら駅ロッカー先行。',
      goodNumberDay: '良番はロッカー確認に時間を使わない。身軽で地下入口へ。',
      merchDay: '物販後に荷物が増えるなら、終演まで持てる量にするか駅ロッカーへ戻す。',
      rainyDay: '雨の日は新宿三丁目・御苑前側で待機。入口前待機を短く。',
      soloDay: 'ぼっち参戦は新宿御苑前か新宿三丁目のどちらで帰るか先に決める。',
      hurryAfterShowDay: '急ぐ日は新宿駅徒歩ではなく、近い地下鉄駅を使う前提で帰る。',
    },
    blogSignals: [
      signal('locker', '古い会場ナビではロッカーなし、ロッカー業者記事では設置情報あり。現状は少数・要現地確認として扱う。', 'ライブハウスナビ / フジコインロッカー', 'https://fuji-ya.co.jp/coinlocker/coinlockerblog/2017/06/05/%E6%9D%B1%E4%BA%AC%E9%83%BD%E6%96%B0%E5%AE%BF%E5%8C%BA%E3%81%AB%E3%82%B3%E3%82%A4%E3%83%B3%E3%83%AD%E3%83%83%E3%82%AB%E3%83%BC%E3%82%92%E8%A8%AD%E7%BD%AE%E3%81%97%E3%81%BE%E3%81%97%E3%81%9F-15/', 'mixed', 'medium'),
      signal('access', '行き方ブログが複数あり、新宿三丁目・新宿御苑前からのルート確認が役立つ。初参戦は入口の細い道を先に見る。', 'NE BA H NO / ユーシスのLIVE IN MY LIFE', 'https://ameblo.jp/rkgkblog/entry-11055132853.html', 'personal_blog', 'medium'),
      signal('nearby', '紹介記事では周辺に飲食店や公園があるとされる。開場前の時間調整は駅側・飲食店側に寄せる。', 'DECO MUSIC SCHOOL', 'https://deco-music.jp/14027/', 'personal_blog', 'low'),
      signal('show', '参戦レポでは早い開演でも人が入っていたという記録があり、整列や入場時間は余裕を持つ。', 'As usual', 'https://blog.mitsuto.com/extreme-colosseum', 'personal_blog', 'low'),
    ],
    sourceLinks: [
      source('WildSide Tokyo公式', 'https://ws-tokyo.com/', 'official'),
      source('LiveFans Wild Side Tokyo', 'https://www.livefans.jp/venues/5040', 'venue_database'),
      source('ライブハウスナビ WildSide Tokyo', 'https://live-house.info/sinjuku/wildside-tokyo.html', 'venue_database'),
      source('フジコインロッカー WildSide設置記事', 'https://fuji-ya.co.jp/coinlocker/coinlockerblog/2017/06/05/%E6%9D%B1%E4%BA%AC%E9%83%BD%E6%96%B0%E5%AE%BF%E5%8C%BA%E3%81%AB%E3%82%B3%E3%82%A4%E3%83%B3%E3%83%AD%E3%83%83%E3%82%AB%E3%83%BC%E3%82%92%E8%A8%AD%E7%BD%AE%E3%81%97%E3%81%BE%E3%81%97%E3%81%9F-15/', 'mixed'),
      source('NE BA H NO WildSide行き方', 'https://ameblo.jp/rkgkblog/entry-11055132853.html', 'personal_blog'),
      source('ユーシス WildSide行き方', 'https://ameblo.jp/yushis1126/entry-12222759171.html', 'personal_blog'),
    ],
  },
  'shimokitazawa-shangrila': {
    blogResearch: {
      status: 'researched',
      checkedAt: CHECKED_AT,
      searchQueries: [
        '下北沢シャングリラ ロッカー クローク 参戦レポ ブログ',
        '下北沢シャングリラ コインロッカー 駅ロッカー',
        '下北沢シャングリラ 雨の日 待機 カフェ',
        '下北沢シャングリラ トイレ ドリンク代 現金',
      ],
      summary: '複数の参戦系記事でロッカーあり・個数情報が見られる。下北沢駅周辺やドンキ前ロッカーなど外部ロッカー情報もあり、動員が多い日は会場ロッカーだけに寄せない方が安全。入口がビル奥の階段という情報もあり、初参戦は入口確認が効く。',
      confidence: 'medium',
    },
    lockerInfo: {
      venueLockerStatus: 'available',
      venueLockerText: '参戦系記事で会場内外ロッカーありの情報。動員が多い日は早め利用が安全。',
      lockerCountText: '合計135個、フロア内30個という参戦系記事あり。変更の可能性あり。',
      beforeEntryUse: 'unknown',
      afterEntryUse: 'available',
      coinNeeded: 'yes',
      largeBagFit: 'unknown',
      sourceConfidence: 'blog_report',
      lastCheckedAt: CHECKED_AT,
    },
    cloakInfo: {
      cloakStatus: 'unknown',
      cloakText: 'クローク常設は未確認。大荷物は駅・外部ロッカーを候補にする。',
      priceText: '未確認。',
      timingText: '未確認。',
      bagTypeText: '未確認。',
      sourceConfidence: 'unknown',
      lastCheckedAt: CHECKED_AT,
    },
    nearbyInfo: {
      nearestConvenienceStore: '下北沢駅周辺にコンビニ・飲食店が多い。開場前は駅側で飲み物を用意する。',
      stationLocker: '下北沢駅周辺やドンキ前ロッカーの記事あり。大荷物は会場内ロッカーより外部ロッカーも候補。',
      waitingSpot: '下北沢はカフェ・飲食店が多い。会場前ではなく駅周辺で時間を潰す。',
      rainShelter: '雨の日は駅周辺・商業施設・カフェで待つ。ビル奥階段への移動は整列時間に合わせる。',
      restroomBeforeEntry: '参戦系記事ではトイレ設備に触れられているが、混雑時は駅や店で先に済ませる。',
      cashAndCoin: 'ドリンク代700円・現金のみという参戦系記事あり。小銭と千円札を用意。',
      afterShowRoute: '終演後は下北沢駅方面へ人が流れる。駅ロッカーを使った場合は回収場所をメモ。',
      nightSafety: '下北沢は夜も人通りがあるが、路地で迷わないよう駅方向を先に確認。',
    },
    dayDecisionGuide: {
      baggageDay: 'ロッカーあり情報はあるが、動員が多い日は駅周辺ロッカーも保険にする。',
      goodNumberDay: '良番は会場ロッカー探しに寄らず、外部ロッカーか小バッグで入場。',
      merchDay: '物販で大きくなるなら、駅ロッカーへ戻すか終演まで持てる量に絞る。',
      rainyDay: '雨の日はカフェ・駅周辺で待って、整列時間だけ会場へ。',
      soloDay: 'ぼっち参戦は入口のビル奥階段を先に確認。駅近なので待機はしやすい。',
      hurryAfterShowDay: '急ぐ日はロッカー回収を少なく。下北沢駅の改札位置を先に決める。',
    },
    blogSignals: [
      signal('locker', '参戦系記事で会場内外ロッカーあり、合計135個という情報がある。ただし動員が多い日は早め利用が必要。', 'colorful情報局', 'https://colourfuls.hatenablog.com/entry/2025/11/27/063000', 'personal_blog', 'medium'),
      signal('locker', '下北沢ローカルメディアで駅以外のロッカーやライブハウス近隣ロッカー情報が整理されている。外部ロッカーも候補。', 'しもブロ', 'https://www.shimokitazawa.info/coinlocker/', 'personal_blog', 'medium'),
      signal('entry', '現地写真つきブログではビル奥・地下への動線に触れられている。初参戦は入口確認を先に。', 'やどこい', 'https://yadokoi.com/shimokitazawa-shangrila/', 'personal_blog', 'medium'),
      signal('cash', '参戦系記事ではドリンク代現金運用に触れられている。入場時に小銭・千円札を残す。', 'colorful情報局', 'https://colourfuls.hatenablog.com/entry/2025/11/27/063000', 'personal_blog', 'low'),
    ],
    sourceLinks: [
      source('下北沢シャングリラ公式', 'https://www.shan-gri-la.jp/tokyo/', 'official'),
      source('やどこい 下北沢シャングリラ', 'https://yadokoi.com/shimokitazawa-shangrila/', 'personal_blog'),
      source('colorful情報局 下北沢シャングリラ', 'https://colourfuls.hatenablog.com/entry/2025/11/27/063000', 'personal_blog'),
      source('ライブガイドドッグ 下北沢シャングリラ', 'https://trend-dogman.com/shimokitazawa-shangrila/', 'personal_blog'),
      source('しもブロ 下北沢コインロッカー', 'https://www.shimokitazawa.info/coinlocker/', 'personal_blog'),
      source('ミュージックプレイス 下北沢Shangri-La口コミ', 'https://www.music-place.jp/detail/450/', 'review_site'),
    ],
  },
  'music-lab-hamashobo': {
    blogResearch: {
      status: 'partial',
      checkedAt: CHECKED_AT,
      searchQueries: [
        'Music Lab.濱書房 ロッカー クローク 関内 ブログ',
        'Music Lab.濱書房 ライブハウス 参戦レポ 荷物',
        'Music Lab.濱書房 キャパ ロッカー クローク イベここ',
        'Music Lab.濱書房 関内 駅ロッカー',
      ],
      summary: '会場DBではクロークあり、LiveFansではコインロッカー欄が空欄。公式で小規模キャパを確認できる。noteでは関内駅からの動きや近隣飲食の使い方が見えるが、ロッカー詳細の参戦レポは多くないため、キャリーは駅側処理が安全。',
      confidence: 'low',
    },
    lockerInfo: {
      venueLockerStatus: 'none',
      venueLockerText: 'LiveFansではコインロッカー欄が空欄。会場内ロッカーはなし前提で動く。',
      lockerCountText: 'なし/未確認。',
      beforeEntryUse: 'unavailable',
      afterEntryUse: 'unavailable',
      coinNeeded: 'no',
      largeBagFit: 'no',
      sourceConfidence: 'mixed',
      lastCheckedAt: CHECKED_AT,
    },
    cloakInfo: {
      cloakStatus: 'available',
      cloakText: 'イベここでクロークあり情報。現在運用は当日案内優先。',
      priceText: '料金未確認。',
      timingText: '受付タイミング未確認。',
      bagTypeText: '袋形式未確認。',
      sourceConfidence: 'blog_report',
      lastCheckedAt: CHECKED_AT,
    },
    nearbyInfo: {
      nearestConvenienceStore: '関内駅周辺で先に飲み物を用意。会場前で買い足すより駅側が楽。',
      stationLocker: '関内駅周辺ロッカーを候補にする。NAVITIMEにも周辺ロッカー検索あり。',
      waitingSpot: '関内駅周辺・伊勢佐木町側の飲食店で時間調整しやすい。会場前に長く固まらない。',
      rainShelter: '雨の日は関内駅・地下鉄出口周辺・飲食店で待つ。',
      restroomBeforeEntry: '100人規模の小箱なので、駅や飲食店で先に済ませる。',
      cashAndCoin: 'ドリンク代とクローク代を現金で残す。',
      afterShowRoute: '終演後は関内駅へ戻る。遠征組は桜木町・横浜方面の乗換も先に確認。',
      nightSafety: '関内・伊勢佐木町周辺は夜の人通りがある。ぼっち参戦は大通りを選んで駅へ戻る。',
    },
    dayDecisionGuide: {
      baggageDay: 'ロッカーなし前提。荷物ありなら関内駅ロッカーかクロークを使う。',
      goodNumberDay: '良番は入場前に駅側で荷物処理。クローク受付で焦らない。',
      merchDay: '物販後は小袋で持てる量にする。大きい物はクロークがある日だけ会場預け。',
      rainyDay: '雨の日は駅・飲食店で待つ。小箱前で長く濡れない。',
      soloDay: '一人参戦は関内駅からの出口と帰り道を先に見れば動きやすい。',
      hurryAfterShowDay: '急ぐ日はクローク返却を見込み、駅までの最短出口を確認。',
    },
    blogSignals: [
      signal('cloak', '会場DBでクロークあり情報。ロッカーは当てにせず、クロークか関内駅側で処理する。', 'イベここ Music Lab.濱書房', 'https://evecoco.net/livehouse/kanagawa/yokohama/hamashobo/', 'mixed', 'medium'),
      signal('access', 'noteでは関内駅から向かい、近隣飲食で時間調整する動きが見られる。開場前は駅周辺に逃げ場がある。', 'ひかる47 note', 'https://note.com/h47have/n/nc2b8797c63b4', 'note', 'low'),
      signal('facility', '公式で小規模キャパを確認。大荷物はフロアに持ち込まない前提にする。', 'Music Lab.濱書房公式', 'https://www.hamashobo.com/post-9900/', 'official', 'high'),
      signal('locker', 'LiveFansではコインロッカー欄が空欄。会場内ロッカー確認が取れないため、駅ロッカー候補を先に持つ。', 'LiveFans Music Lab.濱書房', 'https://www.livefans.jp/venues/9354', 'mixed', 'low'),
    ],
    sourceLinks: [
      source('Music Lab.濱書房公式', 'https://www.hamashobo.com/post-9900/', 'official'),
      source('イベここ Music Lab.濱書房', 'https://evecoco.net/livehouse/kanagawa/yokohama/hamashobo/', 'venue_database'),
      source('LiveFans Music Lab.濱書房', 'https://www.livefans.jp/venues/9354', 'venue_database'),
      source('校長さんのブログ Music Lab.濱書房', 'https://ameblo.jp/artpop-k/entry-12306468241.html', 'personal_blog'),
      source('ひかる47 note Music Lab.濱書房', 'https://note.com/h47have/n/nc2b8797c63b4', 'note'),
      source('NAVITIME 濱書房周辺ロッカー', 'https://www.navitime.co.jp/around/category/poi?category=0506027&spt=02022.1233924', 'mixed'),
    ],
  },
  'yokohama-baysis': {
    blogResearch: {
      status: 'researched',
      checkedAt: CHECKED_AT,
      searchQueries: [
        '横浜BAYSIS ロッカー クローク 参戦レポ ブログ',
        '横浜BAYSIS ロッカー クローク 公式 INFO',
        '横浜BAYSIS 一人 参戦 ロッカー クローク Q&A',
        '横浜BAYSIS 関内駅ロッカー 物販 荷物',
      ],
      summary: '公式でロッカー料金情報が確認でき、個人ブログでは関内駅ロッカーが埋まっていた体験と、クロークを保険にする動きが見られる。Q&Aでもロッカーが少なくクロークがある前提で相談されており、遠征荷物は駅ロッカー・クローク・小荷物化を組み合わせるのが安全。',
      confidence: 'medium',
    },
    lockerInfo: {
      venueLockerStatus: 'limited',
      venueLockerText: '公式INFOでコインロッカー料金情報あり。個人レポでは少なめ扱い。',
      lockerCountText: '個数は未確認。少数として扱う。',
      beforeEntryUse: 'unknown',
      afterEntryUse: 'available',
      coinNeeded: 'yes',
      largeBagFit: 'no',
      sourceConfidence: 'mixed',
      lastCheckedAt: CHECKED_AT,
    },
    cloakInfo: {
      cloakStatus: 'event_dependent',
      cloakText: '個人レポ・Q&Aではクロークを保険にする話がある。常設運用かは当日案内優先。',
      priceText: '個人レポでは500円想定の記録あり。公式確定は未確認。',
      timingText: '受付タイミング未確認。',
      bagTypeText: '袋形式未確認。貴重品は手元。',
      sourceConfidence: 'blog_report',
      lastCheckedAt: CHECKED_AT,
    },
    nearbyInfo: {
      nearestConvenienceStore: '関内駅周辺で先に飲み物を用意。会場近くで買い足すより駅側が楽。',
      stationLocker: '個人レポでは関内駅ロッカーが埋まっていた体験あり。早めに確保し、空きがなければ別候補へ。',
      waitingSpot: '関内駅周辺・馬車道側のカフェや飲食店で時間調整。会場前に長くたまらない。',
      rainShelter: '雨の日は関内駅・地下鉄出口・周辺カフェで待ってから向かう。',
      restroomBeforeEntry: '関内駅や周辺施設で先に済ませる。終演後は混みやすい。',
      cashAndCoin: 'ロッカー用小銭、ドリンク代、クローク用現金を分けて残す。',
      afterShowRoute: '終演後は関内駅方面へ戻る。夜行・遠征組はロッカー回収時間と終電を先に見る。',
      nightSafety: '関内エリアは夜も人通りがあるが、ぼっち参戦は大通りで駅へ戻る。',
    },
    dayDecisionGuide: {
      baggageDay: '会場ロッカーは少数扱い。荷物がある日は関内駅ロッカーを早めに押さえる。',
      goodNumberDay: '良番ならロッカー空き探しで遅れないよう、駅で預けてから会場へ。',
      merchDay: '物販後に増える荷物はクロークがある日だけ預ける。なければ持てる量に絞る。',
      rainyDay: '雨の日は駅・カフェで待機。濡れた荷物をフロアに持ち込まない。',
      soloDay: '一人参戦は関内駅までの戻り方とロッカー位置を先に確認。',
      hurryAfterShowDay: '急ぐ日はクローク返却や駅ロッカー回収を見込んで、終演後の動線を決めておく。',
    },
    blogSignals: [
      signal('locker', '公式でロッカー料金情報、個人レポで関内駅ロッカーが埋まっていた体験がある。早め確保が安全。', '横浜BAYSIS公式 / 個人ブログ', 'https://ameblo.jp/jiu3jing3/entry-12076556646.html', 'mixed', 'medium'),
      signal('cloak', 'Q&Aではロッカーが少なくクロークがある前提で相談されている。クロークは保険として考え、当日案内を見る。', 'Yahoo!知恵袋 横浜BAYSIS', 'https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q12144433702', 'q_and_a', 'low'),
      signal('show', '個人レポではフロアの見え方に不安があったが楽しめたという体験があり、後方でも楽しめる可能性はある。', 'ごじゃっぺ夢烏の保管庫。', 'https://ameblo.jp/jiu3jing3/entry-12076556646.html', 'personal_blog', 'low'),
      signal('facility', 'LiveWalker等の会場DBも参照しつつ、公式INFOを優先する。', 'LiveWalker 横浜BAYSIS', 'https://www.livewalker.com/web/detail/2034', 'mixed', 'medium'),
    ],
    sourceLinks: [
      source('横浜BAYSIS公式INFO', 'https://www.yokohamabaysis.com/info.php', 'official'),
      source('LiveWalker 横浜BAYSIS', 'https://www.livewalker.com/web/detail/2034', 'venue_database'),
      source('横浜BAYSIS個人レポ', 'https://ameblo.jp/jiu3jing3/entry-12076556646.html', 'personal_blog'),
      source('Yahoo!知恵袋 横浜BAYSIS', 'https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q12144433702', 'q_and_a'),
    ],
  },
};

const alignLegacyProfiles = (venue) => {
  const lockerStatusMap = {
    available: 'available',
    limited: 'limited',
    none: 'none',
    unknown: 'unknown',
  };
  const cloakStatusMap = {
    available: 'available',
    event_dependent: 'sometimes',
    none: 'none',
    unknown: 'unknown',
  };
  venue.lockerProfile = {
    ...(venue.lockerProfile ?? {}),
    status: lockerStatusMap[venue.lockerInfo.venueLockerStatus] ?? 'unknown',
    summary: venue.lockerInfo.venueLockerText,
    countNote: venue.lockerInfo.lockerCountText,
    timing: `開場前: ${venue.lockerInfo.beforeEntryUse} / 開場後: ${venue.lockerInfo.afterEntryUse}`,
    coinNote: venue.lockerInfo.coinNeeded === 'yes' ? '小銭または100円玉を用意。' : venue.lockerInfo.coinNeeded === 'no' ? '会場ロッカー用の小銭は不要。' : '小銭要否は未確認。',
    bestMove: venue.dayDecisionGuide.baggageDay,
    riskLevel: venue.lockerInfo.venueLockerStatus === 'none' ? 5 : venue.lockerInfo.venueLockerStatus === 'limited' ? 4 : venue.lockerInfo.venueLockerStatus === 'unknown' ? 3 : 2,
  };
  venue.cloakProfile = {
    ...(venue.cloakProfile ?? {}),
    status: cloakStatusMap[venue.cloakInfo.cloakStatus] ?? 'unknown',
    summary: venue.cloakInfo.cloakText,
    priceNote: venue.cloakInfo.priceText,
    timing: venue.cloakInfo.timingText,
    bagTypeNote: venue.cloakInfo.bagTypeText,
    bestMove: venue.cloakInfo.cloakStatus === 'none' ? venue.dayDecisionGuide.baggageDay : venue.dayDecisionGuide.merchDay,
    riskLevel: venue.cloakInfo.cloakStatus === 'none' ? 5 : venue.cloakInfo.cloakStatus === 'unknown' ? 3 : 2,
  };
  venue.baggageDecision = {
    tinyBag: venue.baggageGuide.smallBag,
    backpack: venue.baggageGuide.backpack,
    suitcase: venue.baggageGuide.suitcase,
    afterMerch: venue.baggageGuide.afterMerch,
    goodTicketNumber: venue.baggageGuide.goodTicketNumber,
  };
  venue.arrivalStrategy = venue.nearbyInfo.waitingSpot;
  venue.merchBaggageStrategy = venue.baggageGuide.afterMerch;
  venue.afterShowStrategy = venue.nearbyInfo.afterShowRoute;
  venue.stationLockerNote = venue.nearbyInfo.stationLocker;
  venue.badWeatherNote = venue.nearbyInfo.rainShelter;
  venue.timeKillingNote = venue.nearbyInfo.waitingSpot;
  venue.lockerAlternativeNote = venue.nearbyInfo.stationLocker;
  venue.practicalSummary = venue.practicalSummary ?? {
    headline: venue.dayDecisionGuide.baggageDay,
    points: [
      venue.dayDecisionGuide.baggageDay,
      venue.cloakInfo.cloakText,
      venue.nearbyInfo.waitingSpot,
      venue.nearbyInfo.afterShowRoute,
    ],
  };
  venue.practicalSummary.points = [
    venue.dayDecisionGuide.baggageDay,
    venue.cloakInfo.cloakText,
    venue.nearbyInfo.waitingSpot,
    venue.nearbyInfo.afterShowRoute,
  ];
};

for (const [slug, patch] of Object.entries(patches)) {
  const venue = venues.find((item) => item.slug === slug);
  if (!venue) {
    console.warn(`Missing venue: ${slug}`);
    continue;
  }
  Object.assign(venue, patch);
  venue.sourceLinks = mergeUniqueByUrl([...(venue.sourceLinks ?? []), ...(patch.sourceLinks ?? [])]);
  venue.blogSignals = mergeUniqueByUrl([...(patch.blogSignals ?? []), ...(venue.blogSignals ?? [])]);
  venue.venueComments = mergeUniqueByTitle([
    ...(venue.venueComments ?? []),
    comment('baggage', '荷物ありの日の最適行動', patch.dayDecisionGuide.baggageDay, patch.dayDecisionGuide.baggageDay, patch.sourceLinks?.[0]?.label || venue.name, patch.sourceLinks?.[0]?.url || venue.officialUrl || '', 'mixed', patch.blogResearch.confidence === 'high' ? 'high' : 'medium'),
    comment('arrival', '良番の日の最適行動', patch.dayDecisionGuide.goodNumberDay, patch.dayDecisionGuide.goodNumberDay, patch.sourceLinks?.[0]?.label || venue.name, patch.sourceLinks?.[0]?.url || venue.officialUrl || '', 'mixed', patch.blogResearch.confidence === 'high' ? 'high' : 'medium'),
    comment('merch', '物販を買う日の最適行動', patch.dayDecisionGuide.merchDay, patch.dayDecisionGuide.merchDay, patch.sourceLinks?.[0]?.label || venue.name, patch.sourceLinks?.[0]?.url || venue.officialUrl || '', 'mixed', patch.blogResearch.confidence === 'high' ? 'high' : 'medium'),
    comment('weather', '雨の日の待ち方', patch.dayDecisionGuide.rainyDay, patch.dayDecisionGuide.rainyDay, patch.sourceLinks?.[0]?.label || venue.name, patch.sourceLinks?.[0]?.url || venue.officialUrl || '', 'mixed', patch.blogResearch.confidence === 'high' ? 'high' : 'medium'),
    comment('solo', 'ぼっち参戦の日の動き方', patch.dayDecisionGuide.soloDay, patch.dayDecisionGuide.soloDay, patch.sourceLinks?.[0]?.label || venue.name, patch.sourceLinks?.[0]?.url || venue.officialUrl || '', 'mixed', patch.blogResearch.confidence === 'high' ? 'high' : 'medium'),
    comment('return', '終演後に急ぐ日の動き方', patch.dayDecisionGuide.hurryAfterShowDay, patch.dayDecisionGuide.hurryAfterShowDay, patch.sourceLinks?.[0]?.label || venue.name, patch.sourceLinks?.[0]?.url || venue.officialUrl || '', 'mixed', patch.blogResearch.confidence === 'high' ? 'high' : 'medium'),
  ]);
  venue.tipTags = [...new Set([
    ...(venue.tipTags ?? []),
    venue.lockerInfo.venueLockerStatus === 'none' || venue.lockerInfo.venueLockerStatus === 'limited' ? 'ロッカー注意' : '',
    venue.cloakInfo.cloakStatus === 'event_dependent' || venue.cloakInfo.cloakStatus === 'unknown' ? 'クローク確認' : '',
    venue.nearbyInfo.stationLocker.includes('駅') ? '駅ロッカー推奨' : '',
    '物販後荷物注意',
  ].filter(Boolean))];
  alignLegacyProfiles(venue);
}

for (const venue of venues) {
  alignLegacyProfiles(venue);
}

fs.writeFileSync(DATA_PATH, `${JSON.stringify(venues, null, 2)}\n`);
console.log('Applied logistics and blog research data.');
