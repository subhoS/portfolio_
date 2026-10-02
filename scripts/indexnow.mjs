#!/usr/bin/env node
// Notifies IndexNow search engines (Bing, Yandex, Seznam, Naver and others) about every URL in the sitemap.
// Run after a deploy: npm run indexnow   (override the site with SITE_URL=https://... if needed)
const KEY = "9766f587a8c58757bdc34d1be00dede5"; // must match public/9766f587a8c58757bdc34d1be00dede5.txt
const site = (
  process.env.SITE_URL || "https://www.subhadeepdatta.page"
).replace(/\/$/, "");
const host = new URL(site).host;

const fail = (msg) => {
  console.error(`IndexNow: ${msg}`);
  process.exit(1);
};

// 1. The live sitemap must list URLs on exactly this host, or IndexNow rejects the batch.
const sitemapRes = await fetch(`${site}/sitemap.xml`);
if (!sitemapRes.ok)
  fail(
    `could not fetch ${site}/sitemap.xml (HTTP ${sitemapRes.status}). Is the site deployed?`,
  );
const urlList = [
  ...(await sitemapRes.text()).matchAll(/<loc>([^<]+)<\/loc>/g),
].map((m) => m[1].trim());
if (urlList.length === 0) fail(`${site}/sitemap.xml has no URLs.`);

const foreign = urlList.filter((u) => new URL(u).host !== host);
if (foreign.length > 0) {
  fail(`${foreign.length} of ${urlList.length} sitemap URLs are not on ${host}, e.g. ${foreign[0]}
The live site was built with a different SITE_URL. Fix it in Vercel and redeploy:
  vercel env rm SITE_URL production     # the code already defaults to ${site}
  vercel --prod`);
}

// 2. The key file must be live, or IndexNow can't verify ownership.
const keyRes = await fetch(`${site}/${KEY}.txt`);
const keyText = keyRes.ok ? (await keyRes.text()).trim() : "";
if (keyText !== KEY)
  fail(
    `key file ${site}/${KEY}.txt is missing or wrong (HTTP ${keyRes.status}). Deploy the latest main first.`,
  );

// 3. Submit.
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host,
    key: KEY,
    keyLocation: `${site}/${KEY}.txt`,
    urlList,
  }),
});
const meaning = {
  200: "OK",
  202: "accepted (key validation pending)",
  400: "bad request",
  403: "key not valid",
  422: "URLs don't match the host or key",
  429: "too many requests, try again later",
}[res.status];
console.log(
  `IndexNow: submitted ${urlList.length} URLs for ${host} → HTTP ${res.status} ${meaning ?? ""}`,
);
const body = (await res.text()).trim();
if (body) console.log(body);
if (res.status !== 200 && res.status !== 202) process.exit(1);
