# V系ライブ遠征ナビ

ライブ情報は公式で探す。小箱の不安はここで消す。

V系ライブに行く前に確認したい、ライブハウス周辺情報、ロッカー、待機場所、コンビニ、終演後の帰り方、初参戦の不安、遠征費をまとめる静的WebサイトMVPです。若手V系・マイナーV系・地下寄りイベントで使われる小さめのライブハウスにも対応します。

## 技術構成

- Astro
- TypeScript
- Tailwind CSS
- Markdown
- JSON
- @astrojs/sitemap

外部DB、外部API、CMS、WordPress、スクレイピング、X API、Google Maps APIは使いません。

## ローカル起動方法

```bash
npm install
npm run dev
```

Windowsで作業場所が分からない場合は、先にこのフォルダへ移動します。

```powershell
cd C:\Users\amamiya-remo\Documents\Codex\2026-05-05\codex-v-mvp-0-web-v
npm install
npm run dev
```

## ビルド方法

```bash
npm run build
```

静的ファイルは `dist/` に出力されます。

## 小箱・マイナーV系会場も扱う方針

このサイトは大きな会場だけでなく、若手V系、マイナーV系、地下寄りイベントで使われる小箱も扱います。

ただし、当サイトの価値は公演情報の網羅ではありません。公演情報は公式サイト、チケットサイト、会場公式スケジュールで確認してもらい、当サイトではロッカー、待機場所、コンビニ、雨の日、夜の帰り道、初参戦、ぼっち参戦、遠征費を整理します。

## Grok/X由来会場の扱い

Grok/X由来で候補にした会場は `grokSuggested: true` で管理します。SNS上の言及だけで十分に確認できていない場合は、`sourceConfidence: "social_only"` または `sourceConfidence: "partially_verified"` にします。

公式サイト、会場公式スケジュール、チケットサイトなどで確認できたら `sourceConfidence: "verified"` に更新し、`lastVerifiedAt` も更新します。X由来・SNS由来の情報は未確定の可能性があるため、本文では断定せず「要確認」「事前確認推奨」を使います。

ライブハウスではない会場は `venueType` で分類します。小箱ライブハウス、大型ライブハウス、ホール、屋外ステージ、イベントスペースを同列に扱わず、ページ上でも会場種別と情報確度を表示します。

## 会場データの追加方法

会場データは `data/venues.json` で管理します。

新しい会場を追加するときは、以下を入れてください。

- `slug`: URLに使う英数字
- `name`: 会場名
- `area`: エリア
- `status`: `active`, `closed`, `unknown`
- `venueType`: `small_livehouse`, `mid_livehouse`, `large_livehouse`, `hall`, `theater`, `outdoor_stage`, `event_space`, `closed_archive`, `unknown`
- `venueScale`: `small`, `small-mid`, `mid`, `large`, `unknown`
- `vkeiAffinity`: `high`, `medium`, `low`, `unknown`
- `minorVkeiFriendly`: 若手V系・マイナーV系向きなら `true`
- `sourceConfidence`: `verified`, `partially_verified`, `social_only`, `unknown`
- `sourceType`: `official`, `ticket_site`, `social`, `mixed`, `unknown`
- `sourceMemo`: 情報確認や分類のメモ
- `grokSuggested`: Grok/X由来候補なら `true`
- `currentUseNote`: 現在の扱い。ライブハウス以外は特に明記
- `vkeiUseType`: `minor_vkei`, `vkei_regular`, `vkei_occasional`, `release_event`, `large_scale`, `copy_band`, `related_event`, `unknown`
- `areaGroup`: `tokyo_shibuya` などのエリア分類
- `priority`: `A`, `B`, `C`, `D`
- `tips`: 会場別の豆知識配列
- `warnings`: 設備・運用変更に関する注意文
- `preCheckItems`: 初参戦前に確認する項目
- `lockerStrategy`, `cloakStrategy`, `baggageStrategy`: 荷物・ロッカー・クローク攻略
- `drinkStrategy`, `entryStrategy`, `merchStrategy`, `returnStrategy`, `soloStrategy`, `beginnerStrategy`: 入場、物販、帰宅、ぼっち参戦、初参戦の戦略メモ
- `cashNote`, `coinNote`, `restroomNote`, `signalNote`, `stairsNote`, `neighborhoodNote`, `photographyNote`, `reentryNote`: 細かい注意点
- `lastTipVerifiedAt`: 豆知識データの最終確認日
- `tipTags`: 一覧フィルターやカード表示に使う注意タグ
- `station`: 最寄り駅
- `walkMinutes`: 徒歩目安
- `officialUrl`: 会場公式ページ。不明なら空文字
- `lastVerifiedAt`: 会場情報を最後に確認した日
- `showInVenueList`: 現役一覧に出すなら `true`
- `archiveOnly`: 閉館済み・過去会場なら `true`
- `beginnerFriendly`, `soloFriendly`, `lockerRisk`, `returnDifficulty`: 1から5のスコア
- `nightSafetyNote`: 夜の帰り道
- `lockerNote`: ロッカー情報
- `baggageNote`: 荷物対策
- `convenienceNote`: コンビニ情報
- `waitingNote`: 開場前の待機注意
- `rainNote`: 雨の日対策
- `returnNote`: 終演後の帰宅
- `beginnerNote`: 初参戦向け注意
- `ticketSearchLinks`: 公式・準公式チケット確認リンク
- `sourceNotes`: 公式URL確認や要確認事項

追加すると `/venues` と `/venues/{slug}` が自動生成されます。

