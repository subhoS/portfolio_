import type { Metadata } from "next";
import Analytics from "../components/Analytics";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ThemeProviderClient from "../components/ThemeProviderClient";
import { ThemeProvider } from "../context/ThemeContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Subhadeep Datta — Software Engineer",
  description:
    "Personal portfolio of Subhadeep Datta — projects, blog, and contact. SEO-optimized.",
  metadataBase: new URL(process.env.SITE_URL || "https://example.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Search Console verification - set SEARCH_CONSOLE_VERIFICATION env var in production */}
        {process.env.SEARCH_CONSOLE_VERIFICATION && (
          <meta
            name="google-site-verification"
            content={process.env.SEARCH_CONSOLE_VERIFICATION}
          />
        )}
      </head>
      <body>
        <ThemeProvider>
          <ThemeProviderClient>
            <Header />
            {/* Analytics will only add gtag if NEXT_PUBLIC_GA_ID is set */}
            <Analytics gaId={process.env.NEXT_PUBLIC_GA_ID ?? null} />
            <main style={{ minHeight: "70vh" }}>{children}</main>
            <Footer />
          </ThemeProviderClient>
        </ThemeProvider>
      </body>
    </html>
  );
}
