import SEO from "../components/SEO";
import Hero from "../components/Hero";
import { Box, Typography, Grid } from "@mui/joy";
import ProjectCard from "../components/ProjectCard";
import type { Metadata } from "next";

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

export default function Home() {
  return (
    <Box component="section" sx={{ px: 2, py: { xs: 4, md: 8 } }}>
      <SEO
        title="Home"
        description="Portfolio site of Subhadeep Datta — full stack engineer."
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
          Work
        </Typography>
        <Typography
          level="body-sm"
          sx={{ color: "var(--text-secondary)", mb: 4 }}
        >
          Projects and things I've built. Real work on real problems.
        </Typography>
        <Grid container spacing={3} sx={{ mt: 0 }}>
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
    </Box>
  );
}
