import {
  Box,
  Typography,
  Link as JoyLink,
  Stack,
} from "@mui/joy";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: { xs: 8, md: 12 },
        py: { xs: 4, md: 6 },
        px: { xs: 1.5, sm: 2, md: 3 },
        borderTop: "1px solid var(--border)",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Gradient divider */}
      <Box
        sx={{
          position: "absolute",
          top: -1,
          left: "10%",
          right: "10%",
          height: 1,
          background: "var(--accent-gradient)",
          opacity: 0.4,
        }}
      />

      <Box
        sx={{
          maxWidth: 980,
          mx: "auto",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 3, md: 4 },
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            level="title-md"
            sx={{
              fontWeight: 700,
              color: "var(--text-primary)",
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "-0.01em",
            }}
          >
            Subhadeep Datta
          </Typography>
          <Typography
            level="body-sm"
            sx={{
              mt: 0.5,
              maxWidth: 360,
              color: "var(--text-secondary)",
              fontSize: { xs: "14px", md: "15px" },
              lineHeight: 1.6,
            }}
          >
            Full stack engineer building performant, scalable systems.
            Always shipping.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <SocialLinks
              links={{
                github: "https://github.com/subhoS",
                linkedin: "https://www.linkedin.com/in/subhadeep-datta-cto/",
                x: "https://x.com/SubhadeepDataa",
              }}
            />
          </Box>
        </Box>

        <Stack
          direction="row"
          spacing={4}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <Box>
            <Typography
              level="body-xs"
              sx={{
                fontWeight: 600,
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "1px",
                mb: 1.5,
                fontSize: "11px",
              }}
            >
              Navigate
            </Typography>
            {["Projects", "Blog", "About", "Contact"].map((item) => (
              <Typography
                key={item}
                component="a"
                href={`/${item.toLowerCase()}`}
                level="body-sm"
                sx={{
                  display: "block",
                  color: "var(--text-secondary)",
                  mb: 1,
                  fontSize: "14px",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                  "&:hover": { color: "var(--accent)" },
                  "&::after": { display: "none" },
                }}
              >
                {item}
              </Typography>
            ))}
          </Box>
          <Box>
            <Typography
              level="body-xs"
              sx={{
                fontWeight: 600,
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "1px",
                mb: 1.5,
                fontSize: "11px",
              }}
            >
              Resources
            </Typography>
            {[
              { label: "Resume", href: "/resume.pdf" },
              { label: "GitHub", href: "https://github.com/subhoS" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/subhadeep-datta-cto/" },
            ].map((item) => (
              <Typography
                key={item.label}
                component="a"
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                level="body-sm"
                sx={{
                  display: "block",
                  color: "var(--text-secondary)",
                  mb: 1,
                  fontSize: "14px",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                  "&:hover": { color: "var(--accent)" },
                  "&::after": { display: "none" },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Box>
        </Stack>
      </Box>

      <Box
        sx={{
          mt: { xs: 3, md: 5 },
          textAlign: "center",
          maxWidth: 980,
          mx: "auto",
        }}
      >
        <Typography
          level="body-xs"
          sx={{
            color: "var(--text-tertiary)",
            fontSize: "12px",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          © {new Date().getFullYear()} Subhadeep Datta · Built with Next.js
        </Typography>
      </Box>
    </Box>
  );
}
