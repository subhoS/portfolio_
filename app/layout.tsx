import type { Metadata } from "next";
import Analytics from "../components/Analytics";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ThemeProviderClient from "../components/ThemeProviderClient";
import "./globals.css";

export const metadata: Metadata = {
  title: "Subhadeep Datta — Full Stack Engineer",
  description:
    "Full stack engineer building fast, scalable systems. Focused on performance, architecture, and shipping things that work.",
  keywords: [
    "full stack engineer",
    "software engineer",
    "system design",
    "backend engineering",
    "react",
    "node.js",
    "distributed systems",
  ],
  metadataBase: new URL(process.env.SITE_URL || "https://example.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.SITE_URL || "https://example.com",
    title: "Subhadeep Datta — Full Stack Engineer",
    description:
      "Full stack engineer focused on building fast, scalable systems.",
    siteName: "Subhadeep Datta",
  },
  twitter: {
    card: "summary_large_image",
    title: "Subhadeep Datta — Full Stack Engineer",
    description:
      "Full stack engineer focused on building fast, scalable systems.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: process.env.SITE_URL || "https://example.com",
  },
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
