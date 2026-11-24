# 世界の気温マップ(Astro 版)

世界の主要都市の現在の気温を地図で見られるサイトです。都市ごとのページでは、月別の平均気温と服装の目安も確認できます。

- フレームワーク: [Astro](https://astro.build/)(静的サイト生成)
- 地図: Leaflet + OpenStreetMap
- 気温データ: [Open-Meteo](https://open-meteo.com/)(APIキー不要)
- ホスティング: Cloudflare Pages(GitHub Actions からデプロイ)

## ローカルで動かす

Node.js 22 以上が必要です。

```
npm install
npm run fetch-climate   # 月別平均気温を取得(初回と、都市を追加したとき)
npm run dev
```

## 構成

| 場所 | 役割 |
| --- | --- |
| `src/data/cities.json` | 都市の一覧。`featured: true` の都市だけ個別ページが作られる |
| `src/data/climate.json` | 月別平均気温(`npm run fetch-climate` で自動生成) |
| `src/pages/index.astro` | トップページ(地図 + 都市ページへのリンク) |
| `src/pages/city/[slug].astro` | 都市ページ(現在の気温・月別平均・服装の目安) |
| `src/layouts/Base.astro` | 共通レイアウト(title / meta / OGP / フッター) |

## 都市ページを増やす

1. `cities.json` の都市に `"featured": true` と `"summary"`(その都市ならではの説明文)を追加する。
2. `npm run fetch-climate` を実行して、月別平均気温を取得する。
3. push する。

説明文(`summary`)は、**その都市に固有の内容**を書くほど検索で評価されやすくなります。
全都市を一度にページ化すると内容が薄くなりがちなので、少しずつ増やすのがおすすめです。

## 公開前に変更するところ

- `astro.config.mjs` の `site`
- `public/robots.txt` の Sitemap の URL
- `.github/workflows/deploy.yml` の `--project-name=world-temp-map`(Cloudflare Pages のプロジェクト名)

## Cloudflare Pages へのデプロイ(初回のみ)

1. GitHub に push する(ブランチ名は `main`)。
2. Cloudflare ダッシュボードで API トークンを作成する(権限: **Account > Cloudflare Pages > Edit**)。
3. Cloudflare の **Account ID** を控える。
4. GitHub リポジトリの *Settings > Secrets and variables > Actions* に登録する
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
5. `main` に push すると自動でデプロイされる。

## 公開後にやること

- [Google Search Console](https://search.google.com/search-console) にサイトを登録し、`sitemap-index.xml` を送信する。

## 利用上の注意

- Open-Meteo の無料利用は非商用向けです。公開前に最新の利用規約を確認してください。
- 地図右下の OpenStreetMap と Open-Meteo の表記は削除しないでください。
- OpenStreetMap の公式タイルサーバーは大量アクセス向けではありません。アクセスが増えたら、別のタイル提供元を検討してください。
