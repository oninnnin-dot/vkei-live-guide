#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const targetDir = process.argv[2] || "dist";

const bannedPatterns = [
  { label: "個人ブログ", pattern: /個人ブログ/g },
  { label: "note", pattern: /(^|[^A-Za-z])note($|[^A-Za-z])|note\.com/gi },
  { label: "SNS", pattern: /SNS/g },
  { label: "参戦レポ", pattern: /参戦レポ/g },
  { label: "外部会場情報", pattern: /外部会場情報/g },
  { label: "ブログ由来", pattern: /ブログ由来/g },
  { label: "個人解説", pattern: /個人解説/g },
  { label: "転載", pattern: /転載/g },
  { label: "引用", pattern: /引用/g }
];

const awkwardValuePatterns = [
  { label: "小銭・100円玉の近くに「いいえ」", pattern: /小銭・100円玉[\s\S]{0,160}いいえ/g },
  { label: "大型荷物の近くに「いいえ」", pattern: /大型荷物[\s\S]{0,160}いいえ/g },
  { label: "現金必要の近くに「いいえ」", pattern: /現金必要[\s\S]{0,160}いいえ/g },
  { label: "開場前利用の近くに「いいえ」", pattern: /開場前利用[\s\S]{0,160}いいえ/g },
  { label: "開場後利用の近くに「いいえ」", pattern: /開場後利用[\s\S]{0,160}いいえ/g },
  { label: "駅ロッカー推奨の近くに「はい」だけの直訳", pattern: /駅ロッカー推奨[\s\S]{0,120}はい/g },
  { label: "情報確度の近くに「はい」", pattern: /情報確度[\s\S]{0,120}はい/g },
  { label: "情報確度の近くに「いいえ」", pattern: /情報確度[\s\S]{0,120}いいえ/g },
  { label: "出典区分の近くに「はい」", pattern: /出典区分[\s\S]{0,120}はい/g },
  { label: "出典区分の近くに「いいえ」", pattern: /出典区分[\s\S]{0,120}いいえ/g },
  { label: "確認日の近くに「はい」", pattern: /確認日[\s\S]{0,120}はい/g },
  { label: "確認日の近くに「いいえ」", pattern: /確認日[\s\S]{0,120}いいえ/g }
];

const textExt = new Set([".html", ".css", ".json", ".txt", ".xml", ".svg"]);
// JSはビルド時にデータキー名や検査語配列を含むことがあるため、初期設定では除外。
// 公開HTMLに埋め込まれる場合は .html / .json 側で検出する。
if (process.env.CHECK_JS_PUBLIC_TEXT === "1") {
  textExt.add(".js");
}

let errors = [];

function walk(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`対象ディレクトリがありません: ${dir}`);
    process.exit(1);
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (textExt.has(path.extname(entry.name))) {
      const body = fs.readFileSync(full, "utf8");
      for (const item of bannedPatterns) {
        item.pattern.lastIndex = 0;
        if (item.pattern.test(body)) {
          errors.push(`${full}: ${item.label}`);
        }
      }
      for (const item of awkwardValuePatterns) {
        item.pattern.lastIndex = 0;
        if (item.pattern.test(body)) {
          errors.push(`${full}: ${item.label}`);
        }
      }
    }
  }
}

walk(targetDir);

if (errors.length) {
  console.error("公開禁止語が検出されました。");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`OK: no banned public words in ${targetDir}.`);
