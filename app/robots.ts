import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.SITE_URL || "https://example.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/*.json$"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
