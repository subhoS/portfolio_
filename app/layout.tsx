import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import Analytics from "./analytics";
import JsonLd from "../components/JsonLd";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { themeScript } from "../components/ThemeToggle";
import { graph, personSchema, websiteSchema } from "../lib/schema";
import { site } from "../lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Full Stack Engineer & CTO`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  keywords: [
    "Subhadeep Datta",
    "Subhadeep Datta CTO",
    "Subhadeep Datta Hirerkey",
    "Subhadeep Datta Noisiv",
    "Subhadeep Datta Qid",
    "full stack engineer",
    "CTO",
    "system design",
    "distributed systems",
    "backend engineering",
  ],
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    title: `${site.name} — Full Stack Engineer & CTO`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    site: site.twitter,
    creator: site.twitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE || process.env.SEARCH_CONSOLE_VERIFICATION,
    other: process.env.BING_VERIFICATION_CODE ? { "msvalidate.01": process.env.BING_VERIFICATION_CODE } : undefined,
  },
  category: "technology",
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0e19" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${instrument.variable} ${mono.variable}`}
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: theme must be set before first paint */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="alternate" type="application/rss+xml" href="/rss.xml" title={`${site.name} — Writing`} />
        <link rel="alternate" type="application/feed+json" href="/feed.json" title={`${site.name} — Writing`} />
        <JsonLd data={graph(personSchema(), websiteSchema())} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="page-bg" aria-hidden="true" />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
