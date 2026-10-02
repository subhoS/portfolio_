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
import { usePathname } from "next/navigation";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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
        py: { xs: 1, md: 1.5 },
        gap: 1,
        position: "sticky",
        top: 0,
        zIndex: 1200,
        backdropFilter: "blur(16px) saturate(180%)",
        bgcolor: "rgba(var(--bg-rgb), 0.75) !important",
        borderColor: "var(--border) !important",
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
        color: "var(--foreground) !important",
      }}
    >
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          gap: 10,
          flex: 1,
        }}
      >
        <Box
          component="img"
          src="/logo.png"
          alt={`${profile.name || "Site"} logo`}
          sx={{
            width: { xs: 36, md: 40 },
            height: { xs: 36, md: 40 },
            borderRadius: "10px",
            flexShrink: 0,
            filter: "drop-shadow(0 0 8px rgba(124,58,237,0.3))",
            transition: "all 0.3s ease",
            "&:hover": {
              filter: "drop-shadow(0 0 16px rgba(124,58,237,0.5))",
              transform: "scale(1.05)",
            },
          }}
        />
        <Typography
          level="title-lg"
          sx={{
            fontWeight: 700,
            color: "var(--foreground) !important",
            fontSize: { xs: "16px", md: "18px" },
            display: { xs: "none", md: "block" },
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "-0.02em",
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
          gap: 0.5,
        }}
      >
        <nav
          aria-label="Primary"
          style={{ display: "flex", gap: 4, alignItems: "center" }}
        >
          {navigationItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{ textDecoration: "none" }}
              >
                <Button
                  variant="plain"
                  size="sm"
                  sx={{
                    color: isActive
                      ? "var(--accent) !important"
                      : "var(--text-secondary) !important",
                    fontSize: "14px",
                    fontWeight: isActive ? 600 : 500,
                    fontFamily: "'Inter', sans-serif",
                    position: "relative",
                    "&:hover": {
                      bgcolor: "var(--surface-secondary)",
                      color: "var(--foreground) !important",
                    },
                    "&::after": isActive
                      ? {
                          content: '""',
                          position: "absolute",
                          bottom: 2,
                          left: "20%",
                          right: "20%",
                          height: 2,
                          borderRadius: 1,
                          background: "var(--accent-gradient)",
                        }
                      : {},
                  }}
                >
                  {item.label}
                </Button>
              </Link>
            );
          })}
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
