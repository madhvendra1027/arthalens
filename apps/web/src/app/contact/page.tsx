"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useToast } from "@/components/ui/Toast";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronDown,
  Check,
  Server,
  RefreshCw,
  ArrowRight,
  Terminal,
} from "lucide-react";

interface InquiryOption {
  value: string;
  label: string;
  category: string;
  description: string;
}

const INQUIRY_OPTIONS: InquiryOption[] = [
  {
    value: "research",
    label: "Academic & Macro Research",
    category: "Research",
    description: "Methodologies, national accounts time series, and university collaborations.",
  },
  {
    value: "api",
    label: "Enterprise API & Feed Access",
    category: "Data Feeds",
    description: "Automated JSON/CSV data feeds, direct pipelines, and high-frequency queries.",
  },
  {
    value: "methodology",
    label: "Methodology & Deflator Audit",
    category: "Audit",
    description: "UN SNA 2008 double deflation, base year splicing, and MoSPI revisions.",
  },
  {
    value: "partnership",
    label: "Institutional Partnership",
    category: "Institutional",
    description: "Central bank desks, economic research bureaus, sovereign observatories.",
  },
  {
    value: "security",
    label: "Security & Vulnerability Disclosure",
    category: "Security",
    description: "Responsible vulnerability reports, data provenance, and cryptographic verification.",
  },
];

interface FormState {
  name: string;
  email: string;
  organization: string;
  inquiryType: string;
  subject: string;
  message: string;
  website: string; // Anti-bot honeypot field
}

interface FormErrors {
  name?: string;
  email?: string;
  organization?: string;
  subject?: string;
  message?: string;
}

interface SubmissionReceipt {
  inquiryId: string;
  timestamp: string;
  name: string;
  email: string;
  organization: string;
  inquiryType: string;
  subject: string;
}

