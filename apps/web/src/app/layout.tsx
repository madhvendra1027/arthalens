import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/layout/NavBar";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

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
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://arthalens-production.up.railway.app",
    siteName: "ArthaLens — India Macroeconomic Intelligence",
    title: "India GDP & Macroeconomic Indicators 2024 | Official MoSPI & RBI Data",
    description:
      "Authoritative economic portal for India's National Accounts Statistics. Real GDP (+8.2%), Nominal GDP, Sectoral GVA, Deflator, and Sovereign Credit Ratings.",
  },
  twitter: {
    card: "summary_large_image",
    title: "India GDP & Macroeconomic Intelligence | ArthaLens",
    description:
      "Official macroeconomic data repository published by MoSPI and RBI. Real GDP (+8.2%), Nominal GDP, and Sectoral GVA.",
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
        "inLanguage": "en-IN"
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
          "url": "https://www.mospi.gov.in"
        },
        "temporalCoverage": "2011/2024",
        "spatialCoverage": "India",
        "variableMeasured": [
          "Real Gross Domestic Product Growth (YoY)",
          "Nominal Gross Domestic Product",
          "Gross Value Added (GVA) at Constant Basic Prices",
          "Implicit GDP Deflator",
          "Consumer Price Index (CPI Combined)",
          "Wholesale Price Index (WPI)"
        ],
        "license": "https://data.gov.in/open-government-data-ogd-platform-india"
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
              "text": "According to the Provisional Estimates released by the National Statistical Office (NSO), MoSPI, India's Real GDP grew by 8.2% in FY 2023-24, compared to 7.0% in FY 2022-23."
            }
          },
          {
            "@type": "Question",
            "name": "What is India's Nominal GDP size in FY 2023-24?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "India's Nominal GDP (at Current Prices) for FY 2023-24 is estimated at ₹295.36 Lakh Crore (approximately $3.55 Trillion USD), recording a growth rate of 9.6% over FY 2022-23."
            }
          },
          {
            "@type": "Question",
            "name": "What is the difference between Real GDP and Nominal GDP in India?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Real GDP measures total economic output at constant basic prices, removing the distortive effect of price inflation. Nominal GDP measures output at current market prices without adjusting for inflation."
            }
          },
          {
            "@type": "Question",
            "name": "What is India's GDP Deflator and how does it relate to CPI and WPI?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The Implicit GDP Deflator measures inflation across all goods and services produced in the domestic economy. In FY 2023-24, the GDP Deflator stood at 1.4%, reflecting low wholesale commodity inflation (WPI 1.26%) relative to retail consumer inflation (CPI 4.83%)."
            }
          },
          {
            "@type": "Question",
            "name": "What are the official base years for India's GDP calculation?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The current benchmark series uses base year 2022-23, which incorporates modern administrative registries including MCA-21 and GSTN data, superseding the historical 2011-12 base year series."
            }
          }
        ]
      }
    ]
  };

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <Providers>
          <NavBar />
          <main className="min-h-screen">{children}</main>
          <footer className="border-t border-surface px-6 py-8 text-center text-sm text-[--color-text-muted]">
            <p>
              ArthaLens — Official statistics reproduced with provenance from MoSPI, RBI, and Government of India.
              Derived analytics, forecasts, and AI interpretations are not official government estimates.
            </p>
            <p className="mt-1 font-mono text-xs">Open Government Data Framework Compliant • Not investment advice.</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
