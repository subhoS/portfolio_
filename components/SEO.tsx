import Head from "next/head";
import profile from "../data/profile.json";

type Props = {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
};

export default function SEO({ title, description, url, image }: Props) {
  const siteName = profile.site?.name || profile.name || "";
  const pageTitle = title ? `${title} — ${siteName}` : siteName;
  const desc = description || profile.site?.description || "";
  const pageUrl = url || profile.site?.url || "";
  const ogImage = image || profile.site?.ogImage || "";
  const twitter = profile.site?.twitter || "";
  const sameAs = [];
  if (profile.socials?.linkedin) sameAs.push(profile.socials.linkedin);
  if (profile.socials?.github) sameAs.push(profile.socials.github);
  if (profile.socials?.x) sameAs.push(profile.socials.x);

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      {pageUrl && <meta property="og:url" content={pageUrl} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      {twitter && <meta name="twitter:creator" content={twitter} />}
      <link rel="canonical" href={pageUrl} />

      {/* JSON-LD Person and Website skeleton - filled from profile.json */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: profile.name,
            url: pageUrl || "",
            sameAs,
          }),
        }}
      />
    </Head>
  );
}
