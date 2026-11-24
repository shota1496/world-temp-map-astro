import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  // 公開URLに合わせて変更してください(sitemap・canonical・OGP に使われます)
  site: "https://world-temp-map.pages.dev",
  integrations: [sitemap()],
});
