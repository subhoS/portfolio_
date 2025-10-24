import SEO from "../../components/SEO";
import { Box, Typography, Grid } from "@mui/joy";
import ProjectCard from "../../components/ProjectCard";
import profile from "../../data/profile.json";

export default function ProjectsPage() {
  const projects = profile.projects || [];

  return (
    <Box sx={{ px: 2, py: { xs: 4, md: 8 }, maxWidth: 980, mx: "auto" }}>
      <SEO
        title="Projects"
        description="Projects by Subhadeep Datta"
        url="/projects"
      />

      <Typography
        level="h1"
        sx={{
          fontSize: { xs: 28, md: 40 },
          fontWeight: 800,
          mb: 2,
          color: "var(--text-primary)",
        }}
      >
        Projects
      </Typography>

      <Typography
        level="body-lg"
        sx={{ color: "var(--text-secondary)", mb: 4 }}
      >
        A selection of projects showcasing my work in frontend architecture,
        performance optimization, and full-stack development.
      </Typography>

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
