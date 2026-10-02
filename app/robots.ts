import type { MetadataRoute } from "next";
import { absoluteUrl, site } from "../lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // Search and AI answer engines are all welcome: the goal is maximum discoverability.
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: site.url,
  };
}
