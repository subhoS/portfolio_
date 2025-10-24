import Head from "next/head";
import profile from "../data/profile.json";

type Props = {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  keywords?: string[];
  author?: string;
  type?: "article" | "website" | "person";
  publishedDate?: string;
  modifiedDate?: string;
};

export default function SEO({
  title,
  description,
  url,
  image,
  keywords,
  author,
  type = "website",
  publishedDate,
  modifiedDate,
}: Props) {
  const siteName = profile.site?.name || profile.name || "";
  const pageTitle = title ? `${title} — ${siteName}` : siteName;
  const desc = description || profile.site?.description || "";
  const pageUrl = url
    ? `${profile.site?.url || ""}${url}`
    : profile.site?.url || "";
  const ogImage = image || profile.site?.ogImage || "";
  const twitter = profile.site?.twitter || "";
  const sameAs = [];
  if (profile.socials?.linkedin) sameAs.push(profile.socials.linkedin);
  if (profile.socials?.github) sameAs.push(profile.socials.github);
  if (profile.socials?.x) sameAs.push(profile.socials.x);

  return (
    <Head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{pageTitle}</title>
      <meta name="description" content={desc} />
      {keywords && <meta name="keywords" content={keywords.join(", ")} />}
      {author && <meta name="author" content={author} />}
      <meta name="theme-color" content="#0a0e27" />
      <meta name="msapplication-TileColor" content="#0a0e27" />

      {/* Open Graph Tags */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      {pageUrl && <meta property="og:url" content={pageUrl} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      {twitter && <meta name="twitter:creator" content={twitter} />}
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={desc} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Article specific tags */}
      {type === "article" && (
        <>
          {publishedDate && (
            <meta property="article:published_time" content={publishedDate} />
          )}
          {modifiedDate && (
            <meta property="article:modified_time" content={modifiedDate} />
          )}
          {author && <meta property="article:author" content={author} />}
        </>
      )}

      <link rel="canonical" href={pageUrl} />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: profile.name,
            url: pageUrl || "",
            sameAs,
            image: ogImage,
            jobTitle: profile.title,
            description: profile.shortBio,
          }),
        }}
      />

      {/* Website Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteName,
            url: profile.site?.url || "",
            description: profile.site?.description || "",
            publisher: {
              "@type": "Person",
              name: profile.name,
            },
          }),
        }}
      />

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
    </Head>
  );
}
