"use client";

import React from "react";
import { AnalyticsDashboard } from "@/components/block/analytics-dashboard";

export default function AnalyticsPage() {
  return (
    <div className="h-[calc(100vh-80px)] max-w-7xl mx-auto p-4 sm:p-6">
      <AnalyticsDashboard />
    </div>
  );
}
