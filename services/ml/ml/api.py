"""ArthaLens ML Service — extended analytics endpoints."""
from __future__ import annotations

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Any
import structlog

from ml.consistency.scorer import ConsistencyScorer, ConsistencyInput
from ml.consistency.sector_contribution import compute_sector_contributions
from ml.consistency.rolling_correlations import compute_rolling_correlations
from ml.consistency.revision_analytics import compute_revision_stats
from ml.consistency.deflator_diagnostics import check_deflator_identity

log = structlog.get_logger()

app = FastAPI(
    title="ArthaLens ML Service",
    version="1.0.0",
    description=(
        "Analytical diagnostics for India macroeconomic data. "
        "All outputs are research aids — not official government statistics. "
        "ML forecasts are clearly distinguished from official estimates."
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"status": "UP", "service": "arthalens-ml"}


# ─── Consistency Score ─────────────────────────────────────────────────────
class ConsistencyRequest(BaseModel):
    gdp_growth_rate: float | None = None
    iip_growth_rate: float | None = None
    gst_revenue_growth: float | None = None
    pmi_manufacturing: float | None = None
    pmi_services: float | None = None
    export_growth: float | None = None
    credit_growth: float | None = None
    revision_magnitude: float | None = None
    data_age_days: int | None = None
    weights: dict[str, float] | None = None


@app.post("/ml/v1/consistency-score")
def consistency_score(req: ConsistencyRequest):
    """
    Compute a transparent 0-100 consistency score.
    Returns sub-scores, weights, and a coverage indicator.
    Label: ANALYTICAL DIAGNOSTIC — not a truth score.
    """
    scorer = ConsistencyScorer(weights=req.weights)
    inp = ConsistencyInput(
        gdp_growth_rate=req.gdp_growth_rate,
        iip_growth_rate=req.iip_growth_rate,
        gst_revenue_growth=req.gst_revenue_growth,
        pmi_manufacturing=req.pmi_manufacturing,
        pmi_services=req.pmi_services,
        export_growth=req.export_growth,
        credit_growth=req.credit_growth,
        revision_magnitude=req.revision_magnitude,
        data_age_days=req.data_age_days,
    )
    result = scorer.score(inp)
    return {
        "score": result.score,
        "label": result.label,
        "coverage": result.coverage,
        "sub_scores": result.sub_scores,
        "weights_used": result.weights_used,
        "disclaimer": result.disclaimer,
    }


# ─── Sector Contributions ──────────────────────────────────────────────────
class SectorDataItem(BaseModel):
    sector_code: str
    sector_name: str
    value: float
    period: str = ""


class SectorContributionRequest(BaseModel):
    current: list[SectorDataItem]
    prior: list[SectorDataItem] | None = None


@app.post("/ml/v1/sector-contributions")
def sector_contributions(req: SectorContributionRequest):
    """Compute sector GVA shares and contributions to growth."""
    try:
        results = compute_sector_contributions(
            [s.model_dump() for s in req.current],
            [s.model_dump() for s in req.prior] if req.prior else None,
        )
        return {
            "contributions": [
                {
                    "sector_code": r.sector_code,
                    "sector_name": r.sector_name,
                    "period": r.period,
                    "share_of_total_pct": round(r.share_of_total * 100, 3),
                    "yoy_growth_pct": round(r.yoy_growth * 100, 3) if r.yoy_growth else None,
                    "contribution_to_growth_pp": round(r.contribution_to_growth * 100, 3) if r.contribution_to_growth else None,
                    "status": r.status,
                    "methodology_note": r.methodology_note,
                }
                for r in results
            ]
        }
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))


# ─── Rolling Correlations ─────────────────────────────────────────────────
class SeriesPoint(BaseModel):
    period: str
    value: float | None


class RollingCorrelationRequest(BaseModel):
    gdp_growth: list[SeriesPoint]
    indicators: dict[str, list[SeriesPoint]]
    window: int = Field(default=4, ge=2, le=20)


@app.post("/ml/v1/rolling-correlations")
def rolling_correlations(req: RollingCorrelationRequest):
    """Compute rolling Pearson correlations between GDP growth and indicators."""
    results = compute_rolling_correlations(
        [p.model_dump() for p in req.gdp_growth],
        {name: [p.model_dump() for p in series] for name, series in req.indicators.items()},
        window=req.window,
    )
    return {
        "window": req.window,
        "interpretation": "Diagnostic only. Correlation ≠ causation.",
        "series": [
            {
                "indicator_name": r.indicator_name,
                "periods": r.periods,
                "correlations": r.correlations,
                "mean_correlation": r.mean_correlation,
            }
            for r in results
        ],
    }


# ─── Revision Analytics ────────────────────────────────────────────────────
class RevisionItem(BaseModel):
    from_release: str
    to_release: str
    from_value: float
    to_value: float


@app.post("/ml/v1/revision-analytics")
def revision_analytics(revisions: list[RevisionItem]):
    """Analyse historical revision patterns (magnitude, bias, direction)."""
    stats = compute_revision_stats([r.model_dump() for r in revisions])
    return {
        "from_release": stats.from_release,
        "to_release": stats.to_release,
        "n_observations": stats.n_observations,
        "mean_revision_pct": stats.mean_revision,
        "mean_absolute_revision_pct": stats.mean_absolute_revision,
        "max_upward_revision_pct": stats.max_upward_revision,
        "max_downward_revision_pct": stats.max_downward_revision,
        "pct_periods_revised_upward": stats.pct_upward,
        "note": stats.note,
    }


# ─── Deflator Diagnostics ─────────────────────────────────────────────────
class DeflatorCheckRequest(BaseModel):
    period: str
    nominal_gdp: float | None = None
    real_gdp: float | None = None
    published_deflator: float | None = None
    cpi: float | None = None
    wpi: float | None = None


@app.post("/ml/v1/deflator-check")
def deflator_check(req: DeflatorCheckRequest):
    """Check nominal/real identity and cross-index divergence. Flags are for review, not errors."""
    diag = check_deflator_identity(
        nominal_gdp=req.nominal_gdp,
        real_gdp=req.real_gdp,
        published_deflator=req.published_deflator,
        period=req.period,
        cpi=req.cpi,
        wpi=req.wpi,
    )
    return {
        "period": diag.period,
        "implied_deflator": diag.implied_deflator,
        "published_deflator": diag.published_deflator,
        "identity_residual": diag.identity_residual,
        "identity_check_passed": diag.identity_check_passed,
        "gdp_vs_cpi_gap_pp": diag.gdp_vs_cpi_gap,
        "gdp_vs_wpi_gap_pp": diag.gdp_vs_wpi_gap,
        "flags": diag.flags,
        "note": diag.note,
    }
