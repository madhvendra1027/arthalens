import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "India Sovereign Credit Ratings Monitor | Moody's, S&P, and Fitch Outlook",
  description:
    "Official sovereign credit ratings and outlook for the Republic of India by Moody's (Baa3), S&P Global (BBB- Positive Outlook), and Fitch (BBB-). Comprehensive tracking of fiscal deficit, debt-to-GDP, and FX reserves.",
  keywords: [
    "India sovereign rating",
    "Moody's India rating",
    "S&P India rating",
    "Fitch India rating",
    "India credit rating upgrade",
    "India debt to GDP ratio",
    "India FX reserves",
    "India fiscal deficit target",
    "Investment grade rating India",
  ],
  alternates: {
    canonical: "https://arthalens-production.up.railway.app/ratings",
  },
  openGraph: {
    title: "India Sovereign Credit Ratings Monitor | ArthaLens",
    description: "Multi-agency sovereign rating matrix, outlook trends, and credit evaluation metrics for India.",
    url: "https://arthalens-production.up.railway.app/ratings",
    siteName: "ArthaLens",
    type: "website",
  },
};

export default function RatingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
