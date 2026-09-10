import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "India GDP Deflator Simulator & Price Index Comparison | CPI vs WPI vs Deflator",
  description:
    "Interactive GDP Deflator calculation simulator and inflation divergence diagnostic. Compare India's Implicit GDP Deflator (1.4%) against Retail Headline CPI (4.83%) and Wholesale WPI (1.26%) under UN SNA 2008 standards.",
  keywords: [
    "India GDP Deflator",
    "Implicit price deflator India",
    "GDP deflator formula",
    "GDP deflator vs CPI",
    "GDP deflator vs WPI",
    "India inflation divergence",
    "Nominal to Real GDP calculator",
    "MoSPI price index",
    "RBI inflation target",
  ],
  alternates: {
    canonical: "https://arthalens-production.up.railway.app/deflator",
  },
  openGraph: {
    title: "GDP Deflator Simulator & Price Indices | ArthaLens",
    description: "Interactive arithmetic conversion tool between Nominal GDP, Real GDP, and the Implicit Price Deflator.",
    url: "https://arthalens-production.up.railway.app/deflator",
    siteName: "ArthaLens",
    type: "website",
  },
};

export default function DeflatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
