"use client";

import Link from "next/link";
import {
  Box,
  Typography,
  IconButton,
  Sheet,
  Button,
  Drawer,
  List,
  ListItem,
} from "@mui/joy";
import { useState } from "react";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import SocialLinks from "./SocialLinks";
import ThemeToggle from "./ThemeToggle";
import profile from "../data/profile.json";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <Sheet
      component="header"
      variant="outlined"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: { xs: 1.5, sm: 2, md: 3 },
        py: { xs: 1.5, md: 2 },
        gap: 1,
        position: "sticky",
        top: 0,
        zIndex: 1200,
        backdropFilter: "blur(6px)",
        bgcolor: "var(--surface) !important",
        borderColor: "var(--border) !important",
        color: "var(--foreground) !important",
      }}
    >
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          gap: 8,
          flex: 1,
        }}
      >
        <img
          src={profile.logo || "/logo.svg"}
          alt={`${profile.name || "Site"} logo`}
          width={40}
          height={40}
          style={{ borderRadius: 6, flexShrink: 0 }}
        />
        <Typography
          level="title-lg"
          sx={{
            fontWeight: 700,
            color: "var(--foreground) !important",
            fontSize: { xs: "16px", md: "18px" },
            display: { xs: "none", md: "block" },
          }}
        >
          {profile.name}
        </Typography>
      </Link>

      {/* Mobile Menu Button */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          gap: 1,
          alignItems: "center",
        }}
      >
        <ThemeToggle />
        <IconButton
          variant="plain"
          size="sm"
          onClick={() => setMobileMenuOpen(true)}
          sx={{ color: "var(--foreground) !important" }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Desktop Navigation */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          gap: 1,
        }}
      >
        <nav
          aria-label="Primary"
          style={{ display: "flex", gap: 2, alignItems: "center" }}
        >
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ textDecoration: "none" }}
            >
              <Button
                variant="plain"
                size="sm"
                sx={{
                  color: "var(--foreground) !important",
                  fontSize: "14px",
                  "&:hover": {
                    bgcolor: "var(--surface-secondary)",
                  },
                }}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <ThemeToggle />

        <Box sx={{ display: "flex" }}>
          <SocialLinks links={profile.socials || {}} />
        </Box>
      </Box>

      {/* Mobile Drawer Menu */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          zIndex: 1400,
          "& [role='presentation']": {
            bgcolor: "var(--surface) !important",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid var(--border)",
          }}
        >
          <Typography level="h4">Menu</Typography>
          <IconButton
            variant="plain"
            onClick={() => setMobileMenuOpen(false)}
            sx={{ color: "var(--foreground) !important" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <List sx={{ p: 2, width: 280 }}>
          {navigationItems.map((item) => (
            <ListItem key={item.href} sx={{ mb: 1 }}>
              <Link
                href={item.href}
                style={{ textDecoration: "none", width: "100%" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button
                  fullWidth
                  variant="plain"
                  sx={{
                    color: "var(--foreground) !important",
                    justifyContent: "flex-start",
                    fontSize: "16px",
                    "&:hover": {
                      bgcolor: "var(--surface-secondary)",
                    },
                  }}
                >
                  {item.label}
                </Button>
              </Link>
            </ListItem>
          ))}
        </List>
        <Box sx={{ p: 2, borderTop: "1px solid var(--border)" }}>
          <SocialLinks links={profile.socials || {}} />
        </Box>
      </Drawer>
    </Sheet>
  );
}
