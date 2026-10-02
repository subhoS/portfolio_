---
title: "How I Built an SEO-First Developer Portfolio with Next.js"
description: "A blueprint for a developer portfolio that ranks for your name: static rendering, structured data, OG images, sitemaps, RSS and a content strategy."
date: "2025-10-24"
updated: "2026-10-02"
author: "Subhadeep Datta"
category: "Web Development"
tags: ["Next.js", "SEO", "Web Development", "Performance", "Personal Branding"]
keywords: "developer portfolio SEO, Next.js SEO, personal website SEO, structured data Person schema, JSON-LD portfolio, rank for your name, Core Web Vitals portfolio, Open Graph images Next.js"
featured: false
faq:
  - q: "How do I make my portfolio rank for my name on Google?"
    a: "Put your full name in the homepage title and H1, publish an About page that describes who you are in plain sentences, add Person structured data with sameAs links to your LinkedIn, GitHub and X profiles, link back to your site from all of those profiles, and submit a sitemap in Google Search Console. Consistency across profiles is what lets Google connect them into one entity."
  - q: "Is Next.js good for SEO?"
    a: "Yes, as long as pages are server-rendered or statically generated. Next.js App Router renders to HTML by default, generates metadata, sitemaps and Open Graph images from code, and ships little JavaScript when you keep components on the server."
  - q: "Does a developer portfolio need a blog?"
    a: "If you want search traffic beyond your own name, yes. A homepage ranks for one query; every well-written article can rank for dozens. Articles also give people a reason to link to you, which strengthens the whole domain."
  - q: "What structured data should a personal website use?"
    a: "A Person entity (with name, jobTitle, image, worksFor, alumniOf and sameAs), a WebSite entity, ProfilePage on the homepage and About page, BlogPosting on each article, and BreadcrumbList for navigation. Give each entity a stable @id so they reference each other."
---

Most developer portfolios are built to impress the person already looking at them. Very few are built so that someone can **find** them in the first place.

When I rebuilt this site, I set one concrete goal: if someone searches for "Subhadeep Datta", the first result should be a page I control that answers "who is this person and what do they do?". The second goal was bigger: every article I write should be able to rank for a real engineering question, so the site keeps growing without me promoting each post by hand.

This is the blueprint I followed. Everything here is running on the page you're reading.

## The three jobs of a portfolio site

Before touching code, it helps to name what the site has to do:

1. **Own your name.** Searches for your name should resolve to you, not a namesake, a stale profile or a scraped directory.
2. **Prove your work.** Case studies with real numbers beat a grid of logos.
3. **Earn new visitors.** Articles that answer specific questions bring in people who have never heard of you.

The first job is mostly technical SEO and consistency. The second is writing. The third is a content strategy. You need all three; the technical layer just makes sure the other two get credit.

## Rendering: ship HTML, not a loading spinner

Search engines can execute JavaScript, but they do it later and less reliably than they read HTML. Answer engines and social preview bots often don't run JavaScript at all. So the rule is simple: **every page should be complete HTML on the first response.**

With the Next.js App Router that's the default, as long as you don't fight it. All the pages on this site are static: they're rendered at build time and served from the CDN.

```bash
Route (app)
┌ ○ /
├ ○ /about
├ ● /blog/[slug]
├ ● /blog/[slug]/opengraph-image
├ ● /blog/tag/[tag]
├ ○ /rss.xml
└ ○ /sitemap.xml

○  (Static)  prerendered as static content
●  (SSG)     prerendered as static HTML
```

A few habits keep it that way:

- **Keep components on the server.** Only the theme toggle, mobile menu, copy-link button and table-of-contents highlighter are client components. Everything else ships zero JavaScript.
- **Never gate content behind animations.** My previous version faded sections in on scroll. In a full-page render, half the homepage was invisible. If content needs JavaScript to become visible, assume some crawlers will never see it.
- **Use `generateStaticParams` with `dynamicParams = false`** for articles, so unknown slugs return a real 404 instead of rendering an empty page.

## Metadata that agrees with itself

Every page gets a title, description, canonical URL, Open Graph tags and Twitter card tags, and they must all describe the same URL. I centralized this in one helper so I can't get it wrong page by page:

```ts
export function pageMetadata({ title, description, path, type = "website" }: PageMeta): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type, url: path, title, description, siteName: site.name },
    twitter: { card: "summary_large_image", title, description, creator: site.twitter },
  };
}
```

One trap worth calling out: **don't set a canonical URL in the root layout.** Next.js merges metadata from layouts into pages, so any page that forgets to override it will declare the homepage as its canonical, and Google may drop it from the index. Set canonicals per page, every time.

Titles follow a pattern: the specific thing first, the brand second. "Why Your API Is Slow (And How to Fix It) | Subhadeep Datta" is better than the reverse, because the first 50–60 characters are what people actually read in search results.

## Structured data: teach Google who you are

This is the part most portfolios skip, and it's the most important for ranking on your name.

