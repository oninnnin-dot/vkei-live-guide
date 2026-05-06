import fs from 'node:fs';

const path = 'data/venues.json';
const venues = JSON.parse(fs.readFileSync(path, 'utf8'));
const checkedAt = '2026-05-06';

const notePrefix = '要確認: 非公式ソース由来。公演日・運用変更・改装で変わる可能性があります。';

const community = (category, label, body, sourceLabel, sourceUrl, sourceType = 'blog', confidence = 'unknown', note = notePrefix) => ({
  category,
  label,
  body,
  sourceLabel,
  sourceUrl,
  sourceType,
  checkedAt,
  confidence,
  note,
});

const notesBySlug = {
  'ikebukuro-edge': [
    community(
      'locker',
      'ロッカー/クロークは期待しない前提',
      'ライブ研究室とライブハウスナビの会場情報では、池袋EDGEは会場内外のロッカーやクロークがない扱いで紹介されている。駅ロッカーを先に確保する前提で動くメモとして登録。',
      'ライブ研究室 池袋EDGE記事',
      'https://live-kenkyushitsu.com/569.html',
    ),
    community(
      'nearby',
      '最寄りの目印候補',
      '体験記事では、会場付近の目印としてファミリーマートが挙げられている。店舗名や位置は変わる可能性があるため、当日は地図アプリで再確認する。',
      'ライブ研究室 池袋EDGE記事',
      'https://live-kenkyushitsu.com/569.html',
    ),
    community(
      'entry',
      '整列場所は番号帯で変わる可能性',
      '体験記事では、早番は建物内階段、遅めの番号は建物裏側で待機する運用が紹介されている。公演ごとに案内が変わるため、主催・会場スタッフの指示を優先する。',
      'ライブ研究室 池袋EDGE記事',
      'https://live-kenkyushitsu.com/569.html',
    ),
    community(
      'weather',
      '屋外待機になる番号帯への備え',
      '体験記事では、番号帯によって屋根のない屋外待機になるケースがあると紹介されている。雨天時は折りたたみ傘と荷物の防水を先に用意する。',
      'ライブ研究室 池袋EDGE記事',
      'https://live-kenkyushitsu.com/569.html',
    ),
    community(
      'signal',
      '地下会場の電波は弱い可能性',
      '体験記事では、電波がまったくないわけではないが弱いと紹介されている。電子チケットは入場前に表示確認しておく。',
      'ライブ研究室 池袋EDGE記事',
      'https://live-kenkyushitsu.com/569.html',
    ),
    community(
      'restroom',
      'トイレ位置の事前把握',
      '体験記事では、トイレはロビー内・フロア入口近くの奥側として紹介されている。小箱は開演前に混みやすいため、入場後すぐ位置確認する。',
      'ライブ研究室 池袋EDGE記事',
      'https://live-kenkyushitsu.com/569.html',
    ),
    community(
      'view',
      '横長フロアと後方段差',
      '体験記事では、横長フロアでステージが見やすい一方、後方段差やロビーの狭さに触れられている。混雑公演では立ち位置を早めに決める。',
      'ライブ研究室 池袋EDGE記事',
      'https://live-kenkyushitsu.com/569.html',
    ),
  ],

  'ikebukuro-blackhole': [
    community(
      'facility',
      'キャパとフロア形状の目安',
      'LiveWalkerとSupernice!では、池袋BlackHoleはスタンディング約250人規模、フラットなフロア・低めのステージとして紹介されている。見え方は動員や身長差で変わる。',
      'LiveWalker 池袋BlackHole',
      'https://www.livewalker.com/web/detail/15216',
      'venue_database',
      'partially_verified',
    ),
    community(
      'locker',
      '非公式DBでもロッカーなし扱い',
      'Supernice!でもコインロッカーなしとして掲載されている。公式の「コインロッカー・クロークなし」と一致するため、荷物は池袋駅周辺ロッカーか宿泊先預けを先に検討する。',
      'Supernice! 池袋BlackHole',
      'https://super-nice.net/%E6%9D%B1%E4%BA%AC%E9%83%BD/27395/',
      'venue_database',
      'partially_verified',
    ),
  ],

  'ikebukuro-livegarage-adm': [
    community(
      'locker',
      'ロッカーなし・クロークありとの体験メモ',
      'ライブハウス雑記では、池袋Admはロッカーなし、クローク500円ありとして紹介されている。料金や受付有無は公演で変わる可能性がある。',
      'ライブハウス雑記 池袋Adm',
      'https://ameblo.jp/ksk-1994/entry-12860305944.html',
    ),
    community(
      'entry',
      '入口が分かりにくい可能性',
      '同記事では、入口がライブハウスらしく見えにくく、階段を降りた先で受付に着く流れとして紹介されている。初参戦は建物入口と階段位置を地図で確認する。',
      'ライブハウス雑記 池袋Adm',
      'https://ameblo.jp/ksk-1994/entry-12860305944.html',
    ),
    community(
      'view',
      '後方段差と斜めステージのメモ',
      '同記事では、ステージが斜め気味で、後方に段差があると紹介されている。混雑時は早めに視界を確認する。',
      'ライブハウス雑記 池袋Adm',
      'https://ameblo.jp/ksk-1994/entry-12860305944.html',
    ),
    community(
      'safety',
      '音量への備え',
      '同記事では音が大きい印象が書かれている。耳が疲れやすい人はライブ用耳栓を持っていく。',
      'ライブハウス雑記 池袋Adm',
      'https://ameblo.jp/ksk-1994/entry-12860305944.html',
    ),
  ],

  'shibuya-rex': [
    community(
      'locker',
      'ロッカー数は少なめとして扱う',
      'ライブガイドドッグと体験記事では、渋谷REXのロッカーは20〜30個程度の少数として紹介されている。人気公演や物販予定がある日は駅ロッカーやクロークを優先候補にする。',
      'ライブガイドドッグ SHIBUYA REX',
      'https://trend-dogman.com/shibuya-rex/',
      'blog',
      'unknown',
      `${notePrefix} 掲載値が記事により異なるため、数は目安として扱います。`,
    ),
    community(
      'cloak',
      'クローク利用候補',
      '体験記事では、ロッカーが少ないためクローク利用が現実的な選択肢として紹介されている。受付時間・料金・袋サイズは当日案内を確認する。',
      '渋谷REXレビュー記事',
      'https://natsu-otoku.com/rex/',
    ),
    community(
      'restroom',
      'トイレは混みやすい可能性',
      '体験記事では、トイレの個数が少ない旨が書かれている。入場後すぐ場所を把握し、開演直前を避ける。',
      '渋谷REXレビュー記事',
      'https://natsu-otoku.com/rex/',
    ),
    community(
      'access',
      'マークシティ経由の導線候補',
      '体験記事では、渋谷マークシティ内を通るルートが楽な導線として紹介されている。営業時間や混雑は変わるため、当日は地図アプリで補助確認する。',
      '渋谷REXレビュー記事',
      'https://natsu-otoku.com/rex/',
    ),
    community(
      'view',
      '後方段差と高めステージの体感メモ',
      '体験記事では、後方段差と高めのステージにより見やすい一方、混雑時は段上が早めに埋まりやすいと紹介されている。',
      '渋谷REXレビュー記事',
      'https://natsu-otoku.com/rex/',
    ),
  ],

  'harajuku-ruido': [
    community(
      'locker',
      'ロッカーは複数あるが最新確認必須',
      'ライブガイドドッグでは、原宿RUIDOのラウンジ周辺にロッカーが複数設置されていると紹介されている。個数・料金・利用開始タイミングは当日案内で確認する。',
      'ライブガイドドッグ 原宿RUIDO',
      'https://trend-dogman.com/harajuku-ruido/',
    ),
    community(
      'cloak',
      'クローク対応ありとの紹介',
      '同記事では、クローク対応もあると紹介されている。公演ごとに受付時間が異なる可能性があるため、主催・会場案内を確認する。',
      'ライブガイドドッグ 原宿RUIDO',
      'https://trend-dogman.com/harajuku-ruido/',
    ),
    community(
      'restroom',
      'トイレ個室数は少なめの可能性',
      '同記事では、トイレは1階右手、男女共用と女性用が各1つという趣旨で紹介されている。混雑前に済ませる。',
      'ライブガイドドッグ 原宿RUIDO',
      'https://trend-dogman.com/harajuku-ruido/',
    ),
    community(
      'nearby',
      '原宿駅周辺ロッカーも候補',
      'JREメディアでは原宿駅周辺のコインロッカー設置場所がまとめられている。遠征荷物や物販予定がある場合は駅周辺ロッカーも候補にする。',
      'JREメディア 原宿駅周辺コインロッカー',
      'https://media.jreast.co.jp/articles/707',
      'mixed',
      'partially_verified',
    ),
  ],

  'shibuya-the-game': [
    community(
      'safety',
      '音量への備え',
      'Top-Rated.Online掲載のレビューでは、音量が大きいという声が複数見られる。耳が疲れやすい人はライブ用耳栓を持参する。',
      'Top-Rated.Online shibuya THE GAME reviews',
      'https://www.top-rated.online/cities/Shibuya/place/p/15715671/shibuya%2BTHE%2BGAME',
      'review_site',
    ),
    community(
      'rule',
      '再入場料金の口コミあり',
      '同レビュー集には、イベント中に出入りする場合の再入場料金に触れた口コミがある。実際の可否・料金はイベントごとに確認する。',
      'Top-Rated.Online shibuya THE GAME reviews',
      'https://www.top-rated.online/cities/Shibuya/place/p/15715671/shibuya%2BTHE%2BGAME',
      'review_site',
    ),
    community(
      'locker',
      'クローク限定運用のSNS転載情報あり',
      '外部サイト上の公式SNS転載では、場内ロッカーと限定人数クロークに触れた投稿が見られる。通常運用とは限らないため、当日案内を確認する。',
      'TwStalker SHIBUYA THE GAME転載表示',
      'https://ww.twstalker.com/SHIBUYATHEGAME',
      'social',
      'unknown',
    ),
  ],

  'takadanobaba-club-phase': [
    community(
      'locker',
      '古い掲載と公式情報の差分に注意',
      'Supernice!ではロッカー30個と掲載されているが、公式INFORMATIONでは現在コインロッカーなしと案内されている。古い記事や会場DBより公式を優先する。',
      'Supernice! 高田馬場CLUB PHASE',
      'https://super-nice.net/%E6%9D%B1%E4%BA%AC%E9%83%BD/3419/',
      'venue_database',
      'unknown',
      '要確認: 古い会場DBと公式情報が食い違うため、公式の「コインロッカーなし」を優先してください。',
    ),
  ],

  'yokohama-baysis': [
    community(
      'locker',
      'ロッカー18個との会場DB情報',
      'LiveWalkerでは、横浜BAYSISのロッカー数を18個として掲載している。数が少ない前提で、遠征荷物は関内駅周辺ロッカーも候補にする。',
      'LiveWalker 横浜BAYSIS',
      'https://www.livewalker.com/web/detail/2034',
      'venue_database',
      'partially_verified',
    ),
    community(
      'facility',
      'キャパ300人・着席80席の目安',
      'LiveWalkerではキャパ300人、シーティング80席の設置が可能として紹介されている。公演形態により実際の見え方や混雑は変わる。',
      'LiveWalker 横浜BAYSIS',
      'https://www.livewalker.com/web/detail/2034',
      'venue_database',
      'partially_verified',
    ),
    community(
      'access',
      '関内駅徒歩5分の会場DB情報',
      'LiveWalkerではJR関内駅から徒歩5分として掲載されている。終演後は関内駅方面の導線を先に確認する。',
      'LiveWalker 横浜BAYSIS',
      'https://www.livewalker.com/web/detail/2034',
      'venue_database',
      'partially_verified',
    ),
  ],

  'higashi-koenji-20000v': [
    community(
      'locker',
      'ロッカーなし・クローク500円との会場DB情報',
      'Supernice!では、東高円寺二万電圧はコインロッカーなし、クローク500円として掲載されている。クローク有無と料金は公演当日確認する。',
      'Supernice! 東高円寺二万電圧',
      'https://super-nice.net/%E6%9D%B1%E4%BA%AC%E9%83%BD/3171/',
      'venue_database',
      'partially_verified',
    ),
    community(
      'facility',
      'キャパ130人規模の目安',
      'Supernice!ではキャパシティ130人として掲載されている。小箱前提で荷物を減らし、フロアを広く使える状態にする。',
      'Supernice! 東高円寺二万電圧',
      'https://super-nice.net/%E6%9D%B1%E4%BA%AC%E9%83%BD/3171/',
      'venue_database',
      'partially_verified',
    ),
    community(
      'access',
      '東高円寺駅出口の導線候補',
      'Supernice!では東高円寺駅3番出口より徒歩1分として掲載されている。出口番号は変わることがあるため、当日は地図アプリも併用する。',
      'Supernice! 東高円寺二万電圧',
      'https://super-nice.net/%E6%9D%B1%E4%BA%AC%E9%83%BD/3171/',
      'venue_database',
      'partially_verified',
    ),
  ],

  'music-lab-hamashobo': [
    community(
      'facility',
      '椅子50席程度を置ける規模感メモ',
      '関係者ブログでは、開業準備時にホールへ椅子を並べて50席は余裕だったという趣旨の記述がある。通常公演のキャパではなく、空間規模の目安として扱う。',
      '校長さんのブログ Music Lab.濱書房',
      'https://ameblo.jp/artpop-k/entry-12306468241.html',
    ),
    community(
      'facility',
      'ロビーとバーカウンターの存在メモ',
      '同ブログでは、開業準備中のロビーとバーカウンターに触れられている。現在の配置や利用可否は会場・公演案内を確認する。',
      '校長さんのブログ Music Lab.濱書房',
      'https://ameblo.jp/artpop-k/entry-12306468241.html',
    ),
    community(
      'drink',
      'ドリンクメニューの変化に注意',
      '同ブログでは、開業時のドリンクメニュー準備に触れられている。メニューや追加料金は時期で変わるため当日確認する。',
      '校長さんのブログ Music Lab.濱書房',
      'https://ameblo.jp/artpop-k/entry-12306468241.html',
    ),
  ],

  'wildside-tokyo': [
    community(
      'locker',
      'ロッカーなしとの会場DB情報',
      'ライブハウスナビでは、WildSide Tokyoはロッカーなしとして掲載されている。大きな荷物は駅ロッカーや宿泊先預けを先に検討する。',
      'ライブハウスナビ WildSide Tokyo',
      'https://live-house.info/sinjuku/wildside-tokyo.html',
      'venue_database',
      'partially_verified',
    ),
    community(
      'facility',
      'キャパ150人規模の目安',
      'ライブハウスナビではキャパ150人として掲載されている。小箱寄りのため、フロアに荷物を持ち込まない前提で準備する。',
      'ライブハウスナビ WildSide Tokyo',
      'https://live-house.info/sinjuku/wildside-tokyo.html',
      'venue_database',
      'partially_verified',
    ),
    community(
      'nearby',
      '周辺に飲食店や公園があるとの紹介',
      'WACCA MUSIC SCHOOLの記事では、近隣に飲食店や公園があり待ち時間調整に使える趣旨で紹介されている。具体店舗は地図アプリで確認する。',
      'WACCA MUSIC SCHOOL WildSideTokyo紹介',
      'https://wacca-music.co.jp/livehouse/13385/',
      'blog',
    ),
  ],

  'shinjuku-club-science': [
    community(
      'facility',
      'フロアは約300人規模、物販席などで約200人目安',
      '公式フロアマップでは、通常のスタンディング約300名、物販席や関係者席を設ける場合は約200名と案内されている。',
      '新宿club SCIENCE 公式FLOOR MAP',
      'https://club-science.com/floormap/',
      'official',
      'verified',
      '',
    ),
    community(
      'facility',
      'フロア外に広めのBarスペース',
      '公式フロアマップでは、フロアとは独立した広いBarスペースがあると案内されている。混雑時の使い方は当日案内に従う。',
      '新宿club SCIENCE 公式FLOOR MAP',
      'https://club-science.com/floormap/',
      'official',
      'verified',
      '',
    ),
    community(
      'safety',
      '歌舞伎町エリアの自衛メモ',
      '体験系ブログでは、会場周辺で女性はトラブル回避のため自衛意識を持つ旨が書かれている。夜は駅までのルートを事前に決め、寄り道を減らす。',
      '地下アイドルを推す会ブログ部 新宿club SCIENCE記事',
      'https://ameblo.jp/idolopenchat/entry-12700780804.html',
      'blog',
    ),
  ],

  'sugamo-shishio': [
    community(
      'facility',
      '公式ABOUTのキャパ情報',
      '公式ABOUTでは、最大160名のオールスタンディング、椅子席最大60名として案内されている。',
      '巣鴨獅子王 公式ABOUT',
      'https://www.sugamo-cco.com/about.php',
      'official',
      'verified',
      '',
    ),
    community(
      'drink',
      'ドリンク代700円への変更告知',
      '公式トップページでは、2026年5月よりドリンク代700円とする告知が出ている。入場時の現金・決済手段は公演案内を確認する。',
      '巣鴨獅子王 公式サイト',
      'https://sugamo-cco.com/',
      'official',
      'verified',
      '',
    ),
    community(
      'return',
      '山手線トラブル時の代替ルート意識',
      '個人ブログでは、巣鴨へ向かう途中で山手線トラブルに遭い、池袋経由などに切り替えた体験が書かれている。終演後も山手線一本に頼らず、都営三田線や別ルートを確認しておく。',
      'takepunks DISCOVERY BLOG 巣鴨獅子王記事',
      'https://blog.takepunks.com/32829/',
      'blog',
    ),
  ],
};

