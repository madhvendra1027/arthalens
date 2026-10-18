"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Globe2,
  TrendingUp,
  SlidersHorizontal,
  Bell,
  Search,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  Info,
  Clock,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Filter,
  RefreshCw,
  Building2,
  Layers,
  Award,
  Zap,
  Radio,
  BookOpen,
} from "lucide-react";
import {
  EconomicTopic,
  GeographicRegion,
  IntelligenceStory,
  MarketIndex,
  SeverityLevel,
  StoryType,
  UserPreferences,
} from "@/lib/intelligence/types";
import { SUPPORTED_COUNTRIES, getCountryByIso } from "@/lib/intelligence/countries";
import { NotificationCenter } from "@/components/intelligence/NotificationCenter";

const REGIONS: { key: GeographicRegion; label: string }[] = [
  { key: "global", label: "All Regions" },
  { key: "south_asia", label: "South Asia" },
  { key: "north_america", label: "North America" },
  { key: "europe", label: "Europe" },
  { key: "east_asia", label: "East Asia" },
  { key: "southeast_asia", label: "Southeast Asia" },
  { key: "middle_east_africa", label: "Middle East & Africa" },
  { key: "latin_america", label: "Latin America" },
  { key: "oceania", label: "Oceania" },
];

const TOPICS: { key: EconomicTopic | "all"; label: string }[] = [
  { key: "all", label: "All Topics" },
  { key: "central_banking_rates", label: "Central Banks & Rates" },
  { key: "gdp_growth", label: "GDP & Output" },
  { key: "inflation_cpi", label: "Inflation & CPI" },
  { key: "fiscal_budgets", label: "Fiscal & Capex" },
  { key: "commodities_energy", label: "Commodities & Energy" },
  { key: "trade_forex", label: "Trade & Forex" },
  { key: "financial_stability", label: "Financial Stability" },
  { key: "regulations_sebi", label: "Regulations & SEBI" },
];

function IntelligenceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Navigation tab
  const tabParam = searchParams.get("tab") as "overview" | "markets" | "economy" | "india" | "preferences" | null;
  const [activeTab, setActiveTab] = useState<"overview" | "markets" | "economy" | "india" | "preferences">(
    tabParam || "overview"
  );

  // Data states
  const [stories, setStories] = useState<IntelligenceStory[]>([]);
  const [marketIndices, setMarketIndices] = useState<MarketIndex[]>([]);
  const [userPrefs, setUserPrefs] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [freshnessTime, setFreshnessTime] = useState<string>("");

  // Filter states
  const [selectedCountry, setSelectedCountry] = useState<string>("IN");
  const [selectedRegion, setSelectedRegion] = useState<GeographicRegion>("global");
  const [selectedTopic, setSelectedTopic] = useState<EconomicTopic | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<"all" | StoryType>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStory, setSelectedStory] = useState<IntelligenceStory | null>(null);

  // Sync tab with URL
  useEffect(() => {
    if (tabParam && ["overview", "markets", "economy", "india", "preferences"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const switchTab = (tab: "overview" | "markets" | "economy" | "india" | "preferences") => {
    setActiveTab(tab);
    router.replace(`/intelligence?tab=${tab}`, { scroll: false });
  };

  // Fetch initial data
  const loadData = async () => {
    try {
      setRefreshing(true);
      const [newsRes, marketRes, prefsRes] = await Promise.all([
        fetch("/api/intelligence/news?limit=50"),
        fetch("/api/intelligence/markets"),
        fetch("/api/user/preferences"),
      ]);

      if (newsRes.ok) {
        const newsData = await newsRes.json();
        setStories(newsData.data || []);
        setFreshnessTime(newsData.metadata?.freshnessTimestamp || new Date().toISOString());
      }

      if (marketRes.ok) {
        const marketData = await marketRes.json();
        setMarketIndices(marketData.indices || []);
      }

      if (prefsRes.ok) {
        const pData = await prefsRes.json();
        if (pData.preferences) {
          setUserPrefs(pData.preferences);
          setSelectedCountry(pData.preferences.homeCountry || "IN");
        }
      }
    } catch (err) {
      console.error("Failed to load intelligence data", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update country preference
  const handleCountryChange = async (newCountry: string) => {
    setSelectedCountry(newCountry);
    try {
      const res = await fetch("/api/user/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ homeCountry: newCountry }),
      });
      if (res.ok) {
        const data = await res.json();
        setUserPrefs(data.preferences);
      }
    } catch (err) {
      console.error("Failed to update home country", err);
    }
  };

  // Current active country profile
  const countryProfile = useMemo(() => getCountryByIso(selectedCountry), [selectedCountry]);

  // Filtered stories based on current tab and filters
  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      // Category filter
      if (selectedCategory !== "all" && story.storyType !== selectedCategory) {
        return false;
      }
      // Region filter
      if (selectedRegion !== "global" && !story.regions.includes(selectedRegion) && !story.regions.includes("global")) {
        return false;
      }
      // Topic filter
      if (selectedTopic !== "all" && !story.topics.includes(selectedTopic)) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesHeadline = story.headline.toLowerCase().includes(q);
        const matchesSummary = story.summary.toLowerCase().includes(q);
        const matchesPublisher = story.publisher.toLowerCase().includes(q);
        const matchesIndicator = story.indicators?.some((ind) => ind.toLowerCase().includes(q));
        if (!matchesHeadline && !matchesSummary && !matchesPublisher && !matchesIndicator) {
          return false;
        }
      }
      return true;
    });
  }, [stories, selectedCategory, selectedRegion, selectedTopic, searchQuery]);

  // Stories for country briefing
  const domesticStories = useMemo(() => {
    return stories.filter(
      (s) => s.primaryCountry === selectedCountry || s.affectedCountries.includes(selectedCountry)
    );
  }, [stories, selectedCountry]);

  // Spillovers affecting current home country
  const spilloverStories = useMemo(() => {
    return stories.filter(
      (s) => s.isSpillover && s.affectedCountries.includes(selectedCountry) && s.primaryCountry !== selectedCountry
    );
  }, [stories, selectedCountry]);

  // Critical alerts banner
  const criticalStories = useMemo(() => {
    return stories.filter((s) => s.severity === "critical");
  }, [stories]);

  const getStatusBadge = (status: "open" | "closed" | "delayed") => {
    switch (status) {
      case "open":
        return <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#059669] bg-[#059669]/10 px-2 py-0.5 rounded-full"><span className="h-1.5 w-1.5 rounded-full bg-[#059669] animate-pulse" /> OPEN</span>;
      case "closed":
        return <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#828387] bg-black/5 px-2 py-0.5 rounded-full"><span className="h-1.5 w-1.5 rounded-full bg-[#828387]" /> CLOSED</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#E5A83B] bg-[#E5A83B]/10 px-2 py-0.5 rounded-full"><span className="h-1.5 w-1.5 rounded-full bg-[#E5A83B]" /> DELAYED</span>;
    }
  };

  const getSeverityBadge = (sev: SeverityLevel) => {
    switch (sev) {
      case "critical":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border border-[#D94E34]/30 bg-[#D94E34]/10 text-[#D94E34]">
            <ShieldAlert className="h-3 w-3" />
            <span>Critical</span>
          </span>
        );
      case "high":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border border-[#E5A83B]/30 bg-[#E5A83B]/10 text-[#E5A83B]">
            <AlertTriangle className="h-3 w-3" />
            <span>High Impact</span>
          </span>
        );
      case "standard":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border border-[#059669]/30 bg-[#059669]/10 text-[#059669]">
            <Info className="h-3 w-3" />
            <span>Standard</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border border-black/10 bg-black/5 text-[#57585C]">
            <Info className="h-3 w-3" />
            <span>Info</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#ECEBE5] text-[#141416]">
      {/* Top Global Market Ticker Tape */}
      <div className="w-full max-w-full overflow-hidden border-b border-[rgba(20,21,23,0.12)] bg-[#E3E2DC]/80 py-2 shadow-xs">
        <div className="w-full max-w-full overflow-x-auto px-4 [scrollbar-width:none] [-ms-overflow-style:none] touch-pan-x">
          <div className="mx-auto max-w-7xl flex items-center justify-between gap-4 min-w-max">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#059669] animate-pulse" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#141416]">
              WORLD EXCHANGES
            </span>
          </div>

          <div className="flex items-center gap-5">
            {marketIndices.map((idx) => {
              const isPositive = idx.changePercent >= 0;
              return (
                <div key={idx.symbol} className="flex items-center gap-2 font-mono text-xs">
                  <span className="font-bold text-[#141416]">{idx.name}:</span>
                  <span className="text-[#57585C]">
                    {idx.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                  <span
                    className={`flex items-center font-bold ${
                      isPositive ? "text-[#059669]" : "text-[#D94E34]"
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5" />
                    )}
                    {isPositive ? "+" : ""}
                    {idx.changePercent}%
                  </span>
                  {getStatusBadge(idx.status)}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-[#828387]">
            <Clock className="h-3 w-3" />
            <span>Quotes delayed 15-20 min per exchange SLA</span>
          </div>
        </div>
      </div>
    </div>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Observatory Header Banner */}
        <div className="rounded-2xl border border-[rgba(20,21,23,0.12)] bg-[#E6E5DF] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="rounded-full bg-[#141416] text-[#ECEBE5] px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="h-3 w-3 text-[#059669] animate-pulse" />
                <span>MACROECONOMIC & MARKET INTELLIGENCE</span>
              </span>
              <span className="font-mono text-xs text-[#828387] hidden sm:inline">
                MoSPI • RBI • Federal Reserve • ECB • BoJ • Official Gazettes
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#141416]">
              Global Financial Intelligence Observatory
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[#57585C] max-w-3xl leading-relaxed">
              Synthesized sovereign monetary decisions, national account releases, global stock market liquidity,
              and cross-border economic spillovers, with dedicated India desk integration.
            </p>
          </div>

          {/* Quick Country Switcher & Telemetry Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            {/* Home Country Pill Selector */}
            <div className="flex items-center gap-2 rounded-xl border border-[rgba(20,21,23,0.15)] bg-white/70 p-1.5 shadow-2xs">
              <span className="font-mono text-[10px] uppercase font-bold text-[#828387] pl-2">
                Home Country:
              </span>
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="bg-transparent font-heading text-xs font-bold text-[#141416] py-1 px-2 border-0 focus:ring-0 cursor-pointer rounded-lg hover:bg-black/5"
              >
                {SUPPORTED_COUNTRIES.map((c) => (
                  <option key={c.isoCode} value={c.isoCode}>
                    {c.flag} {c.name} ({c.isoCode})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={loadData}
              disabled={refreshing}
              className="flex items-center gap-1.5 rounded-xl border border-[rgba(20,21,23,0.15)] bg-white/70 px-3 py-2 text-xs font-mono font-medium text-[#141416] hover:bg-black/5 transition-all shadow-2xs cursor-pointer"
              title="Refresh feeds"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-[#059669]" : ""}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-[rgba(20,21,23,0.12)] pb-2 overflow-x-auto gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => switchTab("overview")}
              className={`px-4 py-2 rounded-xl font-heading text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "overview"
                  ? "bg-[#141416] text-[#ECEBE5] shadow-xs"
                  : "text-[#57585C] hover:text-[#141416] hover:bg-black/5"
              }`}
            >
              Global Overview
            </button>
            <button
              onClick={() => switchTab("markets")}
              className={`px-4 py-2 rounded-xl font-heading text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "markets"
                  ? "bg-[#141416] text-[#ECEBE5] shadow-xs"
                  : "text-[#57585C] hover:text-[#141416] hover:bg-black/5"
              }`}
            >
              Stock Markets (8 Regions)
            </button>
            <button
              onClick={() => switchTab("economy")}
              className={`px-4 py-2 rounded-xl font-heading text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "economy"
                  ? "bg-[#141416] text-[#ECEBE5] shadow-xs"
                  : "text-[#57585C] hover:text-[#141416] hover:bg-black/5"
              }`}
            >
              Economic Intelligence
            </button>
            <button
              onClick={() => switchTab("india")}
              className={`px-4 py-2 rounded-xl font-heading text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "india"
                  ? "bg-[#141416] text-[#ECEBE5] shadow-xs"
                  : "text-[#57585C] hover:text-[#141416] hover:bg-black/5"
              }`}
            >
              <span>🇮🇳 India Desk</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#D94E34]" />
            </button>
            <button
              onClick={() => switchTab("preferences")}
              className={`px-4 py-2 rounded-xl font-heading text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "preferences"
                  ? "bg-[#141416] text-[#ECEBE5] shadow-xs"
                  : "text-[#57585C] hover:text-[#141416] hover:bg-black/5"
              }`}
            >
              Alerts & Personalization
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 font-mono text-[11px] text-[#828387]">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#059669]" />
            <span>AUTHENTIC GAZEtte FEED</span>
          </div>
        </div>

        {/* TAB 1: GLOBAL OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Critical Intelligence Alert Banner */}
            {criticalStories.length > 0 && (
              <div className="rounded-2xl border border-[#D94E34]/30 bg-[#D94E34]/5 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#D94E34]/15 text-[#D94E34] shrink-0 mt-0.5">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#D94E34]">
                        CRITICAL MACRO DEVELOPMENTS
                      </span>
                      <span className="font-mono text-[10px] text-[#828387]">• Systemic Importance</span>
                    </div>
                    <h3 className="font-heading text-sm sm:text-base font-bold text-[#141416]">
                      {criticalStories[0].headline}
                    </h3>
                    <p className="font-sans text-xs text-[#57585C] mt-1 line-clamp-2">
                      {criticalStories[0].summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 pl-11 md:pl-0">
                  {criticalStories[0].relatedArthaLensRoutes?.[0] && (
                    <Link
                      href={criticalStories[0].relatedArthaLensRoutes[0].href}
                      className="btn-realistic btn-solid-black text-xs px-4 py-2 font-sans font-semibold flex items-center gap-1.5"
                    >
                      <span>Analyze in Workspace</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                  <a
                    href={criticalStories[0].canonicalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-realistic btn-outline-pill text-xs px-3 py-2 flex items-center gap-1 text-[#57585C] hover:text-[#141416]"
                  >
                    <span>Official Gazette</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Split Grid: Home Country Briefing vs World Market Movers */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Home-Country Personalized Economic Briefing */}
              <div className="lg:col-span-7 space-y-4">
                <div className="rounded-2xl border border-[rgba(20,21,23,0.12)] bg-[#E6E5DF] p-5 sm:p-6 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-[rgba(20,21,23,0.1)]">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{countryProfile.flag}</span>
                      <div>
                        <h2 className="font-heading text-lg font-bold text-[#141416]">
                          {countryProfile.name} Sovereign Briefing
                        </h2>
                        <p className="font-mono text-xs text-[#57585C]">
                          {countryProfile.centralBank}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] font-bold px-2 py-1 rounded bg-[#059669]/15 text-[#059669] uppercase">
                      Selected Home Country
                    </span>
                  </div>

                  {/* Key Indicators Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
                    <div className="p-3 rounded-xl bg-white/70 border border-black/5">
                      <div className="font-mono text-[10px] text-[#828387] uppercase">Real GDP Growth</div>
                      <div className="font-heading text-base font-bold text-[#059669] mt-0.5">
                        +{countryProfile.keyIndicators.realGdpGrowthPercent}%
                      </div>
                      <div className="font-mono text-[9px] text-[#828387] mt-1">Year-on-Year</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/70 border border-black/5">
                      <div className="font-mono text-[10px] text-[#828387] uppercase">Headline Inflation</div>
                      <div className="font-heading text-base font-bold text-[#141416] mt-0.5">
                        {countryProfile.keyIndicators.inflationRatePercent}%
                      </div>
                      <div className="font-mono text-[9px] text-[#828387] mt-1">CPI Latest</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/70 border border-black/5">
                      <div className="font-mono text-[10px] text-[#828387] uppercase">Policy Rate</div>
                      <div className="font-heading text-base font-bold text-[#141416] mt-0.5">
                        {countryProfile.keyIndicators.centralBankPolicyRatePercent}%
                      </div>
                      <div className="font-mono text-[9px] text-[#828387] mt-1">Target Rate</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/70 border border-black/5">
                      <div className="font-mono text-[10px] text-[#828387] uppercase">Debt / GDP</div>
                      <div className="font-heading text-base font-bold text-[#D94E34] mt-0.5">
                        {countryProfile.keyIndicators.debtToGdpPercent}%
                      </div>
                      <div className="font-mono text-[9px] text-[#828387] mt-1">General Govt</div>
                    </div>
                  </div>

                  <p className="font-sans text-xs text-[#57585C] leading-relaxed p-3 rounded-xl bg-white/50 border border-black/5">
                    <strong className="text-[#141416]">Macro Outlook:</strong> {countryProfile.macroOutlookSummary}
                  </p>

                  {/* Domestic News Stream */}
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-[#828387]">
                        Prioritized Domestic Economic Releases ({domesticStories.length})
                      </h3>
                      <Link
                        href={`/intelligence?tab=economy&country=${selectedCountry}`}
                        className="font-mono text-[11px] text-[#059669] hover:underline"
                      >
                        View all country stories →
                      </Link>
                    </div>

                    <div className="divide-y divide-[rgba(20,21,23,0.08)] bg-white/60 rounded-xl border border-black/5 p-1">
                      {domesticStories.slice(0, 3).map((story) => (
                        <div key={story.id} className="p-3 hover:bg-white/90 rounded-lg transition-colors">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-mono text-[10px] text-[#828387]">
                              {story.publisher} • {new Date(story.publishedAt).toLocaleDateString()}
                            </span>
                            {getSeverityBadge(story.severity)}
                          </div>
                          <h4 className="font-heading text-xs sm:text-sm font-bold text-[#141416] leading-snug">
                            {story.headline}
                          </h4>
                          <p className="font-sans text-xs text-[#57585C] mt-1 line-clamp-2">
                            {story.summary}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              {story.indicators?.map((ind) => (
                                <span
                                  key={ind}
                                  className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-black/5 text-[#57585C]"
                                >
                                  {ind}
                                </span>
                              ))}
                            </div>
                            <a
                              href={story.canonicalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-[10px] text-[#57585C] hover:text-[#141416] flex items-center gap-1"
                            >
                              <span>Official Bulletin</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* International Spillovers Impacting Selected Country */}
                {spilloverStories.length > 0 && (
                  <div className="rounded-2xl border border-[rgba(20,21,23,0.12)] bg-[#E6E5DF] p-5 shadow-xs">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="h-4 w-4 text-[#E5A83B]" />
                      <h3 className="font-heading text-sm font-bold text-[#141416]">
                        Cross-Border Economic Spillovers Affecting {countryProfile.name}
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {spilloverStories.map((story) => (
                        <div
                          key={story.id}
                          className="p-3.5 rounded-xl bg-white/70 border border-black/5 hover:bg-white transition-all"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-mono text-[10px] uppercase font-bold text-[#E5A83B]">
                              Origin: {getCountryByIso(story.primaryCountry).name} → Impact: {countryProfile.name}
                            </span>
                            <span className="font-mono text-[10px] text-[#828387]">
                              {new Date(story.publishedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h4 className="font-heading text-xs font-bold text-[#141416] leading-snug">
                            {story.headline}
                          </h4>
                          <p className="font-sans text-xs text-[#57585C] mt-1.5 leading-relaxed">
                            <strong className="text-[#141416]">Spillover Mechanism:</strong>{" "}
                            {story.spilloverDetails || story.summary}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Global Market Intelligence & Moving Sectors */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-2xl border border-[rgba(20,21,23,0.12)] bg-[#E6E5DF] p-5 sm:p-6 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-[rgba(20,21,23,0.1)]">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-[#141416]" />
                      <h3 className="font-heading text-sm font-bold text-[#141416]">
                        Major Global Indices & Liquidity
                      </h3>
                    </div>
                    <button
                      onClick={() => switchTab("markets")}
                      className="font-mono text-[11px] text-[#059669] hover:underline"
                    >
                      All 8 Regions →
                    </button>
                  </div>

                  {/* Indices Cards */}
                  <div className="divide-y divide-[rgba(20,21,23,0.08)] py-1">
                    {marketIndices.slice(0, 7).map((idx) => {
                      const isPositive = idx.changePercent >= 0;
                      return (
                        <div key={idx.symbol} className="py-2.5 flex items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-heading text-xs font-bold text-[#141416]">
                                {idx.name}
                              </span>
                              <span className="font-mono text-[10px] text-[#828387]">
                                ({idx.country})
                              </span>
                            </div>
                            <div className="font-mono text-[10px] text-[#57585C] truncate max-w-[190px]">
                              {idx.exchange}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="font-mono text-xs font-bold text-[#141416]">
                              {idx.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </div>
                            <div
                              className={`font-mono text-[11px] font-bold flex items-center justify-end ${
                                isPositive ? "text-[#059669]" : "text-[#D94E34]"
                              }`}
                            >
                              {isPositive ? "+" : ""}
                              {idx.changePercent}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3 pt-3 border-t border-[rgba(20,21,23,0.08)] flex items-center justify-between text-[10px] font-mono text-[#828387]">
                    <span>Delayed quotes for research SLA</span>
                    <button
                      onClick={() => switchTab("markets")}
                      className="text-[#141416] hover:underline font-semibold"
                    >
                      Explore Full Regional Matrix
                    </button>
                  </div>
                </div>

                {/* India Prominent Feature in Global Overview */}
                <div className="rounded-2xl border border-[rgba(20,21,23,0.12)] bg-[#141416] text-[#ECEBE5] p-5 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇮🇳</span>
                      <h3 className="font-heading text-sm font-bold text-[#ECEBE5]">
                        ArthaLens India Macro Desk
                      </h3>
                    </div>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#059669] text-white">
                      Core Observatory
                    </span>
                  </div>

                  <p className="font-sans text-xs text-[#A1A2A6] leading-relaxed mb-4">
                    Connect national accounts from MoSPI and liquidity aggregates from RBI directly to ArthaLens
                    mathematical Double Deflation matrices and sovereign debt analytics.
                  </p>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <Link
                      href="/gdp"
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-xs font-mono flex items-center justify-between"
                    >
                      <span>Macro Workspace</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                    <Link
                      href="/deflator"
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-xs font-mono flex items-center justify-between"
                    >
                      <span>Deflator Simulator</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>

                  <button
                    onClick={() => switchTab("india")}
                    className="w-full py-2 rounded-xl bg-[#ECEBE5] text-[#141416] font-sans text-xs font-bold hover:bg-white transition-all text-center cursor-pointer"
                  >
                    Open Dedicated India Intelligence Desk →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GLOBAL STOCK MARKETS (8 GEOGRAPHIC REGIONS) */}
        {activeTab === "markets" && (
          <div className="space-y-6">
            {/* Filter by Region Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[rgba(20,21,23,0.1)]">
              <span className="font-mono text-xs font-bold text-[#828387] pr-2 uppercase">Region:</span>
              {REGIONS.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setSelectedRegion(r.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    selectedRegion === r.key
                      ? "bg-[#141416] text-[#ECEBE5] font-bold shadow-xs"
                      : "bg-white/60 text-[#57585C] hover:bg-white hover:text-[#141416]"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Markets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketIndices
                .filter((idx) => selectedRegion === "global" || idx.region === selectedRegion)
                .map((idx) => {
                  const isPositive = idx.changePercent >= 0;
                  return (
                    <div
                      key={idx.symbol}
                      className="rounded-2xl border border-[rgba(20,21,23,0.12)] bg-[#E6E5DF] p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-heading text-base font-bold text-[#141416]">
                                {idx.name}
                              </span>
                              <span className="font-mono text-[10px] text-[#828387] px-1.5 py-0.5 rounded bg-black/5">
                                {idx.symbol}
                              </span>
                            </div>
                            <p className="font-mono text-xs text-[#57585C] mt-0.5">
                              {idx.exchange} ({idx.countryName})
                            </p>
                          </div>
                          {getStatusBadge(idx.status)}
                        </div>

                        {/* Price and Percentage */}
                        <div className="my-3 p-3 rounded-xl bg-white/70 border border-black/5 flex items-baseline justify-between">
                          <div>
                            <span className="font-mono text-[10px] text-[#828387] uppercase block">Current Quote</span>
                            <span className="font-mono text-xl font-bold text-[#141416]">
                              {idx.currency} {idx.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </span>
                          </div>

                          <div
                            className={`flex items-center font-mono text-sm font-bold ${
                              isPositive ? "text-[#059669]" : "text-[#D94E34]"
                            }`}
                          >
                            {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                            <span>{isPositive ? "+" : ""}{idx.changePercent}%</span>
                          </div>
                        </div>

                        {/* Moving Catalyst Headline */}
                        {idx.topMovingHeadline && (
                          <div className="mt-3 p-2.5 rounded-lg bg-black/5">
                            <span className="font-mono text-[9px] uppercase font-bold text-[#828387] block mb-0.5">
                              Market Catalyst
                            </span>
                            <p className="font-sans text-xs text-[#141416] leading-snug">
                              {idx.topMovingHeadline}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Footer Metadata */}
                      <div className="mt-4 pt-3 border-t border-[rgba(20,21,23,0.08)] flex items-center justify-between text-[10px] font-mono text-[#828387]">
                        <span>{idx.timezone.split(" ")[0]}</span>
                        <span>{idx.attribution.delayMinutes}m Delayed • {idx.attribution.source.split(" ")[0]}</span>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Provider and Disclaimer Box */}
            <div className="p-4 rounded-xl bg-white/50 border border-black/10 text-xs font-mono text-[#57585C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-[#828387] shrink-0" />
                <span>
                  All index quotes and closing metrics are delayed per exchange licensing and clearinghouse terms.
                  ArthaLens does not provide real-time brokerage quotes.
                </span>
              </div>
              <span className="font-bold text-[#141416] shrink-0">8 Regional Geographies Covered</span>
            </div>
          </div>
        )}

        {/* TAB 3: GLOBAL ECONOMIC INTELLIGENCE */}
        {activeTab === "economy" && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="rounded-2xl border border-[rgba(20,21,23,0.12)] bg-[#E6E5DF] p-4 shadow-2xs space-y-3">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#828387]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search economic developments, central banks, indicators (e.g. CPI, Repo, GDP)..."
                    className="w-full pl-9 pr-4 py-2 text-xs font-sans rounded-xl border border-[rgba(20,21,23,0.15)] bg-white/80 focus:outline-none focus:border-[#141416]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#828387] hover:text-[#141416]"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Category and Region Controls */}
                <div className="flex items-center gap-2 overflow-x-auto">
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value as GeographicRegion)}
                    className="text-xs font-sans rounded-xl border border-[rgba(20,21,23,0.15)] bg-white/80 py-2 px-3 focus:outline-none cursor-pointer"
                  >
                    {REGIONS.map((r) => (
                      <option key={r.key} value={r.key}>
                        {r.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as "all" | StoryType)}
                    className="text-xs font-sans rounded-xl border border-[rgba(20,21,23,0.15)] bg-white/80 py-2 px-3 focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Stories</option>
                    <option value="macro">Macroeconomic Only</option>
                    <option value="market">Market Structure Only</option>
                  </select>
                </div>
              </div>

              {/* Topic Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
                {TOPICS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setSelectedTopic(t.key)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                      selectedTopic === t.key
                        ? "bg-[#141416] text-[#ECEBE5] font-bold"
                        : "bg-white/60 text-[#57585C] hover:bg-white hover:text-[#141416]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stories Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-[#828387]">
                <span>SHOWING {filteredStories.length} VERIFIED INTELLIGENCE RELEASES</span>
                <span>AUTHENTIC OFFICIAL GAZETTES</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredStories.map((story) => (
                  <div
                    key={story.id}
                    className="rounded-2xl border border-[rgba(20,21,23,0.12)] bg-[#E6E5DF] p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Source & Severity Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-[#141416]">
                            {getCountryByIso(story.primaryCountry).flag} {story.publisher}
                          </span>
                          <span className="font-mono text-[10px] text-[#828387]">
                            • {new Date(story.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                        {getSeverityBadge(story.severity)}
                      </div>

                      {/* Headline */}
                      <h3 className="font-heading text-sm sm:text-base font-bold text-[#141416] leading-snug mb-2">
                        {story.headline}
                      </h3>

                      {/* Summary */}
                      <p className="font-sans text-xs text-[#57585C] leading-relaxed mb-3">
                        {story.summary}
                      </p>

                      {/* Spillover Callout */}
                      {story.isSpillover && (
                        <div className="p-2.5 mb-3 rounded-xl bg-[#E5A83B]/10 border border-[#E5A83B]/20 text-[11px] font-sans text-[#141416]">
                          <strong className="text-[#E5A83B] font-mono uppercase text-[10px] block mb-0.5">
                            Cross-Border Spillover:
                          </strong>
                          {story.spilloverDetails || "Affects external import prices and sovereign borrowing costs."}
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-3">
                        {story.indicators?.map((ind) => (
                          <span
                            key={ind}
                            className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-white/70 text-[#141416] border border-black/5"
                          >
                            {ind}
                          </span>
                        ))}
                        {story.topics.map((top) => (
                          <span
                            key={top}
                            className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-black/5 text-[#57585C]"
                          >
                            #{top.replace("_", " ")}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Actions & ArthaLens Integration Links */}
                    <div className="pt-3 border-t border-[rgba(20,21,23,0.08)] flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {story.relatedArthaLensRoutes?.map((route) => (
                          <Link
                            key={route.href}
                            href={route.href}
                            className="font-mono text-[11px] font-bold text-[#059669] hover:underline flex items-center gap-1"
                          >
                            <span>{route.label}</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        ))}
                      </div>

                      <a
                        href={story.canonicalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[11px] text-[#57585C] hover:text-[#141416] flex items-center gap-1"
                      >
                        <span>Official Publication</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INDIA ECONOMIC INTELLIGENCE DESK */}
        {activeTab === "india" && (
          <div className="space-y-6">
            {/* India Hero Card */}
            <div className="rounded-2xl border border-[rgba(20,21,23,0.12)] bg-[#141416] text-[#ECEBE5] p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🇮🇳</span>
                    <span className="font-mono text-xs font-bold text-[#D94E34] uppercase tracking-wider">
                      REPUBLIC OF INDIA SOVEREIGN ECONOMIC DESK
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white">
                    India Macroeconomic Observability & National Accounts
                  </h2>
                  <p className="font-sans text-xs sm:text-sm text-[#A1A2A6] max-w-2xl leading-relaxed">
                    Direct integration between official MoSPI national accounts, RBI DBIE liquidity telemetry,
                    Union fiscal budgets, and ArthaLens econometric double deflation pipelines.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href="/gdp"
                    className="btn-realistic btn-solid-white text-xs px-4 py-2 font-sans font-semibold flex items-center gap-1 text-[#141416] bg-white rounded-xl shadow-xs"
                  >
                    <span>Launch GDP Explorer</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* India Sovereign Vital Signs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white/10 border border-white/10">
                  <div className="font-mono text-[10px] text-[#A1A2A6] uppercase">RBI Repo Rate</div>
                  <div className="font-heading text-xl font-bold text-white mt-1">6.50%</div>
                  <div className="font-mono text-[10px] text-[#059669] mt-1">Stance: Neutral (Oct 2024)</div>
                </div>
                <div className="p-4 rounded-xl bg-white/10 border border-white/10">
                  <div className="font-mono text-[10px] text-[#A1A2A6] uppercase">Real GDP (Base 2011-12)</div>
                  <div className="font-heading text-xl font-bold text-white mt-1">₹173.8 Lakh Cr</div>
                  <div className="font-mono text-[10px] text-[#059669] mt-1">+7.2% FY24 Growth</div>
                </div>
                <div className="p-4 rounded-xl bg-white/10 border border-white/10">
                  <div className="font-mono text-[10px] text-[#A1A2A6] uppercase">Union Capex Outlay</div>
                  <div className="font-heading text-xl font-bold text-white mt-1">₹11.11 Lakh Cr</div>
                  <div className="font-mono text-[10px] text-[#E5A83B] mt-1">3.4% of GDP Target</div>
                </div>
                <div className="p-4 rounded-xl bg-white/10 border border-white/10">
                  <div className="font-mono text-[10px] text-[#A1A2A6] uppercase">Fiscal Deficit Glidepath</div>
                  <div className="font-heading text-xl font-bold text-white mt-1">4.9% of GDP</div>
                  <div className="font-mono text-[10px] text-[#A1A2A6] mt-1">BE FY25 Target</div>
                </div>
              </div>
            </div>

            {/* Official Institutional Feeds Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* RBI Monetary Policy & Liquidity */}
              <div className="rounded-2xl border border-[rgba(20,21,23,0.12)] bg-[#E6E5DF] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[rgba(20,21,23,0.1)]">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#141416]" />
                    <h3 className="font-heading text-sm font-bold text-[#141416]">
                      Reserve Bank of India Monetary Policy
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[#059669] bg-[#059669]/10 px-2 py-0.5 rounded">
                    Official MPC
                  </span>
                </div>

                <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                  The MPC policy repo rate remains calibrated at 6.50% with an amended neutral stance. The Standing
                  Deposit Facility (SDF) rate stands at 6.25% and the Marginal Standing Facility (MSF) rate at 6.75%.
                </p>

                <div className="p-3 rounded-xl bg-white/70 border border-black/5 text-xs font-sans space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#57585C]">Headline CPI Outlook:</span>
                    <span className="font-mono font-bold text-[#141416]">4.5% FY25</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#57585C]">Real GDP Growth Forecast:</span>
                    <span className="font-mono font-bold text-[#059669]">7.2% FY25</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#57585C]">Forex Reserves:</span>
                    <span className="font-mono font-bold text-[#141416]">$690+ Billion</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-mono">
                  <Link href="/deflator" className="text-[#059669] hover:underline flex items-center gap-1">
                    <span>Simulate CPI vs WPI Deflator</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                  <a
                    href="https://rbi.org.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#828387] hover:text-[#141416] flex items-center gap-1"
                  >
                    <span>rbi.org.in</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* MoSPI National Accounts & Sub-National GVA */}
              <div className="rounded-2xl border border-[rgba(20,21,23,0.12)] bg-[#E6E5DF] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[rgba(20,21,23,0.1)]">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[#141416]" />
                    <h3 className="font-heading text-sm font-bold text-[#141416]">
                      MoSPI National Accounts & State GVA
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[#141416] bg-black/5 px-2 py-0.5 rounded">
                    NSO Base 2011-12
                  </span>
                </div>

                <p className="font-sans text-xs text-[#57585C] leading-relaxed">
                  Quarterly National Accounts estimates released by the National Statistical Office (NSO) show
                  manufacturing and construction maintaining robust value added, with gross fixed capital formation
                  expanding over 7.5%.
                </p>

                <div className="p-3 rounded-xl bg-white/70 border border-black/5 text-xs font-sans space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#57585C]">Construction Sector GVA:</span>
                    <span className="font-mono font-bold text-[#059669]">+10.5% YoY</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#57585C]">Manufacturing Sector GVA:</span>
                    <span className="font-mono font-bold text-[#141416]">+7.0% YoY</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#57585C]">Base Year Methodology:</span>
                    <span className="font-mono font-bold text-[#57585C]">UN SNA 2008 Double Deflation</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-mono">
                  <Link href="/gdp?view=composition" className="text-[#059669] hover:underline flex items-center gap-1">
                    <span>Inspect 28 States Output</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                  <a
                    href="https://mospi.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#828387] hover:text-[#141416] flex items-center gap-1"
                  >
                    <span>mospi.gov.in</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Direct Tooling Launchpads Strip */}
            <div className="rounded-2xl border border-[rgba(20,21,23,0.12)] bg-[#E6E5DF] p-6 shadow-xs">
              <h3 className="font-heading text-sm font-bold text-[#141416] mb-3">
                Connect India Intelligence to ArthaLens Analytical Engines
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Link
                  href="/gdp"
                  className="p-3.5 rounded-xl bg-white/70 border border-black/5 hover:bg-white hover:border-black/20 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="font-mono text-[10px] text-[#059669] font-bold uppercase">FLAGSHIP</span>
                    <h4 className="font-heading text-xs font-bold text-[#141416] mt-1">Macro Workspace</h4>
                    <p className="font-sans text-[11px] text-[#57585C] mt-1">8 industry sectors & 28 state accounts</p>
                  </div>
                  <span className="font-mono text-[11px] text-[#141416] font-semibold mt-3 flex items-center gap-1">
                    Open Workspace →
                  </span>
                </Link>

                <Link
                  href="/deflator"
                  className="p-3.5 rounded-xl bg-white/70 border border-black/5 hover:bg-white hover:border-black/20 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="font-mono text-[10px] text-[#E5A83B] font-bold uppercase">SIMULATOR</span>
                    <h4 className="font-heading text-xs font-bold text-[#141416] mt-1">Deflator Modeling</h4>
                    <p className="font-sans text-[11px] text-[#57585C] mt-1">Double deflation commodity shocks</p>
                  </div>
                  <span className="font-mono text-[11px] text-[#141416] font-semibold mt-3 flex items-center gap-1">
                    Launch Simulator →
                  </span>
                </Link>

                <Link
                  href="/ratings"
                  className="p-3.5 rounded-xl bg-white/70 border border-black/5 hover:bg-white hover:border-black/20 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="font-mono text-[10px] text-[#141416] font-bold uppercase">CREDIT</span>
                    <h4 className="font-heading text-xs font-bold text-[#141416] mt-1">Sovereign Ratings</h4>
                    <p className="font-sans text-[11px] text-[#57585C] mt-1">Moody's, S&P, and Fitch trajectories</p>
                  </div>
                  <span className="font-mono text-[11px] text-[#141416] font-semibold mt-3 flex items-center gap-1">
                    View Ratings →
                  </span>
                </Link>

                <Link
                  href="/sources"
                  className="p-3.5 rounded-xl bg-white/70 border border-black/5 hover:bg-white hover:border-black/20 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="font-mono text-[10px] text-[#828387] font-bold uppercase">VERIFICATION</span>
                    <h4 className="font-heading text-xs font-bold text-[#141416] mt-1">Gazette Registry</h4>
                    <p className="font-sans text-[11px] text-[#57585C] mt-1">SHA-256 cryptographic provenance</p>
                  </div>
                  <span className="font-mono text-[11px] text-[#141416] font-semibold mt-3 flex items-center gap-1">
                    Verify Hashes →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ALERTS & PERSONALIZATION */}
        {activeTab === "preferences" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="rounded-2xl border border-[rgba(20,21,23,0.12)] bg-[#E6E5DF] p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-normal text-[#141416]">
                  Notification Preferences & Personalization
                </h2>
                <p className="font-sans text-xs sm:text-sm text-[#57585C] mt-1 leading-relaxed">
                  Configure your sovereign intelligence priorities. Global stock-market alerts are available worldwide;
                  macroeconomic alerts prioritize your selected home country with verified cross-border spillovers.
                </p>
              </div>

              {/* Home Country Selector */}
              <div className="p-4 rounded-xl bg-white/70 border border-black/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-sm font-bold text-[#141416]">Selected Home Country</h3>
                    <p className="font-sans text-xs text-[#57585C]">
                      Determines default macroeconomic focus, inflation releases, and central bank alerts.
                    </p>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#059669]">{selectedCountry}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                  {SUPPORTED_COUNTRIES.map((c) => (
                    <button
                      key={c.isoCode}
                      onClick={() => handleCountryChange(c.isoCode)}
                      className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2 ${
                        selectedCountry === c.isoCode
                          ? "bg-[#141416] text-[#ECEBE5] border-[#141416] shadow-xs"
                          : "bg-white/80 border-black/10 text-[#141416] hover:bg-black/5"
                      }`}
                    >
                      <span className="text-xl">{c.flag}</span>
                      <div>
                        <div className="font-heading text-xs font-bold leading-tight">{c.name}</div>
                        <div className="font-mono text-[10px] opacity-70">{c.isoCode} • {c.currency}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Alert Category Subscriptions */}
              <div className="p-4 rounded-xl bg-white/70 border border-black/5 space-y-4">
                <h3 className="font-heading text-sm font-bold text-[#141416]">Intelligence Stream Subscriptions</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-heading text-xs font-bold text-[#141416]">
                        Global Stock-Market Intelligence
                      </div>
                      <div className="font-sans text-[11px] text-[#57585C]">
                        Significant index movements, exchange notices, and liquidity shifts across all 8 regions.
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#059669]">Worldwide Active</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-black/5">
                    <div>
                      <div className="font-heading text-xs font-bold text-[#141416]">
                        Home-Country Economic Releases
                      </div>
                      <div className="font-sans text-[11px] text-[#57585C]">
                        Prioritized central bank interest rate moves, CPI inflation bulletins, and GDP releases for {countryProfile.name}.
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#059669]">Prioritized</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-black/5">
                    <div>
                      <div className="font-heading text-xs font-bold text-[#141416]">
                        International Economic Spillovers
                      </div>
                      <div className="font-sans text-[11px] text-[#57585C]">
                        Foreign events with credible, material implications for {countryProfile.name} (e.g. Fed rates or oil supply shocks).
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#059669]">Active</span>
                  </div>
                </div>
              </div>

              {/* Notification Channel & Seed Trigger */}
              <div className="p-4 rounded-xl bg-white/70 border border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-heading text-sm font-bold text-[#141416]">In-App Notification Center</h3>
                  <p className="font-sans text-xs text-[#57585C]">
                    Integrated in the top navigation bar. Scoped securely to your session.
                  </p>
                </div>

                <button
                  onClick={async () => {
                    await fetch("/api/notifications", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ homeCountry: selectedCountry }),
                    });
                    loadData();
                    alert(`Notification stream refreshed and synchronized with ${countryProfile.name} releases.`);
                  }}
                  className="btn-realistic btn-solid-black text-xs px-4 py-2 font-sans font-semibold cursor-pointer shadow-xs shrink-0"
                >
                  Sync & Reset Notification Feed
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function IntelligencePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#ECEBE5] flex items-center justify-center p-8">
          <div className="font-mono text-xs text-[#57585C] flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#059669] animate-pulse" />
            <span>Synchronizing Global Financial Intelligence Feed...</span>
          </div>
        </div>
      }
    >
      <IntelligenceContent />
    </Suspense>
  );
}
