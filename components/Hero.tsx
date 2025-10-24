"use client";

import { Box, Typography, Button, Stack, Avatar } from "@mui/joy";
import { motion } from "framer-motion";
import profile from "../data/profile.json";

export default function Hero() {
  const name = profile.displayName || profile.name || "";
  const title = profile.title || "";
  const shortBio = profile.shortBio || "";
  const avatar = profile.avatar || "/profile.svg";

  return (
    <Box sx={{ maxWidth: 980, mx: "auto", px: 2, py: 10 }}>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 4,
            alignItems: "center",
            flexDirection: { xs: "column", md: "row" },
            color: "var(--foreground)",
          }}
        >
          <Avatar
            src={avatar}
            size="lg"
            variant="soft"
            sx={{
              width: 160,
              height: 160,
              bgcolor: "var(--surface-secondary)",
            }}
          />
          <Box>
            <Typography
              level="h1"
              sx={{
                fontSize: { xs: 28, md: 40 },
                fontWeight: 800,
                color: "var(--text-primary)",
              }}
            >
              Hi, I'm <span style={{ color: "var(--accent)" }}>{name}</span>
            </Typography>
            <Typography
              level="body-lg"
              sx={{ mt: 2, color: "var(--text-secondary)" }}
            >
              {shortBio || title}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button
                component="a"
                href="/projects"
                variant="solid"
                color="primary"
                sx={{
                  bgcolor: "var(--accent) !important",
                  color: "var(--background) !important",
                  "&:hover": {
                    bgcolor: "var(--accent-dark) !important",
                  },
                }}
              >
                See projects
              </Button>
              <Button
                component="a"
                href="/contact"
                variant="outlined"
                sx={{
                  color: "var(--foreground) !important",
                  borderColor: "var(--border) !important",
                  "&:hover": {
                    bgcolor: "var(--surface-secondary)",
                  },
                }}
              >
                Get in touch
              </Button>
            </Stack>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}
