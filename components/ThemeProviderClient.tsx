"use client";

import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import React from "react";

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          solidBg: "#0ea5a4",
          solidHoverBg: "#089e9d",
          plainColor: "#0ea5a4",
        },
        background: {
          surface: "#fafafa",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          solidBg: "#06b6d4",
          solidHoverBg: "#0891b2",
          plainColor: "#06b6d4",
        },
        background: {
          surface: "#1a1a1a",
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
  return <CssVarsProvider theme={theme}>{children}</CssVarsProvider>;
}
