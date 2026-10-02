import type { Metadata } from "next";
import { site } from "./site";

type PageMeta = {
  title: string;
  description: string;
  path: string;
  /** Use the title verbatim instead of appending "| Subhadeep Datta". */
  absoluteTitle?: boolean;
  keywords?: string[];
  type?: "website" | "profile" | "article";
  article?: { publishedTime: string; modifiedTime: string; tags: string[] };
};

/** Full per-page metadata: canonical URL, Open Graph and Twitter all agree with each other. */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle,
  keywords,
  type = "website",
  article,
}: PageMeta): Metadata {
  // Search results show ~60 characters: only append the name when it still fits.
  const suffixed = `${title} | ${site.name}`;
  const useAbsolute = absoluteTitle || suffixed.length > 65;
  const fullTitle = useAbsolute ? title : suffixed;
  // Articles get a generated image from their own opengraph-image route; everything else shares the site card.
  const images =
    type === "article"
      ? undefined
      : [
          {
            url: "/opengraph-image",
            width: 1200,
            height: 630,
            alt: site.title,
          },
        ];
  return {
    title: useAbsolute ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      title: fullTitle,
      description,
      siteName: site.name,
      locale: site.locale,
      ...(images && { images }),
      ...(type === "profile" && {
        firstName: "Subhadeep",
        lastName: "Datta",
        username: "subhoS",
      }),
      ...(article && {
        publishedTime: article.publishedTime,
        modifiedTime: article.modifiedTime,
        authors: [`${site.url}/about`],
        tags: article.tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      site: site.twitter,
      creator: site.twitter,
      ...(images && { images }),
    },
  };
}
