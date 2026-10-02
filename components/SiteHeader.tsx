import Image from "next/image";
import Link from "next/link";
import { site } from "../lib/site";
import logo from "../public/logo.png";
import { GitHub, LinkedIn } from "./icons";
import MobileNav from "./MobileNav";
import NavLinks from "./NavLinks";
import ThemeToggle from "./ThemeToggle";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="brand" aria-label={`${site.name} — home`}>
          <Image src={logo} alt="" width={32} height={32} priority />
          <span>{site.name}</span>
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
