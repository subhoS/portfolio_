import SEO from "../../components/SEO";
import { Box, Typography, Stack, Chip } from "@mui/joy";

export default function AboutPage() {
  const skills = [
    "React",
    "TypeScript",
    "Next.js",
    "Node.js",
    "Performance Optimization",
    "SEO",
    "Accessibility",
  ];

  return (
    <Box sx={{ px: 2, py: { xs: 4, md: 8 }, maxWidth: 780, mx: "auto" }}>
      <SEO title="About" description="About Subhadeep Datta" url="/about" />

      <Typography
        level="h1"
        sx={{ fontSize: { xs: 28, md: 40 }, fontWeight: 800, mb: 2 }}
      >
        About me
      </Typography>

      <Typography
        level="body-lg"
        sx={{ mt: 4, color: "text.secondary", lineHeight: 1.8 }}
      >
        I'm a software engineer specializing in frontend architecture,
        performance optimization, and building scalable web applications. With
        over 4 years of experience, I've helped teams deliver fast, accessible,
        and SEO-optimized web experiences.
      </Typography>

      <Typography
        level="body-lg"
        sx={{ mt: 3, color: "text.secondary", lineHeight: 1.8 }}
      >
        I'm passionate about writing clean, maintainable code and mentoring
        other engineers. When I'm not coding, you can find me contributing to
        open source projects or exploring new technologies.
      </Typography>

      <Box sx={{ mt: 6 }}>
        <Typography level="title-lg" sx={{ fontWeight: 700, mb: 2 }}>
          Skills & Technologies
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
          {skills.map((skill) => (
            <Chip key={skill} variant="soft" size="md">
              {skill}
            </Chip>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
