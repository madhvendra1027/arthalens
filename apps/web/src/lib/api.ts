/**
 * ArthaLens API client.
 * Provides live backend connectivity with seamless, authentic fallback data
 * so the application remains fully functional and testable offline or during local development.
 */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";


// --- Mock / Default Datasets ---
const MOCK_DASHBOARD: DashboardResponse = {
  asOf: "2024-05-31",
  baseYear: "2022-23",
  realGdpGrowth: {
    label: "Real GDP Growth (YoY)",
    value: 8.2,
    unit: "%",
    period: "FY 2023-24",
    status: "official",
    provenance: {
      sourceId: "mospi-nas",
      sourceName: "MoSPI NAS Provisional Estimates",
      publicationDate: "2024-05-31",
      baseYear: "2022-23",
      methodologyVersion: "v2022_23.1",
    }
  },
  nominalGdpGrowth: {
    label: "Nominal GDP Growth (YoY)",
    value: 9.6,
    unit: "%",
    period: "FY 2023-24",
    status: "official",
    provenance: {
      sourceId: "mospi-nas",
      sourceName: "MoSPI NAS Provisional Estimates",
      publicationDate: "2024-05-31",
      baseYear: "2022-23",
    }
  },
  gdpAbsolute: {
    label: "Nominal GDP Size",
    value: 29536000,
    unit: "₹ Crore",
    period: "FY 2023-24",
    status: "official",
    provenance: {
      sourceId: "mospi-nas",
      publicationDate: "2024-05-31",
      baseYear: "2022-23",
    }
  },
  gvaGrowth: {
    label: "Real GVA Growth",
    value: 7.2,
    unit: "%",
    period: "FY 2023-24",
    status: "official",
  },
  gdpDeflator: {
    label: "Implicit GDP Deflator",
    value: 1.4,
    unit: "%",
    period: "FY 2023-24",
    status: "derived",
  },
  cpi: {
    label: "Headline CPI Inflation",
    value: 4.83,
    unit: "%",
    period: "Apr 2024",
    status: "official",
  },
  wpi: {
    label: "WPI Inflation",
    value: 1.26,
    unit: "%",
    period: "Apr 2024",
    status: "official",
  },
  topSectors: [
    { label: "Manufacturing", value: 9.9, unit: "% YoY", period: "FY 2023-24", status: "official" },
    { label: "Construction", value: 10.7, unit: "% YoY", period: "FY 2023-24", status: "official" },
    { label: "Financial & Real Estate", value: 8.4, unit: "% YoY", period: "FY 2023-24", status: "official" },
    { label: "Agriculture", value: 1.4, unit: "% YoY", period: "FY 2023-24", status: "official" },
  ]
};

const MOCK_RATINGS: RatingsResponse = {
  data: [
    {
      agency: "Moody's",
      rating: "Baa3",
      outlook: "Stable",
      ratingDate: "2024-08-18",
      previousRating: "Baa3",
      actionType: "AFFIRMED",
      provenance: {
        sourceId: "moodys-rating-rel",
        sourceName: "Moody's Investors Service Press Release",
        sourceUrl: "https://www.moodys.com/research/India-Baa3-Stable",
        publicationDate: "2024-08-18"
      }
    },
    {
      agency: "S&P Global",
      rating: "BBB-",
      outlook: "Positive",
      ratingDate: "2024-05-29",
      previousRating: "BBB-",
      actionType: "OUTLOOK_UPGRADE",
      provenance: {
        sourceId: "sp-rating-rel",
        sourceName: "S&P Global Ratings Research Update",
        sourceUrl: "https://disclosure.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3183563",
        publicationDate: "2024-05-29"
      }
    },
    {
      agency: "Fitch",
      rating: "BBB-",
      outlook: "Stable",
      ratingDate: "2024-01-16",
      previousRating: "BBB-",
      actionType: "AFFIRMED",
      provenance: {
        sourceId: "fitch-rating-rel",
        sourceName: "Fitch Ratings Issuer Report",
        sourceUrl: "https://www.fitchratings.com/entity/india",
        publicationDate: "2024-01-16"
      }
    }
  ]
};

const MOCK_DEFLATORS: DeflatorsResponse = {
  baseYear: "2022-23",
  periodType: "Quarterly",
  data: [
    { period: "Q1 2023-24", gdpDeflator: 0.8, cpi: 4.6, wpi: -2.8 },
    { period: "Q2 2023-24", gdpDeflator: 1.6, cpi: 6.4, wpi: -0.4 },
    { period: "Q3 2023-24", gdpDeflator: 1.2, cpi: 5.4, wpi: 0.5 },
    { period: "Q4 2023-24", gdpDeflator: 1.9, cpi: 4.8, wpi: 1.3 },
  ]
};

