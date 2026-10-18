import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How ArthaLens Works | UN SNA 2008 Double Deflation Architecture",
  description:
    "Explore the econometrics behind ArthaLens: UN SNA 2008 double deflation, sub-national GVA synthesis, and SHA-256 cryptographic provenance for Indian National Accounts.",
  alternates: {
    canonical: "https://arthalens-production.up.railway.app/how-it-works",
  },
  openGraph: {
    title: "How ArthaLens Works | UN SNA 2008 Double Deflation Architecture",
    description:
      "Explore the econometrics behind ArthaLens: UN SNA 2008 double deflation, sub-national GVA synthesis, and SHA-256 cryptographic provenance.",
    url: "https://arthalens-production.up.railway.app/how-it-works",
    type: "website",
    images: [
      {
        url: "https://arthalens-production.up.railway.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "How ArthaLens Works",
      },
    ],
  },
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
