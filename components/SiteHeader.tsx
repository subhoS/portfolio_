import Link from "next/link";
import { site } from "../lib/site";
import { GitHub, LinkedIn } from "./icons";
import Logo from "./Logo";
import MobileNav from "./MobileNav";
import NavLinks from "./NavLinks";
import ThemeToggle from "./ThemeToggle";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="brand" aria-label={`${site.name} — home`}>
          <Logo id="sd-header" />
          <span>
            Subhadeep <span className="serif">Datta</span>
          </span>
        </Link>
        <nav className="nav" aria-label="Primary">
          <NavLinks />
        </nav>
        <div className="header-actions">
          <a
            className="icon-btn hide-sm"
            href={site.socials.github}
            aria-label="GitHub"
            rel="me noopener"
            target="_blank"
          >
            <GitHub />
          </a>
          <a
            className="icon-btn hide-sm"
            href={site.socials.linkedin}
            aria-label="LinkedIn"
            rel="me noopener"
            target="_blank"
          >
            <LinkedIn />
          </a>
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
