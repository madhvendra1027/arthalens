import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ShieldCheck, Lock, Eye, FileText, Database, ArrowLeft, Mail } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy | ArthaLens Macroeconomic Intelligence",
  description:
    "ArthaLens privacy policy: institutional data governance, session management, zero-PII analytics, and transparent statistical inquiry handling.",
  alternates: {
    canonical: "https://arthalens-production.up.railway.app/privacy",
  },
  openGraph: {
    title: "Privacy Policy | ArthaLens Macroeconomic Intelligence",
    description:
      "ArthaLens privacy policy: institutional data governance, session management, zero-PII analytics, and transparent statistical inquiry handling.",
    url: "https://arthalens-production.up.railway.app/privacy",
    type: "website",
    images: [
      {
        url: "https://arthalens-production.up.railway.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArthaLens Privacy Policy",
      },
    ],
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "October 18, 2026";
  const effectiveDate = "October 18, 2026";

  return (
    <div className="relative min-h-screen bg-[#E6E5DF] text-[#141416] py-12 sm:py-16 selection:bg-[#141416] selection:text-[#E6E5DF]">
      <div className="mx-auto max-w-4xl px-6 sm:px-8 space-y-8">
        <Breadcrumbs items={[{ label: "Privacy Policy", href: "/privacy" }]} className="!text-[#57585C]" />

        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between border-b border-[rgba(20,21,23,0.12)] pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-[#57585C] hover:text-[#141416] transition-colors focus-visible:ring-2 focus-visible:ring-[#D94E34] focus:outline-hidden rounded-md px-1 py-0.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Observatory</span>
          </Link>
          <div className="flex items-center gap-3 font-mono text-xs text-[#828387]">
            <span>LEGAL ARCHIVE // PRIVACY</span>
            <span>•</span>
            <span>REV 2026.10</span>
          </div>
        </div>

        {/* Header Block */}
        <div className="rounded-3xl border border-[rgba(20,21,23,0.14)] bg-[#ECEBE5] p-8 sm:p-12 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(20,21,23,0.18)] bg-[#E6E5DF] px-3.5 py-1 font-mono text-[11px] font-bold text-[#059669]">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>DATA GOVERNANCE &amp; PRIVACY CHARTER</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-[#141416]">
            Privacy Policy
          </h1>

          <p className="font-sans text-sm sm:text-base text-[#57585C] leading-relaxed max-w-2xl">
            ArthaLens is committed to institutional transparency, high-integrity data stewardship,
            and protecting user privacy. This policy explains what information is collected, how it is
            processed, and how we safeguard user security across all ArthaLens services.
          </p>

          <div className="pt-4 border-t border-[rgba(20,21,23,0.1)] flex flex-wrap items-center gap-6 font-mono text-xs text-[#828387]">
            <span>Effective Date: <strong>{effectiveDate}</strong></span>
            <span>•</span>
            <span>Last Updated: <strong>{lastUpdated}</strong></span>
          </div>
        </div>

        {/* Core Content Sections */}
        <div className="space-y-10 font-sans text-sm sm:text-[15px] leading-relaxed text-[#35363A]">
          {/* Section 1: Overview */}
          <section className="space-y-4 rounded-2xl border border-[rgba(20,21,23,0.1)] bg-[#ECEBE5]/60 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-[#141416] flex items-center gap-2.5">
              <Eye className="h-5 w-5 text-[#D94E34]" />
              <span>1. Overview and Scope</span>
            </h2>
            <p>
              ArthaLens provides macroeconomic intelligence, national accounts time series, and
              econometric research tools based on official open government data from the Ministry of
              Statistics and Programme Implementation (MoSPI) and the Reserve Bank of India (RBI).
            </p>
            <p>
              We adhere strictly to a <strong>privacy-by-design</strong> architecture: we do not sell
              personal information, we do not perform cross-site tracking or behavioral advertising,
              and we minimize personal data collection to what is strictly necessary to operate secure
              institutional sessions and maintain service reliability.
            </p>
          </section>

          {/* Section 2: Data Collected */}
          <section className="space-y-4 rounded-2xl border border-[rgba(20,21,23,0.1)] bg-[#ECEBE5]/60 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-[#141416] flex items-center gap-2.5">
              <Database className="h-5 w-5 text-[#059669]" />
              <span>2. Categories of Information Collected</span>
            </h2>
            <div className="space-y-3">
              <h3 className="font-heading font-semibold text-sm text-[#141416]">
                A. Authentication and Account Data (Registered Users)
              </h3>
              <p>
                When institutional users log into ArthaLens, we process:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#57585C]">
                <li>Name, institutional email address, and designated organizational role (e.g. analyst, researcher, administrator).</li>
                <li>Cryptographically salted password hashes (we never store or have access to plaintext passwords).</li>
                <li>Temporary session tokens generated via our secure session manager (`arthalens_session` cookie).</li>
              </ul>
              <p className="text-xs text-[#828387]">
                Note: No credit card numbers, payment instruments, or personal bank accounts are requested or collected by ArthaLens.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-[rgba(20,21,23,0.08)]">
              <h3 className="font-heading font-semibold text-sm text-[#141416]">
                B. Client Preferences &amp; Session Cookies
              </h3>
              <p>
                To provide a seamless research experience, we use strictly necessary session cookies and browser storage for:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#57585C]">
                <li>Preserving active base-year methodology selection (2022-23 benchmark vs 2011-12 legacy backcast).</li>
                <li>Preserving visual modes (Macro Constellation vs 3D Particle Globe).</li>
                <li>Managing authenticated session state with an automatic 24-hour expiration window.</li>
              </ul>
            </div>

            <div className="space-y-3 pt-4 border-t border-[rgba(20,21,23,0.08)]">
              <h3 className="font-heading font-semibold text-sm text-[#141416]">
                C. AI Copilot Research Queries
              </h3>
              <p>
                When you interact with the Sovereign AI Research Copilot, query text is processed statelessly to match relevant MoSPI press notes, RBI statistical bulletins, and national accounts methodological chapters. User research inquiries are not used to train third-party public foundation models.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-[rgba(20,21,23,0.08)]">
              <h3 className="font-heading font-semibold text-sm text-[#141416]">
                D. Privacy-Conscious Analytics &amp; Performance Telemetry
              </h3>
              <p>
                We may measure aggregate website traffic, page responsiveness, and technical error rates to maintain service availability. When analytics is enabled, IP addresses are anonymized, and no personally identifiable information or authentication tokens are included in event telemetry. Non-essential analytics is only initiated after user consent.
              </p>
            </div>
          </section>

          {/* Section 3: Purpose of Processing */}
          <section className="space-y-4 rounded-2xl border border-[rgba(20,21,23,0.1)] bg-[#ECEBE5]/60 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-[#141416] flex items-center gap-2.5">
              <FileText className="h-5 w-5 text-[#2563EB]" />
              <span>3. Purposes of Processing</span>
            </h2>
            <p>We process collected information solely for the following legitimate purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#57585C]">
              <li>Authenticating authorized institutional analysts and providing access to research workspace tools.</li>
              <li>Maintaining system stability, rate limiting, and protecting infrastructure against automated scraping or denial-of-service attempts.</li>
              <li>Diagnosing technical issues, broken series feeds, or API integration errors.</li>
              <li>Ensuring compliance with Open Government Data (OGD) attribution guidelines and institutional security policies.</li>
            </ul>
          </section>

          {/* Section 4: Data Retention & Security */}
          <section className="space-y-4 rounded-2xl border border-[rgba(20,21,23,0.1)] bg-[#ECEBE5]/60 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-[#141416] flex items-center gap-2.5">
              <Lock className="h-5 w-5 text-[#059669]" />
              <span>4. Data Retention, Security, and Storage</span>
            </h2>
            <p>
              Session tokens are automatically invalidated in our Redis/in-memory store after 24 hours of inactivity.
              All network communication between your browser and ArthaLens is encrypted using Transport Layer Security (TLS 1.3).
              Database records are isolated behind private subnet controls, with strict role-based access limits.
            </p>
          </section>

          {/* Section 5: Third-Party Disclosures */}
          <section className="space-y-4 rounded-2xl border border-[rgba(20,21,23,0.1)] bg-[#ECEBE5]/60 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-[#141416]">
              5. Third-Party Sharing and Disclosures
            </h2>
            <p>
              We do not sell, rent, monetize, or broker user information to any third parties. We do not disclose personal information to commercial data brokers. Information is only shared under the following limited conditions:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#57585C]">
              <li><strong>Cloud Hosting &amp; Infrastructure Providers:</strong> Highly vetted cloud infrastructure providers (e.g. Railway, Vercel, cloud database hosts) operating under strict data processing agreements.</li>
              <li><strong>Legal Compliance:</strong> Where required by valid judicial order, regulatory directive, or applicable law.</li>
            </ul>
          </section>

          {/* Section 6: User Rights */}
          <section className="space-y-4 rounded-2xl border border-[rgba(20,21,23,0.1)] bg-[#ECEBE5]/60 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-[#141416]">
              6. Your Rights and Choices
            </h2>
            <p>
              In accordance with applicable data protection principles, including India's Digital Personal Data Protection Act (DPDP) standards:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#57585C]">
              <li>You may request details of any personal information associated with your institutional account.</li>
              <li>You may request correction of inaccurate profile data or deletion of your registered credentials.</li>
              <li>You can clear local cookies at any time through your browser settings to terminate active sessions.</li>
              <li>You can accept or decline non-essential analytics tracking using the on-site consent banner.</li>
            </ul>
          </section>

          {/* Section 7: Contact and Owner Review */}
          <section className="space-y-4 rounded-2xl border border-[rgba(20,21,23,0.1)] bg-[#ECEBE5]/60 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-[#141416] flex items-center gap-2.5">
              <Mail className="h-5 w-5 text-[#D94E34]" />
              <span>7. Privacy Inquiries and Governance Contact</span>
            </h2>
            <p>
              If you have questions regarding this Privacy Policy, data processing practices, or wish to exercise your privacy rights, please reach out to the ArthaLens governance team:
            </p>
            <div className="rounded-xl border border-[rgba(20,21,23,0.12)] bg-[#E6E5DF] p-4 font-mono text-xs space-y-1.5 text-[#141416]">
              <div><strong>Project:</strong> ArthaLens Macroeconomic Intelligence Observatory</div>
              <div><strong>Email:</strong> <span className="text-[#2563EB]">privacy@arthalens.org</span> (or configure <code>NEXT_PUBLIC_CONTACT_EMAIL</code>)</div>
              <div><strong>Institutional Repository:</strong> open-data-framework@arthalens.org</div>
              <div><strong>Response SLA:</strong> Inquiries are reviewed within 5 business days.</div>
            </div>
          </section>
        </div>

        {/* Footer Navigation Cross-Link */}
        <div className="pt-8 border-t border-[rgba(20,21,23,0.12)] flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#57585C]">
          <span>Related Legal Instruments:</span>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-[#141416] hover:text-[#D94E34] underline underline-offset-4">
              Terms &amp; Conditions of Research
            </Link>
            <Link href="/about" className="text-[#141416] hover:text-[#D94E34] underline underline-offset-4">
              Institutional Governance
            </Link>
            <Link href="/sources" className="text-[#141416] hover:text-[#D94E34] underline underline-offset-4">
              Data Sources Registry
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
