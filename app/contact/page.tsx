"use client";

import { useState } from "react";
import SEO from "../../components/SEO";
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
    <Box sx={{ px: 2, py: { xs: 4, md: 8 }, maxWidth: 600, mx: "auto" }}>
      <SEO
        title="Contact"
        description="Contact Subhadeep Datta"
        url="/contact"
      />

      <Typography
        level="h1"
        sx={{ fontSize: { xs: 28, md: 40 }, fontWeight: 800, mb: 2 }}
      >
        Get in touch
      </Typography>

      <Typography level="body-lg" sx={{ color: "text.secondary", mb: 4 }}>
        Have a question or want to collaborate? I'd love to hear from you.
      </Typography>

      <Stack component="form" onSubmit={handleSubmit} spacing={2}>
        <Box>
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Box>

        <Box>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Box>

        <Box>
          <FormLabel>Message</FormLabel>
          <Textarea
            placeholder="Your message…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            minRows={5}
            required
          />
        </Box>

        <Button
          type="submit"
          variant="solid"
          color="primary"
          size="lg"
          sx={{ mt: 2 }}
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

      <Typography level="body-sm" sx={{ mt: 4, color: "text.secondary" }}>
        You can also reach me at <strong>subhadeepdatta2@gmail.com</strong> or
        connect on{" "}
        <a
          href="https://linkedin.com/in/subhadeep-datta-cto/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontWeight: 600 }}
        >
          LinkedIn
        </a>
      </Typography>
    </Box>
  );
}
