import type { Metadata } from "next";
import Analytics from "../components/Analytics";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ThemeProviderClient from "../components/ThemeProviderClient";
import "./globals.css";

export const metadata: Metadata = {
  title: "Subhadeep Datta — Full Stack Engineer & CTO",
  description:
    "Full stack engineer & CTO building fast, scalable systems. 6+ years specializing in distributed systems, enterprise architecture, and performance optimization. Tech leader at Noisiv Consulting.",
  keywords: [
    "full stack engineer",
    "software engineer",
    "system design",
    "backend engineering",
    "react",
    "node.js",
    "distributed systems",
    "CTO",
    "technical leader",
    "enterprise architecture",
    "performance optimization",
    "scalable systems",
    "LLM",
    "RAG",
    "MCP",
  ],
  icons: {
    icon: [
      { url: "/sd-card.png", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/sd-card.png",
    apple: "/sd-card.png",
  },
  metadataBase: new URL(process.env.SITE_URL || "https://subhadeep-datta.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.SITE_URL || "https://subhadeep-datta.dev",
    title: "Subhadeep Datta — Full Stack Engineer & CTO",
    description:
      "Full stack engineer & CTO specializing in distributed systems, enterprise architecture, and scalable backend systems. 6+ years building robust solutions with 99.9% uptime.",
    siteName: "Subhadeep Datta",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Subhadeep Datta — Tech Leader & Full Stack Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Subhadeep Datta — Full Stack Engineer & CTO",
    description:
      "Full stack engineer & CTO specializing in distributed systems and enterprise architecture.",
    creator: "@SubhadeepDataa",
    site: "@SubhadeepDataa",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: process.env.SITE_URL || "https://subhadeep-datta.dev",
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE,
  },
  category: "Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Search Console verification - set SEARCH_CONSOLE_VERIFICATION env var in production */}
        {process.env.SEARCH_CONSOLE_VERIFICATION && (
          <meta
            name="google-site-verification"
            content={process.env.SEARCH_CONSOLE_VERIFICATION}
          />
        )}

        {/* Additional SEO Meta Tags */}
        <meta name="author" content="Subhadeep Datta" />
        <meta
          name="copyright"
          content="© 2024 Subhadeep Datta. All rights reserved."
        />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />

        {/* Favicon declarations for better compatibility */}
        <link rel="icon" type="image/png" href="/sd-card.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="shortcut icon" href="/sd-card.png" />
        <link rel="apple-touch-icon" href="/sd-card.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Subhadeep Datta",
              url: process.env.SITE_URL || "https://subhadeep-datta.dev",
              jobTitle: "Full Stack Engineer & CTO",
              description:
                "Full stack engineer specializing in distributed systems and enterprise architecture",
              image: "/subhadeep-datta.jpg",
              sameAs: [
                "https://github.com/subhoS",
                "https://linkedin.com/in/subhadeep-datta-cto",
                "https://x.com/SubhadeepDataa",
              ],
              worksFor: {
                "@type": "Organization",
                name: "Noisiv Consulting",
                url: "https://noisivconsulting.com/",
              },
            }),
          }}
        />

        {/* Theme initialization script to prevent FOUC (Flash of Unstyled Content) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedMode = localStorage.getItem('themeMode') || 'system';
                  let theme = 'light';
                  
                  if (savedMode === 'light') {
                    theme = 'light';
                  } else if (savedMode === 'dark') {
                    theme = 'dark';
                  } else {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  
                  document.documentElement.setAttribute('data-theme', theme);
                  document.documentElement.classList.add(theme);
                  document.documentElement.classList.remove(theme === 'dark' ? 'light' : 'dark');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProviderClient>
          <Header />
          {/* Analytics will only add gtag if NEXT_PUBLIC_GA_ID is set */}
          <Analytics gaId={process.env.NEXT_PUBLIC_GA_ID ?? null} />
          <main style={{ minHeight: "70vh" }}>{children}</main>
          <Footer />
        </ThemeProviderClient>
      </body>
    </html>
  );
}
