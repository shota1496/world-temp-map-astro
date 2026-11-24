// 都市ページ用の「月別平均気温」を Open-Meteo の過去データから計算して src/data/climate.json に保存する。
//   使い方: npm run fetch-climate
// 2015〜2024年の日平均気温を月ごとに平均する。取得に失敗した都市は、既存の値をそのまま残す。
import { readFile, writeFile } from "node:fs/promises";

const START = "2015-01-01";
const END = "2024-12-31";
const CITIES_PATH = new URL("../src/data/cities.json", import.meta.url);
const CLIMATE_PATH = new URL("../src/data/climate.json", import.meta.url);

const cities = JSON.parse(await readFile(CITIES_PATH, "utf8")).filter((c) => c.featured);
let climate = {};
try {
  climate = JSON.parse(await readFile(CLIMATE_PATH, "utf8"));
} catch {
  // 初回は空から始める
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ok = 0;
let failed = 0;

for (const city of cities) {
  const url =
    "https://archive-api.open-meteo.com/v1/archive" +
    `?latitude=${city.lat}&longitude=${city.lon}` +
    `&start_date=${START}&end_date=${END}&daily=temperature_2m_mean&timezone=auto`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { daily } = await res.json();

    const sum = new Array(12).fill(0);
    const count = new Array(12).fill(0);
    daily.time.forEach((date, i) => {
      const v = daily.temperature_2m_mean[i];
      if (v == null) return;
      const m = Number(date.slice(5, 7)) - 1;
      sum[m] += v;
      count[m] += 1;
    });
    if (count.some((n) => n === 0)) throw new Error("データが不足している月があります");

    climate[city.slug] = sum.map((s, m) => Math.round((s / count[m]) * 10) / 10);
    ok += 1;
    console.log(`OK   ${city.name}`);
  } catch (e) {
    failed += 1;
    console.warn(`SKIP ${city.name}: ${e.message}`);
  }
  await sleep(1000); // API に負荷をかけすぎない
}

await writeFile(CLIMATE_PATH, JSON.stringify(climate, null, 2) + "\n");
console.log(`完了: 成功 ${ok} / 失敗 ${failed}`);
