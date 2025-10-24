import { getPostBySlug, getPostSlugs } from "../../../lib/posts";
import SEO from "../../../components/SEO";
import { Box, Typography, Chip, Card, CardContent } from "@mui/joy";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const slugs = await getPostSlugs();
    return slugs.map((s) => ({ slug: s }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  if (!slug) {
    return (
      <Box sx={{ px: 2, py: 8, maxWidth: 800, mx: "auto" }}>
        <Typography level="h1">Post not found</Typography>
      </Box>
    );
  }

  try {
    const { meta, contentHtml, readingTime } = await getPostBySlug(slug);
    const siteUrl = process.env.SITE_URL || "https://example.com";
    const postUrl = `${siteUrl}/blog/${slug}`;
    const formattedDate = meta.date
      ? new Date(meta.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

    return (
      <>
        <SEO
          title={meta.title}
          description={meta.description || meta.excerpt}
          url={`/blog/${slug}`}
          image={meta.featured_image}
        />

        <Box
          sx={{
            px: { xs: 2, md: 4 },
            py: { xs: 6, md: 10 },
            maxWidth: 800,
            mx: "auto",
          }}
        >
          {/* Breadcrumb Navigation */}
          <Box
            sx={{
              mb: 4,
              display: "flex",
              gap: 1,
              alignItems: "center",
              fontSize: "sm",
              color: "var(--text-secondary)",
            }}
          >
            <Link href="/blog" style={{ color: "var(--accent)", opacity: 0.7 }}>
              Blog
            </Link>
            <span>/</span>
            <Typography
              level="body-sm"
              sx={{ opacity: 0.7, color: "var(--text-secondary)" }}
            >
              {meta.title}
            </Typography>
          </Box>

          {/* Featured Image */}
          {meta.featured_image && (
            <Box
              component="img"
              src={meta.featured_image}
              alt={meta.title}
              sx={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
                borderRadius: "12px",
                mb: 4,
              }}
            />
          )}

          {/* Article Header */}
          <Typography
            level="h1"
            sx={{
              fontSize: { xs: 28, md: 40 },
              fontWeight: 800,
              mb: 2,
              lineHeight: 1.2,
              color: "var(--text-primary)",
            }}
          >
            {meta.title}
          </Typography>

          {/* Article Meta Info */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              mb: 4,
              pb: 3,
              borderBottom: "1px solid var(--border)",
              opacity: 0.7,
              fontSize: "14px",
              color: "var(--text-secondary)",
            }}
          >
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <span>📅</span>
              <span>{formattedDate}</span>
            </Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <span>⏱️</span>
              <span>{readingTime} min read</span>
            </Box>
            {meta.author && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <span>✍️</span>
                <span>{meta.author}</span>
              </Box>
            )}
          </Box>

          {/* Tags/Keywords */}
          {meta.tags && meta.tags.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 4 }}>
              {meta.tags.map((tag: string) => (
                <Chip
                  key={tag}
                  variant="soft"
                  color="primary"
                  sx={{ fontSize: "12px" }}
                >
                  {tag}
                </Chip>
              ))}
            </Box>
          )}

          {/* Article Content */}
          <Box
            component="article"
            sx={{
              "& h2": {
                fontSize: { xs: 24, md: 28 },
                fontWeight: 700,
                mt: 6,
                mb: 3,
                lineHeight: 1.3,
                color: "var(--text-primary)",
              },
              "& h3": {
                fontSize: { xs: 20, md: 24 },
                fontWeight: 600,
                mt: 4,
                mb: 2,
                lineHeight: 1.3,
                color: "var(--text-primary)",
              },
              "& h4": {
                fontSize: { xs: 18, md: 20 },
                fontWeight: 600,
                mt: 3,
                mb: 2,
                color: "var(--text-primary)",
              },
              "& p": {
                fontSize: { xs: 16, md: 17 },
                lineHeight: 1.8,
                mb: 2,
                color: "var(--text-secondary)",
              },
              "& ul, & ol": {
                fontSize: { xs: 16, md: 17 },
                lineHeight: 1.8,
                mb: 2,
                pl: 3,
              },
              "& li": {
                mb: 1,
                color: "var(--text-secondary)",
              },
              "& blockquote": {
                borderLeft: "4px solid var(--accent)",
                pl: 3,
                py: 1,
                my: 3,
                bgcolor: "var(--surface)",
                color: "var(--text-secondary)",
                borderRadius: "4px",
                fontStyle: "italic",
              },
              "& code": {
                background: "var(--surface)",
                color: "var(--accent)",
                px: "6px",
                py: "3px",
                borderRadius: "4px",
                fontSize: "14px",
                fontFamily: "monospace",
              },
              "& pre": {
                background: "var(--surface-secondary)",
                color: "var(--foreground)",
                p: 3,
                borderRadius: "8px",
                overflow: "auto",
                mb: 3,
                fontSize: "14px",
                lineHeight: 1.6,
                border: "1px solid var(--border)",
              },
              "& pre code": {
                background: "transparent",
                color: "var(--foreground)",
                border: "none",
                px: 0,
                py: 0,
              },
              "& a": {
                color: "var(--accent)",
                textDecoration: "underline",
                "&:hover": {
                  opacity: 0.8,
                },
              },
              "& img": {
                maxWidth: "100%",
                height: "auto",
                borderRadius: "8px",
                my: 3,
              },
            }}
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* Call to Action / Share */}
          <Box
            sx={{
              mt: 8,
              pt: 4,
              borderTop: "1px solid var(--border)",
              opacity: 0.7,
              color: "var(--text-secondary)",
            }}
          >
            <Typography level="body-sm">
              💡 Found this helpful? Share it with others!
            </Typography>
          </Box>
        </Box>

        {/* JSON-LD BlogPosting for better search appearance */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: meta.title,
              description: meta.description || meta.excerpt,
              datePublished: meta.date,
              dateModified: meta.date,
              author: {
                "@type": "Person",
                name: meta.author || "Subhadeep Datta",
              },
              publisher: {
                "@type": "Person",
                name: "Subhadeep Datta",
              },
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": postUrl,
              },
              ...(meta.featured_image && {
                image: meta.featured_image,
              }),
              keywords: meta.keywords?.join(", ") || "",
            }),
          }}
        />
      </>
    );
  } catch (error) {
    console.error(`Error loading post: ${slug}`, error);
    return (
      <Box sx={{ px: 2, py: 8, maxWidth: 800, mx: "auto" }}>
        <Typography level="h1">Error loading post</Typography>
        <Typography level="body-lg" sx={{ mt: 2, color: "text.secondary" }}>
          Sorry, we couldn't load this post. Please try again later.
        </Typography>
        <Link
          href="/blog"
          style={{
            color: "#0066cc",
            textDecoration: "underline",
            marginTop: "20px",
            display: "inline-block",
          }}
        >
          ← Back to Blog
        </Link>
      </Box>
    );
  }
}