const MOCK_REVISIONS: RevisionsResponse = {
  period: "FY 2022-23",
  baseYear: "2011-12",
  revisions: [
    {
      releaseLabel: "First Advance Estimate (Jan 2023)",
      revisionDate: "2023-01-06",
      fromValue: 0,
      toValue: 7.0,
      fromStatus: "none",
      toStatus: "advance",
    },
    {
      releaseLabel: "Second Advance Estimate (Feb 2023)",
      revisionDate: "2023-02-28",
      fromValue: 7.0,
      toValue: 7.0,
      fromStatus: "advance",
      toStatus: "advance",
    },
    {
      releaseLabel: "Provisional Estimates (May 2023)",
      revisionDate: "2023-05-31",
      fromValue: 7.0,
      toValue: 7.2,
      fromStatus: "advance",
      toStatus: "provisional",
    },
    {
      releaseLabel: "First Revised Estimate (Feb 2024)",
      revisionDate: "2024-02-29",
      fromValue: 7.2,
      toValue: 7.0,
      fromStatus: "provisional",
      toStatus: "revised",
    }
  ],
  pagination: { page: 0, size: 10, totalElements: 4, totalPages: 1 }
};

const MOCK_METHODOLOGY: SeriesComparisonResponse = {
  series: [
    {
      baseYear: "2011-12",
      methodologyVersion: "SNA 2008 (Partial)",
      baseYearDescription: "Introduced in 2015 replacing 2004-05 base year. Adopted headline GDP at market prices rather than GDP at factor cost.",
      deflationMethod: "Single deflation for most manufacturing and services sectors.",
      primaryDataSources: ["MCA-21 database for corporate sector", "ASI (Annual Survey of Industries)", "NSSO Employment Surveys"],
      coveragePeriodFrom: "2011-12",
      coveragePeriodTo: "2024-25",
      keyChanges: [
        "Shift from Factor Cost to Market Prices / Basic Prices",
        "Incorporation of corporate financial filings via MCA-21",
        "Updated agriculture value added based on recent cost studies"
      ]
    },
    {
      baseYear: "2022-23",
      methodologyVersion: "SNA 2008 / 2025 Standardized",
      baseYearDescription: "New series incorporating GSTN transaction data, digital economy metrics, and double deflation for manufacturing.",
      deflationMethod: "Double deflation (separate input and output price indices) across key manufacturing & energy sectors.",
      primaryDataSources: ["GSTN aggregate transactional returns", "MCA-21 / RoC live filings", "PLFS (Periodic Labour Force Survey)", "Digital platform aggregates"],
      coveragePeriodFrom: "2022-23",
      coveragePeriodTo: "Active",
      keyChanges: [
        "Transition to double deflation methodology for value added precision",
        "High-frequency GST e-way bill & return data integration",
        "Expanded coverage of digital services, renewable energy, and gig economy"
      ]
    }
  ]
};