const targetSlugs = new Set(Object.keys(notesBySlug));
const managedSourceUrls = new Set(Object.values(notesBySlug).flat().map((fact) => fact.sourceUrl));

for (const venue of venues) {
  if (!targetSlugs.has(venue.slug)) continue;

  const nextNotes = notesBySlug[venue.slug];
  const previousFacts = Array.isArray(venue.factChecks) ? venue.factChecks : [];
  const keptFacts = previousFacts.filter((fact) => !managedSourceUrls.has(fact.sourceUrl));

  venue.factChecks = [...keptFacts, ...nextNotes];
  venue.lastVerifiedAt = checkedAt;
  venue.sourceConfidence = venue.sourceConfidence === 'verified' ? 'verified' : 'partially_verified';
  venue.sourceMemo = '公式確認済み情報と、個人ブログ・会場情報サイト由来の要確認メモを分けて登録。公演情報は掲載しない。';

  if (!Array.isArray(venue.sourceNotes)) venue.sourceNotes = venue.sourceNotes ? [String(venue.sourceNotes)] : [];
  const note = '非公式ソース由来の現地メモは要確認として factChecks に登録。公式情報と混同しない。';
  if (!venue.sourceNotes.includes(note)) venue.sourceNotes.push(note);
}

fs.writeFileSync(path, `${JSON.stringify(venues, null, 2)}\n`);
console.log(`Updated community venue notes for ${targetSlugs.size} venues.`);
