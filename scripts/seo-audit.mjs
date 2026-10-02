#!/usr/bin/env node
// Crawls every URL in the sitemap of a running site and flags common SEO problems.
// Usage: node scripts/seo-audit.mjs [http://localhost:3000]
const origin = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");

const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const siteBase = new URL(urls[0]).origin;
const toLocal = (u) => u.replace(siteBase, origin);

const problems = [];
const internalLinks = new Set();
const flag = (url, msg) =>
  problems.push(`${url.replace(siteBase, "")}: ${msg}`);
const attr = (html, re) => html.match(re)?.[1]?.replace(/&amp;/g, "&");

for (const url of urls) {
  const res = await fetch(toLocal(url));
  if (res.status !== 200) {
    flag(url, `status ${res.status}`);
    continue;
  }
  const html = await res.text();

  const title = attr(html, /<title>([^<]*)<\/title>/);
  const desc = attr(html, /<meta name="description" content="([^"]*)"/);
  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
  const ogImage = attr(html, /<meta property="og:image" content="([^"]*)"/);
  const h1s = html.match(/<h1[\s>]/g)?.length ?? 0;

  if (!title) flag(url, "missing <title>");
  else if (title.length > 70)
    flag(url, `title is ${title.length} chars (>70): ${title}`);
  if (!desc) flag(url, "missing meta description");
  else if (desc.length < 50 || desc.length > 165)
    flag(url, `description is ${desc.length} chars`);
  if (canonical !== url && canonical !== url.replace(/\/$/, ""))
    flag(url, `canonical mismatch: ${canonical}`);
  if (!ogImage) flag(url, "missing og:image");
  if (h1s !== 1) flag(url, `${h1s} <h1> elements`);
  if (/name="robots" content="[^"]*noindex/.test(html))
    flag(url, "is in sitemap but noindex");

  for (const m of html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  )) {
    try {
      JSON.parse(m[1]);
    } catch {
      flag(url, "invalid JSON-LD");
    }
  }
  for (const m of html.matchAll(/<img [^>]*>/g)) {
    if (!/ alt="/.test(m[0]))
      flag(url, `image without alt: ${m[0].slice(0, 80)}`);
  }
  for (const m of html.matchAll(/href="(\/[^"#]*)/g)) internalLinks.add(m[1]);
}

for (const path of internalLinks) {
  const res = await fetch(`${origin}${path}`, { redirect: "manual" });
  if (res.status >= 400)
    problems.push(`broken internal link: ${path} (${res.status})`);
}

console.log(
  `Audited ${urls.length} URLs and ${internalLinks.size} internal links.`,
);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
console.log("No problems found.");
