import { getPostSlugs, getPostBySlug } from "../../lib/posts";
import { NextResponse } from "next/server";

interface SitemapItem {
  url: string;
  priority: string;
  changefreq: string;
  lastmod?: string;
}

export async function GET() {
  const baseUrl = process.env.SITE_URL || "https://example.com";
  const staticPages: SitemapItem[] = [
    { url: "/", priority: "1.0", changefreq: "weekly" },
    { url: "/about", priority: "0.8", changefreq: "monthly" },
    { url: "/projects", priority: "0.9", changefreq: "weekly" },
    { url: "/blog", priority: "0.9", changefreq: "weekly" },
    { url: "/contact", priority: "0.7", changefreq: "monthly" },
  ];

  const slugs = await getPostSlugs();

  // Get blog post details for better sitemap
  const blogUrls: SitemapItem[] = await Promise.all(
    slugs.map(async (slug) => {
      try {
        const { meta } = await getPostBySlug(slug);
        return {
          url: `/blog/${slug}`,
          priority: "0.8",
          changefreq: "monthly",
          lastmod: meta.date,
        };
      } catch {
        return {
          url: `/blog/${slug}`,
          priority: "0.8",
          changefreq: "monthly",
        };
      }
    })
  );

  const allUrls = [...staticPages, ...blogUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
    .map(
      (item) => `
  <url>
    <loc>${baseUrl}${item.url}</loc>
    ${item.lastmod ? `<lastmod>${item.lastmod}</lastmod>` : ""}
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
    )
    .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
