import SEO from "../../components/SEO";
import { Box, Typography, Stack, Chip } from "@mui/joy";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Subhadeep Datta",
  description:
    "Learn about my work in full stack development, distributed systems, and building products that scale.",
  keywords: [
    "about",
    "software engineer",
    "full stack developer",
    "system design",
  ],
  openGraph: {
    type: "website",
    title: "About — Subhadeep Datta",
    description:
      "Full stack engineer focused on building fast, scalable systems.",
    url: "/about",
  },
};

export default function AboutPage() {
  const skillCategories = {
    "Frontend Development": [
      "React.js",
      "Angular",
      "Ionic",
      "PWA",
      "TypeScript",
      "Next.js",
    ],
    "Backend Development": [
      "Node.js",
      "NestJS",
      "Go (Gin)",
      "Python (Flask)",
      "Java",
    ],
    "Mobile Development": ["Android", "iOS", "Ionic"],
    Databases: ["MongoDB", "PostgreSQL", "Redis", "Elasticsearch"],
    "Containerization & Orchestration": ["Docker", "Kubernetes"],
    "Cloud & DevOps": [
      "AWS",
      "Google Cloud",
      "Vercel",
      "Terraform",
      "CI/CD",
      "Git",
    ],
    "AI & Machine Learning": [
      "Artificial Intelligence (AI)",
      "Machine Learning (ML)",
      "LLMs",
    ],
    "System Design & Architecture": [
      "Cloud Computing",
      "Distributed Systems",
      "Performance Optimization",
      "System Design",
      "Architecture",
    ],
    "Professional Skills": [
      "Team Leadership",
      "Project Management",
      "Agile/Scrum",
      "Jira",
      "Trello",
      "Asana",
      "ClickUp",
      "Notion",
    ],
  };

  return (
    <Box sx={{ px: 2, py: { xs: 4, md: 8 }, maxWidth: 780, mx: "auto" }}>
      <SEO title="About" description="About Subhadeep Datta" url="/about" />

      <Typography
        level="h1"
        sx={{
          fontSize: { xs: 28, md: 40 },
          fontWeight: 800,
          mb: 2,
          color: "var(--text-primary)",
        }}
      >
        About me
      </Typography>

      <Typography
        level="body-lg"
        sx={{ mt: 4, color: "var(--text-secondary)", lineHeight: 1.8 }}
      >
        I'm a full stack engineer who enjoys building systems that work well. I
        focus on the intersection of good architecture, performance, and
        shipping things that users actually need.
      </Typography>

      <Typography
        level="body-lg"
        sx={{ mt: 3, color: "var(--text-secondary)", lineHeight: 1.8 }}
      >
        Right now I'm at Noisiv Consulting where I'm a co-founder and CTO,
        working on enterprise technology solutions. Before that, I led
        engineering at QID, a digital verification platform, and spent time at
        early-stage startups learning how to build products.
      </Typography>

      <Typography
        level="body-lg"
        sx={{ mt: 3, color: "var(--text-secondary)", lineHeight: 1.8 }}
      >
        I care about code quality, mentoring other engineers, and thinking
        deeply about system design. I believe good engineering is about making
        things simpler, not more complex. When I'm not working, I read about
        distributed systems, play around with new technologies, and contribute
        to open source when I find something interesting.
      </Typography>

      <Box sx={{ mt: 6 }}>
        <Typography
          level="title-lg"
          sx={{ fontWeight: 700, mb: 3, color: "var(--text-primary)" }}
        >
          Technical Skills
        </Typography>
        <Stack spacing={3}>
          {Object.entries(skillCategories).map(([category, skills]) => (
            <Box key={category}>
              <Typography
                level="body-sm"
                sx={{
                  fontWeight: 600,
                  mb: 1.5,
                  color: "var(--accent)",
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  letterSpacing: "0.5px",
                }}
              >
                {category}
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                sx={{ flexWrap: "wrap", gap: 1 }}
              >
                {skills.map((skill) => (
                  <Chip
                    key={skill}
                    variant="soft"
                    size="sm"
                    sx={{
                      bgcolor: "var(--surface-secondary) !important",
                      color: "var(--foreground) !important",
                    }}
                  >
                    {skill}
                  </Chip>
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
