"use client";

import React, { Suspense } from "react";
import { MacroAccountsWorkspace } from "@/components/macro/MacroAccountsWorkspace";

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Suspense
        fallback={
          <div className="p-12 text-center font-mono text-xs text-[#828387] rounded-3xl bg-[#ECEBE5] border border-[rgba(20,21,23,0.1)]">
            Loading Macro Analytics Terminal...
          </div>
        }
      >
        <MacroAccountsWorkspace initialView="trends" />
      </Suspense>
    </div>
  );
}
