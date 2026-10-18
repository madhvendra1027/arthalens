import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Institutional Portal Login | ArthaLens Macroeconomic Intelligence",
  description:
    "Institutional sign-in for authorized macroeconomic researchers, economists, and administrators.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
