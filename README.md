# V系ライブ遠征ナビ

ライブ情報は公式で探す。小箱の不安はここで消す。

「V系ライブ遠征ナビ」は、公演情報を網羅するサイトではありません。V系ライブ当日に困りやすい会場周辺、荷物、ロッカー、クローク、待機場所、雨の日、終演後の帰り方を整理する静的Webサイトです。

## 技術構成

- Astro
- TypeScript
- Tailwind CSS
- Markdown
- JSON
- @astrojs/sitemap
- Cloudflare Pages または GitHub Pages

外部DB、外部API、CMS、WordPress、スクレイピング、X API、Google Maps APIは使いません。

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

ビルド成果物は `dist/` に出力されます。

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
- アーティスト画像
- 公式ロゴ

最新の公演情報は、公式サイト、チケットサイト、会場公式スケジュール、主催者告知、当日案内で確認する運用です。

## サイトの独自性

このサイトの価値は、公式リンク集ではなく「当日どう動けばいいか」を会場ごとに整理する点です。

- 荷物がある日はどこへ預けるか
- 良番の日に先に済ませること
- 物販後に荷物が増える場合の動き
- 雨の日に待ちやすい場所
- 会場前で長く待ってよいか
- 終演後に急ぐ日の回収順
- ぼっち参戦で困りやすい点

## 会場データ

会場データは `data/venues.json` で管理します。

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
- `sourceConfidence`: 会場存在情報の確度
- `lastVerifiedAt`: 会場情報の最終確認日
- `showInVenueList`: 現役一覧に表示するか
- `archiveOnly`: 閉館済み・過去会場アーカイブ扱いか

閉館済み会場は以下のように管理します。

```json
{
  "status": "closed",
  "showInVenueList": false,
  "archiveOnly": true
}
```

## ロッカー・クローク・周辺情報

抽象的な「危険度」だけでは判断できないため、以下の事実ベース項目で管理します。

### `lockerInfo`

- `venueLockerStatus`: `available`, `none`, `limited`, `unknown`
- `venueLockerText`: 会場内ロッカーの説明
- `lockerCountText`: 個数感。不明なら未確認
- `beforeEntryUse`: 開場前利用の可否
- `afterEntryUse`: 開場後利用の可否
- `coinNeeded`: 小銭が必要か
- `largeBagFit`: 大型荷物が入るか
- `stationLockerRecommended`: 駅ロッカー推奨か
- `bestMove`: 荷物がある日の具体的な動き
- `sourceConfidence`: `official`, `mixed`, `blog_report`, `sns_report`, `unknown`
- `lastCheckedAt`: 確認日

### `cloakInfo`

- `cloakStatus`: `available`, `none`, `event_dependent`, `unknown`
- `cloakText`: クロークの説明
- `priceText`: 料金情報。不明なら未確認
- `timingText`: 受付タイミング
- `bagTypeText`: 袋形式などの補足
- `bestMove`: クロークを使うべき状況
- `sourceConfidence`: `official`, `mixed`, `blog_report`, `sns_report`, `unknown`
- `lastCheckedAt`: 確認日

### `nearbyInfo`

- `nearestConvenienceStore`
- `stationLocker`
- `waitingSpot`
- `rainShelter`
- `restroomBeforeEntry`
- `cashAndCoin`
- `afterShowRoute`
- `nightSafety`

## 個人ブログ・参戦レポの扱い

個人ブログ、note、参戦レポ、Q&A、SNS由来の情報は、文章コピーせず要点だけ独自表現に変換します。

- URLは `sourceLinks` に残す
- 傾向は `blogSignals` に要約する
- 調査状況は `blogResearch` で管理する
- 公式情報と矛盾する場合は公式情報を優先する
- 古い情報や単発情報は断定しない
- 設備やクローク運用は公演・時期で変わるため、最終判断は公式・当日案内を優先する

## /venues の検索機能

`/venues` はスマホ向けの会場検索ページです。

- 会場名、aliases、エリア、都道府県、地域、駅名、注意タグで検索
- 地域、都道府県、会場種別、V系向き度、注意タグで絞り込み
- 複数条件を同時に利用可能
- URLクエリに検索条件を反映
- デフォルトでは閉館済み会場を非表示

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

`/venues/regions` は全国会場マスターを地域別に見るページです。公演情報、出演者、日程、チケット状況は掲載しません。

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

`.astro` ファイル内では Markdown の `#` / `##` / `###` を直接書かず、`<h1>` / `<h2>` / `<h3>` を使います。

## デザイン方針

耽美ゴシック・クラシカルV系の方向性です。

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

1. GitHubにリポジトリをpush
2. Cloudflare PagesでGitHubリポジトリを接続
3. Framework presetは `Astro`
4. Build commandは `npm run build`
5. Build output directoryは `dist`
6. Node.jsは `.node-version` または環境変数 `NODE_VERSION=22.16.0` で指定

Cloudflare PagesでCSS欠落による表示崩れが起きにくいよう、`astro.config.mjs` で `build.inlineStylesheets: "always"` を設定しています。

## GitHub Pages 注意

GitHub Pagesでも静的サイトとして公開できます。リポジトリ名配下で公開する場合は、Astroの `base` 設定が必要になる場合があります。初期運用はCloudflare Pages推奨です。

## 今後追加できる機能

- 会場データの追加
- 地域別おすすめ導線
- 閉館済み会場アーカイブページ
- Googleフォームによる掲載依頼・情報修正依頼
- 雨の日チェック
- 遠征費テンプレート保存
- 会場情報の更新フロー

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
