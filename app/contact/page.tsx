"use client";

import { useState } from "react";
import profile from "../../data/profile.json";
import {
  Box,
  Typography,
  Button,
  Input,
  Stack,
  Alert,
  FormLabel,
  Textarea,
} from "@mui/joy";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setStatus("sent");
        setName("");
        setEmail("");
        setMessage("");
        setTimeout(() => setStatus(null), 5000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <Box sx={{ px: { xs: 1.5, sm: 2, md: 3 }, py: { xs: 6, md: 12 }, maxWidth: 600, mx: "auto" }}>
      <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
        <Typography
          level="h1"
          sx={{
            fontSize: { xs: 36, sm: 48, md: 56 },
            fontWeight: 900,
            mb: 2,
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "-0.03em",
          }}
        >
          Let's{" "}
          <Box
            component="span"
            sx={{
              background: "var(--accent-gradient)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            connect
          </Box>
        </Typography>

        <Typography
          level="body-lg"
          sx={{
            color: "var(--text-secondary)",
            fontSize: { xs: "16px", md: "18px" },
            maxWidth: 500,
            mx: "auto",
            lineHeight: 1.6,
          }}
        >
          Have a question or want to collaborate? Send a message or reach out directly.
        </Typography>
      </Box>

      <Stack component="form" onSubmit={handleSubmit} spacing={2}>
        <Box>
          <FormLabel sx={{ color: "var(--text-primary)" }}>Name</FormLabel>
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{
              borderColor: "var(--border) !important",
              color: "var(--foreground) !important",
              bgcolor: "var(--surface) !important",
              "& input": {
                color: "var(--foreground) !important",
              },
              "& input::placeholder": {
                color: "var(--text-tertiary) !important",
              },
            }}
          />
        </Box>

        <Box>
          <FormLabel sx={{ color: "var(--text-primary)" }}>Email</FormLabel>
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              borderColor: "var(--border) !important",
              color: "var(--foreground) !important",
              bgcolor: "var(--surface) !important",
              "& input": {
                color: "var(--foreground) !important",
              },
              "& input::placeholder": {
                color: "var(--text-tertiary) !important",
              },
            }}
          />
        </Box>

        <Box>
          <FormLabel sx={{ color: "var(--text-primary)" }}>Message</FormLabel>
          <Textarea
            placeholder="Your message…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            minRows={5}
            required
            sx={{
              borderColor: "var(--border) !important",
              color: "var(--foreground) !important",
              bgcolor: "var(--surface) !important",
              "& textarea": {
                color: "var(--foreground) !important",
              },
              "& textarea::placeholder": {
                color: "var(--text-tertiary) !important",
              },
            }}
          />
        </Box>

        <Button
          type="submit"
          variant="solid"
          color="primary"
          size="lg"
          sx={{
            mt: 2,
            bgcolor: "var(--accent) !important",
            color: "var(--background) !important",
            "&:hover": {
              bgcolor: "var(--accent-dark) !important",
            },
          }}
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </Button>
      </Stack>

      {status === "sent" && (
        <Alert color="success" variant="soft" sx={{ mt: 4 }}>
          Thanks for your message! I'll get back to you soon.
        </Alert>
      )}

      {status === "error" && (
        <Alert color="danger" variant="soft" sx={{ mt: 4 }}>
          There was an error sending your message. Please try again.
        </Alert>
      )}

      <Box sx={{ mt: 8 }}>
        <Typography
          level="h3"
          sx={{
            textAlign: "center",
            fontWeight: 700,
            mb: 3,
            color: "var(--text-primary)",
          }}
        >
          Or find me elsewhere
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          {[
            { label: "Email", href: `mailto:${profile.contact.email}`, emoji: "📧" },
            { label: "LinkedIn", href: profile.socials.linkedin, emoji: "💼" },
            { label: "Twitter / X", href: profile.socials.x, emoji: "🐦" },
            { label: "GitHub", href: profile.socials.github, emoji: "💻" },
          ].map((link) => (
            <Box
              key={link.label}
              component="a"
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                p: 3,
                borderRadius: "16px",
                bgcolor: "rgba(var(--surface-rgb), 0.4)",
                border: "1px solid var(--border)",
                backdropFilter: "blur(12px)",
                display: "flex",
                alignItems: "center",
                gap: 2,
                textDecoration: "none",
                transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
                "&:hover": {
                  borderColor: "var(--accent)",
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 32px rgba(124,58,237,0.2)",
                  bgcolor: "rgba(var(--surface-rgb), 0.7)",
                },
              }}
            >
              <Typography sx={{ fontSize: "24px" }}>{link.emoji}</Typography>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {link.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
