import { getFeedPosts } from "../../lib/feed";
import { site } from "../../lib/site";

export const dynamic = "force-static";

export async function GET() {
  const posts = await getFeedPosts(site.url);
  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: `${site.name} — Writing`,
    home_page_url: `${site.url}/blog`,
    feed_url: `${site.url}/feed.json`,
    description:
      "Articles by Subhadeep Datta on system design, backend performance, distributed systems and AI engineering.",
    icon: `${site.url}/apple-icon.png`,
    authors: [
      {
        name: site.name,
        url: `${site.url}/about`,
        avatar: `${site.url}${site.avatar}`,
      },
    ],
    language: "en",
    items: posts.map((p) => ({
      id: p.url,
      url: p.url,
      title: p.title,
      summary: p.description,
      content_html: p.html,
      image: `${p.url}/opengraph-image`,
      date_published: `${p.date}T00:00:00+05:30`,
      date_modified: `${p.updated}T00:00:00+05:30`,
      tags: p.tags,
    })),
  };
  return Response.json(feed, {
    headers: {
      "Cache-Control":
        "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
