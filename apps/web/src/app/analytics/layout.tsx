import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Macro Analytics Terminal | ArthaLens Macroeconomic Intelligence",
  description:
    "Institutional multi-series macroeconomic workspace, trends, and analytical charts.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