export default function ContactPage() {
  const { success, error, warning } = useToast();
  const shouldReduceMotion = useReducedMotion();

  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    organization: "",
    inquiryType: "research",
    subject: "",
    message: "",
    website: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [receipt, setReceipt] = useState<SubmissionReceipt | null>(null);

  // Custom accessible select dropdown state
  const [selectOpen, setSelectOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const selectButtonRef = useRef<HTMLButtonElement>(null);
  const selectListRef = useRef<HTMLUListElement>(null);

  const nameInputId = useId();
  const emailInputId = useId();
  const orgInputId = useId();
  const typeInputId = useId();
  const subjectInputId = useId();
  const messageInputId = useId();

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "ArthaLens Institutional Contact",
    description:
      "Direct communication channel for sovereign research inquiries, custom data pipelines, methodology questions, and enterprise telemetry access with ArthaLens.",
    url: "https://arthalens-production.up.railway.app/contact",
    mainEntity: {
      "@type": "Organization",
      name: "ArthaLens",
      url: "https://arthalens-production.up.railway.app",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Institutional Inquiries & Research",
        email: "governance@arthalens.org",
        availableLanguage: ["English", "Hindi"],
      },
    },
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectButtonRef.current &&
        !selectButtonRef.current.contains(event.target as Node) &&
        selectListRef.current &&
        !selectListRef.current.contains(event.target as Node)
      ) {
        setSelectOpen(false);
      }
    }
    if (selectOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectOpen]);

  // Validation helper
  const validateField = (field: keyof FormState, value: string): string | undefined => {
    switch (field) {
      case "name":
        if (!value.trim()) return "Full name is required.";
        if (value.trim().length < 2) return "Name must be at least 2 characters.";
        if (value.trim().length > 100) return "Name cannot exceed 100 characters.";
        return undefined;
      case "email":
        if (!value.trim()) return "Work or academic email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return "Please enter a valid business or academic email address.";
        }
        if (value.trim().length > 120) return "Email cannot exceed 120 characters.";
        return undefined;
      case "organization":
        if (value.trim().length > 120) return "Organization cannot exceed 120 characters.";
        return undefined;
      case "subject":
        if (!value.trim()) return "Subject line is required.";
        if (value.trim().length < 4) return "Subject must be at least 4 characters.";
        if (value.trim().length > 150) return "Subject cannot exceed 150 characters.";
        return undefined;
      case "message":
        if (!value.trim()) return "Message details are required.";
        if (value.trim().length < 10) return "Message must be at least 10 characters.";
        if (value.trim().length > 3000) return "Message cannot exceed 3,000 characters.";
        return undefined;
      default:
        return undefined;
    }
  };

  const handleBlur = (field: keyof FormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setFormErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const error = validateField(field, value);
      setFormErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleSelectOption = (option: InquiryOption) => {
    setFormData((prev) => ({ ...prev, inquiryType: option.value }));
    setSelectOpen(false);
    selectButtonRef.current?.focus();
  };

  const handleSelectKeyDown = (e: React.KeyboardEvent) => {
    if (!selectOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setSelectOpen(true);
        const currentIdx = INQUIRY_OPTIONS.findIndex((opt) => opt.value === formData.inquiryType);
        setHighlightedIndex(currentIdx >= 0 ? currentIdx : 0);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % INQUIRY_OPTIONS.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + INQUIRY_OPTIONS.length) % INQUIRY_OPTIONS.length);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (INQUIRY_OPTIONS[highlightedIndex]) {
          handleSelectOption(INQUIRY_OPTIONS[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setSelectOpen(false);
        selectButtonRef.current?.focus();
        break;
      case "Tab":
        setSelectOpen(false);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate all fields
    const errors: FormErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      organization: validateField("organization", formData.organization),
      subject: validateField("subject", formData.subject),
      message: validateField("message", formData.message),
    };

    setFormErrors(errors);
    setTouched({
      name: true,
      email: true,
      organization: true,
      subject: true,
      message: true,
    });

    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) {
      setErrorMsg("Please correct the highlighted fields before transmitting your inquiry.");
      warning("Validation Incomplete", "Please check that all required fields satisfy the input criteria.");
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
        throw new Error(data.error || "Failed to submit inquiry. Please try again.");
      }

      const receiptId = data.inquiryId ? `AL-${data.inquiryId}` : `AL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const nowStr = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      });

      setReceipt({
        inquiryId: receiptId,
        timestamp: `${nowStr} IST`,
        name: formData.name,
        email: formData.email,
        organization: formData.organization,
        inquiryType: formData.inquiryType,
        subject: formData.subject,
      });

      setSubmitted(true);
      success("Inquiry Dispatched", "Your dispatch has been successfully recorded at our macroeconomic research desk.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred while transmitting your inquiry.";
      setErrorMsg(msg);
      error("Transmission Failed", msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setReceipt(null);
    setFormData({
      name: "",
      email: "",
      organization: "",
      inquiryType: "research",
      subject: "",
      message: "",
      website: "",
    });
    setFormErrors({});
    setTouched({});
    setErrorMsg(null);
  };

  const selectedOption = INQUIRY_OPTIONS.find((opt) => opt.value === formData.inquiryType) || INQUIRY_OPTIONS[0];

  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.45,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-hidden">
        {/* Subtle institutional ambient background grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden="true"
        />

        {/* Ambient radial glow positioned subtly behind the form */}
        <div
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-24 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
          >
            {/* Top Breadcrumbs */}
            <motion.div variants={itemVariants}>
              <Breadcrumbs items={[{ label: "Contact & Inquiries", href: "/contact" }]} />
            </motion.div>

            {/* Main Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Left Column: Institutional Context & Standards */}
              <motion.div variants={itemVariants} className="lg:col-span-5 space-y-7">
                {/* Channel Indicator Badge */}
                <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 text-xs font-mono tracking-wider">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  <span className="font-semibold">OFFICIAL INQUIRY CHANNEL</span>
                  <span className="text-emerald-500/40 hidden sm:inline" aria-hidden="true">|</span>
                  <span className="text-emerald-400/80 text-[11px] hidden sm:inline font-mono">TLS 1.3 SECURE</span>
                </div>

                {/* Dominant Headline */}
                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-bold tracking-tight text-white font-mono leading-[1.18] text-balance">
                    Institutional &amp; Research Inquiries
                  </h1>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                    Connect directly with our quantitative macroeconomics and sovereign data governance desk regarding
                    National Accounts access, custom API data pipelines, deflator methodology reviews, or academic research collaborations.
                  </p>
                </div>

                {/* Desk Response & Handling Standards Panel */}
                <div className="border border-slate-800/90 rounded-xl p-5 bg-slate-900/50 backdrop-blur-sm space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                      <h2 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                        Desk Review &amp; Handling Standards
                      </h2>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                      Protocol v2.4
                    </span>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    {/* Item 01 */}
                    <div className="flex items-start gap-3.5 group p-2 -mx-2 rounded-lg transition-colors hover:bg-slate-800/30">
                      <span className="text-emerald-400 font-mono font-bold text-sm leading-tight shrink-0 select-none">
                        01
                      </span>
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-200">Standard Desk Review</p>
                        <p className="text-slate-400 leading-relaxed">
                          Inquiries are triaged by our macroeconomic research desk in order of arrival, typically within 1–2 business days (Monday–Friday, IST).
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-slate-800/60" />

                    {/* Item 02 */}
                    <div className="flex items-start gap-3.5 group p-2 -mx-2 rounded-lg transition-colors hover:bg-slate-800/30">
                      <span className="text-emerald-400 font-mono font-bold text-sm leading-tight shrink-0 select-none">
                        02
                      </span>
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-200">Confidential Handling &amp; Zero Tracking</p>
                        <p className="text-slate-400 leading-relaxed">
                          Communications are routed strictly for institutional research dialogue. We do not participate in commercial advertising, behavioral profiling, or third-party data broker sharing.
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-slate-800/60" />

                    {/* Item 03 */}
                    <div className="flex items-start gap-3.5 group p-2 -mx-2 rounded-lg transition-colors hover:bg-slate-800/30">
                      <span className="text-emerald-400 font-mono font-bold text-sm leading-tight shrink-0 select-none">
                        03
                      </span>
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-200">MoSPI &amp; RBI Provenance Alignment</p>
                        <p className="text-slate-400 leading-relaxed">
                          Methodology queries and deflator audits are benchmarked against official National Accounts Statistics, RBI DBIE, and Census registries.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Restrained Technical Annotations Metadata */}
                <div className="rounded-lg border border-slate-800/60 bg-slate-900/30 p-4 space-y-2 text-xs font-mono text-slate-400">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-800/60 pb-2">
                    <span className="flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                      <span>INFRASTRUCTURE METADATA</span>
                    </span>
                    <span className="text-emerald-400">ONLINE</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-4 pt-1 text-[11px]">
                    <div>
                      <span className="text-slate-500">Gateway: </span>
                      <span className="text-slate-300">HTTPS / TLS 1.3</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Jurisdiction: </span>
                      <span className="text-slate-300">Mumbai (IST / UTC+05:30)</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Security PGP: </span>
                      <span className="text-slate-300">Available on request</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Direct Desk: </span>
                      <span className="text-slate-300">governance@arthalens.org</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Inquiry Form / Confirmation Console */}
              <motion.div variants={itemVariants} className="lg:col-span-7">
                <div className="border border-slate-800/90 rounded-2xl bg-slate-900/60 backdrop-blur-xl shadow-2xl relative">
                  {/* Console Header Bar */}
                  <div className="px-6 py-3.5 bg-slate-950/70 border-b border-slate-800/80 rounded-t-2xl flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                      <span className="tracking-wider uppercase">Dispatch Console</span>
                      <span className="text-slate-600 hidden sm:inline">{"//"}</span>
                      <span className="text-slate-500 text-[11px] hidden sm:inline">INSTITUTIONAL TRANSMISSION</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-emerald-400 text-[11px] font-semibold tracking-wide">SYSTEM READY</span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    {submitted && receipt ? (
                      /* Success Confirmation State */
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="py-6 space-y-6"
                      >
                        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/10">
                          <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
                        </div>

                        <div className="text-center space-y-2 max-w-lg mx-auto">
                          <h2 className="text-2xl font-bold text-white font-mono tracking-tight">
                            Inquiry Dispatched Successfully
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            Thank you for contacting ArthaLens. Your inquiry has been registered with our macroeconomic research and governance desk.
                          </p>
                        </div>

                        {/* Dispatch Receipt Card */}
                        <div className="rounded-xl border border-slate-800/90 bg-slate-950/70 p-5 space-y-3 font-mono text-xs">
                          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                            <span className="text-slate-400 font-semibold uppercase text-[11px]">Dispatch Receipt</span>
                            <span className="px-2.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                              {receipt.inquiryId}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-slate-300">
                            <div>
                              <span className="text-slate-500 block text-[10px] uppercase">Researcher / Analyst</span>
                              <span className="font-semibold text-white">{receipt.name}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[10px] uppercase">Routing Address</span>
                              <span className="text-slate-200">{receipt.email}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[10px] uppercase">Affiliation</span>
                              <span className="text-slate-200">{receipt.organization || "Independent Researcher"}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[10px] uppercase">Inquiry Classification</span>
                              <span className="text-emerald-400 capitalize">{receipt.inquiryType}</span>
                            </div>
                            <div className="sm:col-span-2">
                              <span className="text-slate-500 block text-[10px] uppercase">Subject</span>
                              <span className="text-slate-200">{receipt.subject}</span>
                            </div>
                            <div className="sm:col-span-2">
                              <span className="text-slate-500 block text-[10px] uppercase">Timestamp</span>
                              <span className="text-slate-400 text-[11px]">{receipt.timestamp}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-center pt-2">
                          <button
                            type="button"
                            onClick={handleReset}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs font-mono text-slate-200 hover:text-white hover:border-slate-600 hover:bg-slate-800 transition active:scale-[0.99] cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Transmit Another Inquiry</span>
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      /* Inquiry Input Form */
                      <form onSubmit={handleSubmit} noValidate className="space-y-5">
                        {/* Honeypot field (hidden from legitimate users, catches spam bots) */}
                        <div className="hidden" aria-hidden="true">
                          <label htmlFor="website-hp">Website</label>
                          <input
                            id="website-hp"
                            name="website"
                            type="text"
                            tabIndex={-1}
                            autoComplete="off"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          />
                        </div>

                        {/* Top Global Error Banner */}
                        {errorMsg && (
                          <div
                            role="alert"
                            aria-live="polite"
                            className="p-3.5 rounded-lg bg-rose-950/70 border border-rose-800/90 text-rose-200 text-xs flex items-start gap-2.5 shadow-sm"
                          >
                            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
                            <div>
                              <span className="font-semibold font-mono block">Submission Notice:</span>
                              <span className="text-rose-300 leading-relaxed">{errorMsg}</span>
                            </div>
                          </div>
                        )}

                        {/* Row 1: Full Name & Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor={nameInputId}
                              className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-medium"
                            >
                              Full Name <span className="text-emerald-400" aria-label="required">*</span>
                            </label>
                            <div className="relative">
                              <input
                                id={nameInputId}
                                name="name"
                                type="text"
                                required
                                autoComplete="name"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                onBlur={() => handleBlur("name")}
                                placeholder="e.g. Dr. Anand Verma"
                                aria-invalid={!!formErrors.name}
                                aria-describedby={formErrors.name ? `${nameInputId}-err` : undefined}
                                disabled={submitting}
                                className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-950/80 border text-sm text-slate-100 placeholder-slate-500 transition-colors focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed ${
                                  formErrors.name
                                    ? "border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/40"
                                    : "border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
                                }`}
                              />
                            </div>
                            {formErrors.name && (
                              <p id={`${nameInputId}-err`} role="alert" className="mt-1 text-xs text-rose-400 flex items-center gap-1 font-mono">
                                <AlertCircle className="w-3 h-3 shrink-0" aria-hidden="true" />
                                <span>{formErrors.name}</span>
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor={emailInputId}
                              className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-medium"
                            >
                              Work / Academic Email <span className="text-emerald-400" aria-label="required">*</span>
                            </label>
                            <div className="relative">
                              <input
                                id={emailInputId}
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                onBlur={() => handleBlur("email")}
                                placeholder="name@institution.org"
                                aria-invalid={!!formErrors.email}
                                aria-describedby={formErrors.email ? `${emailInputId}-err` : undefined}
                                disabled={submitting}
                                className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-950/80 border text-sm text-slate-100 placeholder-slate-500 transition-colors focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed ${
                                  formErrors.email
                                    ? "border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/40"
                                    : "border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
                                }`}
                              />
                            </div>
                            {formErrors.email && (
                              <p id={`${emailInputId}-err`} role="alert" className="mt-1 text-xs text-rose-400 flex items-center gap-1 font-mono">
                                <AlertCircle className="w-3 h-3 shrink-0" aria-hidden="true" />
                                <span>{formErrors.email}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Row 2: Organization & Inquiry Type */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor={orgInputId}
                              className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-medium"
                            >
                              Organization / Affiliation
                            </label>
                            <div className="relative">
                              <input
                                id={orgInputId}
                                name="organization"
                                type="text"
                                autoComplete="organization"
                                value={formData.organization}
                                onChange={(e) => handleChange("organization", e.target.value)}
                                onBlur={() => handleBlur("organization")}
                                placeholder="e.g. Reserve Bank / IIT / Treasury"
                                aria-invalid={!!formErrors.organization}
                                aria-describedby={formErrors.organization ? `${orgInputId}-err` : undefined}
                                disabled={submitting}
                                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 hover:border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                              />
                            </div>
                            {formErrors.organization && (
                              <p id={`${orgInputId}-err`} role="alert" className="mt-1 text-xs text-rose-400 flex items-center gap-1 font-mono">
                                <AlertCircle className="w-3 h-3 shrink-0" aria-hidden="true" />
                                <span>{formErrors.organization}</span>
                              </p>
                            )}
                          </div>

                          {/* Inquiry Type Custom Accessible Select */}
                          <div className="relative">
                            <label
                              id={`${typeInputId}-label`}
                              htmlFor="contact-type"
                              className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-medium"
                            >
                              Inquiry Type
                            </label>

                            {/* Hidden native select for accessibility & form automation fallback */}
                            <select
                              id="contact-type"
                              name="inquiryType"
                              value={formData.inquiryType}
                              onChange={(e) => handleChange("inquiryType", e.target.value)}
                              tabIndex={-1}
                              aria-hidden="true"
                              className="sr-only"
                            >
                              {INQUIRY_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>

                            {/* Visible Custom Button Trigger */}
                            <button
                              ref={selectButtonRef}
                              type="button"
                              id={`${typeInputId}-trigger`}
                              role="combobox"
                              aria-haspopup="listbox"
                              aria-expanded={selectOpen}
                              aria-controls={`${typeInputId}-listbox`}
                              aria-labelledby={`${typeInputId}-label ${typeInputId}-trigger`}
                              onClick={() => setSelectOpen((prev) => !prev)}
                              onKeyDown={handleSelectKeyDown}
                              disabled={submitting}
                              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-sm text-slate-100 hover:border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 transition-colors text-left flex items-center justify-between gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                            >
                              <span className="truncate font-sans font-medium text-slate-100">
                                {selectedOption.label}
                              </span>
                              <ChevronDown
                                className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                                  selectOpen ? "rotate-180 text-emerald-400" : ""
                                }`}
                                aria-hidden="true"
                              />
                            </button>

                            {/* Custom Dropdown Menu */}
                            <AnimatePresence>
                              {selectOpen && (
                                <motion.ul
                                  ref={selectListRef}
                                  id={`${typeInputId}-listbox`}
                                  role="listbox"
                                  aria-labelledby={`${typeInputId}-label`}
                                  initial={{ opacity: 0, y: -6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -6 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute left-0 right-0 mt-1.5 max-h-72 overflow-y-auto rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1.5 z-30 focus:outline-none"
                                >
                                  {INQUIRY_OPTIONS.map((option, idx) => {
                                    const isSelected = option.value === formData.inquiryType;
                                    const isHighlighted = idx === highlightedIndex;
                                    return (
                                      <li
                                        key={option.value}
                                        role="option"
                                        aria-selected={isSelected}
                                        id={`${typeInputId}-opt-${option.value}`}
                                        onClick={() => handleSelectOption(option)}
                                        onMouseEnter={() => setHighlightedIndex(idx)}
                                        className={`px-3.5 py-2.5 cursor-pointer text-xs transition-colors flex items-start justify-between gap-3 ${
                                          isSelected
                                            ? "bg-emerald-950/40 text-emerald-200"
                                            : isHighlighted
                                            ? "bg-slate-800/60 text-white"
                                            : "text-slate-300 hover:bg-slate-800/40"
                                        }`}
                                      >
                                        <div className="space-y-0.5">
                                          <div className="flex items-center gap-2">
                                            <span className="font-semibold text-slate-100 text-xs">
                                              {option.label}
                                            </span>
                                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                                              {option.category}
                                            </span>
                                          </div>
                                          <p className="text-[11px] text-slate-400 leading-normal">
                                            {option.description}
                                          </p>
                                        </div>
                                        {isSelected && (
                                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                                        )}
                                      </li>
                                    );
                                  })}
                                </motion.ul>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* Row 3: Subject */}
                        <div>
                          <label
                            htmlFor={subjectInputId}
                            className="block text-xs font-mono uppercase text-slate-300 mb-1.5 font-medium"
                          >
                            Subject <span className="text-emerald-400" aria-label="required">*</span>
                          </label>
                          <div className="relative">
                            <input
                              id={subjectInputId}
                              name="subject"
                              type="text"
                              required
                              value={formData.subject}
                              onChange={(e) => handleChange("subject", e.target.value)}
                              onBlur={() => handleBlur("subject")}
                              placeholder="Brief summary of inquiry"
                              aria-invalid={!!formErrors.subject}
                              aria-describedby={formErrors.subject ? `${subjectInputId}-err` : undefined}
                              disabled={submitting}
                              className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-950/80 border text-sm text-slate-100 placeholder-slate-500 transition-colors focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed ${
                                formErrors.subject
                                  ? "border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/40"
                                  : "border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
                              }`}
                            />
                          </div>
                          {formErrors.subject && (
                            <p id={`${subjectInputId}-err`} role="alert" className="mt-1 text-xs text-rose-400 flex items-center gap-1 font-mono">
                              <AlertCircle className="w-3 h-3 shrink-0" aria-hidden="true" />
                              <span>{formErrors.subject}</span>
                            </p>
                          )}
                        </div>

                        {/* Row 4: Message */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label
                              htmlFor={messageInputId}
                              className="block text-xs font-mono uppercase text-slate-300 font-medium"
                            >
                              Message Details <span className="text-emerald-400" aria-label="required">*</span>
                            </label>
                            <span className="text-[11px] font-mono text-slate-500">
                              {formData.message.length} / 3,000
                            </span>
                          </div>
                          <div className="relative">
                            <textarea
                              id={messageInputId}
                              name="message"
                              rows={5}
                              required
                              value={formData.message}
                              onChange={(e) => handleChange("message", e.target.value)}
                              onBlur={() => handleBlur("message")}
                              placeholder="Provide details regarding datasets, time-series horizons, deflator methodology, or institutional scope..."
                              aria-invalid={!!formErrors.message}
                              aria-describedby={formErrors.message ? `${messageInputId}-err` : undefined}
                              disabled={submitting}
                              className={`w-full px-3.5 py-2.5 rounded-lg bg-slate-950/80 border text-sm text-slate-100 placeholder-slate-500 transition-colors focus:outline-none resize-y min-h-[120px] disabled:opacity-60 disabled:cursor-not-allowed ${
                                formErrors.message
                                  ? "border-rose-500/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/40"
                                  : "border-slate-800 hover:border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40"
                              }`}
                            />
                          </div>
                          {formErrors.message && (
                            <p id={`${messageInputId}-err`} role="alert" className="mt-1 text-xs text-rose-400 flex items-center gap-1 font-mono">
                              <AlertCircle className="w-3 h-3 shrink-0" aria-hidden="true" />
                              <span>{formErrors.message}</span>
                            </p>
                          )}
                        </div>

                        {/* Submit Action Bar */}
                        <div className="pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-slate-800/80">
                          <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider font-mono transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 active:scale-[0.99] cursor-pointer"
                          >
                            {submitting ? (
                              <>
                                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                                <span>Dispatching Telemetry...</span>
                              </>
                            ) : (
                              <>
                                <span>Transmit Inquiry</span>
                                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                              </>
                            )}
                          </button>

                          <p className="text-xs text-slate-400 leading-normal">
                            Protected by anti-abuse rate limits. View{" "}
                            <Link
                              href="/privacy"
                              className="text-slate-300 underline underline-offset-4 hover:text-emerald-400 transition-colors"
                            >
                              Privacy Policy
                            </Link>
                            .
                          </p>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
