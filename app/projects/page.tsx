import { Box, Typography, Grid } from "@mui/joy";
import ProjectCard from "../../components/ProjectCard";
import profile from "../../data/profile.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Projects — ${profile.displayName || profile.name}`,
  description:
    "Work I've built - from enterprise platforms to open source tools. Focused on solving real problems.",
  keywords: ["projects", "portfolio", "web applications", "open source"],
  openGraph: {
    type: "website",
    title: `Projects — ${profile.displayName || profile.name}`,
    description: "Portfolio of projects and work.",
    url: "/projects",
  },
};

export default function ProjectsPage() {
  const projects = profile.projects || [];

  return (
    <Box sx={{ px: { xs: 1.5, sm: 2, md: 3 }, py: { xs: 6, md: 12 }, maxWidth: 980, mx: "auto" }}>
      <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
        <Typography
          level="h1"
          sx={{
            fontSize: { xs: 36, sm: 48, md: 56 },
            fontWeight: 900,
            mb: 2,
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "-0.03em",
          }}
        >
          Work I've{" "}
          <Box
            component="span"
            sx={{
              background: "var(--accent-gradient)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            built
          </Box>
        </Typography>

        <Typography
          level="body-lg"
          sx={{
            color: "var(--text-secondary)",
            fontSize: { xs: "16px", md: "18px" },
            maxWidth: 600,
            mx: "auto",
            lineHeight: 1.6,
          }}
        >
          Things I've built and learned from. Most of this work is about solving
          real problems — scaling systems, handling edge cases, and shipping
          things that work.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {projects.map((project: any) => (
          <Grid xs={12} sm={6} md={4} key={project.title}>
            <ProjectCard
              title={project.title}
              description={project.description}
              tech={project.tech}
              href={project.href}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
