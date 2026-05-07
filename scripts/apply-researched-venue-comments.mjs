import fs from 'node:fs';

const DATA_PATH = 'data/venues.json';
const CHECKED_AT = '2026-05-07';
const venues = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

const comment = (category, title, commentText, action, sourceName, sourceUrl, sourceType = 'mixed', confidence = 'medium') => ({
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

const appendSource = (venue, label, url, type) => {
  venue.sourceLinks ??= [];
  if (!venue.sourceLinks.some((item) => item.url === url && item.label === label)) {
    venue.sourceLinks.push({ label, url, type, checkedAt: CHECKED_AT });
  }
};

const mergeUnique = (base = [], extra = []) => [...new Set([...base, ...extra])];

const update = (slug, patch) => {
  const venue = venues.find((item) => item.slug === slug);
  if (!venue) throw new Error(`Venue not found: ${slug}`);
  const comments = patch.venueComments ?? [];
  venue.venueComments = comments;
  venue.tipTags = mergeUnique(venue.tipTags, patch.tipTags ?? []);
  for (const source of patch.sources ?? []) appendSource(venue, source.label, source.url, source.type);
  for (const [key, value] of Object.entries(patch.fields ?? {})) venue[key] = value;
  const note = '会場別実用コメントを venueComments に追加。出典文章はコピーせず、当日の行動に変換。';
  venue.sourceNotes = Array.isArray(venue.sourceNotes) ? venue.sourceNotes : [];
  if (!venue.sourceNotes.includes(note)) venue.sourceNotes.push(note);
};

update('ikebukuro-edge', {
  tipTags: ['駅ロッカー推奨', '屋外待機注意', '地下電波注意', '後方段差', '入口確認'],
  sources: [
    { label: 'ライブハウスナビ 池袋EDGE', url: 'https://live-house.info/toshimaku/edge.html', type: 'venue_database' },
    { label: 'ライブ研究室 池袋EDGE', url: 'https://live-kenkyushitsu.com/569.html', type: 'personal_blog' },
    { label: 'LiveFans 池袋EDGE', url: 'https://www.livefans.jp/venues/5023', type: 'venue_database' },
    { label: 'note 池袋EDGE体験メモ', url: 'https://note.com/ebitama/n/nb37867990132', type: 'note' },
    { label: 'ライブハウスまとめ 池袋EDGE', url: 'https://liveh0use.hateblo.jp/entry/2025/10/23/160343', type: 'personal_blog' },
  ],
  fields: {
    practicalSummary: {
      headline: '荷物は池袋駅で消す。EDGEは身軽に入って、入口・整列・電波だけ先に潰す。',
      points: [
        '会場ロッカーなし扱いの会場DBが複数ある',
        '近年の体験記事ではクローク運用があったという声もあるが、公演ごとに変わる',
        '番号帯によって建物内外の待機になる可能性を見る',
        '地下なので電子チケットは入場前に表示しておく',
      ],
    },
    lockerProfile: {
      status: 'none',
      summary: '会場ロッカーなし扱いの会場DBが複数ある。クロークはある日もあるが、固定設備として当てにしない。',
      timing: '池袋駅に着いた時点で預け先を決める。会場前で迷う時間を作らない。',
      countNote: '会場内ロッカーなし扱い。クローク運用は公演ごとに差がある。',
      priceNote: '駅ロッカー料金、またはクロークがある日の預け料金を想定。',
      coinNote: '駅ロッカー用に交通系IC残高と小銭を残す。',
      bestMove: '良番・物販あり・遠征荷物ありなら、池袋駅ロッカー先行。',
      riskLevel: 5,
    },
    cloakProfile: {
      status: 'sometimes',
      summary: '古い会場DBではクロークなし、近年の体験記事ではクロークありの声がある。つまり固定ではなく公演運用として見る。',
      priceNote: '体験記事では500円クロークの声あり。ただし当日案内優先。',
      timing: 'クローク受付がある場合でも、入場前か入場後かは当日案内を見る。',
      bagTypeNote: '袋にまとめて預ける想定。財布・スマホ・チケットは手元。',
      bestMove: 'クロークがあれば使う、なければ駅ロッカーで詰まないよう先に保険を作る。',
      riskLevel: 4,
    },
    arrivalStrategy: '池袋駅でロッカー候補を確認してから西武口側へ。会場前で長く待つより、整列時間まで駅・商業施設側で調整する。',
    entryStrategyPlain: '番号帯で待機場所が変わる可能性を見る。呼び出し前に電子チケット表示、トイレ、荷物処理を終える。',
    merchBaggageStrategy: 'チェキや小物だけなら薄いポーチへ。衣類や大きめグッズを買うなら、買った後に駅ロッカーへ戻す動線を先に決める。',
    afterShowStrategy: '終演後は池袋駅の改札とロッカー回収がセット。預けたロッカー位置をスクショかメモに残しておく。',
    stationLockerNote: '池袋駅は広いので、会場近くの出口だけでなく、乗換側や東口側のロッカーも候補にする。',
    timeKillingNote: '開場前は会場前に固まらず、駅側の商業施設やカフェで時間を潰す方が動きやすい。',
  },
  venueComments: [
    comment('locker', 'ロッカーなし前提で動く会場', 'ライブハウスナビとLiveFansではコインロッカーなし扱い。古い紹介記事でもロッカー・クロークなしとして案内されている。一方で近年の体験記事ではクロークありの日も見られるため、固定設備ではなく公演運用として扱う。', '荷物がある日は池袋駅ロッカーを第一候補。クロークがある日はラッキー、ない日でも詰まないようにする。', 'ライブハウスナビ 池袋EDGE', 'https://live-house.info/toshimaku/edge.html', 'venue_database', 'high'),
    comment('waiting', '番号帯で待機場所が変わる可能性', '体験記事では、番号帯によって建物内階段や屋外側で待つ流れに触れられている。雨の日や寒い日は、待機位置が外になっても困らない準備が必要。', '整列開始前に荷物を預け、雨具と電子チケットを出せる状態にしておく。', 'ライブ研究室 池袋EDGE', 'https://live-kenkyushitsu.com/569.html', 'personal_blog', 'medium'),
    comment('arrival', '地下会場なので通信と入口確認を先に', '地下会場のため、電波が弱いという体験メモがある。入口もビル内導線なので、初回は地図とビル名を見ながら行く。', '電子チケットは駅か地上で表示確認。入口前でアプリ更新やログインに手間取らない。', 'ライブ研究室 池袋EDGE', 'https://live-kenkyushitsu.com/569.html', 'personal_blog', 'medium'),
    comment('nearby', '段上センター狙いの声あり', 'noteの体験メモでは、池袋EDGEの段上センターが見やすいという個人の好みが書かれている。視界は動員や身長差で変わるが、後方段差を候補にできる会場として見る。', '前にこだわらないなら、荷物を減らして後方段差候補。良番なら荷物処理を優先してから立ち位置を取る。', 'note 池袋EDGE体験メモ', 'https://note.com/ebitama/n/nb37867990132', 'note', 'low'),
  ],
});

update('ikebukuro-blackhole', {
  tipTags: ['公式ロッカーなし', '公式クロークなし', '駅ロッカー推奨', 'C6出口', '地下小箱'],
  sources: [
    { label: '池袋BlackHole 公式アクセス', url: 'https://www.black-hole.jp/contents/access.html', type: 'official' },
    { label: 'LiveWalker 池袋BlackHole', url: 'https://www.livewalker.com/web/detail/15216', type: 'venue_database' },
    { label: 'Supernice! 池袋BlackHole', url: 'https://super-nice.net/%E6%9D%B1%E4%BA%AC%E9%83%BD/27395/', type: 'venue_database' },
  ],
  fields: {
    practicalSummary: {
      headline: '公式でロッカー・クロークなし。池袋駅C6出口へ向かう前に荷物を消す。',
      points: [
        '公式アクセスがコインロッカー・クロークなしと案内',
        '池袋駅西口C6出口から近い',
        '専用駐車場なし',
        '小箱なのでキャリーケースは会場に持ち込まない',
      ],
    },
    lockerProfile: {
      status: 'none',
      summary: '公式アクセスにコインロッカー・クロークなしの案内がある。',
      timing: '池袋駅で預けてからC6出口へ向かう。',
      countNote: '会場ロッカーなし。',
      priceNote: '駅ロッカー料金を想定。',
      coinNote: '交通系IC残高か小銭を残す。',
      bestMove: '荷物がある日は池袋駅ロッカー。会場で預け先を探さない。',
      riskLevel: 5,
    },
    cloakProfile: {
      status: 'none',
      summary: '公式でクロークなし。物販袋も持ったまま入る前提にしない。',
      priceNote: '会場クローク料金ではなく駅ロッカー料金を想定。',
      timing: '預けるなら入場前。',
      bagTypeNote: '貴重品だけ小さく手元に残す。',
      bestMove: '池袋駅で預ける。大荷物は宿泊先や外部預かりも候補。',
      riskLevel: 5,
    },
    arrivalStrategy: '池袋駅西口・C6出口の位置を先に確認。出口から近いので、早着しすぎたら駅側で待機する。',
    timeKillingNote: '会場前に固まらず、池袋駅側で時間調整。C6出口からすぐ戻れる距離感で待つ。',
  },
  venueComments: [
    comment('locker', '公式でロッカー・クロークなし', '公式アクセスページに、専用駐車場、コインロッカー、クロークがない旨の案内がある。ここは推測ではなく公式ベースで「会場に預けない」前提にできる。', '池袋駅で預けてからC6出口へ。キャリーケースは会場に持ち込まない。', '池袋BlackHole 公式アクセス', 'https://www.black-hole.jp/contents/access.html', 'official', 'high'),
    comment('arrival', 'C6出口から近いが、出口確認が大事', '公式は池袋駅西口・C6出口から近い導線を案内している。池袋駅は広いので、出口を間違えると余計に歩く。', '池袋駅に着いたらC6出口を先に検索。ロッカーに預けた場所もメモしておく。', '池袋BlackHole 公式アクセス', 'https://www.black-hole.jp/contents/access.html', 'official', 'high'),
    comment('nearby', '小規模フロアとして身軽さ優先', '会場情報サイトでは小さめのライブハウスとして扱われる。フロアの見え方は動員で変わるが、大荷物を抱えたまま入るメリットはない。', 'スマホ・財布・チケットだけに近い状態で入る。物販後の袋も駅ロッカーへ逃がす。', 'LiveWalker 池袋BlackHole', 'https://www.livewalker.com/web/detail/15216', 'venue_database', 'medium'),
  ],
});

update('shibuya-rex', {
  tipTags: ['クロークあり情報', 'ロッカー少なめ', '道玄坂注意', '渋谷駅ロッカー', '後方段差'],
  sources: [
    { label: '渋谷REX 公式', url: 'https://ruido.org/rex/', type: 'official' },
    { label: 'ライブガイドドッグ 渋谷REX', url: 'https://trend-dogman.com/shibuya-rex/', type: 'personal_blog' },
    { label: '渋谷REXレビュー記事', url: 'https://natsu-otoku.com/rex/', type: 'personal_blog' },
    { label: '東急 渋谷駅コインロッカー', url: 'https://www.tokyu.co.jp/railway/guide/baggage/station/TY/ty01.html', type: 'official' },
  ],
  fields: {
    practicalSummary: {
      headline: 'REXはクローク候補あり。ただしロッカー少なめなので、物販日は渋谷駅ロッカーも見る。',
      points: [
        '公式サイトで住所は道玄坂の地下会場と確認',
        '非公式記事ではロッカー少数、クローク利用候補の声あり',
        '渋谷駅には大型対応ロッカーもあるが、場所ごとに決済方法が違う',
        '道玄坂方面は人が多いので徒歩分数に余裕を足す',
      ],
    },
    lockerProfile: {
      status: 'limited',
      summary: 'ロッカーは少数という記事が複数ある。ソールドや物販ありの日は満杯前提。',
      timing: '会場で空きを探すより、渋谷駅で預けるかクロークを使うか先に決める。',
      countNote: '個人記事では少数として紹介。最新数は当日案内優先。',
      priceNote: '会場ロッカー・駅ロッカーとも料金変更あり。',
      coinNote: '100円玉と交通系ICの両方を用意。駅ロッカーは現金不可の場所もある。',
      bestMove: '物販で荷物が増える日は、渋谷駅ロッカーかクロークを先に決める。',
      riskLevel: 4,
    },
    cloakProfile: {
      status: 'sometimes',
      summary: 'クロークが使えるという体験記事・SNSプロフィール情報がある。固定ではなく当日運用として見る。',
      priceNote: '500円前後の情報あり。当日案内優先。',
      timing: 'オープン後受付の情報があるが、公演ごとに確認。',
      bagTypeNote: '袋にまとめる前提。貴重品は手元。',
      bestMove: 'ロッカーが少ないため、クロークがある日は積極的に使う。',
      riskLevel: 3,
    },
    arrivalStrategy: '渋谷駅から道玄坂方面へ。人混みと坂で時間を食うので、初回は10分以上の余裕を取る。',
    timeKillingNote: '開場前は会場前に長居せず、渋谷駅・マークシティ側で時間を潰す。道玄坂は人の流れが多い。',
    stationLockerNote: '東急の渋谷駅ロッカー案内では大型対応やキャッシュレス専用ロッカーがある。現金だけに頼らない。',
  },
  venueComments: [
    comment('locker', 'ロッカーは少なめ、クロークを保険に', '個人記事ではロッカー数が少ない会場として紹介され、別の体験記事でもクローク利用が現実的という声がある。', '荷物が多い日は渋谷駅ロッカーかクローク。会場ロッカー一本で予定を組まない。', 'ライブガイドドッグ 渋谷REX', 'https://trend-dogman.com/shibuya-rex/', 'personal_blog', 'medium'),
    comment('nearby', '道玄坂の地下会場。移動に余裕を足す', '公式サイトで道玄坂の地下会場と確認できる。渋谷駅から近く見えても、人混みと坂で歩く速度が落ちやすい。', '初回は地図を開いたまま向かう。開場直前到着にしない。', '渋谷REX 公式', 'https://ruido.org/rex/', 'official', 'high'),
    comment('baggage', '渋谷駅ロッカーは決済方法も見る', '東急の渋谷駅ロッカー案内では、場所によって電子マネーやQR決済などキャッシュレス前提のロッカーがある。', '現金だけでなく交通系IC残高も用意。大型荷物は駅ロッカーを先に探す。', '東急 渋谷駅コインロッカー', 'https://www.tokyu.co.jp/railway/guide/baggage/station/TY/ty01.html', 'official', 'high'),
    comment('arrival', '後方段差は候補。ただし埋まる', '体験記事では後方段差やステージの見やすさに触れられている。混雑公演では狙える場所が早く埋まる。', '視界優先なら荷物を預けてから早めに入る。無理に前へ行かず段差候補も見る。', '渋谷REXレビュー記事', 'https://natsu-otoku.com/rex/', 'personal_blog', 'medium'),
  ],
});

update('takadanobaba-club-phase', {
  tipTags: ['公式ロッカーなし', '公式クロークあり', '再入場不可', '階段待機禁止', '飲食物持込禁止'],
  sources: [
    { label: '高田馬場CLUB PHASE 公式INFORMATION', url: 'https://www.club-phase.com/information.html', type: 'official' },
    { label: 'Supernice! 高田馬場CLUB PHASE', url: 'https://super-nice.net/%E6%9D%B1%E4%BA%AC%E9%83%BD/3419/', type: 'venue_database' },
  ],
  fields: {
    practicalSummary: {
      headline: 'PHASEは公式でロッカーなし・クロークあり。再入場不可なので入る前に全部済ませる。',
      points: [
        '公式でコインロッカーなし',
        'B1Fロビーのクローク案内あり',
        '再入場不可',
        'ビル周辺・階段付近にたまらない注意あり',
      ],
    },
    timeKillingNote: '会場周辺や階段付近で待たない。整列開始までは高田馬場駅側で時間調整する。',
    arrivalStrategy: '高田馬場駅に着いたら、トイレ、飲み物、現金、荷物を先に処理。再入場不可なので入った後に戻れない。',
    entryStrategyPlain: 'クロークを使うなら受付の流れを先に確認。階段付近に滞留しない。',
  },
  venueComments: [
    comment('locker', 'ロッカーなし、クロークありは公式確認済み', '公式INFORMATIONでコインロッカーなし、B1Fロビーのクローク運用が案内されている。キャリーバッグも料金設定がある。', '荷物はクローク前提。ロッカー探しに時間を使わない。貴重品だけ手元に残す。', '高田馬場CLUB PHASE 公式INFORMATION', 'https://www.club-phase.com/information.html', 'official', 'high'),
    comment('entry', '再入場不可なので入場前チェックが必須', '公式注意事項で再入場不可、飲食物持ち込み不可が案内されている。入場後にコンビニやトイレへ戻る前提は危険。', '入場前にトイレ、飲み物、ドリンク代、荷物整理を終える。', '高田馬場CLUB PHASE 公式INFORMATION', 'https://www.club-phase.com/information.html', 'official', 'high'),
    comment('waiting', '階段・ビル周辺でたまらない', '公式注意事項でビル周辺や階段付近にたまらないよう明記されている。住宅・ビル導線への配慮が必要。', '整列開始までは駅側で時間調整。呼び出しが始まってから会場へ寄る。', '高田馬場CLUB PHASE 公式INFORMATION', 'https://www.club-phase.com/information.html', 'official', 'high'),
    comment('baggage', '古いロッカー掲載より公式を優先', '会場DBに古いロッカー情報が残る一方、公式ではコインロッカーなしと案内されている。設備情報は新しい公式表示を優先する。', '古いまとめを見てロッカーありと思い込まない。クロークか駅ロッカーで組む。', 'Supernice! 高田馬場CLUB PHASE', 'https://super-nice.net/%E6%9D%B1%E4%BA%AC%E9%83%BD/3419/', 'venue_database', 'low'),
  ],
});

update('sugamo-shishio', {
  tipTags: ['入口確認', '駐輪禁止', '録音録画注意', '飲食物持込注意', '代替路線確認'],
  sources: [
    { label: '巣鴨獅子王 公式アクセス', url: 'https://sugamo-cco.com/access.php', type: 'official' },
    { label: '巣鴨獅子王 公式ABOUT', url: 'https://sugamo-cco.com/about.php', type: 'official' },
    { label: 'takepunks DISCOVERY BLOG 巣鴨獅子王', url: 'https://blog.takepunks.com/32829/', type: 'personal_blog' },
  ],
  fields: {
    practicalSummary: {
      headline: '巣鴨駅北口から近い地下小箱。入口、駐輪不可、録音録画ルールを先に見る。',
      points: [
        '公式で入口目印が具体的に案内されている',
        '駐車場・駐輪スペースなし',
        '飲食物持込、録音録画機材は公式注意あり',
        '山手線以外の帰り道も見る',
      ],
    },
    timeKillingNote: '巣鴨駅側で時間調整。会場前や歩道に自転車・人がたまる形を避ける。',
    arrivalStrategy: '巣鴨駅北口から、公式アクセスの目印を追う。地下入口を通り過ぎないよう地図を開く。',
  },
  venueComments: [
    comment('arrival', '入口目印が公式でかなり具体的', '公式アクセスでは、巣鴨駅北口からの目印と地下への入り方が具体的に案内されている。初回はこの導線をそのまま使うと迷いにくい。', '駅を出たら公式アクセスを開く。ビル名と地下入口を確認してから向かう。', '巣鴨獅子王 公式アクセス', 'https://sugamo-cco.com/access.php', 'official', 'high'),
    comment('waiting', '駐輪・歩道待機に注意', '公式アクセスで駐車場・駐輪スペースがないこと、歩道に自転車やバイクを止めない注意が出ている。', '開場前は駅側で待つ。自転車利用や歩道待機は避ける。', '巣鴨獅子王 公式アクセス', 'https://sugamo-cco.com/access.php', 'official', 'high'),
    comment('nearby', '小箱としてキャパ感を意識', '公式ABOUTではオールスタンディング最大160名、椅子席最大60名の案内がある。大きい荷物を抱えて入るサイズ感ではない。', '荷物は最小限。リュックやキャリーは駅ロッカー候補に回す。', '巣鴨獅子王 公式ABOUT', 'https://sugamo-cco.com/about.php', 'official', 'high'),
    comment('return', '山手線一本に頼らない', '個人ブログでは移動中の山手線トラブルでルートを切り替えた体験がある。巣鴨は三田線も使えるので、終演後の代替を持てる。', '終電検索は山手線だけでなく、都営三田線や池袋経由も保存しておく。', 'takepunks DISCOVERY BLOG 巣鴨獅子王', 'https://blog.takepunks.com/32829/', 'personal_blog', 'low'),
  ],
});

update('higashi-koenji-20000v', {
  tipTags: ['駅出口すぐ', '住宅地待機禁止', '地下会場', '自転車注意', 'クローク確認'],
  sources: [
    { label: '東高円寺二万電圧 公式アクセス', url: 'https://den-atsu.com/access/', type: 'official' },
    { label: 'Supernice! 東高円寺二万電圧', url: 'https://super-nice.net/%E6%9D%B1%E4%BA%AC%E9%83%BD/3171/', type: 'venue_database' },
  ],
  fields: {
    practicalSummary: {
      headline: '駅3番出口から近いが住宅地。会場前にたまらず、荷物は先に処理。',
      points: [
        '公式で東高円寺駅3番出口からすぐと案内',
        '周辺は住宅地でたむろ禁止の強い注意あり',
        '地下へ降りる導線',
        'ロッカーなし情報があるため駅ロッカー先行',
      ],
    },
    timeKillingNote: '駅出口から近すぎるぶん、早く着いて会場前で待つと近隣迷惑になりやすい。整列までは駅側で時間調整。',
    arrivalStrategy: '東高円寺駅3番出口を出たらすぐ。早着しすぎず、荷物処理とトイレを済ませてから向かう。',
  },
  venueComments: [
    comment('arrival', '駅出口から近いが、待機はしない', '公式アクセスでは東高円寺駅3番出口からすぐの導線が案内されている。一方で周辺は住宅地で、会場周辺にたまらないよう強い注意がある。', '早く着いたら会場前ではなく駅側で待つ。呼び出し時間に合わせて向かう。', '東高円寺二万電圧 公式アクセス', 'https://den-atsu.com/access/', 'official', 'high'),
    comment('waiting', '近隣迷惑で公演に影響する可能性まで書かれている', '公式アクセスでは、状況が悪い場合は公演中止の可能性に触れるほど、周辺待機への注意が強い。', '会場前での長話、座り込み、歩道滞留を避ける。友達待ち合わせも駅側にする。', '東高円寺二万電圧 公式アクセス', 'https://den-atsu.com/access/', 'official', 'high'),
    comment('locker', 'ロッカーなし情報あり', '会場情報サイトではロッカーなし、クロークありの情報がある。最新運用は当日案内だが、会場ロッカーは期待しない方が安全。', '荷物は駅ロッカーかクローク。キャリーケースは会場へ持ち込まない。', 'Supernice! 東高円寺二万電圧', 'https://super-nice.net/%E6%9D%B1%E4%BA%AC%E9%83%BD/3171/', 'venue_database', 'medium'),
  ],
});

update('wildside-tokyo', {
  tipTags: ['ロッカーなし情報', '新宿御苑前', '新宿三丁目', '地下会場', '耳栓候補'],
  sources: [
    { label: 'ライブハウスナビ WildSide Tokyo', url: 'https://live-house.info/sinjuku/wildside-tokyo.html', type: 'venue_database' },
    { label: 'LiveFans Wild Side Tokyo', url: 'https://www.livefans.jp/venues/5040', type: 'venue_database' },
    { label: 'WACCA MUSIC SCHOOL WildSideTokyo紹介', url: 'https://wacca-music.co.jp/livehouse/13385/', type: 'personal_blog' },
    { label: '個人ブログ WildSideTokyo体験メモ', url: 'https://ameblo.jp/uno0530/entry-12443102295.html', type: 'personal_blog' },
  ],
  fields: {
    practicalSummary: {
      headline: 'WildSideはロッカーなし情報を前提に、新宿御苑前か新宿三丁目で荷物を消す。',
      points: [
        '会場DBでロッカーなし扱い',
        '新宿御苑前・新宿三丁目から徒歩圏',
        '地下B1F会場',
        '音量が大きいという体験メモもあるので耳栓候補',
      ],
    },
    timeKillingNote: '新宿御苑前・新宿三丁目側のカフェや駅周辺で調整。会場前に長く残らない。',
    arrivalStrategy: '新宿御苑前側から行くと人混みを避けやすい。新宿駅から歩く場合は時間を多めに見る。',
  },
  venueComments: [
    comment('locker', 'ロッカーなし扱いで組む', 'ライブハウスナビとLiveFansではロッカーなし扱い。会場に着いてから預け先を探すと詰まりやすい。', '新宿御苑前、新宿三丁目、乗換駅のロッカーを先に見る。', 'ライブハウスナビ WildSide Tokyo', 'https://live-house.info/sinjuku/wildside-tokyo.html', 'venue_database', 'medium'),
    comment('arrival', '新宿駅より新宿御苑前・新宿三丁目を軸に', '会場情報サイトでは新宿三丁目、LiveFansでは新宿御苑前と新宿三丁目からのアクセスが紹介されている。新宿駅から歩けるが人混みと距離が増える。', '初回は新宿御苑前か新宿三丁目で検索。夜は大通り寄りのルートで戻る。', 'LiveFans Wild Side Tokyo', 'https://www.livefans.jp/venues/5040', 'venue_database', 'medium'),
    comment('nearby', '周辺に飲食店や公園がある紹介あり', '紹介記事では周辺の飲食店や公園にも触れられている。会場前待機ではなく、時間調整先を持てるエリア。', '整列開始まで会場前に固まらない。新宿御苑前側で飲み物やトイレを済ませる。', 'WACCA MUSIC SCHOOL WildSideTokyo紹介', 'https://wacca-music.co.jp/livehouse/13385/', 'personal_blog', 'low'),
    comment('beginner', '音量対策も候補', '個人ブログでは音の大きさに触れられている。ライブハウスの体感は公演で変わるが、小箱でスピーカーが近い日は耳栓があると安心。', '耳が弱い人はライブ用耳栓を持つ。最前やスピーカー前に行くなら特に準備。', '個人ブログ WildSideTokyo体験メモ', 'https://ameblo.jp/uno0530/entry-12443102295.html', 'personal_blog', 'low'),
  ],
});

update('shimokitazawa-shangrila', {
  tipTags: ['ロッカー135個情報', '大型ロッカー注意', '下北沢駅ロッカー', '地下B1F', 'ドリンク代700円'],
  sources: [
    { label: '下北沢シャングリラ 公式', url: 'https://www.shan-gri-la.jp/tokyo/', type: 'official' },
    { label: 'ライブガイドドッグ 下北沢シャングリラ', url: 'https://trend-dogman.com/shimokitazawa-shangrila/', type: 'personal_blog' },
    { label: 'colorful情報局 下北沢シャングリラ', url: 'https://colourfuls.hatenablog.com/entry/2025/11/27/063000', type: 'personal_blog' },
  ],
  fields: {
    practicalSummary: {
      headline: 'シャングリラは中箱。ロッカー数は多めでもキャパに対して足りない前提で早めに。',
      points: [
        '公式でキャパ500〜600、ドリンク代700円の案内あり',
        '個人記事で会場内外ロッカー合計135個の情報あり',
        '大型荷物は下北沢駅・ミカン下北側も候補',
        '地下1階へ降りるため、キャリーは先に預ける',
      ],
    },
    lockerProfile: {
      status: 'available',
      summary: '個人記事では会場内外に合計135個のロッカー情報がある。ただしキャパ500〜600に対して全員分ではない。',
      timing: '早め入場なら会場ロッカー候補。遠征荷物は駅ロッカー先行。',
      countNote: 'フロア内外合計135個という記事情報あり。',
      priceNote: '記事では300円情報あり。最新は当日確認。',
      coinNote: '100円玉を持つ。駅ロッカー用にIC残高も残す。',
      bestMove: '小荷物は会場ロッカー、大荷物は下北沢駅周辺ロッカー。',
      riskLevel: 3,
    },
    arrivalStrategy: '下北沢駅から会場入口へ。地下へ降りる前に荷物とドリンク代を確認する。',
    timeKillingNote: '下北沢駅周辺で時間調整しやすい。開場直前に会場前へ移動する。',
  },
  venueComments: [
    comment('locker', 'ロッカーはあるがキャパ全員分ではない', '公式ではキャパ500〜600。個人記事ではロッカー合計135個の情報があり、数はあるが満員公演では足りない前提。', '小荷物なら早めに会場ロッカー。遠征荷物やキャリーは下北沢駅周辺へ。', 'ライブガイドドッグ 下北沢シャングリラ', 'https://trend-dogman.com/shimokitazawa-shangrila/', 'personal_blog', 'medium'),
    comment('baggage', '大型荷物は駅側へ逃がす', '個人記事では下北沢駅中央口やミカン下北周辺のロッカーにも触れられている。会場ロッカーは大きい荷物向きとは限らない。', 'キャリーがある日は駅周辺ロッカーを先に探す。会場地下へ降ろさない。', 'colorful情報局 下北沢シャングリラ', 'https://colourfuls.hatenablog.com/entry/2025/11/27/063000', 'personal_blog', 'low'),
    comment('arrival', '公式でキャパとドリンク代を確認', '公式サイトではキャパ500〜600、ドリンク代700円の案内がある。中箱なので入場列もロッカーも小箱より混みやすい。', 'ドリンク代用の現金を残す。整列前にロッカー方針を決める。', '下北沢シャングリラ 公式', 'https://www.shan-gri-la.jp/tokyo/', 'official', 'high'),
  ],
});

update('music-lab-hamashobo', {
  tipTags: ['公式キャパ100', '小箱', '関内駅ロッカー', 'クロークあり情報', 'ドリンク代500円'],
  sources: [
    { label: 'Music Lab.濱書房 公式キャパ告知', url: 'https://www.hamashobo.com/post-9900/', type: 'official' },
    { label: 'イベここ Music Lab.濱書房', url: 'https://evecoco.net/livehouse/kanagawa/yokohama/hamashobo/', type: 'venue_database' },
    { label: 'LiveFans Music Lab.濱書房', url: 'https://www.livefans.jp/venues/9354', type: 'venue_database' },
    { label: '校長さんのブログ Music Lab.濱書房', url: 'https://ameblo.jp/artpop-k/entry-12306468241.html', type: 'personal_blog' },
  ],
  fields: {
    practicalSummary: {
      headline: '濱書房は100人規模の小箱。キャリーは関内駅側へ、荷物は最小限。',
      points: [
        '公式でスタンディング100名、座席55席の案内あり',
        '公式で入場時1ドリンク代500円の案内あり',
        '会場DBではクロークあり、LiveFansではコインロッカーなし',
        '関内駅から近いので駅ロッカー候補を先に見る',
      ],
    },
    lockerProfile: {
      status: 'none',
      summary: 'LiveFansではコインロッカーなし扱い。小箱なので大荷物は外へ逃がす。',
      timing: '関内駅に着いた時点で預け先を見る。',
      countNote: 'コインロッカーなし情報あり。',
      priceNote: '駅ロッカーまたはクローク料金を想定。',
      coinNote: 'IC残高と小銭を用意。',
      bestMove: '関内駅ロッカーか宿泊先へ預け、会場には小バッグだけで入る。',
      riskLevel: 5,
    },
    cloakProfile: {
      status: 'sometimes',
      summary: '会場情報サイトではクロークありとして扱われるが、当日の運用確認が必要。',
      priceNote: '料金は当日案内を見る。',
      timing: '受付タイミングは公演ごとに確認。',
      bagTypeNote: '袋にまとめて預ける形式を想定。',
      bestMove: 'クロークがある日は使う。なければ関内駅ロッカーへ。',
      riskLevel: 3,
    },
    arrivalStrategy: '関内駅に着いたら、ロッカー候補と帰りの改札を先に見る。会場には小バッグで入る。',
    timeKillingNote: '関内駅周辺で時間調整。小箱なので会場前に大人数で固まらない。',
  },
  venueComments: [
    comment('nearby', '100人規模の小箱として荷物を絞る', '公式告知でスタンディング100名、座席55席の案内がある。小さい会場なので、リュックやキャリーをフロアに入れる前提は避けたい。', 'キャリーは関内駅かホテルへ。小バッグだけで入る。', 'Music Lab.濱書房 公式キャパ告知', 'https://www.hamashobo.com/post-9900/', 'official', 'high'),
    comment('locker', 'コインロッカーなし、クロークあり情報が混在', 'LiveFansではコインロッカーなし、イベここではクロークありとして扱われている。固定設備としてロッカーを期待せず、クロークは当日運用として見る。', '関内駅ロッカーを第一候補。クロークがあれば物販後に使う。', 'LiveFans Music Lab.濱書房', 'https://www.livefans.jp/venues/9354', 'venue_database', 'medium'),
    comment('arrival', '関内駅から近いので駅側で準備', 'イベここでは地下鉄関内駅3番出口から徒歩1分、JR関内駅北口から徒歩5分として紹介されている。駅が近いぶん、荷物処理を駅側で済ませやすい。', '駅でトイレ、現金、ロッカーを済ませてから会場へ向かう。', 'イベここ Music Lab.濱書房', 'https://evecoco.net/livehouse/kanagawa/yokohama/hamashobo/', 'venue_database', 'medium'),
    comment('nearby', 'ロビーとバーがある小規模空間', '関係者ブログではロビー、バーカウンター、椅子席を並べた時の空間感に触れられている。通常公演の見え方とは別だが、コンパクトな会場感の参考になる。', '待機や荷物置き場としてロビーを当てにしすぎない。貴重品は手元に。', '校長さんのブログ Music Lab.濱書房', 'https://ameblo.jp/artpop-k/entry-12306468241.html', 'personal_blog', 'low'),
  ],
});

update('yokohama-baysis', {
  tipTags: ['公式ロッカー200円', 'ロッカー18個情報', '関内駅ロッカー', '横浜遠征', '駅ロッカー混雑'],
  sources: [
    { label: '横浜BAYSIS 公式INFO', url: 'https://www.yokohamabaysis.com/info.php', type: 'official' },
    { label: 'LiveWalker 横浜BAYSIS', url: 'https://www.livewalker.com/web/detail/2034', type: 'venue_database' },
    { label: '個人ブログ 横浜BAYSIS荷物メモ', url: 'https://ameblo.jp/jiu3jing3/entry-12076556646.html', type: 'personal_blog' },
  ],
  fields: {
    practicalSummary: {
      headline: 'BAYSISは公式でロッカー200円。数は少なめ情報あり、遠征荷物は関内駅へ。',
      points: [
        '公式INFOにコインロッカー料金200円の案内あり',
        'LiveWalkerではロッカー18個の情報あり',
        '古い参戦メモでは関内駅ロッカー混雑の声あり',
        '横浜遠征ならホテル・駅・会場の順で荷物導線を作る',
      ],
    },
    lockerProfile: {
      status: 'limited',
      summary: '公式でコインロッカー料金200円の案内あり。会場DBでは18個という情報があるため少数扱い。',
      timing: '会場で使うなら早め。遠征荷物は関内駅側へ。',
      countNote: 'LiveWalkerで18個の情報あり。',
      priceNote: '公式INFOで200円の案内あり。',
      coinNote: '100円玉を用意。駅ロッカー用にIC残高も残す。',
      bestMove: '小物は会場ロッカー候補、キャリーや物販袋は関内駅ロッカーかホテル預け。',
      riskLevel: 4,
    },
    arrivalStrategy: '関内駅に着いたら、帰りの改札とロッカー位置を先に確認。横浜遠征ならホテル方面の導線も見る。',
    stationLockerNote: '関内駅ロッカーは埋まることがあるという古い参戦メモあり。横浜駅やホテル預けも保険にする。',
  },
  venueComments: [
    comment('locker', '公式でロッカー料金あり、数は少なめ扱い', '公式INFOではコインロッカー料金200円の案内がある。LiveWalkerでは18個と紹介されており、キャパに対して多くない。', '会場ロッカーは小物用。遠征荷物は関内駅かホテルへ。', '横浜BAYSIS 公式INFO', 'https://www.yokohamabaysis.com/info.php', 'official', 'high'),
    comment('baggage', '関内駅ロッカー混雑の体験談あり', '古い個人ブログでは関内駅ロッカーが埋まっていたという体験がある。時期は古いが、遠征時の保険として有用。', '関内駅だけに頼らず、横浜駅・ホテル・会場ロッカーの順に代替を持つ。', '個人ブログ 横浜BAYSIS荷物メモ', 'https://ameblo.jp/jiu3jing3/entry-12076556646.html', 'personal_blog', 'low'),
    comment('nearby', '関内エリアは終演後の戻り方を先に', '横浜遠征では関内駅、横浜駅、宿泊先のどこへ戻るかで動きが変わる。ロッカー回収があると終電前に詰まりやすい。', '終演後は会場前で長く残らず、荷物回収と駅ルートを先に進める。', 'LiveWalker 横浜BAYSIS', 'https://www.livewalker.com/web/detail/2034', 'venue_database', 'medium'),
  ],
});

fs.writeFileSync(DATA_PATH, `${JSON.stringify(venues, null, 2)}\n`);
console.log('Applied researched venue comments to focus venues.');
