import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "India GDP Explorer & Sectoral Decomposition | Real vs Nominal Time Series",
  description:
    "Explore India's historical and quarterly GDP time series from official MoSPI National Accounts Statistics. Analyze Real GDP (8.2% YoY), Nominal GDP, and sectoral Gross Value Added (GVA) across Agriculture, Industry, and Services.",
  keywords: [
    "India GDP time series",
    "Real GDP India",
    "Nominal GDP India",
    "India GDP growth rate",
    "Sectoral GVA India",
    "MoSPI GDP quarterly data",
    "India GDP constant prices",
    "India GDP current prices",
    "GVA by economic activity",
    "Agriculture industry services share India",
  ],
  alternates: {
    canonical: "https://arthalens-production.up.railway.app/gdp",
  },
  openGraph: {
    title: "India GDP Explorer | Time Series & Sectoral Growth",
    description: "Official MoSPI National Accounts Statistics: Real GDP, Nominal GDP, and Sectoral GVA Decomposition.",
    url: "https://arthalens-production.up.railway.app/gdp",
    siteName: "ArthaLens",
    type: "website",
  },
};

export default function GdpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
