"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

export function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("arthalens_consent_status");
      if (!stored) {
        setVisible(true);
      }
    } catch {
      // LocalStorage access may fail in private window; fallback silently
    }
  }, []);

  const handleConsent = (status: "accepted" | "declined") => {
    try {
      localStorage.setItem("arthalens_consent_status", status);
    } catch {
      // ignore
    }
    setVisible(false);

    // Update gtag consent mode if gtag exists
    if (typeof window !== "undefined") {
      const win = window as unknown as { gtag?: (...args: unknown[]) => void };
      if (typeof win.gtag === "function") {
        win.gtag("consent", "update", {
          analytics_storage: status === "accepted" ? "granted" : "denied",
        });
      }
    }
  };

  if (!mounted || !visible) return null;

  return (
    <aside
      aria-label="Privacy and Cookie Consent"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 rounded-2xl border border-[rgba(20,21,23,0.18)] bg-[#ECEBE5] p-5 shadow-xl text-[#141416] transition-all animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="inline-flex p-2 rounded-xl bg-[#E6E5DF] border border-[rgba(20,21,23,0.1)] text-[#D94E34]">
          <Cookie className="h-4 w-4" />
        </div>
        <button
          onClick={() => handleConsent("declined")}
          aria-label="Close consent banner and decline non-essential cookies"
          className="text-[#828387] hover:text-[#141416] transition-colors p-1 rounded-md focus-visible:ring-2 focus-visible:ring-[#D94E34] focus:outline-hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 space-y-2">
        <h3 className="font-heading text-sm font-bold tracking-tight text-[#141416] flex items-center gap-1.5">
          <span>Privacy &amp; Analytics Consent</span>
        </h3>
        <p className="font-sans text-xs text-[#57585C] leading-relaxed">
          ArthaLens uses strictly necessary session cookies for authentication and base-year state.
          With your permission, we also use privacy-first, anonymized analytics to measure platform
          reliability without harvesting personal data.
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-[rgba(20,21,23,0.1)] flex items-center justify-between gap-3 text-xs font-mono">
        <Link
          href="/privacy"
          className="text-[#57585C] hover:text-[#141416] underline underline-offset-4 font-sans text-xs"
        >
          Privacy Policy
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleConsent("declined")}
            className="rounded-full border border-[rgba(20,21,23,0.2)] bg-[#E6E5DF] px-3.5 py-1.5 text-xs font-semibold text-[#141416] hover:bg-[#DFDED8] transition-colors focus-visible:ring-2 focus-visible:ring-[#141416] focus:outline-hidden"
          >
            Decline
          </button>
          <button
            onClick={() => handleConsent("accepted")}
            className="rounded-full bg-[#141416] px-4 py-1.5 text-xs font-semibold text-[#ECEBE5] hover:bg-[#D94E34] transition-colors focus-visible:ring-2 focus-visible:ring-[#D94E34] focus:outline-hidden shadow-xs"
          >
            Accept
          </button>
        </div>
      </div>
    </aside>
  );
}
