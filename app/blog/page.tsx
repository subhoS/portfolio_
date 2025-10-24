import { getAllPosts } from "../../lib/posts";
import Link from "next/link";
import SEO from "../../components/SEO";
import { Box, Typography, Card, CardContent, Chip } from "@mui/joy";

export default async function BlogPage() {
  const posts = await getAllPosts();
  
  // Sort posts by date (newest first)
  const sortedPosts = posts.sort((a, b) => {
    const dateA = new Date(a.date || 0).getTime();
    const dateB = new Date(b.date || 0).getTime();
    return dateB - dateA;
  });

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 6, md: 10 }, maxWidth: 900, mx: "auto" }}>
      <SEO 
        title="Blog" 
        description="Thoughts on frontend engineering, performance optimization, and web development best practices" 
        url="/blog" 
      />

      {/* Header Section */}
      <Box sx={{ mb: 8 }}>
        <Typography
          level="h1"
          sx={{ fontSize: { xs: 28, md: 40 }, fontWeight: 800, mb: 2 }}
        >
          📝 Blog
        </Typography>

        <Typography level="body-lg" sx={{ color: "text.secondary", mb: 2 }}>
          Thoughts on frontend engineering, performance optimization, and web development
        </Typography>

        <Typography level="body-sm" sx={{ color: "text.secondary", opacity: 0.7 }}>
          {sortedPosts.length} articles • {sortedPosts.length > 0 ? "Latest insights" : "More coming soon"}
        </Typography>
      </Box>

      {/* Posts List */}
      <Box
        component="ul"
        sx={{
          listStyle: "none",
          p: 0,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {sortedPosts && sortedPosts.length > 0 ? (
          sortedPosts.map((p: any) => {
            const formattedDate = p.date ? new Date(p.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }) : '';

            return (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} style={{ textDecoration: "none" }}>
                  <Card
                    variant="outlined"
                    sx={{
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "lg",
                        borderColor: "primary.solidBg",
                      },
                      "&:active": {
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                      {/* Title */}
                      <Typography
                        level="h4"
                        sx={{
                          fontSize: { xs: 18, md: 22 },
                          fontWeight: 700,
                          mb: 1,
                          lineHeight: 1.3,
                        }}
                      >
                        {p.title}
                      </Typography>

                      {/* Description/Excerpt */}
                      <Typography
                        level="body-sm"
                        sx={{ mt: 1.5, mb: 2.5, color: "text.secondary", lineHeight: 1.6 }}
                      >
                        {p.description || p.excerpt || "Read the full article..."}
                      </Typography>

                      {/* Meta Information */}
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1.5,
                          mb: 2,
                          fontSize: "12px",
                          opacity: 0.7,
                          alignItems: "center",
                        }}
                      >
                        {formattedDate && (
                          <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                            <span>📅</span>
                            <span>{formattedDate}</span>
                          </Box>
                        )}
                        {p.tags && p.tags.length > 0 && (
                          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                            {p.tags.slice(0, 3).map((tag: string) => (
                              <span key={tag} style={{ opacity: 0.8 }}>
                                #{tag}
                              </span>
                            ))}
                          </Box>
                        )}
                      </Box>

                      {/* Tags as Chips */}
                      {p.tags && p.tags.length > 0 && (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          {p.tags.slice(0, 4).map((tag: string) => (
                            <Chip
                              key={tag}
                              variant="soft"
                              size="sm"
                              sx={{ fontSize: "11px" }}
                            >
                              {tag}
                            </Chip>
                          ))}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </li>
            );
          })
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              px: 2,
              borderRadius: "12px",
              background: "var(--background)",
              opacity: 0.7,
            }}
          >
            <Typography level="h3" sx={{ mb: 2 }}>
              📚 No articles yet
            </Typography>
            <Typography level="body-lg" sx={{ color: "text.secondary" }}>
              Check back soon for insights on frontend engineering and web development!
            </Typography>
          </Box>
        )}
      </Box>

      {/* Newsletter CTA */}
      <Box
        sx={{
          mt: 12,
          p: 4,
          borderRadius: "12px",
          background: "linear-gradient(135deg, rgba(0,102,204,0.1) 0%, rgba(0,51,102,0.05) 100%)",
          border: "1px solid rgba(0,102,204,0.2)",
          textAlign: "center",
        }}
      >
        <Typography level="h3" sx={{ mb: 1 }}>
          💌 Stay Updated
        </Typography>
        <Typography level="body-sm" sx={{ color: "text.secondary", mb: 2 }}>
          Get notified when new articles are published about JavaScript, React, and web performance.
        </Typography>
      </Box>
    </Box>
  );
}