豆知識関連の初期値は `scripts/apply-venue-tips.mjs` で整備しています。会場を増やした後に同じ形式へそろえる場合は、内容を確認してから以下を実行します。

```bash
node scripts/apply-venue-tips.mjs
```

共通のライブハウス豆知識は `src/data/commonTips.ts` で管理します。会場別の `tips` は、公式・個人ブログ・SNS・Q&Aの文章をコピーせず、要点を独自表現に変換して登録します。

## status と archiveOnly 管理

現役会場は以下にします。

```json
{
  "status": "active",
  "showInVenueList": true,
  "archiveOnly": false
}
```

閉館済み会場や過去の聖地は以下にします。

```json
{
  "status": "closed",
  "showInVenueList": false,
  "archiveOnly": true
}
```

`showInVenueList: false` の会場は、現役会場一覧、エリア別一覧、トップページのおすすめ会場には表示しません。

閉館済み会場は `status: "closed"`, `archiveOnly: true`, `showInVenueList: false` にします。横浜CLUB24のような過去会場は、現役会場一覧には出さず、必要な場合だけアーカイブ扱いでページを残します。

## lastVerifiedAt の更新運用

会場公式サイト、会場公式スケジュール、アクセス情報、ロッカー・クローク案内を確認したら `lastVerifiedAt` を更新します。

小箱会場は設備、待機ルール、ドリンク代、クローク運用が変わりやすいため、確認日が古い場合は断定表現を避け、「事前確認推奨」「変更の可能性あり」と書いてください。

## ガイド記事の追加方法

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

チェックリストや計算ツールのようなブラウザ内UIが必要なページは `.astro` で作成します。

## 外部リンクの追加方法

`/weekend` の公式リンク集は `src/pages/weekend.astro` の `ticketLinks` に追加します。

会場ごとのチケット確認リンクは `data/venues.json` の `ticketSearchLinks` に追加します。

外部リンクは公式・準公式の確認導線に限定し、公演名、日程、出演者、販売状況を大量転載しません。

新しい会場を追加するときは、まず `venueType` と `sourceConfidence` を決めます。小箱会場は待機場所・ロッカー・夜道の情報が変わりやすいため、未確認の店舗名や設備名は断定せず、公式リンクと `sourceNotes` に確認状況を残します。

## 豆知識・注意点データの運用方針

会場別の豆知識は、参戦準備に使う独自データとして管理します。他サイト、公式注意事項、SNS、Q&Aの文章はコピーせず、要点だけを短く言い換えます。

- 公式確認済みの設備情報でも、公演ごとに変わる可能性があるため断定しすぎない
- 未確認情報は `sourceConfidence: "social_only"` または `"partially_verified"` にする
- `lastTipVerifiedAt` を更新し、確認日が古い場合は「要確認」と表示する
- 公演名、出演者、日程、チケット状況は転載せず、公式リンクへ誘導する
- 画像、ロゴ、アーティスト写真は使わない

## 公演情報を転載しない理由

公演日、出演者、開場/開演時間、チケット状況は頻繁に変わります。チケットサイトや会場公式の掲載文を転載すると、古い情報を残したり、著作権・利用規約上のリスクを生んだりします。

そのため、このサイトでは公演情報をコピーせず、公式・準公式リンクへ案内します。

## 公演情報を転載しない運用方針

このサイトでは以下を行いません。

- チケットサイトのスクレイピング
- 公演情報の自動取得
- X API投稿
- 外部有料API
- 外部DB利用
- アーティスト写真、公式ロゴ、ライブ告知画像の無断利用
- チケットサイト掲載文のコピー
- 公演情報の正確性保証

公演情報、チケット情報、出演者、開場/開演時間、販売状況は必ず公式サイト、主催、会場公式スケジュール、チケット販売ページで確認してください。

## Cloudflare Pagesへの公開方法

1. GitHubにこのリポジトリを作成して push します。
2. Cloudflare PagesでGitHubリポジトリを接続します。
3. Framework preset は `Astro` を選びます。
4. Build command は `npm run build` にします。
5. Build output directory は `dist` にします。
6. 公開URLが決まったら `astro.config.mjs` の `site` を本番URLに変更します。

## GitHub Pagesで公開する場合の注意

GitHub Pagesでも静的サイトとして公開できます。

- リポジトリ名配下で公開する場合は、Astroの `base` 設定が必要になることがあります。
- カスタムドメインを使う場合は `astro.config.mjs` の `site` を本番URLに変更してください。
- GitHub Actionsで `npm run build` を実行し、`dist/` をPagesへデプロイする構成にします。

初回はCloudflare Pagesの方が設定が少なく、MVP向きです。

## 今後追加できる機能

- 会場データの追加
- 小箱会場のエリア別まとめ
- 閉館済み会場のアーカイブ一覧
- 終電チェック用の手動メモ欄
- 雨の日持ち物の追加チェック
- 遠征費テンプレートの保存
- Googleフォームによる問い合わせ・掲載依頼導線
- Cloudflare Pages公開後のサイトマップ送信

## 主なページ

- `/`
- `/weekend`
- `/venues`
- `/venues/types`
- `/guides/livehouse-tips`
- `/venues/ikebukuro-edge`
- `/venues/ikebukuro-blackhole`
- `/venues/sugamo-shishio`
- `/venues/shinjuku-club-science`
- `/venues/shinjuku-heist`
- `/venues/wildside-tokyo`
- `/venues/higashi-koenji-20000v`
- `/guides/beginner`
- `/guides/small-venue`
- `/guides/belongings`
- `/guides/solo`
- `/tools/budget`
- `/about`
- `/disclaimer`
