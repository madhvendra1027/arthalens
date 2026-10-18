import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sovereign AI Research Copilot | Citation-Grounded Econometrics",
  description:
    "Ask complex macroeconomic questions with verified citations from official MoSPI press notes, RBI bulletins, and national accounts methodology.",
  alternates: {
    canonical: "https://arthalens-production.up.railway.app/ai",
  },
  openGraph: {
    title: "Sovereign AI Research Copilot | ArthaLens",
    description:
      "Ask complex macroeconomic questions with verified citations from official MoSPI press notes and RBI bulletins.",
    url: "https://arthalens-production.up.railway.app/ai",
    type: "website",
    images: [
      {
        url: "https://arthalens-production.up.railway.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArthaLens Sovereign AI Copilot",
      },
    ],
  },
};

export default function AILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
