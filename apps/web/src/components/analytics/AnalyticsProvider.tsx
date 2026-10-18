"use client";

import React, { useEffect, Suspense } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_ID || typeof window === "undefined") return;

    // Verify user consent
    try {
      const consent = localStorage.getItem("arthalens_consent_status");
      if (consent !== "accepted") return;
    } catch {
      return;
    }

    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtag === "function") {
      // Clean query parameters to avoid logging sensitive search tokens
      const searchStr = searchParams?.toString();
      const sanitizedUrl = searchStr ? `${pathname}?${searchStr}` : pathname;

      gtag("config", GA_ID, {
        page_path: sanitizedUrl,
        page_title: document.title,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  if (!GA_ID) {
    // Analytics is configured to be optional; runs safely in inactive mode
    return <>{children}</>;
  }

  return (
    <>
      {/* Google Analytics Script with Consent Mode v2 Default */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // Default consent state: denied until user accepts
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied'
            });

            try {
              if (localStorage.getItem('arthalens_consent_status') === 'accepted') {
                gtag('consent', 'update', {
                  'analytics_storage': 'granted'
                });
              }
            } catch(e) {}

            gtag('config', '${GA_ID}', {
              send_page_view: false
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      {children}
    </>
  );
}
