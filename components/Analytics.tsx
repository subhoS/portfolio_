"use client";

import Script from "next/script";

type Props = {
  gaId?: string | null;
};

export default function Analytics({ gaId }: Props) {
  const id = gaId ?? process.env.NEXT_PUBLIC_GA_ID ?? null;
  if (!id) return null;

  return (
    <>
      {/* Global site tag (gtag.js) - Google Analytics 4 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}', { page_path: window.location.pathname });
        `}
      </Script>
    </>
  );
}
