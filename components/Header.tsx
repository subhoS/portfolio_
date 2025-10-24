"use client";

import Link from "next/link";
import { Box, Typography, IconButton, Sheet, Button } from "@mui/joy";
import SocialLinks from "./SocialLinks";
import ThemeToggle from "./ThemeToggle";
import profile from "../data/profile.json";

export default function Header() {
  return (
    <Sheet
      component="header"
      variant="outlined"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: { xs: 2, md: 3 },
        py: 2,
        gap: 2,
        position: "sticky",
        top: 0,
        zIndex: 1200,
        backdropFilter: "blur(6px)",
        bgcolor: "background.surface",
      }}
    >
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          gap: 8,
        }}
      >
        <img
          src={profile.logo || "/logo.svg"}
          alt={`${profile.name || "Site"} logo`}
          width={44}
          height={44}
          style={{ borderRadius: 8 }}
        />
        <Typography
          level="title-lg"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            display: { xs: "none", md: "block" },
          }}
        >
          {profile.name}
        </Typography>
      </Link>

      <Box
        sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2 } }}
      >
        <nav
          aria-label="Primary"
          style={{ display: "flex", gap: 4, alignItems: "center" }}
        >
          <Link href="/projects" style={{ textDecoration: "none" }}>
            <Button
              variant="plain"
              size="sm"
              sx={{
                "&:hover": {
                  bgcolor: "var(--joy-palette-action-hoverBg)",
                },
              }}
            >
              Projects
            </Button>
          </Link>
          <Link href="/blog" style={{ textDecoration: "none" }}>
            <Button
              variant="plain"
              size="sm"
              sx={{
                "&:hover": {
                  bgcolor: "var(--joy-palette-action-hoverBg)",
                },
              }}
            >
              Blog
            </Button>
          </Link>
          <Link href="/about" style={{ textDecoration: "none" }}>
            <Button
              variant="plain"
              size="sm"
              sx={{
                "&:hover": {
                  bgcolor: "var(--joy-palette-action-hoverBg)",
                },
              }}
            >
              About
            </Button>
          </Link>
          <Link href="/contact" style={{ textDecoration: "none" }}>
            <Button variant="solid" color="primary" size="sm">
              Contact
            </Button>
          </Link>
        </nav>

        <ThemeToggle />

        <Box sx={{ display: { xs: "none", sm: "flex" } }}>
          <SocialLinks links={profile.socials || {}} />
        </Box>
      </Box>
    </Sheet>
  );
}
