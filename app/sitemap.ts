import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "../lib/posts";
import { absoluteUrl } from "../lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);
  const latest =
    posts[0]?.updated ||
    posts[0]?.date ||
    new Date().toISOString().slice(0, 10);

  const pages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: latest,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: latest,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: latest,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/projects"),
      lastModified: latest,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified: latest,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  const articles: MetadataRoute.Sitemap = posts.map((p) => ({
    url: absoluteUrl(`/blog/${p.slug}`),
    lastModified: p.updated || p.date,
    changeFrequency: "monthly",
    priority: p.featured ? 0.9 : 0.8,
    images: [absoluteUrl(`/blog/${p.slug}/opengraph-image`)],
  }));

  // Only topic pages with enough content to be worth indexing.
  const topics: MetadataRoute.Sitemap = tags
    .filter((t) => t.count >= 2)
    .map((t) => ({
      url: absoluteUrl(`/blog/tag/${t.slug}`),
      lastModified: latest,
      changeFrequency: "weekly",
      priority: 0.5,
    }));

  return [...pages, ...articles, ...topics];
}
