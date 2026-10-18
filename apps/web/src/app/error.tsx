"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, ArrowLeft, ShieldAlert } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to client diagnostic log if needed
    console.error("[ArthaLens Error Boundary Captured]", error.message);
  }, [error]);

  return (
    <div className="relative min-h-[80vh] bg-[#E6E5DF] text-[#141416] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 selection:bg-[#141416] selection:text-[#E6E5DF]">
      <div className="w-full max-w-xl mx-auto rounded-3xl border border-[rgba(20,21,23,0.16)] bg-[#ECEBE5] p-8 sm:p-12 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(20,21,23,0.18)] bg-[#E6E5DF] px-3.5 py-1 font-mono text-[11px] font-bold text-[#D94E34]">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>UNEXPECTED TELEMETRY EXCEPTION</span>
          </div>
          {error.digest && (
            <span className="font-mono text-[10px] text-[#828387]">
              DIGEST: {error.digest.slice(0, 8)}
            </span>
          )}
        </div>

        <div className="space-y-3">
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-[#141416]">
            Failed to render macroeconomic view.
          </h1>
          <p className="font-sans text-sm text-[#57585C] leading-relaxed">
            An unexpected error occurred while processing national accounts series or rendering the
            visualization stage. Data integrity remains uncompromised.
          </p>
        </div>

        <div className="pt-4 border-t border-[rgba(20,21,23,0.12)] flex flex-wrap items-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-full bg-[#141416] px-5 py-2.5 font-mono text-xs font-semibold text-[#ECEBE5] hover:bg-[#D94E34] transition-colors focus-visible:ring-2 focus-visible:ring-[#D94E34] focus:outline-hidden cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Retry Operation</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[rgba(20,21,23,0.2)] bg-[#E6E5DF] px-5 py-2.5 font-mono text-xs font-semibold text-[#141416] hover:bg-[#DFDED8] transition-colors focus-visible:ring-2 focus-visible:ring-[#141416] focus:outline-hidden"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
