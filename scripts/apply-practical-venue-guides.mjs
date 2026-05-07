import fs from 'node:fs';

const DATA_PATH = 'data/venues.json';
const CHECKED_AT = '2026-05-07';
const venues = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

const hasText = (venue, pattern) => JSON.stringify(venue).includes(pattern);

const uniqueByUrl = (items) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = `${item.type}:${item.url}:${item.label}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const sourceLink = (label, url, type = 'personal_blog') => ({ label, url, type, checkedAt: CHECKED_AT });
const blogSignal = (topic, summary, sourceName, sourceUrl, confidence = 'medium', sourceType = 'personal_blog') => ({
  topic,
  summary,
  sourceType,
  confidence,
  sourceName,
  sourceUrl,
  checkedAt: CHECKED_AT,
  copyrightNote: '文章コピーなし。要点のみ独自表現に変換。',
});

const defaultLockerProfile = (venue) => {
  const text = JSON.stringify(venue);
  if (text.includes('ロッカーはない') || text.includes('ロッカーなし') || text.includes('コインロッカーなし')) {
    return {
      status: 'none',
      summary: '会場ロッカーはない前提で動く。',
      timing: '会場で探す時間を使わず、入場前に荷物を処理する。',
      countNote: '会場内ロッカーなし、または未設置情報あり。',
      priceNote: '駅ロッカーや外部預かりの料金を想定する。',
      coinNote: '駅ロッカー用に100円玉や交通系ICの残高を用意する。',
      bestMove: '荷物がある日は最寄り駅か乗換駅のロッカーを先に押さえる。',
      riskLevel: 5,
    };
  }
  if ((venue.tipTags ?? []).some((tag) => String(tag).includes('ロッカー'))) {
    return {
      status: 'limited',
      summary: 'ロッカーは少ない、または運用が変わる前提で考える。',
      timing: '開場後しか使えない可能性も見る。',
      countNote: '数は未確認または少なめ扱い。',
      priceNote: '料金は当日案内を確認する。',
      coinNote: '100円玉が必要な場合に備える。',
      bestMove: '物販や遠征荷物がある日は駅ロッカーを先に候補に入れる。',
      riskLevel: 4,
    };
  }
  return {
    status: 'unknown',
    summary: 'ロッカー情報は未登録。荷物は少なくして入る。',
    timing: '利用可能タイミングは当日案内を見る。',
    countNote: '数は未確認。',
    priceNote: '料金は未確認。',
    coinNote: '小銭と交通系IC残高を用意する。',
    bestMove: '荷物が多い日は駅ロッカーかホテル預けを先に決める。',
    riskLevel: 3,
  };
};

const defaultCloakProfile = (venue) => {
  const text = JSON.stringify(venue);
  if (text.includes('クロークはない')) {
    return {
      status: 'none',
      summary: 'クロークなし前提で荷物を組む。',
      priceNote: '外部預かりや駅ロッカー料金を想定する。',
      timing: '会場受付に頼らない。',
      bagTypeNote: '大きい荷物は会場へ持ち込まない。',
      bestMove: '入場前に駅ロッカーか宿泊先で身軽にする。',
      riskLevel: 5,
    };
  }
  if (text.includes('クローク') || (venue.tipTags ?? []).some((tag) => String(tag).includes('クローク'))) {
    return {
      status: 'sometimes',
      summary: 'クロークは使える可能性があるが、公演ごとの運用で考える。',
      priceNote: '500円前後のケースが多いが、必ず当日案内を見る。',
      timing: '先行物販時、開場前、入場後のどこで預けられるか確認する。',
      bagTypeNote: '袋にまとめて預ける形式を想定し、貴重品は手元に残す。',
      bestMove: '物販で荷物が増える日はクローク前提で、受付時間を先に確認する。',
      riskLevel: 3,
    };
  }
  return {
    status: 'unknown',
    summary: 'クローク情報は未登録。ある前提で行かない。',
    priceNote: '料金は未確認。',
    timing: '受付時間は未確認。',
    bagTypeNote: '大荷物は預け先を別に探す。',
    bestMove: '駅ロッカーを第一候補にする。',
    riskLevel: 4,
  };
};

const defaultGuide = (venue) => {
  const lockerProfile = defaultLockerProfile(venue);
  const cloakProfile = defaultCloakProfile(venue);
  const station = venue.station || '最寄り駅';
  return {
    lockerProfile,
    cloakProfile,
    baggageDecision: {
      tinyBag: 'スマホ、財布、チケットだけならそのまま入場でOK。肩から下げられる小さめバッグにする。',
      backpack: '背中のリュックはフロアで邪魔になりやすい。足元に置かず、駅ロッカーかクロークへ回す。',
      suitcase: 'キャリーケースは会場へ持ち込まない。駅の大型ロッカー、ホテル、手荷物預かりを先に探す。',
      afterMerch: '物販を買うなら、買った後の袋をどこへ置くか先に決める。終演まで持つなら小さく畳めるバッグを使う。',
      goodTicketNumber: '良番なら荷物処理で出遅れない。整列前にロッカー、トイレ、ドリンク代を済ませる。',
    },
    arrivalStrategy: `${station}に着いたら、先に帰りの出口とロッカー候補を見る。整列開始までは会場前に長くたまらない。`,
    entryStrategyPlain: '整理番号は入場順。呼び出しに遅れると番号の強みが消えるので、整列場所と時間だけは先に見る。',
    merchBaggageStrategy: '物販で荷物が増える日は、買う前に預け先を決める。チェキや小物だけなら薄いポーチにまとめる。',
    afterShowStrategy: '終演後はまず荷物回収と駅までのルート。余韻で長く残る日は、終電と夜行バス時刻だけ先に固定する。',
    beginnerOneLine: '初めてなら、入口、整列場所、ドリンク代、荷物の逃がし先だけ押さえればかなり楽になる。',
    soloOneLine: '一人参戦は普通。開場前の待機場所と終演後の帰り道を決めておくと気持ちが軽い。',
    badWeatherNote: '雨の日は会場前待機がつらい。傘より先に、濡らしたくない荷物を小さくまとめる。',
    stationLockerNote: `${station}周辺ロッカーは埋まることがある。乗換駅や宿泊先預けも候補に入れる。`,
    goodNumberWarning: '良番ほど荷物の迷いが命取り。身軽な状態で整列に入る。',
    carryCaseWarning: 'キャリーケースはフロアに入れない。駅大型ロッカーかホテル預けが先。',
    floorBaggageWarning: 'フロアに荷物を置かない。踏まれる、蹴られる、動線をふさぐの三重苦になる。',
    practicalSummary: {
      headline: lockerProfile.bestMove,
      points: [
        lockerProfile.summary,
        cloakProfile.summary,
        '良番なら荷物処理を先に終わらせる',
        '終演後は荷物回収と終電をセットで考える',
      ],
    },
    blogSignals: [],
    sourceLinks: [
      ...(venue.officialUrl ? [sourceLink('会場公式', venue.officialUrl, 'official')] : []),
      ...((venue.factChecks ?? []).map((fact) => sourceLink(fact.sourceLabel, fact.sourceUrl, fact.sourceType === 'official' ? 'official' : fact.sourceType))),
    ],
    infoFreshnessWarning: 'ロッカー、クローク、整列、再入場、撮影可否は公演ごとに変わる。最後は公式・主催・当日案内を優先する。',
  };
};

const focus = {
  'ikebukuro-edge': {
    lockerProfile: {
      status: 'none',
      summary: '会場ロッカーは当てにしない。池袋駅ロッカーを先に押さえる。',
      timing: '入場直前に探すと整列に遅れやすい。',
      countNote: '参戦レポ系では会場ロッカーなし扱いの情報が目立つ。',
      priceNote: '駅ロッカー料金を予算に入れる。',
      coinNote: '駅ロッカー用に100円玉か交通系IC残高を残す。',
      bestMove: '荷物がある日は池袋駅で預けてから会場へ向かう。',
      riskLevel: 5,
    },
    cloakProfile: {
      status: 'none',
      summary: 'クロークも期待しない。物販後の荷物まで駅ロッカー前提で考える。',
      priceNote: '会場ではなく駅ロッカーや外部預かり料金を想定する。',
      timing: '整列前に預け終える。',
      bagTypeNote: '貴重品だけ小さく手元に残す。',
      bestMove: '物販を買う日は、先に空きロッカーを確保してから動く。',
      riskLevel: 5,
    },
    practicalSummary: {
      headline: '荷物ありなら池袋駅ロッカー先行。良番は特に身軽にしてから整列。',
      points: ['会場ロッカー/クロークは期待しない', '番号帯によって屋外待機になる可能性を見る', '地下で電波が弱い想定で電子チケットを先に表示', '物販後の袋はフロアに持ち込まない'],
    },
    arrivalStrategy: '池袋駅に着いたら、まずロッカー候補を見る。会場前は広くないので、整列開始までは駅側で時間を調整する。',
    entryStrategyPlain: '番号が早い日は、荷物を預けてから会場へ。入口と階段の動線を先に見て、呼び出しに遅れないようにする。',
    merchBaggageStrategy: '物販で袋が増えるなら、買った後に駅へ戻す前提で動く。終演まで持つなら小さく畳めるバッグだけにする。',
    afterShowStrategy: '終演後は池袋駅方面へ戻る人が多い。ロッカー回収、改札、終電の順で動く。',
    beginnerOneLine: 'EDGEは小箱V系の定番。荷物と電波だけ先に潰すと初参戦でもかなり楽。',
    soloOneLine: '一人なら駅近くで待機して、整列時間になったら会場へ向かうのが楽。',
    badWeatherNote: '屋外待機に回る可能性を見る。傘より荷物の防水を優先。',
    stationLockerNote: '池袋駅は広い。会場に近い出口だけでなく、乗換側ロッカーも候補にする。',
    goodNumberWarning: '良番で荷物を抱えるのはもったいない。先に預けて、呼び出し前に入口へ。',
    blogSignals: [
      blogSignal('locker', '会場ロッカーやクロークに頼らず、駅ロッカーを使う前提の参戦メモが見られる。', 'ライブ研究室', 'https://live-kenkyushitsu.com/569.html', 'medium'),
      blogSignal('entry', '番号帯によって待機場所が変わるという体験談があるため、整列案内を優先する。', 'ライブ研究室', 'https://live-kenkyushitsu.com/569.html', 'medium'),
      blogSignal('signal', '地下会場のため電波が弱い可能性があるという体験メモがある。', 'ライブ研究室', 'https://live-kenkyushitsu.com/569.html', 'medium'),
    ],
  },
  'ikebukuro-blackhole': {
    practicalSummary: {
      headline: '公式でロッカー/クロークなし。池袋駅で荷物を消してから入る。',
      points: ['会場ロッカーなし', 'クロークなし', '池袋駅C6出口側の導線を先に見る', 'キャリーケースは会場へ持ち込まない'],
    },
    lockerProfile: {
      status: 'none',
      summary: '公式がコインロッカー・クロークなしと案内している。',
      timing: '入場前に駅ロッカーへ預ける。',
      countNote: '会場内ロッカーなし。',
      priceNote: '駅ロッカー料金を想定する。',
      coinNote: '交通系IC残高か小銭を残す。',
      bestMove: '池袋駅で預け、C6出口から身軽に向かう。',
      riskLevel: 5,
    },
    cloakProfile: {
      status: 'none',
      summary: 'クロークなし。物販袋も持ったまま入る前提にしない。',
      priceNote: '会場クローク料金は想定しない。',
      timing: '預けるなら駅か外部サービス。',
      bagTypeNote: '貴重品だけ小さく手元に。',
      bestMove: '駅ロッカーを先に確保する。',
      riskLevel: 5,
    },
    arrivalStrategy: '池袋駅西口・C6出口までのルートを先に確認。出口から近いので、早く着きすぎたら駅側で待つ。',
    afterShowStrategy: '終演後は駅へ戻るだけに見えるが、荷物を駅に預けた場合は回収位置を忘れないようメモしておく。',
    beginnerOneLine: 'BlackHoleは荷物を持ち込まない判断が一番効く。',
    blogSignals: [
      blogSignal('facility', '会場情報サイトでは小さめフロア、低めステージとして紹介されることがある。視界は混雑で変わる。', 'LiveWalker', 'https://www.livewalker.com/web/detail/15216', 'medium', 'mixed'),
    ],
  },
  'shibuya-rex': {
    practicalSummary: {
      headline: 'ロッカーは少なめ想定。渋谷駅ロッカーかクロークを保険にする。',
      points: ['物販ありなら駅ロッカー候補を先に見る', '道玄坂方面は人が多いので時間に余裕', '後方段差は便利だが埋まりやすい', 'トイレは早めに済ませる'],
    },
    lockerProfile: {
      status: 'limited',
      summary: 'ロッカーは少数という紹介が複数ある。満杯前提で動く。',
      timing: '会場到着後に空きを探すより、渋谷駅で先に判断する。',
      countNote: '記事により20〜30個程度の目安が見られるが、最新数は要確認。',
      priceNote: '会場・駅どちらも料金変更あり。',
      coinNote: '100円玉と交通系ICの両方を用意。',
      bestMove: '荷物が多い日は渋谷駅ロッカー、身軽なら会場ロッカー空き確認。',
      riskLevel: 4,
    },
    cloakProfile: {
      status: 'sometimes',
      summary: 'クロークが使える場合は便利。ロッカーが少ない日の保険にする。',
      priceNote: '料金と受付時間は当日案内を見る。',
      timing: '先行物販後に預けられるかを先に確認。',
      bagTypeNote: '袋にまとめる形式を想定し、貴重品は手元。',
      bestMove: '物販を買うならクローク可否を入場前に見る。',
      riskLevel: 3,
    },
    arrivalStrategy: '渋谷駅から道玄坂方面へ。人混みで歩く速度が落ちるので、地図上の徒歩分数より少し余裕を取る。',
    merchBaggageStrategy: '物販袋を持ったままフロアに入らない。クロークか駅ロッカーの二択を先に決める。',
    afterShowStrategy: '終演後は渋谷駅周辺が混む。ロッカー回収があるなら、出口とロッカー位置を先にメモする。',
    beginnerOneLine: '渋谷REXは荷物とトイレを早めに処理すると動きやすい。',
    blogSignals: [
      blogSignal('locker', 'ロッカー数は少なめという紹介が複数あり、駅ロッカーやクロークを保険にするのが安全。', 'ライブガイドドッグ', 'https://trend-dogman.com/shibuya-rex/', 'medium'),
      blogSignal('view', '後方段差と高めステージで見やすいという体験談があるが、混雑時は早めに埋まる。', '渋谷REXレビュー記事', 'https://natsu-otoku.com/rex/', 'medium'),
    ],
  },
  'takadanobaba-club-phase': {
    practicalSummary: {
      headline: '公式でロッカーなし。クローク前提で、再入場不可を先に潰す。',
      points: ['B1Fロビーのクローク案内あり', 'コインロッカーなし', '再入場不可', 'ビル周辺・階段にたまらない'],
    },
    lockerProfile: {
      status: 'none',
      summary: '公式でコインロッカーなし。駅ロッカーかクロークに振る。',
      timing: '入場前に荷物方針を決める。',
      countNote: '会場コインロッカーなし。',
      priceNote: '駅ロッカー料金またはクローク料金を想定。',
      coinNote: '駅ロッカー用のIC残高を残す。',
      bestMove: '大荷物は駅、小〜中荷物は公式クローク候補。',
      riskLevel: 4,
    },
    cloakProfile: {
      status: 'available',
      summary: '公式でB1Fロビーのクローク案内あり。荷物がある日はこれを軸にする。',
      priceNote: '公式案内では1袋500円、キャリーバッグ1つ500円。',
      timing: '受付タイミングは公演当日案内を見る。',
      bagTypeNote: '袋にまとめる。貴重品は必ず手元。',
      bestMove: 'ロッカー探しより、クローク利用前提で到着時間を組む。',
      riskLevel: 2,
    },
    arrivalStrategy: '高田馬場駅に着いたら、トイレと現金を先に済ませる。再入場不可なので入った後に戻れない前提。',
    entryStrategyPlain: '整列と階段周辺の滞留ルールを守る。良番でも荷物とトイレを済ませてから並ぶ。',
    afterShowStrategy: '終演後はクローク回収で詰まりやすい。終電が近い日は早めに動く。',
    beginnerOneLine: 'PHASEは公式注意事項がはっきりしている。再入場不可、クローク、飲食物持込不可だけ先に覚える。',
    blogSignals: [
      blogSignal('locker', '古い会場DBにロッカー情報が残るが、現在の公式案内ではコインロッカーなし。公式優先。', 'Supernice!', 'https://super-nice.net/%E6%9D%B1%E4%BA%AC%E9%83%BD/3419/', 'low', 'mixed'),
    ],
  },
  'sugamo-shishio': {
    practicalSummary: {
      headline: '巣鴨駅から近い地下小箱。入口導線と代替帰路を先に見る。',
      points: ['公式アクセスの入口説明を先に読む', '駐輪・駐車は使わない', '山手線以外の帰りも見る', '撮影/録音機材ルールに注意'],
    },
    arrivalStrategy: '巣鴨駅北口から、公式アクセスにある建物目印を見ながら向かう。初回は入口を通り過ぎないよう地図を開く。',
    afterShowStrategy: '山手線が止まると帰りが崩れる。都営三田線や池袋方面の代替を先に見ておく。',
    beginnerOneLine: '獅子王は入口導線を先に押さえると迷いにくい。',
    blogSignals: [
      blogSignal('return', '山手線トラブル時に別ルートへ切り替えた体験談がある。帰りは山手線一本に頼らない。', 'takepunks DISCOVERY BLOG', 'https://blog.takepunks.com/32829/', 'low'),
    ],
  },
  'higashi-koenji-20000v': {
    practicalSummary: {
      headline: 'ロッカーなし前提。東高円寺駅で身軽にして地下へ降りる。',
      points: ['会場ロッカーなし情報あり', 'クローク有無と料金は当日確認', '小箱なのでキャリー不可のつもりで行く', '終演後は丸ノ内線の終電を確認'],
    },
    lockerProfile: {
      status: 'none',
      summary: '会場DBではロッカーなしとして扱われている。',
      timing: '会場で探さず、入場前に荷物を処理する。',
      countNote: 'ロッカーなし情報あり。',
      priceNote: '駅ロッカーまたはクローク料金を想定。',
      coinNote: '小銭とIC残高を準備。',
      bestMove: '東高円寺駅か乗換駅で預けてから会場へ。',
      riskLevel: 5,
    },
    cloakProfile: {
      status: 'sometimes',
      summary: '会場DBではクローク500円の情報あり。公演ごとに確認。',
      priceNote: '500円目安だが変更あり。',
      timing: '受付タイミングは当日案内を見る。',
      bagTypeNote: '袋にまとめて預ける想定。',
      bestMove: '荷物ありなら、クロークが使えない場合の駅ロッカーも見る。',
      riskLevel: 3,
    },
    blogSignals: [
      blogSignal('locker', '会場DBではロッカーなし、クローク有りの情報がある。', 'Supernice!', 'https://super-nice.net/%E6%9D%B1%E4%BA%AC%E9%83%BD/3171/', 'medium', 'mixed'),
    ],
  },
  'wildside-tokyo': {
    practicalSummary: {
      headline: 'ロッカーなし情報あり。新宿御苑前/新宿三丁目側で荷物を消す。',
      points: ['会場DBではロッカーなし', '地下会場なので階段移動を想定', '新宿方面の帰り道を先に決める', '周辺で時間調整し、会場前に長く残らない'],
    },
    lockerProfile: {
      status: 'none',
      summary: 'ライブハウスナビではロッカーなしとして紹介されている。',
      timing: '入場前に駅側で預ける。',
      countNote: 'ロッカーなし情報あり。',
      priceNote: '駅ロッカー料金を想定。',
      coinNote: 'IC残高と小銭を用意。',
      bestMove: '新宿御苑前、新宿三丁目、乗換駅のロッカーを先に見る。',
      riskLevel: 5,
    },
    arrivalStrategy: '新宿の人混みを避けたいなら新宿御苑前側から。夜の帰りは明るい大通り寄りのルートを選ぶ。',
    afterShowStrategy: '終演後は新宿三丁目・新宿方面のどちらへ出るか決めておく。乗換が多い人は終電検索を先に。',
    blogSignals: [
      blogSignal('locker', '会場情報サイトではロッカーなしとして紹介されている。', 'ライブハウスナビ', 'https://live-house.info/sinjuku/wildside-tokyo.html', 'medium', 'mixed'),
      blogSignal('nearby', '周辺に飲食店や公園があるという紹介があるため、開場前の時間調整は会場前以外で考える。', 'WACCA MUSIC SCHOOL', 'https://wacca-music.co.jp/livehouse/13385/', 'low'),
    ],
  },
  'shimokitazawa-shangrila': {
    practicalSummary: {
      headline: '下北沢では大きめ。ロッカーは使える想定でも、物販日は駅ロッカー併用。',
      points: ['キャパ600規模の情報あり', '地下1階へ降りて受付', 'ロッカーはあるが混雑日は早めに', '下北沢駅周辺ロッカーも候補'],
    },
    lockerProfile: {
      status: 'available',
      summary: '会場紹介記事ではロッカーありとして扱われている。',
      timing: '入場前後どちらで使えるかは当日案内を見る。',
      countNote: '混雑日は早め利用が安全。',
      priceNote: '料金は当日確認。',
      coinNote: '小銭を持つ。',
      bestMove: '軽装なら会場ロッカー、遠征荷物なら下北沢駅周辺ロッカーも使う。',
      riskLevel: 3,
    },
    arrivalStrategy: '下北沢駅に着いたら、会場入口と駅ロッカー候補を先に確認。地下へ降りる前に荷物を整理する。',
    afterShowStrategy: '終演後は駅周辺の人通りが多い。荷物回収があるなら、回収場所と出口を先に決めておく。',
    blogSignals: [
      blogSignal('facility', '紹介記事では下北沢最大級の600人規模、地下1階のエントランスとメインフロア構成として扱われている。', 'ライブガイドドッグ', 'https://trend-dogman.com/shimokitazawa-shangrila/', 'medium'),
      blogSignal('locker', '周辺ロッカー候補として下北沢駅やミカン下北に触れる記事がある。', 'colorful情報局', 'https://colourfuls.hatenablog.com/entry/2025/11/27/063000', 'low'),
    ],
  },
  'music-lab-hamashobo': {
    practicalSummary: {
      headline: '小規模会場として荷物は最小限。関内駅周辺ロッカーかクローク確認。',
      points: ['キャリーケースは避ける', 'クローク情報は公演ごとに確認', '物販後の袋を持ったままフロアに入らない', '関内駅までの帰路を先に見る'],
    },
    lockerProfile: {
      status: 'unknown',
      summary: 'ロッカーは期待しすぎない。小箱前提で荷物を減らす。',
      timing: '入場前に関内駅周辺の預け先を見る。',
      countNote: '公式確定の数は未登録。',
      priceNote: '駅ロッカーやクローク料金を想定。',
      coinNote: '小銭とIC残高を用意。',
      bestMove: '遠征荷物は関内駅周辺かホテルへ。会場へ持ち込まない。',
      riskLevel: 4,
    },
    arrivalStrategy: '関内駅に着いたら、帰りの改札とロッカー候補を先に見る。会場前で長く待たない。',
    afterShowStrategy: '終演後は関内駅方面へ。横浜遠征なら終電とホテル動線を先に固定する。',
    blogSignals: [
      blogSignal('facility', '関係者ブログではロビーやバーカウンター、椅子を並べた時の空間感に触れられている。通常キャパではなく規模感の参考にする。', '校長さんのブログ', 'https://ameblo.jp/artpop-k/entry-12306468241.html', 'low'),
      blogSignal('locker', '会場情報サイトではクロークあり、別サイトではコインロッカーなしとして扱われる。最新運用は当日確認。', 'イベここ/LiveFans', 'https://evecoco.net/livehouse/kanagawa/yokohama/hamashobo/', 'low', 'mixed'),
    ],
  },
  'yokohama-baysis': {
    practicalSummary: {
      headline: 'ロッカー少数想定。遠征荷物は関内駅ロッカー先行。',
      points: ['会場DBでロッカー18個の情報あり', 'キャパ300規模の情報あり', '関内駅からの帰路を先に確認', '物販袋はフロアに持ち込まない'],
    },
    lockerProfile: {
      status: 'limited',
      summary: '会場DBではロッカー18個。少数なので満杯前提で動く。',
      timing: '開場直前に探すと間に合わない。',
      countNote: '18個という掲載情報あり。最新数は要確認。',
      priceNote: '料金は未確認。',
      coinNote: '小銭とIC残高を用意。',
      bestMove: '遠征荷物は関内駅ロッカーへ。小物だけ会場で判断。',
      riskLevel: 4,
    },
    arrivalStrategy: '関内駅に着いたら、帰りの改札とロッカー候補を先に見る。横浜遠征ならホテル方面の出口も確認。',
    afterShowStrategy: '終演後は関内駅へ戻る。ロッカー回収があるなら終電時刻から逆算する。',
    blogSignals: [
      blogSignal('locker', '会場DBではロッカー18個として掲載されている。遠征荷物には少ない前提で考える。', 'LiveWalker', 'https://www.livewalker.com/web/detail/2034', 'medium', 'mixed'),
      blogSignal('facility', '会場DBではキャパ300、シーティング80席の目安が掲載されている。', 'LiveWalker', 'https://www.livewalker.com/web/detail/2034', 'medium', 'mixed'),
    ],
  },
};

for (const venue of venues) {
  const base = defaultGuide(venue);
  const special = focus[venue.slug] ?? {};
  Object.assign(venue, base, special);

  venue.sourceLinks = uniqueByUrl([
    ...(base.sourceLinks ?? []),
    ...(special.sourceLinks ?? []),
    ...((special.blogSignals ?? []).map((signal) => sourceLink(signal.sourceName, signal.sourceUrl, signal.sourceType))),
  ]);

  if (venue.officialUrl && !venue.sourceLinks.some((link) => link.url === venue.officialUrl)) {
    venue.sourceLinks.unshift(sourceLink('会場公式', venue.officialUrl, 'official'));
  }

  const extraNote = '当日の動き方を practicalSummary / lockerProfile / baggageDecision に登録。非公式ソースは要点のみ独自表現。';
  if (!Array.isArray(venue.sourceNotes)) venue.sourceNotes = venue.sourceNotes ? [String(venue.sourceNotes)] : [];
  if (!venue.sourceNotes.includes(extraNote)) venue.sourceNotes.push(extraNote);

  if (!venue.officialUrl && !venue.sourceNotes.includes('公式URL要確認')) venue.sourceNotes.push('公式URL要確認');
}

fs.writeFileSync(DATA_PATH, `${JSON.stringify(venues, null, 2)}\n`);
console.log(`Applied practical guides to ${venues.length} venues. Focus venues: ${Object.keys(focus).length}`);
