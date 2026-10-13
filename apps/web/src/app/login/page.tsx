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
    <div className="w-full max-w-md rounded-2xl border border-[rgba(20,21,23,0.14)] bg-[#ECEBE5] p-8 shadow-xl">
      {/* Official Header */}
      <div className="flex flex-col items-center text-center pb-6 border-b border-[rgba(20,21,23,0.1)]">
        <ArthaLensLogo size="lg" />
        <div className="mt-4 flex items-center gap-1.5">
          <span className="rounded-full bg-[#141416] text-[#ECEBE5] px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider">
            SOVEREIGN GATEWAY
          </span>
          <span className="rounded-full bg-black/5 text-[#57585C] px-2.5 py-0.5 text-[10px] font-mono font-medium">
            Open Access
          </span>
        </div>
        <h1 className="mt-3 font-serif text-3xl font-normal tracking-tight text-[#141416]">
          Sign in to ArthaLens
        </h1>
        <p className="mt-1 text-xs text-[#57585C] leading-relaxed max-w-xs font-sans">
          Explore India's National Macroeconomic Accounts, GDP series, and Global Benchmarks.
        </p>
      </div>

      {/* 1-Click Access for Google / Citizen Guest */}
      <div className="mt-6 space-y-3">
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
          className="btn-realistic btn-outline-pill flex w-full items-center justify-center gap-2.5 py-2.5 px-4 text-xs font-semibold text-[#141416] disabled:opacity-50"
        >
          <GoogleIcon />
          <span>Continue with Google (Gmail)</span>
        </button>

        {showGmailPrompt && (
          <div className="rounded-xl bg-[#E3E2DC] p-3.5 border border-[rgba(20,21,23,0.15)] space-y-2 text-xs">
            <label className="block text-[10px] font-bold text-[#57585C] font-mono uppercase">
              Enter your Gmail address:
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="yourname@gmail.com"
                value={gmailInput}
                onChange={(e) => setGmailInput(e.target.value)}
                className="flex-1 rounded-full border border-[rgba(20,21,23,0.2)] bg-white px-3 py-1.5 text-xs text-[#141416] font-mono focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => handleGoogleAuth(gmailInput)}
                disabled={loading}
                className="btn-realistic btn-solid-black px-4 py-1.5 text-xs font-semibold shrink-0"
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleGuestExplorer}
          disabled={loading}
          className="btn-realistic btn-solid-black flex w-full items-center justify-between p-3.5 group shadow-xs disabled:opacity-50"
        >
          <div className="flex items-center gap-2.5">
            <Globe2 className="h-4 w-4 text-[#10B981]" />
            <div className="text-left">
              <span className="text-xs font-bold text-white block leading-tight">
                Explore as Public Citizen / Guest
              </span>
              <span className="text-[10px] text-white/60 font-mono">Instant read-only national accounts access</span>
            </div>
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[rgba(20,21,23,0.1)]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[#ECEBE5] px-2 text-[#828387] font-mono text-[10px] uppercase">or email and password</span>
        </div>
      </div>

      {/* Segmented Tab Switcher */}
      <div className="grid grid-cols-2 rounded-full bg-[#DFDED8] p-1 border border-[rgba(20,21,23,0.15)] text-xs gap-1">
        <button
          type="button"
          onClick={() => {
            setTab("signin");
            setErrorMsg(null);
          }}
          className={`btn-realistic rounded-full py-1.5 font-semibold transition-all ${
            tab === "signin"
              ? "btn-solid-black text-white"
              : "text-[#57585C] hover:text-[#141416]"
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
          className={`btn-realistic rounded-full py-1.5 font-semibold transition-all ${
            tab === "signup"
              ? "btn-solid-black text-white"
              : "text-[#57585C] hover:text-[#141416]"
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Status Messages */}
      {errorMsg && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#D94E34]/10 p-2.5 text-xs text-[#D94E34] border border-[#D94E34]/20 font-mono">
          <AlertCircle className="h-4 w-4 shrink-0 text-[#D94E34]" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#059669]/10 p-2.5 text-xs text-[#059669] border border-[#059669]/20 font-mono">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#059669]" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Sign In Form */}
      {tab === "signin" && (
        <form onSubmit={handleSignIn} className="mt-5 space-y-3.5">
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#57585C] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#828387]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@gov.in or email@domain.com"
                className="w-full rounded-full border border-[rgba(20,21,23,0.2)] bg-white py-2 pl-10 pr-4 text-xs text-[#141416] font-mono focus:border-[#141416] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#57585C] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#828387]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-full border border-[rgba(20,21,23,0.2)] bg-white py-2 pl-10 pr-4 text-xs text-[#141416] font-mono focus:border-[#141416] focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-realistic btn-solid-black w-full py-2.5 text-xs font-semibold disabled:opacity-50 mt-2"
          >
            {loading ? "Authenticating..." : "Sign In & Enter"}
          </button>
        </form>
      )}

      {/* Sign Up Form */}
      {tab === "signup" && (
        <form onSubmit={handleSignUp} className="mt-5 space-y-3">
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#57585C] mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-4 w-4 text-[#828387]" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Shreyas Ramanathan"
                className="w-full rounded-full border border-[rgba(20,21,23,0.2)] bg-white py-2 pl-10 pr-4 text-xs text-[#141416] font-mono focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#57585C] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#828387]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="researcher@institute.org"
                className="w-full rounded-full border border-[rgba(20,21,23,0.2)] bg-white py-2 pl-10 pr-4 text-xs text-[#141416] font-mono focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#57585C] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#828387]" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-full border border-[rgba(20,21,23,0.2)] bg-white py-2 pl-10 pr-4 text-xs text-[#141416] font-mono focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-realistic btn-solid-black w-full py-2.5 text-xs font-semibold disabled:opacity-50 mt-2"
          >
            {loading ? "Creating account..." : "Create Account & Explore"}
          </button>
        </form>
      )}

      {/* Institutional Analyst Access Link */}
      <div className="mt-6 pt-4 border-t border-[rgba(20,21,23,0.08)] flex items-center justify-between text-xs text-[#828387] font-mono">
        <button
          type="button"
          onClick={handleDemoAnalyst}
          disabled={loading}
          className="text-[#141416] font-bold hover:underline cursor-pointer"
        >
          1-Click Official Analyst Mode ➔
        </button>
        <span className="text-[10px]">Open Data</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center px-4 py-16">
      <Suspense fallback={<div className="text-xs text-[#828387] font-mono">Loading authentication portal...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
