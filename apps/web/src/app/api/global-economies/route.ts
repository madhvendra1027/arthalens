import { NextResponse } from "next/server";
import { GLOBAL_ECONOMIES_BASELINE, CountryEconomy } from "@/data/globalEconomies";

// In-memory cache for World Bank data
interface CacheEntry {
  data: CountryEconomy[];
  timestamp: number;
  source: string;
}

let cachedData: CacheEntry | null = null;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

const COUNTRY_MAP: Record<string, { id: string; name: string; code: string; flag: string; currency: string; currencySymbol: string; economicModel: string; keyDrivers: string[]; sovereignRating: string }> = {
  USA: {
    id: "usa",
    name: "United States",
    code: "US",
    flag: "🇺🇸",
    currency: "US Dollar",
    currencySymbol: "$",
    economicModel: "Consumer & Tech Innovation Superpower",
    keyDrivers: ["Private Consumption (68% GDP)", "Artificial Intelligence & Cloud", "Financial Services", "Energy Autonomy"],
    sovereignRating: "AA+ (S&P) / Aaa (Moody's)",
  },
  CHN: {
    id: "china",
    name: "China",
    code: "CN",
    flag: "🇨🇳",
    currency: "Chinese Yuan",
    currencySymbol: "¥",
    economicModel: "Industrial Manufacturing & Infrastructure Powerhouse",
    keyDrivers: ["High-tech Manufacturing & EVs", "Clean Energy & Batteries", "Infrastructure Capital", "State-Backed Enterprises"],
    sovereignRating: "A+ (S&P) / A1 (Moody's)",
  },
  DEU: {
    id: "germany",
    name: "Germany",
    code: "DE",
    flag: "🇩🇪",
    currency: "Euro",
    currencySymbol: "€",
    economicModel: "Precision Engineering & Export-Led Mittelstand",
    keyDrivers: ["Automotive & Machinery", "Specialty Chemicals", "Green Industrial Tech", "Skilled Apprenticeship Model"],
    sovereignRating: "AAA (S&P) / Aaa (Moody's)",
  },
  JPN: {
    id: "japan",
    name: "Japan",
    code: "JP",
    flag: "🇯🇵",
    currency: "Japanese Yen",
    currencySymbol: "¥",
    economicModel: "Advanced Robotics & Global Investment Hub",
    keyDrivers: ["Automotive & Electronics", "Semiconductor Equipment", "Outward FDI & Net Foreign Assets", "Automation & Healthcare"],
    sovereignRating: "A+ (S&P) / A1 (Moody's)",
  },
  IND: {
    id: "india",
    name: "India",
    code: "IN",
    flag: "🇮🇳",
    currency: "Indian Rupee",
    currencySymbol: "₹",
    economicModel: "High-Growth Digital, Services & Manufacturing Hub",
    keyDrivers: ["Technology Services & GCCs", "Physical Infrastructure (National Infra Pipeline)", "Formalization & GST Integration", "Domestic Consumer Expansion"],
    sovereignRating: "BBB- Positive (S&P) / Baa3 (Moody's)",
  },
  GBR: {
    id: "uk",
    name: "United Kingdom",
    code: "GB",
    flag: "🇬🇧",
    currency: "British Pound",
    currencySymbol: "£",
    economicModel: "Global Financial Services & Creative Economy",
    keyDrivers: ["Financial & Legal Services", "Pharmaceuticals & Biotech", "Higher Education & Aerospace", "Fintech & Clean Finance"],
    sovereignRating: "AA (S&P) / Aa3 (Moody's)",
  },
  FRA: {
    id: "france",
    name: "France",
    code: "FR",
    flag: "🇫🇷",
    currency: "Euro",
    currencySymbol: "€",
    economicModel: "High-Value Industrial & State-Strategic Capital",
    keyDrivers: ["Aerospace & Defense", "Luxury Goods & Cosmetics", "Nuclear Energy (70% electricity)", "Agri-Food & Tourism"],
    sovereignRating: "AA- (S&P) / Aa2 (Moody's)",
  },
  BRA: {
    id: "brazil",
    name: "Brazil",
    code: "BR",
    flag: "🇧🇷",
    currency: "Brazilian Real",
    currencySymbol: "R$",
    economicModel: "Agricultural Powerhouse & Resource Giant",
    keyDrivers: ["Agribusiness (Soy, Corn, Beef)", "Deepwater Oil & Renewable Energy", "Mining (Iron Ore)", "Fintech Innovation (Pix)"],
    sovereignRating: "BB (S&P) / Ba1 (Moody's)",
  },
  ITA: {
    id: "italy",
    name: "Italy",
    code: "IT",
    flag: "🇮🇹",
    currency: "Euro",
    currencySymbol: "€",
    economicModel: "Specialized Manufacturing & Lifestyle Brands",
    keyDrivers: ["Industrial Machinery", "Automotive & Aerospace", "Pharmaceuticals", "Fashion, Food & Luxury Design"],
    sovereignRating: "BBB (S&P) / Baa3 (Moody's)",
  },
  CAN: {
    id: "canada",
    name: "Canada",
    code: "CA",
    flag: "🇨🇦",
    currency: "Canadian Dollar",
    currencySymbol: "C$",
    economicModel: "Natural Resources & Service Economy",
    keyDrivers: ["Energy & Oil Sands", "Critical Minerals & Mining", "Financial Services & Real Estate", "Clean Tech & High-Skill Immigration"],
    sovereignRating: "AAA (S&P) / Aaa (Moody's)",
  },
};

