"use client";

import {
  Card,
  Typography,
  Chip,
  CardContent,
  CardOverflow,
  Sheet,
  Box,
} from "@mui/joy";

type Props = {
  title: string;
  description: string;
  tech?: string[];
  href?: string;
};

export default function ProjectCard({
  title,
  description,
  tech = [],
  href,
}: Props) {
  return (
    <Card
      variant="outlined"
      sx={{
        minWidth: 280,
        transition: "all 0.3s ease",
        bgcolor: "var(--surface) !important",
        borderColor: "var(--border) !important",
        color: "var(--foreground) !important",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "md",
          borderColor: "var(--accent) !important",
        },
        cursor: href ? "pointer" : "default",
      }}
      component={href ? "a" : "div"}
      {...(href && {
        href,
        style: { textDecoration: "none", color: "inherit" },
      })}
    >
      <CardContent>
        <Typography
          level="h4"
          sx={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}
        >
          {title}
        </Typography>
        <Typography
          level="body-sm"
          sx={{ mt: 1, color: "var(--text-secondary)" }}
        >
          {description}
        </Typography>
        <Sheet
          sx={{
            display: "flex",
            gap: 1,
            mt: 2,
            flexWrap: "wrap",
            bgcolor: "transparent",
          }}
        >
          {tech.map((t) => (
            <Chip
              key={t}
              size="sm"
              variant="soft"
              sx={{
                bgcolor: "var(--surface-secondary) !important",
                color: "var(--foreground) !important",
              }}
            >
              {t}
            </Chip>
          ))}
        </Sheet>
      </CardContent>
      {href && (
        <CardOverflow>
          <Box
            sx={{
              p: 1.5,
              textAlign: "center",
              fontWeight: 600,
              color: "var(--accent)",
            }}
          >
            View project →
          </Box>
        </CardOverflow>
      )}
    </Card>
  );
}