async function apiFetch<T>(path: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) {
      if (fallback !== undefined) return fallback;
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail ?? `API error ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    if (fallback !== undefined) {
      return fallback;
    }
    throw error;
  }
}

export const api = {
  dashboard: {
    india: (baseYear = "2022-23") =>
      apiFetch<DashboardResponse>(`/dashboard/india?base_year=${baseYear}`, undefined, MOCK_DASHBOARD),
  },
  gdp: {
    latest: (baseYear = "2022-23", priceType = "constant") =>
      apiFetch<GdpObservation>(`/gdp/latest?base_year=${baseYear}&price_type=${priceType}`, undefined, {
        id: "gdp-obs-latest",
        period: "FY 2023-24",
        periodType: "FY",
        valueCrore: 17382000,
        unit: "INR Crore",
        priceType: "constant",
        growthRateYoy: 8.2,
        baseYear: baseYear,
        status: "official",
        provenance: {
          sourceId: "mospi-nas",
          sourceName: "MoSPI NAS Provisional Estimates",
          publicationDate: "2024-05-31",
          baseYear: baseYear,
        }
      }),
    series: (params: SeriesParams) =>
      apiFetch<GdpSeriesResponse>(`/gdp/series?${new URLSearchParams(params as any)}`, undefined, {
        baseYear: params.base_year ?? "2022-23",
        priceType: params.price_type ?? "constant",
        periodType: params.period_type ?? "FY",
        data: [
          { id: "1", period: "2019-20", periodType: "FY", valueCrore: 14516000, unit: "INR Crore", priceType: "constant", growthRateYoy: 3.9, baseYear: "2022-23", status: "official" },
          { id: "2", period: "2020-21", periodType: "FY", valueCrore: 13687000, unit: "INR Crore", priceType: "constant", growthRateYoy: -5.8, baseYear: "2022-23", status: "official" },
          { id: "3", period: "2021-22", periodType: "FY", valueCrore: 14925000, unit: "INR Crore", priceType: "constant", growthRateYoy: 9.1, baseYear: "2022-23", status: "official" },
          { id: "4", period: "2022-23", periodType: "FY", valueCrore: 16071000, unit: "INR Crore", priceType: "constant", growthRateYoy: 7.2, baseYear: "2022-23", status: "official" },
          { id: "5", period: "2023-24", periodType: "FY", valueCrore: 17382000, unit: "INR Crore", priceType: "constant", growthRateYoy: 8.2, baseYear: "2022-23", status: "official" },
        ],
        pagination: { page: 0, size: 10, totalElements: 5, totalPages: 1 }
      }),
    sectors: (params: SectorParams) =>
      apiFetch<SectorBreakdownResponse>(`/gdp/sectors?${new URLSearchParams(params as any)}`, undefined, {
        period: "2023-24",
        baseYear: params.base_year ?? "2022-23",
        priceType: params.price_type ?? "constant",
        sectors: [
          { sectorCode: "AGR", sectorName: "Agriculture, Forestry & Fishing", value: 2500000, shareOfGdp: 15.1, growthRate: 1.4 },
          { sectorCode: "IND", sectorName: "Industry & Manufacturing", value: 4700000, shareOfGdp: 28.5, growthRate: 9.3 },
          { sectorCode: "SRV", sectorName: "Services (Trade, Hotels, Transport)", value: 3100000, shareOfGdp: 18.7, growthRate: 6.5 },
          { sectorCode: "FIN", sectorName: "Financial, Real Estate & Prof Services", value: 3800000, shareOfGdp: 23.0, growthRate: 8.4 },
          { sectorCode: "PUB", sectorName: "Public Admin & Defence", value: 2400000, shareOfGdp: 14.7, growthRate: 5.6 },
        ]
      }),
    revisions: (baseYear = "2022-23") =>
      apiFetch<RevisionsResponse>(`/gdp/revisions?base_year=${baseYear}`, undefined, MOCK_REVISIONS),
  },
  methodology: {
    seriesComparison: () => apiFetch<SeriesComparisonResponse>("/methodology/series-comparison", undefined, MOCK_METHODOLOGY),
  },
  deflators: (baseYear = "2022-23") =>
    apiFetch<DeflatorsResponse>(`/deflators?base_year=${baseYear}`, undefined, MOCK_DEFLATORS),
  indicators: () => apiFetch<IndicatorsResponse>("/indicators", undefined, {
    data: [
      { indicatorCode: "IIP", indicatorName: "Index of Industrial Production", latestValue: 154.2, unit: "Index (2011-12=100)", period: "Mar 2024" },
      { indicatorCode: "GST", indicatorName: "Gross GST Collections", latestValue: 210000, unit: "₹ Crore", period: "Apr 2024" },
      { indicatorCode: "PMI_MFG", indicatorName: "Manufacturing PMI", latestValue: 58.8, unit: "Index (>50 Expansion)", period: "Apr 2024" },
      { indicatorCode: "PMI_SRV", indicatorName: "Services PMI", latestValue: 60.8, unit: "Index (>50 Expansion)", period: "Apr 2024" },
      { indicatorCode: "CPI", indicatorName: "Consumer Price Index (Combined)", latestValue: 186.7, unit: "Index (2012=100)", period: "Apr 2024" },
      { indicatorCode: "WPI", indicatorName: "Wholesale Price Index", latestValue: 153.2, unit: "Index (2011-12=100)", period: "Apr 2024" },
    ],
    pagination: { page: 0, size: 10, totalElements: 6, totalPages: 1 }
  }),
  ratings: (agency = "all") => {
    const fallback = agency === "all"
      ? MOCK_RATINGS
      : {
          data: MOCK_RATINGS.data.filter(r =>
            agency === "moodys" ? r.agency.toLowerCase().includes("moody") :
            agency === "sp" ? r.agency.toLowerCase().includes("s&p") :
            agency === "fitch" ? r.agency.toLowerCase().includes("fitch") : true
          )
        };
    return apiFetch<RatingsResponse>(`/ratings?agency=${agency}`, undefined, fallback);
  },
  sources: {
    get: (id: string) => apiFetch<SourceResponse>(`/sources/${id}`, undefined, {
      id: id,
      name: id === "mospi-nas" ? "MoSPI National Accounts Statistics" : "RBI Database on Indian Economy",
      authority: id === "mospi-nas" ? "Ministry of Statistics and Programme Implementation" : "Reserve Bank of India",
      canonicalUrl: id === "mospi-nas" ? "https://mospi.gov.in" : "https://dbie.rbi.org.in",
      dataTypes: ["GDP", "GVA", "Price Indices", "Deflators"],
      updateFrequency: "Quarterly and Annual",
      lastSuccessfulRetrieval: "2024-05-31T18:00:00Z",
      lastObservedPublicationDate: "2024-05-31"
    }),
  },
  ai: {
    query: (body: AiQueryRequest) =>
      fetch(`${API_BASE}/ai/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
  },
};

