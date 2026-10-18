import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GDP Drivers & Expenditure Analysis | ArthaLens",
  description:
    "Deconstruct India's Gross Domestic Product drivers, consumption, gross fixed capital formation, and net exports under official NAS benchmarks.",
  alternates: {
    canonical: "https://arthalens-production.up.railway.app/gdp/why",
  },
  openGraph: {
    title: "GDP Growth & Expenditure Drivers | ArthaLens",
    description:
      "Deconstruct India's Gross Domestic Product drivers under official NAS benchmarks.",
    url: "https://arthalens-production.up.railway.app/gdp/why",
    type: "website",
    images: [
      {
        url: "https://arthalens-production.up.railway.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArthaLens GDP Drivers",
      },
    ],
  },
};

export default function GDPWhyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