Search engines build a knowledge graph of **entities**: people, companies, places. Your goal is to be a clean, unambiguous entity. JSON-LD structured data is how you describe that entity in a machine-readable way. On this site, every page includes a `Person` and a `WebSite`, and they reference each other through stable `@id` values:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://subhadeep-datta.dev/#person",
      "name": "Subhadeep Datta",
      "jobTitle": "Co-Founder & CTO",
      "worksFor": [{ "@type": "Organization", "name": "Hirerkey" }],
      "alumniOf": { "@type": "CollegeOrUniversity", "name": "Jamia Hamdard" },
      "sameAs": [
        "https://www.linkedin.com/in/subhadeep-datta-cto/",
        "https://github.com/subhoS",
        "https://x.com/SubhadeepDataa"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://subhadeep-datta.dev/#website",
      "publisher": { "@id": "https://subhadeep-datta.dev/#person" }
    }
  ]
}
```

Then each page type adds its own node:

| Page | Schema | Why it matters |
| --- | --- | --- |
| Homepage, About | `ProfilePage` with `mainEntity` pointing at the Person | Tells Google this page is *about* you |
| Article | `BlogPosting` with `author` → Person | Connects every article back to your entity |
| Article, topic pages | `BreadcrumbList` | Cleaner breadcrumbs in search results |
| About, articles with FAQs | `FAQPage` | Direct answers for answer engines and AI overviews |

The `sameAs` array does a lot of quiet work. It says "the person on this site is the same person as these profiles." To close the loop, **link back to your site from each of those profiles**. A website field on LinkedIn, the URL on your GitHub profile, the link in your X bio. Mutual links are how a search engine becomes confident those accounts all describe one person. I also add `rel="me"` to the outbound profile links, which is the convention for asserting identity across sites.

## An About page that answers the obvious questions

When people search a name, they're asking "who is this?". The About page should answer that in the first sentence, in plain language, the way a knowledge panel would:

> I'm Subhadeep Datta, a Full Stack Engineer and CTO based in New Delhi, India.

Then I added a short facts panel (role, company, location, focus, education, profiles) and an FAQ section: *Who is Subhadeep Datta? What does he work on? How can I contact him?* It feels redundant to a human, but it's exactly the shape of content that search snippets and AI assistants quote.

## Open Graph images for every page

Links get shared on LinkedIn, X and Slack far more often than they get clicked from search. A good preview image measurably increases clicks. Instead of designing images by hand, I generate one per article at build time with `next/og`:

```tsx
// app/blog/[slug]/opengraph-image.tsx
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPostBySlug((await params).slug);
  return renderOg({ eyebrow: post.category, title: post.title });
}
```

Next.js wires the image into `og:image` and `twitter:image` automatically. Every article gets a consistent, branded card with the title, my photo and my name, so the name gets reinforced every time someone shares a link.

## Sitemaps, feeds and llms.txt

Discovery files are cheap and worth having:

- **`/sitemap.xml`** generated from the content directory, with real `lastModified` dates. Only topic pages with at least two articles are included; thin pages get `noindex` instead.
- **`/robots.txt`** that allows everything and points to the sitemap.
- **`/rss.xml` and `/feed.json`** with full article content. Feed readers, newsletter tools and aggregators still drive real traffic for technical writing.
- **`/llms.txt`**, a plain-text summary of who I am and every article I've written, for AI assistants that look for it.

## Core Web Vitals: speed is a ranking signal and a first impression

Page experience isn't the strongest ranking factor, but slow pages lose readers before they read anything. What made the biggest difference here:

- **Removing the UI framework.** The previous version shipped a component library, a CSS-in-JS runtime and an animation library to render what is mostly text. Replacing them with plain CSS and server components cut the JavaScript to almost nothing.
- **Self-hosted fonts with `next/font`**, so there's no render-blocking request to a font CDN and no layout shift when fonts load.
- **`next/image` for every image**, with explicit dimensions and a blurred placeholder for the portrait.
- **CSS-only effects.** The reading progress bar at the top of this page uses a scroll-driven CSS animation, with no scroll listeners.
- **Syntax highlighting at build time.** Code blocks are highlighted with Shiki during the build, so readers download colored HTML, not a highlighter.

## The content strategy that actually compounds

Technical SEO gets you indexed. Content gets you found. The strategy I follow:

1. **Write about problems you've actually solved.** First-hand experience is what search engines increasingly reward, and it's the only thing that makes an article better than the hundred others on the same topic.
2. **One article, one question.** "Why is my API slow?", "Kafka vs RabbitMQ?", "How do idempotency keys work?". Specific questions have searchers with intent.
3. **Cluster related articles.** Topic pages like [Backend](/blog/tag/backend) and [System Design](/blog/tag/system-design) group articles together, and articles link to each other. Clusters signal depth on a subject.
4. **Answer the question early, then go deep.** The introduction should tell the reader what they'll learn; the body should be the most complete answer they can find.
5. **Update, don't abandon.** Refreshing an article and its `updated` date beats publishing a thin new one.

## Checklist

If you're building your own, here's the short version:

- [ ] Full name in the homepage `<title>` and `<h1>`
- [ ] Static or server-rendered HTML for every page
- [ ] Per-page canonical, description, Open Graph and Twitter tags
- [ ] `Person` + `WebSite` JSON-LD with stable `@id`s and `sameAs` links
- [ ] Your site linked from LinkedIn, GitHub, X and anywhere else you have a profile
- [ ] An About page that answers "who is this?" in the first sentence
- [ ] Generated Open Graph images
- [ ] Sitemap submitted to Google Search Console and Bing Webmaster Tools
- [ ] RSS feed
- [ ] Articles that answer specific questions from your own experience

A portfolio isn't a one-time project. It's the one place on the internet where you control the story, so it's worth treating it like a product.
