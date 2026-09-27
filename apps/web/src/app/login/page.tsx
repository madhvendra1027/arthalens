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
  CheckCircle2,
  AlertCircle,
  
  Globe2,
} from "lucide-react";

function GoogleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  const { login, loginWithGoogle, continueAsGuest, signup } = useAuth();
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [showGmailPrompt, setShowGmailPrompt] = useState(false);
  const [gmailInput, setGmailInput] = useState("");
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
      setSuccessMsg("Signed in successfully. Redirecting...");
      setTimeout(() => router.push(from), 400);
    } else {
      setErrorMsg(res.error || "Authentication failed. Please verify email and password.");
    }
  };

  const handleGoogleAuth = async (customGmail?: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    const targetEmail = customGmail || (gmailInput.trim() ? gmailInput.trim() : "citizen.explorer@gmail.com");
    const res = await loginWithGoogle(targetEmail);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(`Signed in with Google (${targetEmail}). Redirecting...`);
      setTimeout(() => router.push(from), 400);
    } else {
      setErrorMsg(res.error || "Google sign in error.");
    }
  };

  const handleGuestExplorer = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    const res = await continueAsGuest();
    setLoading(false);

    if (res.success) {
      setSuccessMsg("Public Explorer access granted. Loading data...");
      setTimeout(() => router.push(from), 400);
    } else {
      setErrorMsg(res.error || "Explorer access error.");
    }
  };

  const handleDemoAnalyst = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    const res = await login(undefined, undefined, true);
    setLoading(false);

    if (res.success) {
      setSuccessMsg("MoSPI Analyst Authorized. Redirecting...");
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
      setSuccessMsg("Account created successfully. Redirecting...");
      setTimeout(() => router.push(from), 500);
    } else {
      setErrorMsg(res.error || "Registration failed. Please check your information.");
    }
  };

  return (
    <div className="w-full max-w-md rounded-md border border-slate-200 bg-white p-7 shadow-xs">
      {/* Official Crest Header */}
      <div className="flex flex-col items-center text-center pb-5 border-b border-slate-100">
        <ArthaLensLogo size="lg" />
        <div className="mt-3 flex items-center gap-1.5">
          <span className="rounded-md bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
            Public & Institutional Portal
          </span>
          <span className="rounded-md bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 text-[10px] font-mono font-medium">
            Open Access
          </span>
        </div>
        <h1 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900">
          Sign In to ArthaLens
        </h1>
        <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-xs">
          Explore India&apos;s National Macroeconomic Accounts, GDP series, and Global Economic Benchmarks.
        </p>
      </div>

      {/* Primary 1-Click Access for Normal People: Google (Gmail) & Guest Explorer */}
      <div className="mt-5 space-y-2.5">
        {/* Google / Gmail Sign-In Button */}
        <button
          type="button"
          onClick={() => {
            if (!showGmailPrompt) {
              setShowGmailPrompt(true);
            } else {
              handleGoogleAuth();
            }
          }}
          disabled={loading}
          className="btn-realistic btn-solid-slate flex w-full items-center justify-center gap-2.5 rounded-lg py-2.5 px-4 text-xs font-bold text-slate-800 disabled:opacity-50"
        >
          <GoogleIcon />
          <span>Continue with Google (Gmail)</span>
        </button>

        {/* Optional Custom Gmail Input */}
        {showGmailPrompt && (
          <div className="rounded-lg bg-slate-50 p-3 border border-slate-300 space-y-2 text-xs animate-in fade-in duration-200">
            <label className="block text-[11px] font-bold text-slate-700">
              Enter your Gmail address:
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="yourname@gmail.com"
                value={gmailInput}
                onChange={(e) => setGmailInput(e.target.value)}
                className="flex-1 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleGoogleAuth(gmailInput)}
                disabled={loading}
                className="btn-realistic btn-solid-blue px-3.5 py-1.5 text-xs font-bold text-white shrink-0"
              >
                Sign In
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              Or click Sign In to continue with your default Google profile.
            </p>
          </div>
        )}

        {/* Citizen / Public Explorer Quick Access */}
        <button
          type="button"
          onClick={handleGuestExplorer}
          disabled={loading}
          className="btn-realistic btn-solid-navy flex w-full items-center justify-between rounded-lg p-3 text-left group shadow-sm disabled:opacity-50"
        >
          <div className="flex items-center gap-2.5">
            <Globe2 className="h-4 w-4 text-emerald-400" />
            <div>
              <span className="text-xs font-extrabold text-white block leading-tight">
                Explore as Public Citizen / Guest
              </span>
              <span className="text-[10px] text-slate-300 font-medium">Instant access to read macroeconomic accounts</span>
            </div>
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-slate-500 font-mono text-[11px]">or email and password</span>
        </div>
      </div>

      {/* Segmented Tab Switcher */}
      <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1.5 border border-slate-300 shadow-inner text-xs gap-1.5">
        <button
          type="button"
          onClick={() => {
            setTab("signin");
            setErrorMsg(null);
          }}
          className={`btn-realistic rounded-lg py-2 font-extrabold transition-all ${
            tab === "signin"
              ? "btn-solid-blue"
              : "btn-solid-slate font-bold text-slate-700"
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
          className={`btn-realistic rounded-lg py-2 font-extrabold transition-all ${
            tab === "signup"
              ? "btn-solid-blue"
              : "btn-solid-slate font-bold text-slate-700"
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Status Messages */}
      {errorMsg && (
        <div className="mt-3 flex items-center gap-2 rounded-md bg-red-50 p-2.5 text-xs text-red-700 border border-red-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mt-3 flex items-center gap-2 rounded-md bg-emerald-50 p-2.5 text-xs text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Sign In Form */}
      {tab === "signin" && (
        <form onSubmit={handleSignIn} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Email Address (Gmail, personal, or institutional)
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
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
            className="btn-realistic btn-solid-blue w-full py-2.5 text-xs font-bold text-white shadow-md shadow-blue-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="text-xs">Signing in...</span>
            ) : (
              <span>Sign In & Explore</span>
            )}
          </button>
        </form>
      )}

      {/* Sign Up Form */}
      {tab === "signup" && (
        <form onSubmit={handleSignUp} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Your Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Radhika Sharma"
                className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Profession or Interest <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Student, Citizen, Researcher, Business"
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
            className="btn-realistic btn-solid-blue w-full py-2.5 text-xs font-bold text-white shadow-md shadow-blue-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="text-xs">Creating account...</span>
            ) : (
              <span>Create Account & Explore</span>
            )}
          </button>
        </form>
      )}

      {/* Institutional Analyst Access Link */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <button
          type="button"
          onClick={handleDemoAnalyst}
          disabled={loading}
          className="text-blue-900 font-semibold hover:underline cursor-pointer"
        >
          Test as MoSPI Official Analyst (1-Click)
        </button>
        <span className="text-slate-400 text-[11px] font-mono">Open Data Portal</span>
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
