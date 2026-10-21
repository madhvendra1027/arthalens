export type SectorId = "production" | "consumption" | "capital" | "government" | "external";

export interface EconomicIndicator {
  id: string;
  code: string;
  name: string;
  value: string;
  numericValue: number;
  unit: string;
  change: string;
  isPositive: boolean;
  period: string;
  status: "official" | "provisional" | "revised" | "derived";
  sourceName: string;
  authority: string;
  publicationDate: string;
  baseYear: string;
  methodologyNote: string;
  destinationRoute: string;
  historicalTrend: { period: string; value: number }[];
}

export interface EconomicRelationship {
  id: string;
  fromSectorId: SectorId;
  toSectorId: SectorId;
  label: string;
  mechanism: string;
  metricLabel: string;
  isDocumentedFlow: boolean;
}

export interface SectorDefinition {
  id: SectorId;
  title: string;
  category: string;
  tagline: string;
  description: string;
  shareOfEconomy: string;
  color: {
    primary: string;
    accent: string;
    bg: string;
    border: string;
    glow: string;
    topFace: string;
    leftFace: string;
    rightFace: string;
  };
  isometricCoords: {
    x: number; // percentage in SVG coordinate space
    y: number;
    platformWidth: number;
    platformHeight: number;
    elevation: number;
  };
  headlineMetric: {
    label: string;
    value: string;
    period: string;
    change: string;
  };
  indicators: EconomicIndicator[];
  primaryAnalyticsRoute: string;
  primaryAnalyticsLabel: string;
}
