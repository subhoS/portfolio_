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
        width: "100%",
        minHeight: 240,
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        bgcolor: "var(--surface) !important",
        borderColor: "var(--border) !important",
        color: "var(--foreground) !important",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          transform: { xs: "none", md: "translateY(-8px) scale(1.02)" },
          boxShadow: { xs: "sm", md: "lg" },
          borderImage: "var(--accent-gradient) 1",
          borderColor: "var(--accent) !important",
        },
        cursor: href ? "pointer" : "default",
        "&:active": {
          transform: { xs: "scale(0.98)", md: "none" },
        },
      }}
      component={href ? "a" : "div"}
      {...(href && {
        href,
        style: {
          textDecoration: "none",
          color: "inherit",
          display: "flex",
          flexDirection: "column",
        },
      })}
    >
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography
          level="h4"
          sx={{
            fontSize: { xs: 16, md: 18 },
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>
        <Typography
          level="body-sm"
          sx={{
            mt: { xs: 0.75, md: 1 },
            color: "var(--text-secondary)",
            fontSize: { xs: "14px", md: "15px" },
            flex: 1,
            lineHeight: 1.5,
          }}
        >
          {description}
        </Typography>
        <Sheet
          sx={{
            display: "flex",
            gap: 0.75,
            mt: { xs: 1.5, md: 2 },
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
                fontSize: "12px",
                py: 0.5,
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
              p: { xs: 1.25, md: 1.5 },
              textAlign: "center",
              fontWeight: 600,
              color: "var(--accent)",
              fontSize: { xs: "14px", md: "15px" },
            }}
          >
            View project →
          </Box>
        </CardOverflow>
      )}
    </Card>
  );
}
