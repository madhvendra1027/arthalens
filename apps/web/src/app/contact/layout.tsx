import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Institutional Inquiries | ArthaLens Macro Intelligence",
  description:
    "Direct contact channel for sovereign research inquiries, custom data pipelines, methodology questions, and enterprise telemetry access with ArthaLens.",
  alternates: {
    canonical: "https://arthalens-production.up.railway.app/contact",
  },
  openGraph: {
    title: "Contact ArthaLens Research & Engineering",
    description:
      "Connect with the ArthaLens macroeconomic intelligence team for API access, institutional pipelines, and research inquiries.",
    url: "https://arthalens-production.up.railway.app/contact",
    siteName: "ArthaLens",
    type: "website",
    images: [
      {
        url: "https://arthalens-production.up.railway.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArthaLens Macro Intelligence Contact Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact ArthaLens Research & Engineering",
    description:
      "Connect with ArthaLens for macroeconomic telemetry access and research collaboration.",
    images: ["https://arthalens-production.up.railway.app/og-image.png"],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
