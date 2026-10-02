import Hero from "../components/Hero";
import { Box, Typography, Grid, Button } from "@mui/joy";
import ProjectCard from "../components/ProjectCard";
import BlogCard from "../components/BlogCard";
import ScrollReveal from "../components/ScrollReveal";
import AnimatedCounter from "../components/AnimatedCounter";
import type { Metadata } from "next";
import { getAllPosts } from "../lib/posts";
import Link from "next/link";
import profile from "../data/profile.json";

export const metadata: Metadata = {
  title: profile.site.name,
  description: profile.site.description,
  openGraph: {
    type: "website",
    title: profile.site.name,
    description: profile.site.description,
  },
};

export default async function Home() {
  const posts = await getAllPosts();
  const recentPosts = posts.slice(0, 3);

  return (
    <Box
      component="section"
      sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}
    >
      <Hero />

      {/* Stats / Impact Section */}
      <ScrollReveal>
        <Box
          sx={{
            maxWidth: 980,
            mx: "auto",
            mt: { xs: 4, md: 6 },
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
            gap: { xs: 2, md: 3 },
          }}
        >
          {[
            { value: 6, suffix: "+", label: "Years Experience" },
            { value: 25, suffix: "+", label: "Engineers Led" },
            { value: 99, suffix: ".9%", label: "System Uptime" },
            { value: 3, suffix: "M+", label: "Transactions Handled" },
          ].map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.1}>
              <Box
                sx={{
                  textAlign: "center",
                  p: { xs: 3, md: 4 },
                  borderRadius: "20px",
                  bgcolor: "rgba(var(--surface-rgb), 0.4)",
                  border: "1px solid rgba(124,58,237,0.1)",
                  backdropFilter: "blur(16px)",
                  transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
                  "&:hover": {
                    borderColor: "rgba(124,58,237,0.4)",
                    transform: "translateY(-6px) scale(1.02)",
                    boxShadow: "0 12px 32px rgba(124,58,237,0.15)",
                    bgcolor: "rgba(var(--surface-rgb), 0.6)",
                  },
                }}
              >
                <Typography
                  level="h2"
                  sx={{
                    fontSize: { xs: 28, md: 36 },
                    fontWeight: 800,
                    fontFamily: "'Inter', sans-serif",
                    background: "linear-gradient(135deg, #6d28d9 0%, #7c3aed 50%, #a78bfa 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: 1.2,
                    filter: "drop-shadow(0 0 8px rgba(124,58,237,0.2))",
                  }}
                >
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                  />
                </Typography>
                <Typography
                  level="body-sm"
                  sx={{
                    color: "var(--text-secondary)",
                    mt: 0.5,
                    fontSize: "13px",
                    fontWeight: 500,
                    letterSpacing: "0.3px",
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            </ScrollReveal>
          ))}
        </Box>
      </ScrollReveal>

      {/* Skills Bento Grid */}
      <ScrollReveal>
        <Box sx={{ maxWidth: 980, mx: "auto", mt: { xs: 6, md: 10 } }}>
          <Typography
            level="h2"
            sx={{
              fontSize: { xs: 24, sm: 30, md: 38 },
              fontWeight: 800,
              mb: 1,
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            What I{" "}
            <Box
              component="span"
              sx={{
                background: "var(--accent-gradient)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              work with
            </Box>
          </Typography>
          <Typography
            level="body-sm"
            sx={{
              color: "var(--text-secondary)",
              mb: { xs: 3, md: 4 },
              fontSize: { xs: "15px", md: "16px" },
            }}
          >
            Technologies and tools I use to build things that scale.
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            {[
              {
                title: "Backend & Systems",
                emoji: "⚙️",
                skills: profile.skills?.backend || [],
                color: "rgba(124,58,237,0.08)",
              },
              {
                title: "Frontend & UI",
                emoji: "🎨",
                skills: profile.skills?.frontend || [],
                color: "rgba(167,139,250,0.08)",
              },
              {
                title: "Cloud & DevOps",
                emoji: "☁️",
                skills: profile.skills?.cloudDevOps || [],
                color: "rgba(139,92,246,0.08)",
              },
              {
                title: "Databases",
                emoji: "🗄️",
                skills: profile.skills?.databases || [],
                color: "rgba(124,58,237,0.06)",
              },
              {
                title: "AI & ML",
                emoji: "🤖",
                skills: profile.skills?.aiMl || [],
                color: "rgba(167,139,250,0.06)",
              },
              {
                title: "Architecture",
                emoji: "🏗️",
                skills: profile.skills?.systemDesign || [],
                color: "rgba(139,92,246,0.06)",
              },
            ].map((category, i) => (
              <ScrollReveal key={category.title} delay={i * 0.08}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    bgcolor: category.color,
                    border: "1px solid var(--border)",
                    backdropFilter: "blur(12px)",
                    transition: "all 0.3s ease",
                    height: "100%",
                    "&:hover": {
                      borderColor: "var(--accent)",
                      transform: "translateY(-6px) scale(1.02)",
                      boxShadow: "0 12px 32px rgba(124,58,237,0.25)",
                      bgcolor: "rgba(var(--surface-rgb), 0.8)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "24px",
                      mb: 1,
                    }}
                  >
                    {category.emoji}
                  </Typography>
                  <Typography
                    level="title-sm"
                    sx={{
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      mb: 1.5,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {category.title}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                    {category.skills.map((skill) => (
                      <Typography
                        key={skill}
                        level="body-xs"
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "6px",
                          bgcolor: "rgba(124,58,237,0.1)",
                          color: "var(--accent)",
                          fontWeight: 500,
                          fontSize: "12px",
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {skill}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </ScrollReveal>
            ))}
          </Box>
        </Box>
      </ScrollReveal>

      {/* Work Section */}
      <ScrollReveal>
        <Box sx={{ maxWidth: 980, mx: "auto", mt: { xs: 6, md: 10 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: { xs: 3, md: 4 },
            }}
          >
            <Box>
              <Typography
                level="h2"
                sx={{
                  fontSize: { xs: 24, sm: 30, md: 38 },
                  fontWeight: 800,
                  mb: 0.5,
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "-0.02em",
                }}
              >
                Featured{" "}
                <Box
                  component="span"
                  sx={{
                    background: "var(--accent-gradient)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Work
                </Box>
              </Typography>
              <Typography
                level="body-sm"
                sx={{
                  color: "var(--text-secondary)",
                  fontSize: { xs: "15px", md: "16px" },
                }}
              >
                Projects and things I've built. Real work on real problems.
              </Typography>
            </Box>
            <Link href="/projects" style={{ textDecoration: "none" }}>
              <Button
                variant="plain"
                sx={{
                  color: "var(--accent) !important",
                  fontSize: "14px",
                  display: { xs: "none", sm: "flex" },
                  "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
                }}
              >
                View all →
              </Button>
            </Link>
          </Box>
          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            {(profile.projects || []).slice(0, 3).map((project: any, i: number) => (
              <Grid xs={12} sm={6} md={4} key={project.title}>
                <ScrollReveal delay={i * 0.1}>
                  <ProjectCard {...project} />
                </ScrollReveal>
              </Grid>
            ))}
          </Grid>
        </Box>
      </ScrollReveal>

      {/* Writing Section */}
      <ScrollReveal>
        <Box
          sx={{
            maxWidth: 980,
            mx: "auto",
            mt: { xs: 6, md: 10 },
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: "24px",
            bgcolor: "rgba(var(--surface-rgb), 0.3)",
            border: "1px solid rgba(124,58,237,0.15)",
            backdropFilter: "blur(20px)",
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
                  fontSize: { xs: 24, sm: 30, md: 38 },
                  fontWeight: 800,
                  mb: 0.5,
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "-0.02em",
                }}
              >
                Technical{" "}
                <Box
                  component="span"
                  sx={{
                    background: "var(--accent-gradient)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  writing
                </Box>
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
          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            {recentPosts.map((post, i) => (
              <Grid xs={12} sm={6} md={4} key={post.slug}>
                <ScrollReveal delay={i * 0.1}>
                  <BlogCard
                    title={post.title}
                    description={post.description}
                    date={post.date}
                    slug={post.slug}
                  />
                </ScrollReveal>
              </Grid>
            ))}
          </Grid>
        </Box>
      </ScrollReveal>
    </Box>
  );
}
