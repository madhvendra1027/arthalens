/**
 * ArthaLens Global Market Intelligence & Macroeconomic Telemetry
 * Core Type Definitions
 */

export type StoryType = "market" | "macro";

export type SeverityLevel = "critical" | "high" | "standard" | "info";

export type MarketStatus = "open" | "closed" | "delayed";

export type GeographicRegion =
  | "north_america"
  | "latin_america"
  | "europe"
  | "middle_east_africa"
  | "south_asia"
  | "east_asia"
  | "southeast_asia"
  | "oceania"
  | "global";

export type EconomicTopic =
  | "gdp_growth"
  | "inflation_cpi"
  | "central_banking_rates"
  | "fiscal_budgets"
  | "public_debt"
  | "trade_forex"
  | "labor_employment"
  | "commodities_energy"
  | "financial_stability"
  | "regulations_sebi";

export interface IntelligenceStory {
  id: string;
  provider: string; // e.g., "RBI Official", "MoSPI Gazette", "US Federal Reserve", "ECB", "IMF", "Reuters Macro", "Bloomberg Market"
  headline: string;
  summary: string;
  canonicalUrl: string;
  publisher: string;
  author?: string;
  publishedAt: string; // ISO 8601
  updatedAt?: string;
  language: string; // e.g. "en"
  storyType: StoryType;
  primaryCountry: string; // ISO 3166-1 alpha-2, e.g. "IN", "US", "DE", "JP", "GB"
  affectedCountries: string[]; // ISO-2 codes affected
  regions: GeographicRegion[];
  topics: EconomicTopic[];
  sectors?: string[];
  indicators?: string[]; // e.g. ["GDP", "Repo Rate", "CPI", "WPI", "Forex Reserves"]
  severity: SeverityLevel;
  severityReason?: string;
  isSpillover: boolean;
  spilloverDetails?: string;
  duplicateFingerprint: string;
  provenance: {
    sourceType: "official_gazette" | "central_bank" | "licensed_feed" | "authorized_rss";
    verified: boolean;
    licenseNotes: string;
  };
  relatedArthaLensRoutes?: {
    label: string;
    href: string;
  }[];
}

export interface MarketIndex {
  symbol: string;
  name: string;
  exchange: string;
  country: string; // ISO-2 code
  countryName: string;
  region: GeographicRegion;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  status: MarketStatus;
  lastUpdated: string;
  timezone: string;
  high52w?: number;
  low52w?: number;
  marketCapEst?: string;
  topMovingHeadline?: string;
  attribution: {
    source: string;
    delayMinutes: number;
    disclaimer: string;
  };
}

export interface CountryProfile {
  isoCode: string;
  name: string;
  flag: string;
  region: GeographicRegion;
  currency: string;
  currencySymbol: string;
  centralBank: string;
  keyIndicators: {
    gdpNominalUsd: string;
    realGdpGrowthPercent: number;
    inflationRatePercent: number;
    centralBankPolicyRatePercent: number;
    debtToGdpPercent: number;
    unemploymentRatePercent: number;
    currentAccountPercent: number;
  };
  macroOutlookSummary: string;
  lastUpdated: string;
}

export interface UserPreferences {
  userId: string;
  homeCountry: string; // ISO 3166-1 alpha-2, default "IN"
  preferredLanguage: string;
  enableGlobalMarkets: boolean;
  enableDomesticEconomy: boolean;
  enableSpillovers: boolean;
  selectedRegions: GeographicRegion[];
  selectedTopics: EconomicTopic[];
  severityThreshold: SeverityLevel | "all";
  quietHoursEnabled: boolean;
  quietHoursStart?: string; // "22:00"
  quietHoursEnd?: string; // "07:00"
  timezone: string; // e.g. "Asia/Kolkata", "America/New_York"
  notificationChannels: {
    inApp: boolean;
    browserPush: boolean;
    emailDigest: boolean;
  };
  updatedAt: string;
}

export interface InAppNotification {
  id: string;
  userId: string;
  storyId?: string;
  type: "global_market" | "home_economic" | "spillover" | "system";
  title: string;
  message: string;
  severity: SeverityLevel;
  read: boolean;
  createdAt: string;
  link?: string;
  categoryLabel: string;
}
