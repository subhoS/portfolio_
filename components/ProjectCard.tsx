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
import TiltCard from "./TiltCard";

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
  const CardWrapper = href ? "a" : "div";

  return (
    <TiltCard>
      <Card
        variant="outlined"
        sx={{
          width: "100%",
          minHeight: 260,
          bgcolor: "rgba(var(--surface-rgb), 0.6) !important",
          borderColor: "var(--border) !important",
          color: "var(--foreground) !important",
          display: "flex",
          flexDirection: "column",
          backdropFilter: "blur(12px)",
          transition: "all 0.4s cubic-bezier(0.21, 0.47, 0.32, 0.98)",
          cursor: href ? "pointer" : "default",
          "&:hover": {
            borderColor: "var(--accent) !important",
            boxShadow: "0 12px 40px rgba(124,58,237,0.25)",
            transform: "translateY(-4px)",
            bgcolor: "rgba(var(--surface-rgb), 0.8) !important",
          },
        }}
        component={CardWrapper}
        {...(href && {
          href,
          target: "_blank",
          rel: "noopener noreferrer",
          style: {
            textDecoration: "none",
            color: "inherit",
            display: "flex",
            flexDirection: "column",
          },
        })}
      >
        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", zIndex: 2 }}>
          <Typography
            level="h4"
            sx={{
              fontSize: { xs: 16, md: 18 },
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.3,
              fontFamily: "'Inter', sans-serif",
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
              lineHeight: 1.6,
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
                  bgcolor: "rgba(124,58,237,0.1) !important",
                  color: "var(--accent) !important",
                  fontSize: "12px",
                  fontWeight: 500,
                  py: 0.5,
                  borderRadius: "6px",
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
                borderTop: "1px solid var(--border)",
                position: "relative",
                zIndex: 2,
              }}
            >
              View project →
            </Box>
          </CardOverflow>
        )}
      </Card>
    </TiltCard>
  );
}