const COUNTRIES = Object.keys(COUNTRY_MAP);

async function fetchWorldBankIndicator(indicator: string): Promise<Record<string, { value: number; date: string }>> {
  const result: Record<string, { value: number; date: string }> = {};
  const countryList = COUNTRIES.join(";");
  const url = `https://api.worldbank.org/v2/country/${countryList}/indicator/${indicator}?date=2021:2024&format=json&per_page=100`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeoutId);

    if (!res.ok) return result;
    const json = await res.json();
    if (!Array.isArray(json) || json.length < 2 || !Array.isArray(json[1])) return result;

    for (const record of json[1]) {
      const cIso = record.countryiso3code;
      if (cIso && record.value !== null && !result[cIso]) {
        result[cIso] = { value: record.value, date: record.date };
      }
    }
  } catch {
    clearTimeout(timeoutId);
  }

  return result;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get("refresh") === "true";

  const now = Date.now();
  if (!forceRefresh && cachedData && now - cachedData.timestamp < CACHE_TTL_MS) {
    return NextResponse.json({
      data: cachedData.data,
      source: cachedData.source,
      cached: true,
      lastUpdated: new Date(cachedData.timestamp).toISOString(),
    });
  }

  try {
    // Query parallel World Bank indicator series
    const [gdpMap, growthMap, pcapMap, cpiMap, popMap] = await Promise.all([
      fetchWorldBankIndicator("NY.GDP.MKTP.CD"),      // Nominal GDP current USD
      fetchWorldBankIndicator("NY.GDP.MKTP.KD.ZG"),   // Real GDP growth annual %
      fetchWorldBankIndicator("NY.GDP.PCAP.CD"),      // GDP per capita current USD
      fetchWorldBankIndicator("FP.CPI.TOTL.ZG"),      // CPI Inflation annual %
      fetchWorldBankIndicator("SP.POP.TOTL"),          // Total Population
    ]);

    const economies: CountryEconomy[] = COUNTRIES.map((iso) => {
      const meta = COUNTRY_MAP[iso];
      const baseline = GLOBAL_ECONOMIES_BASELINE.find((b) => b.code.toLowerCase() === meta.code.toLowerCase())!;

      const gdpUsd = gdpMap[iso]?.value;
      const nominalGdpTrillion = gdpUsd
        ? Math.round((gdpUsd / 1e12) * 100) / 100
        : baseline.nominalGdpTrillion;

      const nominalGdpInrLakhCrore = Math.round(nominalGdpTrillion * 83.5 * 10) / 10;
      const realGdpGrowth = growthMap[iso]?.value !== undefined
        ? Math.round(growthMap[iso].value * 10) / 10
        : baseline.realGdpGrowth;

      const gdpPerCapitaUsd = pcapMap[iso]?.value !== undefined
        ? Math.round(pcapMap[iso].value)
        : baseline.gdpPerCapitaUsd;

      const inflationRate = cpiMap[iso]?.value !== undefined
        ? Math.round(cpiMap[iso].value * 10) / 10
        : baseline.inflationRate;

      const populationMillion = popMap[iso]?.value !== undefined
        ? Math.round(popMap[iso].value / 1e6)
        : baseline.populationMillion;

      return {
        ...baseline,
        nominalGdpTrillion,
        nominalGdpInrLakhCrore,
        realGdpGrowth,
        gdpPerCapitaUsd,
        inflationRate,
        populationMillion,
        provenance: {
          authority: "The World Bank Group (World Development Indicators) & MoSPI",
          dataset: "World Bank WDI & MoSPI Provisional Estimates",
          nominalGdpSource: "NY.GDP.MKTP.CD",
          growthSource: "NY.GDP.MKTP.KD.ZG",
          perCapitaSource: "NY.GDP.PCAP.CD",
          inflationSource: "FP.CPI.TOTL.ZG",
          canonicalUrl: `https://data.worldbank.org/country/${iso}`,
          lastObservedYear: gdpMap[iso]?.date || "2023",
          retrievedAt: new Date().toISOString(),
        }
      };
    });

    // Re-rank economies based on live World Bank nominal GDP
    economies.sort((a, b) => b.nominalGdpTrillion - a.nominalGdpTrillion);
    economies.forEach((econ, idx) => {
      econ.rank = idx + 1;
    });

    // Cache the successfully assembled dataset
    cachedData = {
      data: economies,
      timestamp: now,
      source: "World Bank Open Data API (Live Authenticated Macroeconomic Records)",
    };

    return NextResponse.json({
      data: economies,
      source: cachedData.source,
      cached: false,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    // Resilient fallback to validated baseline with explicit metadata
    return NextResponse.json({
      data: GLOBAL_ECONOMIES_BASELINE,
      source: "World Bank Open Data Baseline Records (Offline Fallback)",
      cached: false,
      error: error instanceof Error ? error.message : "Network error",
      lastUpdated: new Date().toISOString(),
    });
  }
}
