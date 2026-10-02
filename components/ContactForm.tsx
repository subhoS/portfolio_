"use client";

import { useState } from "react";
import { ArrowRight } from "./icons";

const topics = [
  "Fractional CTO / advisory",
  "Architecture or performance review",
  "AI / RAG system",
  "Speaking or writing",
  "Something else",
];

/** Builds a pre-filled email so messages land straight in the inbox, with no backend to fail. */
export default function ContactForm({ email }: { email: string }) {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const topic = String(data.get("topic") || "");
    const message = String(data.get("message") || "").trim();
    const company = String(data.get("company") || "").trim();
    const subject = `${topic} — ${name}${company ? ` (${company})` : ""}`;
    const body = `${message}\n\n— ${name}${company ? `, ${company}` : ""}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <form className="card contact-form" onSubmit={onSubmit}>
      <div className="grid-2" style={{ gap: 18 }}>
        <div className="field">
          <label htmlFor="name">Your name</label>
          <input id="name" name="name" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="company">Company (optional)</label>
          <input id="company" name="company" autoComplete="organization" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="topic">What&apos;s it about?</label>
        <select id="topic" name="topic" defaultValue={topics[0]}>
          {topics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          required
          placeholder="What are you building, and where are you stuck?"
        />
      </div>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <span className="muted" style={{ fontSize: 14 }}>
          {sent
            ? "Your email app should have opened. If not, write to "
            : "Opens your email app, pre-filled. Or write to "}
          <a href={`mailto:${email}`} style={{ color: "var(--brand-ink)" }}>
            {email}
          </a>
        </span>
        <button className="btn btn-primary" type="submit">
          Send message <ArrowRight className="arrow" />
        </button>
      </div>
    </form>
  );
}
