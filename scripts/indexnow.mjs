#!/usr/bin/env node
// Notifies IndexNow search engines (Bing, Yandex, Seznam, Naver and others) about every URL in the sitemap.
// Run after a deploy: SITE_URL=https://subhadeep-datta.dev npm run indexnow
const KEY = "9766f587a8c58757bdc34d1be00dede5"; // must match public/9766f587a8c58757bdc34d1be00dede5.txt
const site = (process.env.SITE_URL || "https://subhadeep-datta.dev").replace(
  /\/$/,
  "",
);

const sitemap = await (await fetch(`${site}/sitemap.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(site).host,
    key: KEY,
    keyLocation: `${site}/${KEY}.txt`,
    urlList,
  }),
});
console.log(`IndexNow: submitted ${urlList.length} URLs, status ${res.status}`);
if (!res.ok && res.status !== 202) process.exit(1);
