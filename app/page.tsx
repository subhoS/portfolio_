import SEO from "../components/SEO";
import Hero from "../components/Hero";
import { Box, Typography, Grid } from "@mui/joy";
import ProjectCard from "../components/ProjectCard";

export default function Home() {
  return (
    <Box component="section" sx={{ px: 2, py: { xs: 4, md: 8 } }}>
      <SEO
        title="Home"
        description="Portfolio site of Subhadeep Datta — software engineer. Projects, blog and contact."
        url="/"
      />

      <Hero />

      <Box sx={{ maxWidth: 980, mx: "auto", mt: 8 }}>
        <Typography
          level="h2"
          sx={{
            fontSize: { xs: 24, md: 32 },
            fontWeight: 800,
            mb: 1,
            color: "var(--text-primary)",
          }}
        >
          Featured projects
        </Typography>
        <Typography
          level="body-sm"
          sx={{ color: "var(--text-secondary)", mb: 4 }}
        >
          A selection of work spanning frontend architecture, performance
          optimization, and open source
        </Typography>
        <Grid container spacing={3} sx={{ mt: 0 }}>
          <Grid xs={12} sm={6} md={4}>
            <ProjectCard
              title="Realtime Analytics Dashboard"
              description="An opinionated analytics UI focused on performance, realtime updates, and accessibility. Built with a small team and optimized for low-latency UX."
              tech={["React", "Next.js", "WebSockets"]}
              href="https://github.com/subhoS/realtime-analytics"
            />
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <ProjectCard
              title="Open Source Tooling"
              description="A suite of developer tools and CLI utilities to streamline builds, linting, and publishing workflows. Adopted by multiple projects for CI/CD automation."
              tech={["TypeScript", "Node", "CLI"]}
              href="https://github.com/subhoS"
            />
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <ProjectCard
              title="Design System & Component Library"
              description="Cross-platform design system with reusable React components, design tokens, and accessibility-first guidelines."
              tech={["Figma", "MUI", "CSS"]}
              href="/projects/design-system"
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
