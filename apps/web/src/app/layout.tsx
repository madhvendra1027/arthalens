import type { Metadata } from "next";
import { Inter, Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/layout/NavBar";
import { Providers } from "@/components/Providers";
import { AntimetalFooter } from "@/components/antimetal/AntimetalFooter";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { CookieConsentBanner } from "@/components/analytics/CookieConsentBanner";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://arthalens-production.up.railway.app"),
  title: {
    default: "India GDP & Macroeconomic Accounts 2024 | Official MoSPI & RBI Statistics — ArthaLens",
    template: "%s | ArthaLens Macroeconomic Intelligence",
  },
  description:
    "Official repository of India's National Accounts Statistics (NAS). Track Real GDP growth (+8.2% FY24), Nominal GDP (₹295.36 Lakh Crore), GVA by sector, Implicit GDP Deflator, CPI, WPI, and sovereign credit ratings with verified MoSPI & RBI provenance.",
  keywords: [
    "India GDP",
    "India GDP growth rate",
    "India GDP 2024",
    "Real GDP India",
    "Nominal GDP India",
    "India GDP Deflator",
    "Gross Domestic Product India",
    "MoSPI GDP release",
    "National Accounts Statistics",
    "India economic growth",
    "India GVA growth rate",
    "RBI repo rate",
    "CPI inflation India",
    "WPI inflation India",
    "India sovereign rating",
    "Moody's India credit rating",
    "S&P India rating outlook",
    "2022-23 base year GDP",
    "2011-12 base year GDP",
    "Quarterly GDP India",
    "India GDP per capita",
    "Gross Value Added basic prices",
    "Double deflation India GDP",
    "India economic snapshot",
    "Ministry of Statistics and Programme Implementation",
    "Reserve Bank of India economic data",
    "Indian economy statistics portal",
    "India GDP revision calendar",
  ],
  authors: [{ name: "ArthaLens Macroeconomic Research" }],
  creator: "ArthaLens",
  publisher: "ArthaLens Open Data Framework",
  applicationName: "ArthaLens",
  category: "Finance & Macroeconomics",
  alternates: {
    canonical: "https://arthalens-production.up.railway.app",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://arthalens-production.up.railway.app",
    siteName: "ArthaLens — India Macroeconomic Intelligence",
    title: "India GDP & Macroeconomic Indicators 2024 | Official MoSPI & RBI Data",
    description:
      "Authoritative economic portal for India's National Accounts Statistics. Real GDP (+8.2%), Nominal GDP, Sectoral GVA, Deflator, and Sovereign Credit Ratings.",
    images: [
      {
        url: "https://arthalens-production.up.railway.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArthaLens — India Macroeconomic Intelligence Platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "India GDP & Macroeconomic Intelligence | ArthaLens",
    description:
      "Official macroeconomic data repository published by MoSPI and RBI. Real GDP (+8.2%), Nominal GDP, and Sectoral GVA.",
    images: ["https://arthalens-production.up.railway.app/og-image.png"],
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://arthalens-production.up.railway.app/#website",
        "url": "https://arthalens-production.up.railway.app",
        "name": "ArthaLens Macroeconomic Intelligence",
        "description": "Official India National Accounts Statistics, GDP growth rates, and economic indicators portal.",
        "inLanguage": "en-IN",
      },
      {
        "@type": "Organization",
        "@id": "https://arthalens-production.up.railway.app/#organization",
        "name": "ArthaLens Macro Intelligence",
        "url": "https://arthalens-production.up.railway.app",
        "logo": "https://arthalens-production.up.railway.app/icon.png",
        "description": "Independent macroeconomic data observatory synthesizing sovereign National Accounts Statistics, Implicit Price Deflators, and sub-national accounts for India.",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "Institutional Inquiries & Research",
          "url": "https://arthalens-production.up.railway.app/contact",
          "email": "research@arthalens.internal"
        }
      },
      {
        "@type": "Dataset",
        "@id": "https://arthalens-production.up.railway.app/#dataset",
        "name": "India National Accounts Statistics (NAS) & GDP Time Series",
        "description": "Comprehensive annual and quarterly Gross Domestic Product (GDP) observations, Gross Value Added (GVA) by economic activity, and Implicit Price Deflators for India.",
        "url": "https://arthalens-production.up.railway.app/gdp",
        "creator": {
          "@type": "GovernmentOrganization",
          "name": "Ministry of Statistics and Programme Implementation (MoSPI)",
          "alternateName": "National Statistical Office (NSO)",
          "url": "https://www.mospi.gov.in",
        },
        "temporalCoverage": "2011/2024",
        "spatialCoverage": "India",
        "variableMeasured": [
          "Real Gross Domestic Product Growth (YoY)",
          "Nominal Gross Domestic Product",
          "Gross Value Added (GVA) at Constant Basic Prices",
          "Implicit GDP Deflator",
          "Consumer Price Index (CPI Combined)",
          "Wholesale Price Index (WPI)",
        ],
        "license": "https://data.gov.in/open-government-data-ogd-platform-india",
      },
      {
        "@type": "FAQPage",
        "@id": "https://arthalens-production.up.railway.app/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is India's GDP growth rate for FY 2023-24?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "According to the Provisional Estimates released by the National Statistical Office (NSO), MoSPI, India's Real GDP grew by 8.2% in FY 2023-24, compared to 7.0% in FY 2022-23.",
            },
          },
          {
            "@type": "Question",
            "name": "What is India's Nominal GDP size in FY 2023-24?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "India's Nominal GDP (at Current Prices) for FY 2023-24 is estimated at ₹295.36 Lakh Crore (approximately $3.55 Trillion USD), recording a growth rate of 9.6% over FY 2022-23.",
            },
          },
          {
            "@type": "Question",
            "name": "What is the difference between Real GDP and Nominal GDP in India?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Real GDP measures total economic output at constant basic prices, removing the distortive effect of price inflation. Nominal GDP measures output at current market prices without adjusting for inflation.",
            },
          },
          {
            "@type": "Question",
            "name": "What is India's GDP Deflator and how does it relate to CPI and WPI?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The Implicit GDP Deflator measures inflation across all goods and services produced in the domestic economy. In FY 2023-24, the GDP Deflator stood at 1.4%, reflecting low wholesale commodity inflation (WPI 1.26%) relative to retail consumer inflation (CPI 4.83%).",
            },
          },
          {
            "@type": "Question",
            "name": "What are the official base years for India's GDP calculation?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The current benchmark series uses base year 2022-23, which incorporates modern administrative registries including MCA-21 and GSTN data, superseding the historical 2011-12 base year series.",
            },
          },
        ],
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} ${ibmPlexMono.variable}`}
      data-scroll-behavior="smooth"
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function isExt(e) {
                  var file = e && e.filename ? String(e.filename) : '';
                  var msg = e && e.message ? String(e.message) : '';
                  var stack = e && e.error && e.error.stack ? String(e.error.stack) : '';
                  return file.indexOf('chrome-extension:') !== -1 || file.indexOf('embed_script.js') !== -1 || msg.indexOf('299') !== -1 || stack.indexOf('chrome-extension:') !== -1 || stack.indexOf('embed_script.js') !== -1;
                }
                window.addEventListener('error', function(e) {
                  if (isExt(e)) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return true;
                  }
                }, true);
                window.addEventListener('unhandledrejection', function(e) {
                  var reason = e && e.reason ? String(e.reason.stack || e.reason) : '';
                  if (reason.indexOf('chrome-extension:') !== -1 || reason.indexOf('embed_script.js') !== -1) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                  }
                }, true);
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="bg-[#E6E5DF] text-[#141416]">
        <AnalyticsProvider>
          <Providers>
            <ToastProvider>
              <NavBar />
              <main className="min-h-screen">{children}</main>
              <AntimetalFooter />
              <CookieConsentBanner />
            </ToastProvider>
          </Providers>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
