"use client";

import { IconButton, Box, Dropdown, Menu, MenuItem } from "@mui/joy";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { theme, mode, setMode, toggleTheme } = useTheme();

  return (
    <Box sx={{ position: "relative" }}>
      {/* Quick toggle button */}
      <IconButton
        size="sm"
        variant="plain"
        onClick={toggleTheme}
        sx={{
          display: { xs: "flex", sm: "flex" },
          alignItems: "center",
          justifyContent: "center",
          p: 1,
          borderRadius: "6px",
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: "rgba(14, 165, 233, 0.1)",
          },
        }}
      >
        {theme === "light" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        )}
      </IconButton>
    </Box>
  );
}
