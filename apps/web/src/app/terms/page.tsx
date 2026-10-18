import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Scale,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms & Conditions of Research | ArthaLens Macroeconomic Intelligence",
  description:
    "Terms and conditions governing access, analytical research use, statistical provenance, intellectual property, and macroeconomic disclaimers on ArthaLens.",
  alternates: {
    canonical: "https://arthalens-production.up.railway.app/terms",
  },
  openGraph: {
    title: "Terms & Conditions of Research | ArthaLens Macroeconomic Intelligence",
    description:
      "Terms and conditions governing access, analytical research use, statistical provenance, intellectual property, and macroeconomic disclaimers on ArthaLens.",
    url: "https://arthalens-production.up.railway.app/terms",
    type: "website",
    images: [
      {
        url: "https://arthalens-production.up.railway.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArthaLens Terms & Conditions",
      },
    ],
  },
};

export default function TermsAndConditionsPage() {
  const lastUpdated = "October 18, 2026";
  const effectiveDate = "October 18, 2026";

  return (
    <div className="relative min-h-screen bg-[#E6E5DF] text-[#141416] py-12 sm:py-16 selection:bg-[#141416] selection:text-[#E6E5DF]">
      <div className="mx-auto max-w-4xl px-6 sm:px-8 space-y-8">
        <Breadcrumbs items={[{ label: "Terms & Conditions", href: "/terms" }]} className="!text-[#57585C]" />

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
            <span>LEGAL ARCHIVE // TERMS</span>
            <span>•</span>
            <span>REV 2026.10</span>
          </div>
        </div>

        {/* Header Card */}
        <div className="rounded-3xl border border-[rgba(20,21,23,0.14)] bg-[#ECEBE5] p-8 sm:p-12 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(20,21,23,0.18)] bg-[#E6E5DF] px-3.5 py-1 font-mono text-[11px] font-bold text-[#D94E34]">
            <Scale className="h-3.5 w-3.5" />
            <span>INSTITUTIONAL TERMS OF RESEARCH &amp; SERVICE</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-[#141416]">
            Terms &amp; Conditions
          </h1>

          <p className="font-sans text-sm sm:text-base text-[#57585C] leading-relaxed max-w-2xl">
            Please read these Terms &amp; Conditions carefully before accessing or using the ArthaLens
            Macroeconomic Intelligence Observatory. By accessing our platform, databases, or API
            endpoints, you agree to be bound by these terms.
          </p>

          <div className="pt-4 border-t border-[rgba(20,21,23,0.1)] flex flex-wrap items-center gap-6 font-mono text-xs text-[#828387]">
            <span>Effective Date: <strong>{effectiveDate}</strong></span>
            <span>•</span>
            <span>Last Updated: <strong>{lastUpdated}</strong></span>
          </div>
        </div>

        {/* Primary Macroeconomic Advisory Callout */}
        <div className="rounded-2xl border-l-4 border-l-[#D94E34] border border-[rgba(20,21,23,0.14)] bg-[#ECEBE5] p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#D94E34]">
            <AlertTriangle className="h-4 w-4" />
            <span>Important Notice: Informational &amp; Analytical Purpose Only</span>
          </div>
          <p className="font-sans text-sm text-[#141416] leading-relaxed">
            ArthaLens is an academic, policy, and macroeconomic research observatory. <strong>Nothing on this website constitutes financial, investment, tax, commercial, or sovereign debt advisory.</strong> All national account data, deflator simulations, and forecasts are analytical reproductions of official public records and should be interpreted in historical context. Users must independently verify critical statistical figures before making material economic commitments.
          </p>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-10 font-sans text-sm sm:text-[15px] leading-relaxed text-[#35363A]">
          {/* 1. Acceptance */}
          <section className="space-y-4 rounded-2xl border border-[rgba(20,21,23,0.1)] bg-[#ECEBE5]/60 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-[#141416]">
              1. Acceptance of Terms
            </h2>
            <p>
              These Terms &amp; Conditions (&quot;Terms&quot;) constitute a legally binding agreement between you
              (&quot;User&quot;, &quot;Researcher&quot;, or &quot;Institution&quot;) and ArthaLens (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By browsing
              the website, querying time series, testing deflator scenarios, or utilizing our AI copilot,
              you acknowledge that you have read, understood, and agreed to be bound by these Terms and our{" "}
              <Link href="/privacy" className="text-[#2563EB] hover:underline font-medium">
                Privacy Policy
              </Link>.
            </p>
          </section>

          {/* 2. Eligibility & Permitted Use */}
          <section className="space-y-4 rounded-2xl border border-[rgba(20,21,23,0.1)] bg-[#ECEBE5]/60 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-[#141416]">
              2. Eligibility and Permitted Use
            </h2>
            <p>
              The ArthaLens public observatory is accessible to researchers, economists, journalists,
              institutional analysts, policymakers, and members of the public worldwide.
            </p>
            <p>You may use the platform to:</p>
            <ul className="list-disc pl-5 space-y-1 text-[#57585C]">
              <li>Examine and compare official Indian National Accounts Statistics (NAS).</li>
              <li>Evaluate base year harmonizations (2011-12 vs 2022-23 benchmark series).</li>
              <li>Conduct double-deflation econometrics under UN SNA 2008 Chapter 15 guidelines.</li>
              <li>Publish academic papers, economic journalism, or market research citing ArthaLens as an analytical source.</li>
            </ul>
          </section>

          {/* 3. Account Responsibilities */}
          <section className="space-y-4 rounded-2xl border border-[rgba(20,21,23,0.1)] bg-[#ECEBE5]/60 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-[#141416]">
              3. Account Registration &amp; Institutional Credentials
            </h2>
            <p>
              Certain advanced workspace views (e.g. customized multi-series workspaces or persistent API
              keys) may require registering an institutional account. You agree to provide accurate
              credentials, maintain the confidentiality of your session tokens and passwords, and promptly
              notify ArthaLens of any unauthorized access to your account.
            </p>
          </section>

          {/* 4. Nature of Information & Statistical Revisions */}
          <section className="space-y-4 rounded-2xl border border-[rgba(20,21,23,0.1)] bg-[#ECEBE5]/60 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-[#141416]">
              4. Nature of Information, Data Sources, and Official Revisions
            </h2>
            <p>
              Macroeconomic observations presented on ArthaLens are synthesized from official publications
              issued by the Ministry of Statistics and Programme Implementation (MoSPI), the Reserve Bank
              of India (RBI), the Ministry of Finance, and state Directorates of Economics and Statistics.
            </p>
            <div className="rounded-xl border border-[rgba(20,21,23,0.12)] bg-[#E6E5DF] p-4 text-xs space-y-2 text-[#57585C]">
              <div className="font-mono font-bold text-[#141416] uppercase">Understanding National Accounts Revisions:</div>
              <p>
                In accordance with official statistical practices, National Accounts figures undergo periodic
                revisions (from First Advance Estimates, Second Advance Estimates, Provisional Estimates, to
                First and Second Revised Estimates). Figures displayed on ArthaLens reflect the stated
                publication release date and provenance hash. Past data may be retrospectively revised by the
                issuing government authority.
              </p>
            </div>
          </section>

          {/* 5. Acceptable Use Restrictions */}
          <section className="space-y-4 rounded-2xl border border-[rgba(20,21,23,0.1)] bg-[#ECEBE5]/60 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-[#141416]">
              5. Acceptable Use Restrictions
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#57585C]">
              <li>Deploy automated bots, high-frequency scrapers, or scripts that impair platform responsiveness or exceed reasonable rate limits.</li>
              <li>Circumvent or attempt to bypass authentication mechanisms, security firewalls, or session boundaries.</li>
              <li>Misrepresent ArthaLens or its authors as issuing official government decrees, credit rating downgrades, or sovereign guarantees.</li>
              <li>Introduce malicious payloads, SQL injection strings, or attempt denial-of-service attacks against ArthaLens servers.</li>
              <li>Use the Sovereign AI Copilot to generate automated deceptive materials or violate applicable laws.</li>
            </ul>
          </section>

          {/* 6. Intellectual Property & Citation */}
          <section className="space-y-4 rounded-2xl border border-[rgba(20,21,23,0.1)] bg-[#ECEBE5]/60 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-[#141416]">
              6. Intellectual Property and Citation Standards
            </h2>
            <p>
              <strong>Official Statistical Data:</strong> Underlying raw statistical series are public
              records published by the Government of India and the Reserve Bank of India under the Open
              Government Data (OGD) Platform India license.
            </p>
            <p>
              <strong>ArthaLens Platform &amp; Code:</strong> The ArthaLens user interface, proprietary
              visualizations, WebGPU shaders, double-deflation algorithms, consistency index formulas, and
              software code are protected by intellectual property laws.
            </p>
            <div className="rounded-xl border border-[rgba(20,21,23,0.12)] bg-[#E6E5DF] p-4 font-mono text-xs space-y-1 text-[#141416]">
              <div className="font-bold">Recommended Academic / Media Citation:</div>
              <div className="text-[#57585C]">
                &quot;ArthaLens National Accounts Observatory (2026). India Macroeconomic Accounts, UN SNA 2008 Double Deflation Decomposition. Retrieved from https://arthalens-production.up.railway.app&quot;
              </div>
            </div>
          </section>

          {/* 7. Disclaimers and Limitations of Liability */}
          <section className="space-y-4 rounded-2xl border border-[rgba(20,21,23,0.1)] bg-[#ECEBE5]/60 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-[#141416]">
              7. Disclaimer of Warranties and Limitation of Liability
            </h2>
            <p>
              THE ARTHALENS PLATFORM, TIME SERIES, AND SIMULATION TOOLS ARE PROVIDED ON AN &quot;AS IS&quot; AND
              &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
              LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR
              NON-INFRINGEMENT.
            </p>
            <p>
              TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT SHALL ARTHALENS, ITS DEVELOPERS, OR
              CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES
              ARISING OUT OF OR IN CONNECTION WITH THE USE OF, OR INABILITY TO USE, THE PLATFORM OR ANY
              DECISIONS MADE BASED ON INFORMATION PRESENTED ON ARTHALENS.
            </p>
          </section>

          {/* 8. Modifications & Termination */}
          <section className="space-y-4 rounded-2xl border border-[rgba(20,21,23,0.1)] bg-[#ECEBE5]/60 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-[#141416]">
              8. Service Modifications and Updates to Terms
            </h2>
            <p>
              We reserve the right to modify, suspend, or discontinue any feature, endpoint, or dataset at
              any time without prior notice. We may update these Terms periodically to reflect evolving
              methodological standards, legal requirements, or platform capabilities. Continued use of the
              observatory following the posting of updated Terms constitutes acceptance of those changes.
            </p>
          </section>

          {/* 9. Governing Law & Jurisdiction */}
          <section className="space-y-4 rounded-2xl border border-[rgba(20,21,23,0.1)] bg-[#ECEBE5]/60 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-[#141416]">
              9. Governing Law and Dispute Handling
            </h2>
            <p>
              These Terms shall be interpreted and governed in accordance with the laws of India, subject to
              formal review and confirmation by the platform owner upon commercial or institutional incorporation.
              Any dispute, controversy, or claim arising under these Terms shall be resolved through good-faith
              negotiation before resorting to formal legal proceedings.
            </p>
            <p className="text-xs text-[#828387]">
              * Note for platform owner: Governing jurisdiction should be formally aligned with your registered institutional entity.
            </p>
          </section>

          {/* 10. Contact Information */}
          <section className="space-y-4 rounded-2xl border border-[rgba(20,21,23,0.1)] bg-[#ECEBE5]/60 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-[#141416]">
              10. Contact Channel
            </h2>
            <p>
              For legal questions, licensing inquiries, or data provenance verifications, contact the
              observatory administration:
            </p>
            <div className="rounded-xl border border-[rgba(20,21,23,0.12)] bg-[#E6E5DF] p-4 font-mono text-xs space-y-1.5 text-[#141416]">
              <div><strong>Institutional Inquiries:</strong> governance@arthalens.org</div>
              <div><strong>Research Attributions:</strong> open-data-framework@arthalens.org</div>
              <div><strong>Platform:</strong> ArthaLens India Macroeconomic Observatory</div>
            </div>
          </section>
        </div>

        {/* Footer Navigation Cross-Link */}
        <div className="pt-8 border-t border-[rgba(20,21,23,0.12)] flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#57585C]">
          <span>Related Legal Instruments:</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-[#141416] hover:text-[#D94E34] underline underline-offset-4">
              Privacy Policy
            </Link>
            <Link href="/methodology" className="text-[#141416] hover:text-[#D94E34] underline underline-offset-4">
              Methodology Standards
            </Link>
            <Link href="/about" className="text-[#141416] hover:text-[#D94E34] underline underline-offset-4">
              Institutional Governance
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
