"use client";

import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import React from "react";
import { ThemeProvider } from "../context/ThemeContext";

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          solidBg: "#7c3aed",
          solidHoverBg: "#6d28d9",
          plainColor: "#7c3aed",
        },
        background: {
          surface: "#f8f9fa",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          solidBg: "#a78bfa",
          solidHoverBg: "#8b5cf6",
          plainColor: "#a78bfa",
        },
        background: {
          surface: "#1e293b",
        },
      },
    },
  },
  fontFamily: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  typography: {
    h1: {
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
  },
  components: {
    JoyButton: {
      defaultProps: {
        sx: {
          transition: "all 0.2s ease",
        },
      },
    },
  },
});

export default function ThemeProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CssVarsProvider theme={theme}>
      <ThemeProvider>{children}</ThemeProvider>
    </CssVarsProvider>
  );
}
