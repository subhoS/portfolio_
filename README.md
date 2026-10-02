# subhadeepdatta.page

Personal site and engineering blog of **Subhadeep Datta**, Full Stack Engineer & CTO.
Built with Next.js (App Router), fully static, and designed to rank for the name "Subhadeep Datta" and for every article's topic.

## Development

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static production build
npm run lint         # Biome
```

## Writing an article

Add a Markdown file to `content/blog/<slug>.md`:

```yaml
---
title: "Under ~60 characters, the specific topic first"
description: "Under 160 characters. Shown in search results and as the article lede."
date: "2026-10-02"
updated: "2026-10-02"        # optional, bump when you revise
category: "System Design"    # also becomes a topic page
tags: ["Redis", "Backend"]
keywords: "comma, separated, search phrases"
featured: true               # optional: pin to the homepage
faq:                          # optional: rendered + FAQPage structured data
  - q: "A question people search for?"
    a: "A direct, self-contained answer."
---
```

Everything else is automatic: syntax highlighting, heading anchors, table of contents, reading time,
an Open Graph image, related posts, topic pages, sitemap, RSS/JSON feeds and `llms.txt`.

## SEO

- Per-page canonical, Open Graph and Twitter metadata via `lib/seo.ts`
- JSON-LD in `lib/schema.ts`: `Person` + `WebSite` on every page; `ProfilePage`, `BlogPosting`,
  `BreadcrumbList`, `FAQPage`, `CollectionPage` where relevant, all linked by stable `@id`s
- Generated OG images: `app/opengraph-image.tsx`, `app/blog/[slug]/opengraph-image.tsx`
- `app/sitemap.ts`, `app/robots.ts`, `/rss.xml`, `/feed.json`, `/llms.txt`
- `npm run audit:seo -- http://localhost:3000` crawls the sitemap of a running build and checks titles,
  descriptions, canonicals, H1s, JSON-LD, image alts and internal links
- `npm run indexnow` notifies Bing/Yandex/IndexNow engines of every URL after a deploy

## Environment variables

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Production URL used for canonicals, sitemap and OG images (default `https://www.subhadeepdatta.page`) |
| `GOOGLE_VERIFICATION_CODE` | Google Search Console verification |
| `BING_VERIFICATION_CODE` | Bing Webmaster Tools verification |
| `NEXT_PUBLIC_GA_ID` | Optional Google Analytics 4 ID |

## Launch checklist

See [`docs/launch-kit.md`](docs/launch-kit.md) for Search Console setup, profile linking,
and ready-to-post LinkedIn and X copy for every article.
