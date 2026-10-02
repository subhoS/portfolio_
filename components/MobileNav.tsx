"use client";

import { useRef } from "react";
import { Close, Menu } from "./icons";
import NavLinks from "./NavLinks";

export default function MobileNav() {
  const ref = useRef<HTMLDetailsElement>(null);
  const close = () => ref.current?.removeAttribute("open");
  return (
    <details className="mobile-nav" ref={ref}>
      <summary className="icon-btn" aria-label="Open menu">
        <Menu className="icon-menu" />
        <Close className="icon-close" />
      </summary>
      <nav className="mobile-nav-panel" aria-label="Mobile">
        <NavLinks onNavigate={close} />
      </nav>
    </details>
  );
}
