# V系ライブ遠征ナビ

ライブ情報は公式で探す。小箱の不安はここで消す。

「V系ライブ遠征ナビ」は、V系ライブ当日に困りやすい会場周辺・荷物・ロッカー・クローク・待機場所・終演後の帰り方を整理する静的Webサイトです。公演情報を網羅するサイトではありません。公演日、出演者、開場/開演時間、チケット状況は必ず公式サイト、チケットサイト、会場公式スケジュールで確認してください。

## 技術構成

- Astro
- TypeScript
- Tailwind CSS
- Markdown
- JSON
- @astrojs/sitemap

外部DB、外部API、CMS、WordPress、スクレイピング、X API、Google Maps APIは使いません。Cloudflare PagesまたはGitHub Pagesで公開できる静的サイトです。

## ローカル起動

```bash
npm install
npm run dev
```

Windowsで作業場所が分からない場合:

```powershell
cd C:\Users\amamiya-remo\Documents\Codex\2026-05-05\codex-v-mvp-0-web-v
npm install
npm run dev
```

## ビルド

```bash
npm run build
```

静的ファイルは `dist/` に出力されます。

## サイトの独自性

このサイトの価値は、公式リンク集ではなく「当日どう動けばいいか」を会場ごとに整理することです。

- 荷物がある日はどこへ預けるか
- 良番の日に先に何を済ませるか
- 物販後に荷物が増えたらどうするか
- 雨の日はどこで待つか
- ぼっち参戦で困りやすい点は何か
- 終演後に急ぐ日は何を先に回収するか

公式情報だけでは分かりにくい実用判断を、会場公式、会場FAQ、個人ブログ、note、参戦レポ、Q&A、SNSの要点から整理します。ただし、個人ブログや参戦レポの本文はコピーせず、要点だけを独自表現に変換します。

## 公演情報を転載しない方針

このサイトでは以下を登録・転載しません。

- 公演名
- 出演者
- 日程
- 開場/開演時間
- 受付状況
- チケット状況
- チケットサイト掲載文
- 告知画像
- アーティスト写真
- 公式ロゴ

これらは変更が早く、権利面でもリスクがあります。最新情報は公式サイト、チケットサイト、会場公式スケジュールへ誘導します。

## 会場データ

会場データは `data/venues.json` で管理します。全国のV系ライブで使われることがある会場マスターを持ち、会場名、表記ゆれ、地域、都道府県、エリア、会場分類、V系利用傾向、情報確度を登録します。

主な項目:

- `slug`: URL用ID
- `name`: 会場名
- `aliases`: 表記ゆれ
- `prefecture`: 都道府県
- `region`: 地域
- `area`: エリア
- `status`: `active`, `closed`, `unknown`
- `venueType`: `small_livehouse`, `mid_livehouse`, `large_livehouse`, `hall`, `theater`, `outdoor_stage`, `event_space`, `closed_archive`, `unknown`
- `venueScale`: `small`, `small-mid`, `mid`, `large`, `unknown`
- `vkeiAffinity`: `high`, `medium`, `low`, `unknown`
- `minorVkeiFriendly`: 若手V系・マイナーV系向きなら `true`
- `sourceConfidence`: 情報確度
- `sourceType`: 参照元の種類
- `officialUrl`: 会場公式URL。未確認なら空文字
- `lastVerifiedAt`: 会場情報の最終確認日
- `showInVenueList`: 現役一覧に出すか
- `archiveOnly`: 閉館済み・過去会場アーカイブか
- `tipTags`: 注意タグ

## ロッカー・クローク・周辺情報

抽象的な「ロッカー危険度」だけでは判断できないため、以下の事実ベース項目で管理します。

### `lockerInfo`

- `venueLockerStatus`: `available`, `none`, `limited`, `unknown`
- `venueLockerText`: 会場内ロッカーの説明
- `lockerCountText`: 個数感。不明なら未確認
- `beforeEntryUse`: 開場前利用の可否
- `afterEntryUse`: 開場後利用の可否
- `coinNeeded`: 小銭が必要か
- `largeBagFit`: 大荷物が入るか
- `sourceConfidence`: `official`, `blog_report`, `mixed`, `unknown`
- `lastCheckedAt`: 確認日

### `cloakInfo`

- `cloakStatus`: `available`, `none`, `event_dependent`, `unknown`
- `cloakText`: クロークの説明
- `priceText`: 料金情報。不明なら未確認
- `timingText`: 受付タイミング
- `bagTypeText`: 袋形式などの補足
- `sourceConfidence`: `official`, `blog_report`, `mixed`, `unknown`
- `lastCheckedAt`: 確認日

### `baggageGuide`

荷物別の当日判断です。

- `smallBag`
- `backpack`
- `suitcase`
- `afterMerch`
- `goodTicketNumber`

### `nearbyInfo`

会場周辺の実用情報です。

- `nearestConvenienceStore`
- `stationLocker`
- `waitingSpot`
- `rainShelter`
- `restroomBeforeEntry`
- `cashAndCoin`
- `afterShowRoute`
- `nightSafety`

## 個人ブログ・参戦レポの扱い

個人ブログ、note、参戦レポ、Q&A、SNS由来の情報は、本文をコピーせず、以下のように管理します。

### `blogResearch`

- `status`: `researched`, `partial`, `not_found`, `not_started`
- `checkedAt`: 調査日
- `searchQueries`: 検索した語句
- `summary`: 全体傾向の独自要約
- `confidence`: `high`, `medium`, `low`, `unknown`

### `blogSignals`

