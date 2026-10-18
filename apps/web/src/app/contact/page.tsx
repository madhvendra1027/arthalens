"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useToast } from "@/components/ui/Toast";

export default function ContactPage() {
  const { success, error, warning } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    inquiryType: "research",
    subject: "",
    message: "",
    website: "", // Honeypot field
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "ArthaLens Institutional Contact",
    description: "Contact channels for macroeconomic telemetry, sovereign data pipelines, and research inquiries.",
    url: "https://arthalens-production.up.railway.app/contact",
    mainEntity: {
      "@type": "Organization",
      name: "ArthaLens",
      url: "https://arthalens-production.up.railway.app",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Institutional Inquiries & Research",
        email: "research@arthalens.internal",
        availableLanguage: ["English", "Hindi"],
      },
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Basic client validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setErrorMsg("Please fill out all required fields.");
      warning("Validation Error", "Please check that all required fields are filled out.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMsg("Please enter a valid business or academic email address.");
      error("Invalid Email", "Please provide a valid email format.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit message. Please try again.");
      }

      setSubmitted(true);
      success(
        "Inquiry Dispatched",
        "Your inquiry has been successfully routed to our macroeconomic research desk."
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMsg(msg);
      error("Submission Failed", msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <Breadcrumbs items={[{ label: "Contact & Inquiries", href: "/contact" }]} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
            {/* Left Header & Context */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                SECURE COMMUNICATIONS CHANNEL
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-mono">
                Institutional & Research Inquiries
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                Connect with our quantitative macro team regarding sovereign data access,
                custom API feeds, historical deflator recalculations, or academic research collaborations.
              </p>

              <div className="border border-slate-800/80 rounded-xl p-5 bg-slate-900/40 space-y-4">
                <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Telemetry Response Standards
                </h2>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400 font-mono font-bold">01</span>
                    <div>
                      <p className="font-semibold text-slate-200">24-Hour SLA</p>
                      <p className="text-slate-400">Institutional inquiries receive response within one business day.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400 font-mono font-bold">02</span>
                    <div>
                      <p className="font-semibold text-slate-200">Zero Commercial Advertising</p>
                      <p className="text-slate-400">Inquiry details are strictly handled under sovereign confidentiality.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400 font-mono font-bold">03</span>
                    <div>
                      <p className="font-semibold text-slate-200">Verification & Provenance</p>
                      <p className="text-slate-400">All data citations are backed by direct MoSPI, RBI, and Census logs.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <p>Public Key Verification Available Upon Request.</p>
                <p>Telemetry Node: <span className="font-mono text-slate-400">in-bom-1.arthalens.internal</span></p>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="lg:col-span-7">
              <div className="border border-slate-800 rounded-2xl bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative">
                {submitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-2xl">
                      ✓
                    </div>
                    <h2 className="text-2xl font-bold text-white font-mono">Inquiry Logged Successfully</h2>
                    <p className="text-sm text-slate-300 max-w-md mx-auto">
                      Thank you for contacting ArthaLens. Our economic intelligence desk has received your dispatch and will respond via your provided email within 24 hours.
                    </p>
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({
                            name: "",
                            email: "",
                            organization: "",
                            inquiryType: "research",
                            subject: "",
                            message: "",
                            website: "",
                          });
                        }}
                        className="px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs font-mono text-slate-300 hover:text-white hover:border-slate-600 transition"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    {/* Honeypot field (hidden from real users) */}
                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="website-hp">Website</label>
                      <input
                        id="website-hp"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      />
                    </div>

                    {errorMsg && (
                      <div
                        role="alert"
                        className="p-3.5 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2.5"
                      >
                        <span className="font-bold">Error:</span>
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-xs font-mono uppercase text-slate-300 mb-1.5"
                        >
                          Full Name <span className="text-emerald-400">*</span>
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Dr. Anand Verma"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-xs font-mono uppercase text-slate-300 mb-1.5"
                        >
                          Work / Academic Email <span className="text-emerald-400">*</span>
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@institution.org"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="contact-org"
                          className="block text-xs font-mono uppercase text-slate-300 mb-1.5"
                        >
                          Organization / Affiliation
                        </label>
                        <input
                          id="contact-org"
                          type="text"
                          value={formData.organization}
                          onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                          placeholder="e.g. Reserve Bank / IIT / Treasury"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-type"
                          className="block text-xs font-mono uppercase text-slate-300 mb-1.5"
                        >
                          Inquiry Type
                        </label>
                        <select
                          id="contact-type"
                          value={formData.inquiryType}
                          onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition font-mono"
                        >
                          <option value="research">Academic & Macro Research</option>
                          <option value="api">Enterprise API & Feed Access</option>
                          <option value="methodology">Methodology & Deflator Audit</option>
                          <option value="partnership">Institutional Partnership</option>
                          <option value="security">Security & Vulnerability Disclosure</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="block text-xs font-mono uppercase text-slate-300 mb-1.5"
                      >
                        Subject <span className="text-emerald-400">*</span>
                      </label>
                      <input
                        id="contact-subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Brief summary of inquiry"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-xs font-mono uppercase text-slate-300 mb-1.5"
                      >
                        Message <span className="text-emerald-400">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Provide details regarding datasets, time-series horizons, or institutional scope..."
                        className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition resize-y"
                      />
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider font-mono transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
                      >
                        {submitting ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                            Dispatching Telemetry...
                          </>
                        ) : (
                          "Transmit Inquiry"
                        )}
                      </button>

                      <p className="text-xs text-slate-500">
                        Protected by anti-abuse filters. View{" "}
                        <Link href="/privacy" className="text-slate-400 underline hover:text-emerald-400">
                          Privacy Policy
                        </Link>
                        .
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
