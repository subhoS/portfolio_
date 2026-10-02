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
].map((m) => m[1].replace(/\s+/g, "").replace(/&amp;/g, "&"));
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

// 3. Submit. If IndexNow rejects the batch, split it in half until the bad URLs are isolated.
const submit = (list) =>
  fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key: KEY,
      keyLocation: `${site}/${KEY}.txt`,
      urlList: list,
    }),
  });

const rejected = [];
let accepted = 0;
async function send(list) {
  const res = await submit(list);
  if (res.status === 200 || res.status === 202) {
    accepted += list.length;
    return;
  }
  const body = (await res.text()).trim();
  if (res.status !== 400 || list.length === 1) {
    rejected.push(
      ...list.map((u) => `${JSON.stringify(u)} → HTTP ${res.status} ${body}`),
    );
    return;
  }
  const mid = Math.ceil(list.length / 2);
  await send(list.slice(0, mid));
  await send(list.slice(mid));
}

await send(urlList);
console.log(
  `IndexNow: ${accepted} of ${urlList.length} URLs accepted for ${host}.`,
);
if (rejected.length > 0) {
  console.log(`Rejected:\n- ${rejected.join("\n- ")}`);
  process.exit(1);
}