個別ソースから読み取れる傾向です。文章コピーはせず、要点だけを短く整理します。

- `topic`: `locker`, `cloak`, `baggage`, `waiting`, `access`, `restroom`, `aftershow` など
- `summary`: 独自表現の要約
- `sourceType`: `personal_blog`, `note`, `sns`, `q_and_a`, `mixed`, `unknown`
- `confidence`: `high`, `medium`, `low`, `unknown`
- `sourceName`
- `sourceUrl`
- `checkedAt`
- `copyrightNote`

公式情報と個人ブログ情報が矛盾する場合は公式情報を優先します。古い記事や単発の体験談は断定せず、`confidence: "low"` または `partial` として扱います。

## 当日判断データ

会場詳細ページでは `dayDecisionGuide` を使い、次の状況別に表示します。

- `baggageDay`: 荷物ありの日
- `goodNumberDay`: 良番の日
- `merchDay`: 物販ありの日
- `rainDay`: 雨の日
- `soloDay`: ぼっち参戦の日
- `rushAfterShowDay`: 終演後に急ぐ日

「要確認です」だけで終わらせず、「こう動けばOK」と分かる表現にします。

## データ更新スクリプト

全国会場マスターの追加:

```bash
node scripts/merge-national-venues.mjs
```

公式確認済みの会場設備メモを反映:

```bash
node scripts/apply-official-venue-facts.mjs
```

個人ブログ・会場情報サイト・レビュー系ページから要点メモを反映:

```bash
node scripts/apply-community-venue-notes.mjs
```

実用コメントと当日の動き方を反映:

```bash
node scripts/apply-practical-venue-guides.mjs
```

ロッカー、クローク、周辺情報、blogResearch、dayDecisionGuideを補完:

```bash
node scripts/apply-logistics-and-blog-research.mjs
```

スクリプトを実行する前に、参照元URL、確認日、情報確度を必ず確認してください。

## 閉館済み会場

閉館済み会場は現役一覧には表示しません。

```json
{
  "status": "closed",
  "showInVenueList": false,
  "archiveOnly": true
}
```

必要な場合だけアーカイブページとして扱います。

## /venues の検索機能

`/venues` はスマホ向けの会場検索ページです。

- 会場名、aliases、エリア、都道府県、地域、駅名、注意タグで検索できます
- 地域、都道府県、会場種別、V系向き度、注意タグで絞り込めます
- 複数条件を同時に使えます
- 検索条件はURLクエリに反映されます
- デフォルトでは閉館済み会場を表示しません

対応クエリ:

- `q`
- `region`
- `prefecture`
- `type`
- `affinity`
- `tag`
- `sort`
- `archive`

## /venues/regions

`/venues/regions` は全国会場マスターを地域別に見るページです。地域、都道府県、会場名、会場種別、V系向き度、マイナーV系向き、詳細ページリンクを表示します。公演情報、出演者、日程、チケット状況は掲載しません。

## ガイド記事の追加

Markdown記事は `src/pages/guides/` に追加します。

```md
---
layout: ../../layouts/GuideMarkdownLayout.astro
title: "記事タイトル"
pageTitle: "ページ見出し"
description: "SEO用説明文"
lead: "ページ冒頭の説明"
---

## 見出し
本文を書きます。
```

チェックリストや計算ツールなどブラウザ内UIが必要なページは `.astro` で作成します。

## 外部リンクの追加

`/weekend` の公式リンク集は `src/pages/weekend.astro` の `ticketLinks` に追加します。会場ごとの公式・チケット確認リンクは `data/venues.json` の `ticketSearchLinks` や `sourceLinks` に追加します。

外部リンクは公式・準公式・会場公式スケジュールへの案内に限定し、公演名、出演者、日程、販売状況を転載しません。

## デザイン方針

デザインは耽美ゴシック・クラシカルV系の方向性です。

- 黒
- ワインレッド
- ダークネイビー
- アンティークゴールド
- アイボリー
- 細い金線
- 額縁風カード
- 劇場パンフレット風の見出し

特定アーティストのロゴ、画像、歌詞、衣装、アートワーク、固有デザインは使用しません。

## Cloudflare Pages 公開

1. GitHubにリポジトリをpushします。
2. Cloudflare PagesでGitHubリポジトリを接続します。
3. Framework presetは `Astro` を選びます。
4. Build commandは `npm run build` にします。
5. Build output directoryは `dist` にします。
6. 本番URLが決まったら `astro.config.mjs` の `site` を確認します。

このMVPではCloudflare PagesでCSSアセット欠落による表示崩れが起きにくいよう、`astro.config.mjs` で `build.inlineStylesheets: "always"` を設定しています。

## GitHub Pages 注意

GitHub Pagesでも静的サイトとして公開できます。リポジトリ名配下で公開する場合は、Astroの `base` 設定が必要になることがあります。初期運用はCloudflare Pagesの方が設定が少なく、MVP向きです。

## 今後追加できる機能

- 会場データの追加
- 地域別おすすめ導線
- 閉館済み会場のアーカイブ一覧
- 遠征チェック用の手動メモ欄
- 雨の日持ち物チェック
- 遠征費テンプレート保存
- Googleフォームによる掲載依頼・情報修正依頼
- Cloudflare Pages公開後のサイト更新フロー

## 主なページ

- `/`
- `/weekend`
- `/venues`
- `/venues/regions`
- `/venues/types`
- `/guides/livehouse-tips`
- `/guides/beginner`
- `/guides/small-venue`
- `/guides/belongings`
- `/guides/solo`
- `/tools/budget`
- `/about`
- `/disclaimer`
