export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // `<` is escaped so content can never close the script tag early.
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as raw script content
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
