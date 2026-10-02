import type { Metadata } from "next";
import Analytics from "../components/Analytics";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ThemeProviderClient from "../components/ThemeProviderClient";
import ScrollProgress from "../components/ScrollProgress";
import CursorGlow from "../components/CursorGlow";
import GradientBackground from "../components/GradientBackground";
import "./globals.css";

export const metadata: Metadata = {
  title: "Subhadeep Datta — Full Stack Engineer & CTO | Noisiv, Qid, Hirerkey",
  description:
    "Subhadeep Datta is a Full Stack Engineer & CTO. Co-Founder of Hirerkey, Consulting CTO at Noisiv Consulting, and Tech Lead for Qid & Videtorrium. Expert in distributed systems and scalable architecture.",
  keywords: [
    "Subhadeep Datta",
    "Subhadeep",
    "full stack engineer",
    "software engineer",
    "system design",
    "backend engineering",
    "frontend engineering",
    "react",
    "node.js",
    "distributed systems",
    "CTO",
    "technical leader",
    "enterprise architecture",
    "Noisiv Consulting",
    "Qid",
    "oneqid",
    "Hirerkey",
    "Videtorrium",
    "scalable systems",
    "LLM",
    "RAG",
    "MCP",
  ],
  metadataBase: new URL(process.env.SITE_URL || "https://subhadeep-datta.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.SITE_URL || "https://subhadeep-datta.dev",
    title: "Subhadeep Datta — Full Stack Engineer & CTO",
    description:
      "Subhadeep Datta is a Full Stack Engineer & CTO building robust solutions for Noisiv Consulting, Qid, Hirerkey, and Videtorrium.",
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
      "Subhadeep Datta is a Full Stack Engineer & CTO specializing in distributed systems and enterprise architecture.",
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
        {/* Google Fonts — Inter + JetBrains Mono */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />

        {/* Search Console verification */}
        {process.env.SEARCH_CONSOLE_VERIFICATION && (
          <meta
            name="google-site-verification"
            content={process.env.SEARCH_CONSOLE_VERIFICATION}
          />
        )}

        <meta name="author" content="Subhadeep Datta" />
        <meta
          name="copyright"
          content="© 2025 Subhadeep Datta. All rights reserved."
        />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />

        <link rel="manifest" href="/manifest.json" />

        {/* JSON-LD */}
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
                "Subhadeep Datta is a Full Stack Engineer & CTO specializing in distributed systems, enterprise architecture, and AI/LLM integrations.",
              image: "/subhadeep-datta.jpg",
              sameAs: [
                "https://github.com/subhoS",
                "https://linkedin.com/in/subhadeep-datta-cto",
                "https://x.com/SubhadeepDataa",
              ],
              worksFor: [
                {
                  "@type": "Organization",
                  name: "Noisiv Consulting",
                  url: "https://noisivconsulting.com/",
                },
                {
                  "@type": "Organization",
                  name: "Hirerkey",
                  url: "https://www.hirerkey.com/",
                },
                {
                  "@type": "Organization",
                  name: "Qid",
                  url: "https://oneqid.com/",
                },
                {
                  "@type": "Organization",
                  name: "Videtorrium",
                  url: "https://www.videtorrium.com/",
                }
              ]
            }),
          }}
        />

        {/* Theme initialization to prevent FOUC */}
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
          <GradientBackground />
          <ScrollProgress />
          <CursorGlow />
          <Header />
          <Analytics gaId={process.env.NEXT_PUBLIC_GA_ID ?? null} />
          <main style={{ minHeight: "70vh", position: "relative", zIndex: 1 }}>
            {children}
          </main>
          <Footer />
        </ThemeProviderClient>
      </body>
    </html>
  );
}
