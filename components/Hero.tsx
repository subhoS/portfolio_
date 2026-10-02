"use client";

import { Box, Typography, Button, Stack, Avatar } from "@mui/joy";
import { motion } from "framer-motion";
import profile from "../data/profile.json";
import AnimatedText from "./AnimatedText";

export default function Hero() {
  const name = profile.displayName || profile.name || "";
  const avatar = profile.avatar || "/profile.svg";

  return (
    <Box
      sx={{
        maxWidth: 980,
        mx: "auto",
        px: { xs: 1.5, sm: 2, md: 3 },
        py: { xs: 6, md: 12 },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <Box
          sx={{
            display: "flex",
            gap: { xs: 3, md: 5 },
            alignItems: "center",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* Avatar with glow ring */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 3 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Box
              sx={{
                position: "relative",
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: -4,
                  borderRadius: "50%",
                  background: "var(--accent-gradient)",
                  opacity: 0.6,
                  filter: "blur(8px)",
                  animation: "pulse-glow 3s ease-in-out infinite",
                  "@keyframes pulse-glow": {
                    "0%, 100%": { opacity: 0.4, transform: "scale(1)" },
                    "50%": { opacity: 0.7, transform: "scale(1.05)" },
                  },
                }}
              />
              <Avatar
                src={avatar}
                size="lg"
                variant="soft"
                sx={{
                  width: { xs: 120, md: 160 },
                  height: { xs: 120, md: 160 },
                  bgcolor: "var(--surface-secondary)",
                  border: "3px solid var(--border)",
                  position: "relative",
                  zIndex: 1,
                }}
              />
            </Box>
          </motion.div>

          <Box sx={{ width: "100%", textAlign: { xs: "center", md: "left" } }}>
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 0.5,
                  borderRadius: "999px",
                  bgcolor: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  mb: 2,
                  fontSize: "13px",
                  color: "var(--success)",
                  fontWeight: 500,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "var(--success)",
                    animation: "blink 2s ease-in-out infinite",
                    "@keyframes blink": {
                      "0%, 100%": { opacity: 1 },
                      "50%": { opacity: 0.3 },
                    },
                  }}
                />
                Open to interesting projects
              </Box>
            </motion.div>

            {/* Main heading with gradient name */}
            <Typography
              level="h1"
              sx={{
                fontSize: { xs: 28, sm: 36, md: 48 },
                fontWeight: 800,
                color: "var(--text-primary)",
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Hi, I'm{" "}
              <Box
                component="span"
                sx={{
                  background: "var(--accent-gradient)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {name}
              </Box>
            </Typography>

            {/* Animated role titles */}
            <Typography
              level="h2"
              sx={{
                fontSize: { xs: 20, sm: 24, md: 28 },
                fontWeight: 600,
                mt: 1,
                color: "var(--text-primary)",
                lineHeight: 1.3,
                letterSpacing: "-0.02em",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              I'm a{" "}
              <AnimatedText
                words={[
                  "Full Stack Engineer",
                  "Consulting CTO",
                  "Startup Co-Founder",
                  "Technical Leader",
                ]}
                interval={3000}
              />
            </Typography>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Typography
                level="body-lg"
                sx={{
                  mt: 2,
                  color: "var(--text-secondary)",
                  fontSize: { xs: "15px", md: "17px" },
                  maxWidth: 560,
                  lineHeight: 1.7,
                  mx: { xs: "auto", md: 0 },
                }}
              >
                {profile.shortBio}
              </Typography>
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1.5, md: 2 }}
                sx={{
                  mt: { xs: 3, md: 4 },
                  width: "100%",
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <Button
                  component="a"
                  href="/projects"
                  variant="solid"
                  color="primary"
                  size="lg"
                  sx={{
                    background: "var(--accent-gradient) !important",
                    color: "#fff !important",
                    fontSize: { xs: "15px", md: "16px" },
                    py: { xs: 1.2, md: 1.5 },
                    px: 4,
                    fontWeight: 600,
                    borderRadius: "12px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "var(--accent-gradient-hover) !important",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(124,58,237,0.3)",
                    },
                  }}
                >
                  See my work →
                </Button>
                <Button
                  component="a"
                  href="/contact"
                  variant="outlined"
                  size="lg"
                  sx={{
                    color: "var(--foreground) !important",
                    borderColor: "var(--border) !important",
                    fontSize: { xs: "15px", md: "16px" },
                    py: { xs: 1.2, md: 1.5 },
                    px: 4,
                    fontWeight: 600,
                    borderRadius: "12px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: "var(--surface-secondary)",
                      borderColor: "var(--accent) !important",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Get in touch
                </Button>
                <Button
                  component="a"
                  href="/resume.pdf"
                  target="_blank"
                  variant="plain"
                  size="lg"
                  sx={{
                    color: "var(--text-secondary) !important",
                    fontSize: { xs: "15px", md: "16px" },
                    fontWeight: 500,
                    "&:hover": {
                      color: "var(--accent) !important",
                      bgcolor: "transparent",
                    },
                  }}
                >
                  Resume ↗
                </Button>
              </Stack>
            </motion.div>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}
