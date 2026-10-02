"use client";

import { useEffect, useState } from "react";
import type { Heading } from "../lib/posts";

/** Desktop table of contents that highlights the section currently being read. */
export default function Toc({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );
    for (const el of els) observer.observe(el);
    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav className="toc" aria-label="Table of contents">
      <h2>On this page</h2>
      <ol>
        {headings.map((h) => (
          <li key={h.id} className={h.depth === 3 ? "d3" : undefined}>
            <a href={`#${h.id}`} className={active === h.id ? "active" : undefined}>
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
