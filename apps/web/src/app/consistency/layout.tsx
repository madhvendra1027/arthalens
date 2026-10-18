import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "India Macroeconomic Consistency Index | Cross-Indicator Verification (90/100)",
  description:
    "Composite statistical verification index measuring alignment between headline GDP growth (+8.2%) and high-frequency proxies: GST e-way bills, bank credit growth, railway freight, IIP manufacturing, and diesel consumption.",
  keywords: [
    "India macroeconomic consistency",
    "GDP proxy indicators India",
    "GST e-way bills GDP correlation",
    "Bank credit growth India",
    "IIP manufacturing index",
    "India economic health score",
  ],
  alternates: {
    canonical: "https://arthalens-production.up.railway.app/consistency",
  },
  openGraph: {
    title: "Macroeconomic Consistency Index | ArthaLens",
    description: "Composite cross-indicator statistical verification of official GDP growth figures.",
    url: "https://arthalens-production.up.railway.app/consistency",
    siteName: "ArthaLens",
    type: "website",
    images: [
      {
        url: "https://arthalens-production.up.railway.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArthaLens Macroeconomic Consistency Index",
      },
    ],
  },
};

export default function ConsistencyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
