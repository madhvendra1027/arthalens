"use client";

import React, { useState } from "react";
import { Check, X } from "lucide-react";

interface Role {
  id: string;
  department: "engineering" | "econometrics" | "design" | "policy";
  title: string;
  type: string;
  location: string;
  compensation: string;
}

const DEPARTMENTS = [
  { id: "engineering", name: "Engineering", count: 4 },
  { id: "econometrics", name: "Econometrics", count: 3 },
  { id: "design", name: "Design", count: 2 },
  { id: "policy", name: "Policy & Growth", count: 2 },
];

const ROLES: Role[] = [
  // Engineering
  { id: "eng-1", department: "engineering", title: "Platform Engineer", type: "Full Time", location: "Bengaluru (On-site)", compensation: "₹45L - ₹75L + Equity" },
  { id: "eng-2", department: "engineering", title: "Product Engineer — Autonomous Agents", type: "Full Time", location: "Bengaluru (On-site)", compensation: "₹40L - ₹70L + Equity" },
  { id: "eng-3", department: "engineering", title: "Distributed Data Pipelines Engineer", type: "Full Time", location: "Bengaluru (On-site)", compensation: "₹38L - ₹65L + Equity" },
  { id: "eng-4", department: "engineering", title: "Core Systems Reliability Engineer", type: "Full Time", location: "Bengaluru (Hybrid)", compensation: "₹35L - ₹60L + Equity" },

  // Econometrics
  { id: "econ-1", department: "econometrics", title: "Principal Macroeconometrician", type: "Full Time", location: "New Delhi / Bengaluru", compensation: "₹50L - ₹85L + Equity" },
  { id: "econ-2", department: "econometrics", title: "National Accounts Research Fellow", type: "Full Time", location: "New Delhi (On-site)", compensation: "₹35L - ₹55L + Equity" },
  { id: "econ-3", department: "econometrics", title: "Double-Deflation Quant Researcher", type: "Full Time", location: "Bengaluru (Hybrid)", compensation: "₹40L - ₹65L + Equity" },

  // Design
  { id: "des-1", department: "design", title: "Design Engineer", type: "Full Time", location: "Bengaluru (On-site)", compensation: "₹35L - ₹60L + Equity" },
  { id: "des-2", department: "design", title: "Information Architect & Data Visualizer", type: "Full Time", location: "Bengaluru (Hybrid)", compensation: "₹30L - ₹50L + Equity" },

  // Policy & Growth
  { id: "pol-1", department: "policy", title: "Sovereign Institutions Partner", type: "Full Time", location: "New Delhi (On-site)", compensation: "₹40L - ₹70L + Equity" },
  { id: "pol-2", department: "policy", title: "Macro Data Evangelist", type: "Full Time", location: "New Delhi / Mumbai", compensation: "₹30L - ₹50L + Equity" },
];

export function CareersSection() {
  const [activeDept, setActiveDept] = useState<string>("engineering");
  const [appliedRole, setAppliedRole] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<Role | null>(null);

  const filteredRoles = ROLES.filter((r) => r.department === activeDept);

  return (
    <section className="relative my-24 sm:my-32 border-t border-[rgba(20,21,23,0.12)] pt-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-[rgba(20,21,23,0.12)]">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#828387]">
              CAREERS & CULTURE
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#141416] mt-2 tracking-tight">
              Join our team in Bengaluru & New Delhi.
            </h2>
          </div>
          <p className="max-w-md font-sans text-xs sm:text-sm text-[#57585C] leading-relaxed">
            For rockstars who love working like precision craftsmen on national-scale infrastructure.
          </p>
        </div>

        {/* Two Column Layout: Department Selector on Left, Roles List on Right */}
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Department Tabs (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            {DEPARTMENTS.map((dept) => {
              const isActive = dept.id === activeDept;
              return (
                <button
                  key={dept.id}
                  onClick={() => setActiveDept(dept.id)}
                  className={`w-full text-left rounded-lg p-5 transition-all duration-150 flex items-center justify-between border ${
                    isActive
                      ? "bg-[#141416] text-[#ECEBE5] border-[#141416] shadow-md"
                      : "bg-[#ECEBE5] text-[#141416] border-[rgba(20,21,23,0.12)] hover:bg-[#E8E7E1]"
                  }`}
                >
                  <span className="font-serif text-2xl font-normal">{dept.name}</span>
                  <span
                    className={`font-mono text-[10px] font-bold uppercase tracking-widest ${
                      isActive ? "text-[#E5A83B]" : "text-[#828387]"
                    }`}
                  >
                    {dept.count} Open Roles
                  </span>
                </button>
              );
            })}
          </div>

          {/* Roles List (8 cols) */}
          <div className="lg:col-span-8 divide-y divide-[rgba(20,21,23,0.12)] rounded-lg border border-[rgba(20,21,23,0.12)] bg-[#ECEBE5]">
            {filteredRoles.map((role) => (
              <div
                key={role.id}
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#E8E7E0] transition-colors"
              >
                <div>
                  <h3 className="font-serif text-2xl font-normal text-[#141416]">
                    {role.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1 font-mono text-xs text-[#57585C]">
                    <span>{role.type}</span>
                    <span>•</span>
                    <span>{role.location}</span>
                    <span>•</span>
                    <span className="font-bold text-[#141416]">{role.compensation}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowModal(role)}
                  className="btn-realistic btn-solid-black text-xs px-5 py-2 shrink-0 self-start sm:self-auto"
                >
                  {appliedRole === role.id ? "Applied ✓" : "Apply"}
                </button>
              </div>
            ))}

            {filteredRoles.length === 0 && (
              <div className="p-8 text-center font-mono text-xs text-[#828387]">
                No open roles in this department right now.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Application Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl border border-[rgba(20,21,23,0.2)] bg-[#ECEBE5] p-6 shadow-2xl text-[#141416]">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(20,21,23,0.1)]">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#828387]">
                  APPLICATION FORM
                </span>
                <h3 className="font-serif text-2xl font-normal">{showModal.title}</h3>
              </div>
              <button
                onClick={() => setShowModal(null)}
                className="rounded-full p-1 hover:bg-black/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAppliedRole(showModal.id);
                setShowModal(null);
              }}
              className="space-y-4 my-5"
            >
              <div>
                <label className="block font-mono text-[11px] font-bold uppercase mb-1">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Shreyas Ramanathan"
                  className="w-full rounded border border-[rgba(20,21,23,0.2)] bg-white px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold uppercase mb-1">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  placeholder="shreyas@domain.com"
                  className="w-full rounded border border-[rgba(20,21,23,0.2)] bg-white px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold uppercase mb-1">
                  GitHub / Portfolio / Research URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  className="w-full rounded border border-[rgba(20,21,23,0.2)] bg-white px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold uppercase mb-1">
                  Why sovereign macroeconomic infrastructure?
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us what draws you to national accounts accuracy..."
                  className="w-full rounded border border-[rgba(20,21,23,0.2)] bg-white px-3 py-2 text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[rgba(20,21,23,0.1)]">
                <button
                  type="button"
                  onClick={() => setShowModal(null)}
                  className="btn-realistic btn-outline-pill text-xs px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-realistic btn-solid-black text-xs px-6 py-2"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
