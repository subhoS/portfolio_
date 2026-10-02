"use client";

import { Card, Typography, CardContent, Box, Chip } from "@mui/joy";
import Link from "next/link";
import TiltCard from "./TiltCard";

type Props = {
  title: string;
  description: string;
  date: string;
  slug: string;
  tags?: string[];
};

export default function BlogCard({
  title,
  description,
  date,
  slug,
  tags = [],
}: Props) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link href={`/blog/${slug}`} style={{ textDecoration: "none" }}>
      <TiltCard>
        <Card
          variant="outlined"
          sx={{
            width: "100%",
            minHeight: 240,
            bgcolor: "rgba(var(--surface-rgb), 0.6) !important",
            borderColor: "var(--border) !important",
            color: "var(--foreground) !important",
            display: "flex",
            flexDirection: "column",
            backdropFilter: "blur(12px)",
            cursor: "pointer",
            transition: "all 0.4s cubic-bezier(0.21, 0.47, 0.32, 0.98)",
            "&:hover": {
              borderColor: "var(--accent) !important",
              boxShadow: "0 12px 40px rgba(124,58,237,0.25)",
              transform: "translateY(-4px)",
              bgcolor: "rgba(var(--surface-rgb), 0.8) !important",
            },
          }}
        >
          <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", zIndex: 2 }}>
            <Typography
              level="body-xs"
              sx={{
                color: "var(--accent)",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {formattedDate}
            </Typography>
            <Typography
              level="h4"
              sx={{
                fontSize: { xs: 16, md: 18 },
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: 1.3,
                mt: 1,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {title}
            </Typography>
            <Typography
              level="body-sm"
              sx={{
                mt: 1,
                color: "var(--text-secondary)",
                fontSize: { xs: "14px", md: "15px" },
                flex: 1,
                lineHeight: 1.6,
              }}
            >
              {description}
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 0.75,
                mt: { xs: 1.5, md: 2 },
                flexWrap: "wrap",
              }}
            >
              {tags.slice(0, 2).map((tag) => (
                <Chip
                  key={tag}
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
                  {tag}
                </Chip>
              ))}
            </Box>
          </CardContent>
        </Card>
      </TiltCard>
    </Link>
  );
}
