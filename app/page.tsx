import SEO from "../components/SEO";
import Hero from "../components/Hero";
import { Box, Typography, Grid, Button } from "@mui/joy";
import ProjectCard from "../components/ProjectCard";
import BlogCard from "../components/BlogCard";
import type { Metadata } from "next";
import { getAllPosts } from "../lib/posts";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Subhadeep Datta — Full Stack Engineer",
  description:
    "Full stack engineer building scalable systems. Currently at Noisiv Consulting. I care about performance, clean code, and solving real problems.",
  openGraph: {
    type: "website",
    title: "Subhadeep Datta — Full Stack Engineer",
    description:
      "Full stack engineer focused on building fast, scalable systems.",
  },
};

export default async function Home() {
  const posts = await getAllPosts();
  const recentPosts = posts.slice(0, 3);
  return (
    <Box
      component="section"
      sx={{ px: { xs: 1.5, sm: 2, md: 3 }, py: { xs: 3, sm: 4, md: 8 } }}
    >
      <SEO
        title="Home"
        description="Portfolio site of Subhadeep Datta — full stack engineer."
        url="/"
      />

      <Hero />

      <Box sx={{ maxWidth: 980, mx: "auto", mt: { xs: 6, md: 8 } }}>
        <Typography
          level="h2"
          sx={{
            fontSize: { xs: 20, sm: 28, md: 32 },
            fontWeight: 800,
            mb: { xs: 0.5, md: 1 },
            color: "var(--text-primary)",
            lineHeight: 1.2,
          }}
        >
          Work
        </Typography>
        <Typography
          level="body-sm"
          sx={{
            color: "var(--text-secondary)",
            mb: { xs: 3, md: 4 },
            fontSize: { xs: "15px", md: "16px" },
          }}
        >
          Projects and things I've built. Real work on real problems.
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} sx={{ mt: 0 }}>
          <Grid xs={12} sm={6} md={4}>
            <ProjectCard
              title="Noisiv Consulting"
              description="Co-founded and scaling an enterprise technology consulting firm. Leading engineering teams, designing systems, and building products for enterprise clients."
              tech={["Java", "Node.js", "AWS", "Kubernetes"]}
              href="https://noisivconsulting.com/"
            />
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <ProjectCard
              title="QID — Verification Platform"
              description="Built a digital check-in and verification platform from the ground up. Handled millions of transactions with offline-first architecture and India's identity APIs."
              tech={["NestJS", "Angular", "MongoDB"]}
              href="https://github.com/subhoS"
            />
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <ProjectCard
              title="Realtime Analytics"
              description="A WebSocket-based analytics dashboard. Focused on handling real-time updates efficiently without blocking the UI."
              tech={["React", "Next.js", "TypeScript"]}
              href="https://github.com/subhoS"
            />
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          maxWidth: 980,
          mx: "auto",
          mt: { xs: 6, md: 8 },
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: "12px",
          bgcolor: "var(--surface-secondary) !important",
          border: "1px solid var(--border)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
            mb: { xs: 3, md: 4 },
          }}
        >
          <Box>
            <Typography
              level="h2"
              sx={{
                fontSize: { xs: 20, sm: 28, md: 32 },
                fontWeight: 800,
                mb: { xs: 0.5, md: 1 },
                color: "var(--text-primary)",
                lineHeight: 1.2,
              }}
            >
              Writing
            </Typography>
            <Typography
              level="body-sm"
              sx={{
                color: "var(--text-secondary)",
                fontSize: { xs: "15px", md: "16px" },
              }}
            >
              Thoughts on engineering, performance, and building products.
            </Typography>
          </Box>
          <Link href="/blog" style={{ textDecoration: "none" }}>
            <Button
              variant="plain"
              sx={{
                color: "var(--accent) !important",
                fontSize: { xs: "14px", md: "15px" },
                "&:hover": {
                  bgcolor: "transparent",
                  textDecoration: "underline",
                },
              }}
            >
              View all →
            </Button>
          </Link>
        </Box>
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} sx={{ mt: 0 }}>
          {recentPosts.map((post) => (
            <Grid xs={12} sm={6} md={4} key={post.slug}>
              <BlogCard
                title={post.title}
                description={post.description}
                date={post.date}
                slug={post.slug}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