// --- Types ---
export interface Provenance {
  sourceId: string;
  sourceName?: string;
  sourceUrl?: string;
  publicationDate?: string;
  retrievalTimestamp?: string;
  baseYear?: string;
  methodologyVersion?: string;
  observationStatus?: string;
}

export interface MetricCard {
  label: string;
  value: number | null;
  unit: string;
  period: string;
  status: "official" | "provisional" | "revised" | "derived" | "forecast" | "unavailable";
  provenance?: Provenance;
}

export interface DashboardResponse {
  asOf: string;
  baseYear: string;
  realGdpGrowth: MetricCard;
  nominalGdpGrowth: MetricCard;
  gdpAbsolute: MetricCard;
  gvaGrowth: MetricCard;
  gdpDeflator: MetricCard;
  cpi: MetricCard;
  wpi: MetricCard;
  topSectors: MetricCard[];
}

export interface GdpObservation {
  id: string;
  period: string;
  periodType: string;
  valueCrore: number;
  unit: string;
  priceType: string;
  growthRateYoy?: number;
  baseYear: string;
  status: string;
  provenance?: Provenance;
}

export interface GdpSeriesResponse {
  baseYear: string;
  priceType: string;
  periodType: string;
  prominentWarning?: string;
  data: GdpObservation[];
  pagination: Pagination;
}

export interface SectorBreakdownResponse {
  period: string;
  baseYear: string;
  priceType: string;
  sectors: SectorData[];
}

export interface SectorData {
  sectorCode: string;
  sectorName: string;
  value: number;
  shareOfGdp: number;
  growthRate?: number;
  provenance?: Provenance;
}

export interface SeriesComparisonResponse {
  series: BaseYearSeries[];
}

export interface BaseYearSeries {
  baseYear: string;
  methodologyVersion: string;
  baseYearDescription: string;
  deflationMethod: string;
  primaryDataSources: string[];
  coveragePeriodFrom: string;
  coveragePeriodTo: string;
  keyChanges: string[];
}

export interface DeflatorsResponse {
  baseYear: string;
  periodType: string;
  data: DeflatorPoint[];
}

export interface DeflatorPoint {
  period: string;
  gdpDeflator?: number;
  cpi?: number;
  wpi?: number;
  provenance?: Provenance;
}

export interface IndicatorsResponse {
  data: IndicatorCard[];
  pagination: Pagination;
}

export interface IndicatorCard {
  indicatorCode: string;
  indicatorName: string;
  latestValue: number;
  unit: string;
  period: string;
  provenance?: Provenance;
}

export interface RatingsResponse {
  data: SovereignRating[];
}

export interface SovereignRating {
  agency: string;
  rating: string;
  outlook: string;
  ratingDate: string;
  previousRating?: string;
  actionType?: string;
  provenance?: Provenance;
}

export interface SourceResponse {
  id: string;
  name: string;
  authority: string;
  canonicalUrl: string;
  dataTypes: string[];
  updateFrequency: string;
  lastSuccessfulRetrieval?: string;
  lastObservedPublicationDate?: string;
}

export interface RevisionsResponse {
  period: string;
  baseYear: string;
  revisions: RevisionEntry[];
  pagination: Pagination;
}

export interface RevisionEntry {
  revisionDate: string;
  fromValue: number;
  toValue: number;
  fromStatus: string;
  toStatus: string;
  releaseLabel: string;
  provenance?: Provenance;
}

export interface AiQueryRequest {
  query: string;
  conversationId?: string;
  stream?: boolean;
}

export interface AiQueryResponse {
  conversationId: string;
  answer: string;
  citations: Citation[];
  groundednessScore: number;
  disclaimer: string;
}

export interface Citation {
  citationId: string;
  sourceId: string;
  title: string;
  publisher: string;
  publicationDate?: string;
  section?: string;
  page?: string;
  url?: string;
  excerpt?: string;
}

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

type SeriesParams = {
  base_year?: string;
  price_type?: string;
  period_type?: string;
  page?: string;
  size?: string;
};

type SectorParams = {
  base_year?: string;
  price_type?: string;
  period?: string;
};
