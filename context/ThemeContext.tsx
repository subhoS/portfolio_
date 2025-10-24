"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  theme: "light" | "dark";
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mode, setMode] = useState<ThemeMode>("system");
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true);

    // Get saved preference or system preference
    const savedMode =
      (localStorage.getItem("themeMode") as ThemeMode) || "system";
    setMode(savedMode);

    // Determine actual theme
    const determineTheme = () => {
      if (savedMode === "light") {
        return "light";
      } else if (savedMode === "dark") {
        return "dark";
      } else {
        // system
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
    };

    const initialTheme = determineTheme();
    setTheme(initialTheme);
    applyTheme(initialTheme);

    // Listen to system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (savedMode === "system") {
        const newTheme = mediaQuery.matches ? "dark" : "light";
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const applyTheme = (newTheme: "light" | "dark") => {
    const root = document.documentElement;
    root.setAttribute("data-theme", newTheme);

    if (newTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  };

  const setModeAndTheme = (newMode: ThemeMode) => {
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);

    let newTheme: "light" | "dark";
    if (newMode === "light") {
      newTheme = "light";
    } else if (newMode === "dark") {
      newTheme = "dark";
    } else {
      newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setMode(newTheme);
    localStorage.setItem("themeMode", newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mode,
        setMode: setModeAndTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
