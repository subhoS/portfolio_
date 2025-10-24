import { getPostSlugs } from "../../lib/posts";
import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.SITE_URL || "https://example.com";
  const staticPages = ["/", "/about", "/projects", "/blog", "/contact"];

  const slugs = await getPostSlugs();

  const urls = [
    ...staticPages.map((p) => `${baseUrl}${p}`),
    ...slugs.map((s) => `${baseUrl}/blog/${s}`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map(
        (u) => `
      <url>
        <loc>${u}</loc>
      </url>`
      )
      .join("\n")}
  </urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
