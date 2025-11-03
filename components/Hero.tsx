"use client";

import { Box, Typography, Button, Stack, Avatar } from "@mui/joy";
import { motion } from "framer-motion";
import profile from "../data/profile.json";
import FloatingSparkles from "./FloatingSparkles";

export default function Hero() {
  const name = profile.displayName || profile.name || "";
  const title = profile.title || "";
  const shortBio = profile.shortBio || "";
  const avatar = profile.avatar || "/profile.svg";

  return (
    <Box
      sx={{
        maxWidth: 980,
        mx: "auto",
        px: { xs: 1.5, sm: 2, md: 3 },
        py: { xs: 6, md: 10 },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box
          sx={{
            display: "flex",
            gap: { xs: 3, md: 4 },
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
              width: { xs: 120, md: 160 },
              height: { xs: 120, md: 160 },
              bgcolor: "var(--surface-secondary)",
              flexShrink: 0,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05) rotate(5deg)",
              },
            }}
          />
          <Box sx={{ width: "100%" }}>
            <Typography
              level="h1"
              sx={{
                fontSize: { xs: 24, sm: 32, md: 40 },
                fontWeight: 800,
                color: "var(--text-primary)",
                lineHeight: 1.2,
              }}
            >
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  animation: "wave 2s ease-in-out infinite",
                  transformOrigin: "70% 70%",
                  "@keyframes wave": {
                    "0%": { transform: "rotate(0deg)" },
                    "10%": { transform: "rotate(14deg)" },
                    "20%": { transform: "rotate(-8deg)" },
                    "30%": { transform: "rotate(14deg)" },
                    "40%": { transform: "rotate(-4deg)" },
                    "50%": { transform: "rotate(10deg)" },
                    "60%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(0deg)" },
                  },
                }}
              >
                👋
              </Box>{" "}
              Hi, I'm <span style={{ color: "var(--accent)" }}>{name}</span>
            </Typography>
            <Typography
              level="body-lg"
              sx={{
                mt: { xs: 1.5, md: 2 },
                color: "var(--text-secondary)",
                fontSize: { xs: "15px", md: "16px" },
              }}
            >
              {shortBio || title}
              <FloatingSparkles />
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1.5, md: 2 }}
              sx={{ mt: { xs: 3, md: 4 }, width: "100%" }}
            >
              <Button
                component="a"
                href="/projects"
                variant="solid"
                color="primary"
                sx={{
                  bgcolor: "var(--accent) !important",
                  color: "var(--background) !important",
                  fontSize: { xs: "15px", md: "16px" },
                  py: { xs: 1, md: 1.2 },
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
                  fontSize: { xs: "15px", md: "16px" },
                  py: { xs: 1, md: 1.2 },
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
