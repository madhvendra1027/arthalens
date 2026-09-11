"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ArthaLensLogo } from "@/components/ui/ArthaLensLogo";
import {
  Lock,
  Mail,
  User,
  Building,
  ArrowRight,
  Zap,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  const { login, signup } = useAuth();
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      setSuccessMsg("Authorization verified. Redirecting to workspace...");
      setTimeout(() => router.push(from), 400);
    } else {
      setErrorMsg(res.error || "Authentication failed. Please verify credentials.");
    }
  };

  const handleDemoSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    const res = await login(undefined, undefined, true);
    setLoading(false);

    if (res.success) {
      setSuccessMsg("Demo Analyst Authorized. Redirecting to dashboard...");
      setTimeout(() => router.push(from), 400);
    } else {
      setErrorMsg(res.error || "Demo access error.");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    const res = await signup(name, email, password, organization);
    setLoading(false);

    if (res.success) {
      setSuccessMsg("Account registered successfully. Redirecting...");
      setTimeout(() => router.push(from), 500);
    } else {
      setErrorMsg(res.error || "Registration failed. Please check your information.");
    }
  };

  return (
    <div className="w-full max-w-md rounded-md border border-slate-200 bg-white p-7 shadow-xs">
      {/* Official Government / National Accounts Crest Header */}
      <div className="flex flex-col items-center text-center pb-5 border-b border-slate-100">
        <ArthaLensLogo size="lg" />
        <div className="mt-3 flex items-center gap-1.5">
          <span className="rounded-md bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
            Official Data Gateway
          </span>
          <span className="rounded-md bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 text-[10px] font-mono font-medium">
            MoSPI &#x2022; RBI OGD
          </span>
        </div>
        <h1 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900">
          Sign In to ArthaLens
        </h1>
        <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-xs">
          National Accounts Statistics & Macroeconomic Intelligence Portal
        </p>
      </div>

      {/* Instant Demo Quick Access */}
      <div className="mt-5">
        <button
          type="button"
          onClick={handleDemoSignIn}
          disabled={loading}
          className="flex w-full items-center justify-between rounded-md bg-blue-50/70 p-3 text-left border border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-900 text-white">
              <Zap className="h-3.5 w-3.5 fill-white" />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                Instant Demo Analyst Access
                <span className="rounded-md bg-blue-200 text-blue-900 font-mono text-[9px] px-1.5 py-0.2 font-bold">1-CLICK</span>
              </div>
              <div className="text-[11px] text-slate-600">Dr. Vikram Sengupta &#x2022; MoSPI NAS Division</div>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-blue-800 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Segmented Tab Switcher */}
      <div className="mt-4 grid grid-cols-2 rounded-md bg-slate-100 p-1 border border-slate-200 text-xs">
        <button
          type="button"
          onClick={() => {
            setTab("signin");
            setErrorMsg(null);
          }}
          className={`rounded-md py-1.5 font-bold transition-all ${
            tab === "signin"
              ? "bg-white text-blue-950 shadow-2xs border border-slate-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setTab("signup");
            setErrorMsg(null);
          }}
          className={`rounded-md py-1.5 font-bold transition-all ${
            tab === "signup"
              ? "bg-white text-blue-950 shadow-2xs border border-slate-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Status Messages */}
      {errorMsg && (
        <div className="mt-4 flex items-center gap-2 rounded-md bg-red-50 p-3 text-xs text-red-700 border border-red-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mt-4 flex items-center gap-2 rounded-md bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Sign In Form */}
      {tab === "signin" && (
        <form onSubmit={handleSignIn} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Official / Research Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@arthalens.gov.in"
                className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-900 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-blue-800 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="text-xs">Authenticating...</span>
            ) : (
              <span>Authorize & Enter Platform</span>
            )}
          </button>
        </form>
      )}

      {/* Sign Up Form */}
      {tab === "signup" && (
        <form onSubmit={handleSignUp} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Full Professional Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Radhika Sundaram"
                className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Institutional Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@institute.ac.in or research@domain.com"
                className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Organization / Department
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. NITI Aayog / RBI / University Research"
                className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Password (min. 6 characters)
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-900 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-blue-800 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="text-xs">Creating account...</span>
            ) : (
              <span>Create Account & Register</span>
            )}
          </button>
        </form>
      )}

      {/* Institutional Security Notice */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-blue-700" /> Authorized Institutional Access
        </span>
        <span className="text-slate-500">OGD Compliant</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center bg-surface-bg px-4 py-12">
      <Suspense fallback={<div className="text-xs text-slate-500 font-mono">Loading authentication portal...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}