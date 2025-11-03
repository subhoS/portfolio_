"use client";

import { Card, Typography, CardContent, Box, Chip } from "@mui/joy";
import Link from "next/link";

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
          cursor: "pointer",
          "&:hover": {
            transform: { xs: "none", md: "translateY(-8px) scale(1.02)" },
            boxShadow: { xs: "sm", md: "lg" },
            borderImage: "var(--accent-gradient) 1",
            borderColor: "var(--accent) !important",
          },
          "&:active": {
            transform: { xs: "scale(0.98)", md: "none" },
          },
        }}
      >
        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Typography
            level="body-xs"
            sx={{
              color: "var(--text-secondary)",
              fontSize: "12px",
              fontWeight: 500,
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
              lineHeight: 1.5,
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
                  bgcolor: "var(--surface-secondary) !important",
                  color: "var(--foreground) !important",
                  fontSize: "12px",
                  py: 0.5,
                }}
              >
                {tag}
              </Chip>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
}
