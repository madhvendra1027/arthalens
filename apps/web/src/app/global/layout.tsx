import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Global Macroeconomic Nexus | World Bank & International Indicators",
  description:
    "Compare India's economic indicators against global peers using official World Bank World Development Indicators, external debt metrics, and trade flows.",
  alternates: {
    canonical: "https://arthalens-production.up.railway.app/global",
  },
  openGraph: {
    title: "Global Macroeconomic Nexus | ArthaLens",
    description:
      "Compare India's economic indicators against global peers using official World Bank data.",
    url: "https://arthalens-production.up.railway.app/global",
    type: "website",
    images: [
      {
        url: "https://arthalens-production.up.railway.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArthaLens Global Macroeconomic Nexus",
      },
    ],
  },
};

export default function GlobalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
