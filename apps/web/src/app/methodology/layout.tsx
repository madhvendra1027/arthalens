import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "India GDP Base Year Series Methodology | 2011-12 vs 2022-23 Comparison",
  description:
    "Technical comparison of MoSPI National Accounts base year revisions: 2011-12 vs 2022-23 benchmark series. Details on MCA-21 company registry coverage, double deflation, and UN SNA 2008 standards.",
  keywords: [
    "India GDP base year",
    "2011-12 base year India",
    "2022-23 base year India",
    "MoSPI GDP methodology",
    "Double deflation India",
    "MCA-21 company database",
    "UN System of National Accounts SNA 2008",
    "Base year revision India GDP",
  ],
  alternates: {
    canonical: "https://arthalens-production.up.railway.app/methodology",
  },
  openGraph: {
    title: "GDP Base Year Methodology Comparison | ArthaLens",
    description: "Methodological specifications comparing the 2011-12 and 2022-23 National Accounts series.",
    url: "https://arthalens-production.up.railway.app/methodology",
    siteName: "ArthaLens",
    type: "website",
  },
};

export default function MethodologyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
