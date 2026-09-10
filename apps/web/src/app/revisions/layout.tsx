import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "India GDP Revisions Monitor & Audit Trail | Advance to Final Estimates",
  description:
    "Track the lifecycle of India's GDP revisions from First Advance Estimates (FAE) through Second Advance Estimates (SAE), Provisional Estimates (PE), and First, Second, and Third Revised Estimates by MoSPI NSO.",
  keywords: [
    "India GDP revisions",
    "MoSPI advance estimates",
    "Provisional estimates GDP India",
    "Revised estimates national accounts",
    "GDP revision cycle India",
    "First advance estimates FAE",
  ],
  alternates: {
    canonical: "https://arthalens-production.up.railway.app/revisions",
  },
  openGraph: {
    title: "India GDP Revisions Monitor | ArthaLens",
    description: "Milestone progression and historical audit trail of MoSPI GDP estimate revisions.",
    url: "https://arthalens-production.up.railway.app/revisions",
    siteName: "ArthaLens",
    type: "website",
  },
};

export default function RevisionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
