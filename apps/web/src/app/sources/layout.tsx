import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Official Data Sources & Institutional Provenance Registry | ArthaLens",
  description:
    "Comprehensive registry of official institutional data providers, update cadences, and cryptographic SHA-256 provenance for ArthaLens macroeconomic accounts.",
  alternates: {
    canonical: "https://arthalens-production.up.railway.app/sources",
  },
  openGraph: {
    title: "Official Data Sources & Institutional Provenance Registry | ArthaLens",
    description:
      "Comprehensive registry of official institutional data providers and cryptographic provenance.",
    url: "https://arthalens-production.up.railway.app/sources",
    type: "website",
    images: [
      {
        url: "https://arthalens-production.up.railway.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArthaLens Data Sources Registry",
      },
    ],
  },
};

export default function SourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
