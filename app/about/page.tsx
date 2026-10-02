import { Box, Typography, Stack, Chip } from "@mui/joy";
import type { Metadata } from "next";
import ScrollReveal from "../../components/ScrollReveal";
import profile from "../../data/profile.json";
import FloatingSparkles from "../../components/FloatingSparkles";

export const metadata: Metadata = {
  title: `About — ${profile.displayName || profile.name}`,
  description: profile.shortBio,
};

export default function About() {
  const experience = profile.experience || [];
  
  const skillCategories = [
    {
      category: "Backend & Systems",
      emoji: "⚙️",
      skills: profile.skills?.backend || [],
    },
    {
      category: "Frontend & UI",
      emoji: "🎨",
      skills: profile.skills?.frontend || [],
    },
    {
      category: "Cloud & DevOps",
      emoji: "☁️",
      skills: profile.skills?.cloudDevOps || [],
    },
    {
      category: "Databases & Data",
      emoji: "🗄️",
      skills: profile.skills?.databases || [],
    },
    {
      category: "AI & ML",
      emoji: "🤖",
      skills: profile.skills?.aiMl || [],
    },
    {
      category: "Architecture & Leadership",
      emoji: "🏗️",
      skills: [...(profile.skills?.systemDesign || []), ...(profile.skills?.professional || [])],
    },
  ];

  return (
    <Box
      sx={{
        px: { xs: 1.5, sm: 2, md: 3 },
        py: { xs: 6, md: 12 },
        maxWidth: 780,
        mx: "auto",
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
        <ScrollReveal>
          <Box sx={{ display: "inline-block", position: "relative" }}>
            <Box sx={{ position: "absolute", top: -20, right: -40 }}>
              <FloatingSparkles />
            </Box>
            <Typography
              level="h1"
              sx={{
                fontSize: { xs: 36, sm: 48, md: 64 },
                fontWeight: 900,
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.1,
                letterSpacing: "-0.04em",
                color: "var(--text-primary)",
              }}
            >
              Behind the{" "}
              <Box
                component="span"
                sx={{
                  background: "var(--accent-gradient)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  position: "relative",
                  display: "inline-block",
                }}
              >
                code
              </Box>
            </Typography>
          </Box>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <Typography
            level="body-lg"
            sx={{
              mt: 3,
              mx: "auto",
              color: "var(--text-secondary)",
              fontSize: { xs: "16px", md: "18px" },
              lineHeight: 1.8,
              maxWidth: 640,
            }}
          >
            {profile.longBio}
          </Typography>
        </ScrollReveal>
      </Box>

      {/* Experience Timeline */}
      <Box sx={{ mt: { xs: 6, md: 8 } }}>
        <ScrollReveal>
          <Typography
            level="h2"
            sx={{
              fontSize: { xs: 22, sm: 26, md: 30 },
              fontWeight: 800,
              color: "var(--text-primary)",
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "-0.02em",
              mb: { xs: 3, md: 4 },
            }}
          >
            Experience
          </Typography>
        </ScrollReveal>

        <Box sx={{ position: "relative", pl: { xs: 3, md: 4 } }}>
          {/* Timeline line */}
          <Box
            sx={{
              position: "absolute",
              left: { xs: 6, md: 8 },
              top: 8,
              bottom: 8,
              width: 2,
              background: "var(--accent-gradient)",
              opacity: 0.3,
              borderRadius: 1,
            }}
          />

          {experience.map((exp, i) => (
            <ScrollReveal key={exp.company} delay={i * 0.15}>
              <Box
                sx={{
                  position: "relative",
                  mb: { xs: 4, md: 5 },
                  "&:last-child": { mb: 0 },
                }}
              >
                {/* Timeline dot */}
                <Box
                  sx={{
                    position: "absolute",
                    left: { xs: -24, md: -28 },
                    top: 24,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: "var(--accent-gradient)",
                    border: "3px solid var(--background)",
                    zIndex: 2,
                    boxShadow: "0 0 10px rgba(124,58,237,0.5)",
                  }}
                />

                <Box
                  sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: "20px",
                    bgcolor: "rgba(var(--surface-rgb), 0.4)",
                    border: "1px solid rgba(124,58,237,0.1)",
                    backdropFilter: "blur(12px)",
                    transition: "all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
                    "&:hover": {
                      borderColor: "rgba(124,58,237,0.4)",
                      transform: "translateX(8px)",
                      boxShadow: "0 12px 32px rgba(124,58,237,0.15)",
                      bgcolor: "rgba(var(--surface-rgb), 0.6)",
                    },
                  }}
                >
                  <Typography
                    level="body-xs"
                    sx={{
                      color: "var(--accent)",
                      fontWeight: 600,
                      fontSize: "12px",
                      fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      mb: 0.5,
                    }}
                  >
                    {exp.period}
                  </Typography>

                  <Typography
                    level="h4"
                    sx={{
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: { xs: 18, md: 22 },
                      lineHeight: 1.3,
                    }}
                  >
                    {exp.role}
                  </Typography>
                  <Typography
                    level="body-sm"
                    sx={{
                      color: "var(--text-secondary)",
                      fontWeight: 500,
                      mb: 2,
                      fontSize: "15px",
                    }}
                  >
                    {exp.company}
                  </Typography>

                  <Stack spacing={1}>
                      <Typography
                        level="body-sm"
                        sx={{
                          color: "var(--text-secondary)",
                          position: "relative",
                          fontSize: "15px",
                          lineHeight: 1.7,
                        }}
                      >
                        {exp.summary}
                      </Typography>
                  </Stack>
                </Box>
              </Box>
            </ScrollReveal>
          ))}
        </Box>
      </Box>

      {/* Skills Grid */}
      <Box sx={{ mt: { xs: 6, md: 8 } }}>
        <ScrollReveal>
          <Typography
            level="h2"
            sx={{
              fontSize: { xs: 22, sm: 26, md: 30 },
              fontWeight: 800,
              color: "var(--text-primary)",
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "-0.02em",
              mb: { xs: 3, md: 4 },
            }}
          >
            Tech stack
          </Typography>
        </ScrollReveal>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
            gap: 2,
          }}
        >
          {skillCategories.map((cat, i) => (
            <ScrollReveal key={cat.category} delay={i * 0.08}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: "16px",
                  bgcolor: "rgba(var(--surface-rgb), 0.5)",
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
                <Typography sx={{ fontSize: "24px", mb: 1 }}>
                  {cat.emoji}
                </Typography>
                <Typography
                  level="title-sm"
                  sx={{
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    fontFamily: "'Inter', sans-serif",
                    mb: 1.5,
                  }}
                >
                  {cat.category}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                  {cat.skills.map((skill) => (
                    <Chip
                      key={skill}
                      size="sm"
                      variant="soft"
                      sx={{
                        bgcolor: "rgba(124,58,237,0.1) !important",
                        color: "var(--accent) !important",
                        fontSize: "12px",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 500,
                        borderRadius: "6px",
                      }}
                    >
                      {skill}
                    </Chip>
                  ))}
                </Box>
              </Box>
            </ScrollReveal>
          ))}
        </Box>
      </Box>

      {/* What I Value */}
      <ScrollReveal>
        <Box
          sx={{
            mt: { xs: 6, md: 8 },
            p: { xs: 3, md: 4 },
            borderRadius: "20px",
            bgcolor: "rgba(var(--surface-rgb), 0.4)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(12px)",
          }}
        >
          <Typography
            level="h3"
            sx={{
              fontWeight: 700,
              color: "var(--text-primary)",
              fontFamily: "'Inter', sans-serif",
              fontSize: { xs: 18, md: 22 },
              mb: 2,
            }}
          >
            What I value
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 2,
            }}
          >
            {[
              {
                icon: "⚡",
                title: "Performance",
                desc: "Every millisecond matters. I obsess over load times, bundle sizes, and runtime efficiency.",
              },
              {
                icon: "🧱",
                title: "Clean architecture",
                desc: "Code should be simple to understand, easy to change, and hard to break. No clever hacks.",
              },
              {
                icon: "🚀",
                title: "Shipping",
                desc: "The best code is code that's deployed. I bias toward action and iterating fast.",
              },
              {
                icon: "🤝",
                title: "Team growth",
                desc: "Great products come from great teams. I invest in mentoring, code reviews, and culture.",
              },
            ].map((value) => (
              <Box
                key={value.title}
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(124,58,237,0.04)",
                  },
                }}
              >
                <Typography sx={{ fontSize: "20px", mb: 0.5 }}>
                  {value.icon}
                </Typography>
                <Typography
                  level="title-sm"
                  sx={{
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    fontFamily: "'Inter', sans-serif",
                    mb: 0.5,
                  }}
                >
                  {value.title}
                </Typography>
                <Typography
                  level="body-sm"
                  sx={{
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                    lineHeight: 1.6,
                  }}
                >
                  {value.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </ScrollReveal>
    </Box>
  );
}
