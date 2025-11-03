import {
  Box,
  Typography,
  Link as JoyLink,
  Input,
  Button,
  Stack,
} from "@mui/joy";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: { xs: 6, md: 8 },
        py: { xs: 6, md: 8 },
        px: { xs: 1.5, sm: 2, md: 3 },
        borderTop: "1px solid var(--border)",
        bgcolor: "var(--surface) !important",
        color: "var(--foreground) !important",
      }}
    >
      <Box
        sx={{
          maxWidth: 980,
          mx: "auto",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 4, md: 4 },
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            level="title-md"
            sx={{ fontWeight: 600, color: "var(--text-primary)" }}
          >
            About
          </Typography>
          <Typography
            level="body-sm"
            sx={{
              mt: 1,
              maxWidth: 420,
              color: "var(--text-secondary)",
              fontSize: { xs: "14px", md: "15px" },
            }}
          >
            Subhadeep Datta — software engineer building performant, accessible
            web experiences. Find my work and get in touch.
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

        <Box sx={{ width: { xs: "100%", md: "auto" } }}>
          <Typography
            level="title-md"
            sx={{ fontWeight: 600, color: "var(--text-primary)" }}
          >
            Newsletter
          </Typography>
          <Typography
            level="body-sm"
            sx={{
              mt: 1,
              color: "var(--text-secondary)",
              fontSize: { xs: "14px", md: "15px" },
            }}
          >
            Get occasional updates and posts.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, md: 1 }}
            sx={{ mt: 2 }}
          >
            <Input
              placeholder="Your email"
              aria-label="Email for newsletter"
              sx={{
                borderColor: "var(--border) !important",
                color: "var(--foreground) !important",
                bgcolor: "var(--background) !important",
                width: { xs: "100%", sm: "200px" },
                "& input": {
                  color: "var(--foreground) !important",
                },
                "& input::placeholder": {
                  color: "var(--text-tertiary) !important",
                },
              }}
            />
            <Button
              variant="solid"
              color="primary"
              sx={{
                bgcolor: "var(--accent) !important",
                color: "var(--background) !important",
                width: { xs: "100%", sm: "auto" },
                "&:hover": {
                  bgcolor: "var(--accent-dark) !important",
                },
              }}
            >
              Subscribe
            </Button>
          </Stack>
        </Box>
      </Box>

      <Box sx={{ mt: { xs: 4, md: 6 }, textAlign: "center" }}>
        <Typography
          level="body-sm"
          sx={{
            color: "var(--text-secondary)",
            fontSize: { xs: "13px", md: "14px" },
          }}
        >
          © {new Date().getFullYear()} Subhadeep Datta —{" "}
          <JoyLink
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: "var(--accent)" }}
          >
            Download resume
          </JoyLink>
        </Typography>
      </Box>
    </Box>
  );
}
