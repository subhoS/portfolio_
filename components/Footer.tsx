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
        mt: 8,
        py: 8,
        px: 3,
        borderTop: "1px solid",
        borderColor: "divider",
        bgcolor: "background.surface",
      }}
    >
      <Box
        sx={{
          maxWidth: 980,
          mx: "auto",
          display: "flex",
          gap: 4,
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography level="title-md" sx={{ fontWeight: 600 }}>
            About
          </Typography>
          <Typography level="body-sm" sx={{ mt: 1, maxWidth: 420 }}>
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

        <Box>
          <Typography level="title-md" sx={{ fontWeight: 600 }}>
            Newsletter
          </Typography>
          <Typography level="body-sm" sx={{ mt: 1 }}>
            Get occasional updates and posts.
          </Typography>
          <Stack direction="row" sx={{ mt: 2 }}>
            <Input placeholder="Your email" aria-label="Email for newsletter" />
            <Button variant="solid" color="primary">
              Subscribe
            </Button>
          </Stack>
        </Box>
      </Box>

      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Typography level="body-sm">
          © {new Date().getFullYear()} Subhadeep Datta —{" "}
          <JoyLink href="/resume.pdf" target="_blank" rel="noopener noreferrer">
            Download resume
          </JoyLink>
        </Typography>
      </Box>
    </Box>
  );
}
