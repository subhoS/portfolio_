import { escapeXml, getFeedPosts } from "../../lib/feed";
import { site } from "../../lib/site";

export const dynamic = "force-static";

export async function GET() {
  const posts = await getFeedPosts(site.url);
  const updated = posts[0]
    ? new Date(`${posts[0].updated}T00:00:00Z`).toUTCString()
    : new Date().toUTCString();

  const items = posts
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${p.url}</link>
      <guid isPermaLink="true">${p.url}</guid>
      <pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate>
      <dc:creator>${escapeXml(site.name)}</dc:creator>
      <description>${escapeXml(p.description)}</description>
${p.tags.map((t) => `      <category>${escapeXml(t)}</category>`).join("\n")}
      <content:encoded><![CDATA[${p.html.replace(/]]>/g, "]]]]><![CDATA[>")}]]></content:encoded>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(site.name)} — Writing</title>
    <link>${site.url}/blog</link>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml("Articles by Subhadeep Datta on system design, backend performance, distributed systems and AI engineering.")}</description>
    <language>en</language>
    <managingEditor>${site.email} (${escapeXml(site.name)})</managingEditor>
    <lastBuildDate>${updated}</lastBuildDate>
    <image>
      <url>${site.url}${site.avatar}</url>
      <title>${escapeXml(site.name)} — Writing</title>
      <link>${site.url}/blog</link>
    </image>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
