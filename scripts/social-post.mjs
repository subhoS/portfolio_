#!/usr/bin/env node
// Publishes due posts from content/social/schedule.json to LinkedIn and X, and records
// what was posted in content/social/posted.json so nothing is ever posted twice.
//
// Env (set as GitHub Actions secrets):
//   LINKEDIN_ACCESS_TOKEN, LINKEDIN_AUTHOR_URN (urn:li:person:xxxx)
//   X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET
// Flags: --dry-run prints what would be posted without calling any API.
import crypto from "node:crypto";
import fs from "node:fs";

const DRY = process.argv.includes("--dry-run");
const schedulePath = "content/social/schedule.json";
const postedPath = "content/social/posted.json";
const schedule = JSON.parse(fs.readFileSync(schedulePath, "utf8"));
const posted = JSON.parse(fs.readFileSync(postedPath, "utf8"));
const today = new Date().toISOString().slice(0, 10);
const env = process.env;

const linkedinReady = env.LINKEDIN_ACCESS_TOKEN && env.LINKEDIN_AUTHOR_URN;
const xReady = env.X_API_KEY && env.X_API_SECRET && env.X_ACCESS_TOKEN && env.X_ACCESS_SECRET;

async function postLinkedIn(text, url) {
  const res = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.LINKEDIN_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": "202509",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author: env.LINKEDIN_AUTHOR_URN,
      commentary: text.replace(/[\\|{}@[\]()<>#*_~]/g, (c) => `\\${c}`),
      visibility: "PUBLIC",
      distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
      content: { article: { source: url, title: "Read the article" } },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    }),
  });
  if (!res.ok) throw new Error(`LinkedIn HTTP ${res.status}: ${await res.text()}`);
  return res.headers.get("x-restli-id") || "ok";
}

// OAuth 1.0a signing for the X API v2 (user context).
const pct = (s) => encodeURIComponent(s).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
function oauthHeader(method, url) {
  const p = {
    oauth_consumer_key: env.X_API_KEY,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: String(Math.floor(Date.now() / 1000)),
    oauth_token: env.X_ACCESS_TOKEN,
    oauth_version: "1.0",
  };
  const params = Object.keys(p).sort().map((k) => `${pct(k)}=${pct(p[k])}`).join("&");
  const base = [method, pct(url), pct(params)].join("&");
  const signingKey = `${pct(env.X_API_SECRET)}&${pct(env.X_ACCESS_SECRET)}`;
  p.oauth_signature = crypto.createHmac("sha1", signingKey).update(base).digest("base64");
  return `OAuth ${Object.keys(p).sort().map((k) => `${pct(k)}="${pct(p[k])}"`).join(", ")}`;
}

async function postX(text) {
  const url = "https://api.x.com/2/tweets";
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: oauthHeader("POST", url), "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`X HTTP ${res.status}: ${await res.text()}`);
  return (await res.json()).data?.id ?? "ok";
}

let failures = 0;
const due = schedule.filter((p) => p.date <= today);
for (const p of due) {
  const record = (posted[p.id] ??= {});
  const jobs = [
    ["linkedin", linkedinReady, () => postLinkedIn(p.linkedin, p.url)],
    ["x", xReady, () => postX(`${p.x}\n\n${p.url}`)],
  ];
  for (const [network, ready, run] of jobs) {
    if (record[network]) continue;
    if (!ready) {
      console.log(`skip ${p.id} on ${network}: credentials not configured`);
      continue;
    }
    if (DRY) {
      console.log(`[dry-run] would post ${p.id} to ${network}`);
      continue;
    }
    try {
      const id = await run();
      record[network] = { at: new Date().toISOString(), id };
      console.log(`posted ${p.id} to ${network} (${id})`);
    } catch (err) {
      failures += 1;
      console.error(`failed ${p.id} on ${network}: ${err.message}`);
    }
  }
  if (Object.keys(record).length === 0) delete posted[p.id];
}

if (!DRY) fs.writeFileSync(postedPath, `${JSON.stringify(posted, null, 2)}\n`);
const next = schedule.find((p) => p.date > today);
console.log(`${due.length} due, next: ${next ? `${next.id} on ${next.date}` : "none"}`);
if (failures) process.exit(1);
