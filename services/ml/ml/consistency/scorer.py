"""
Economic Consistency Scorer.

Produces a 0-100 diagnostic score across configurable sub-scores.
The score is an analytical diagnostic, NOT a truth score about official GDP.

Sub-scores (all configurable via weights):
  - directional_agreement: do independent indicators agree with GDP direction?
  - magnitude_divergence: how large is the gap between indicators and GDP growth?
  - data_freshness: are the indicators recent enough to be meaningful?
  - revision_stability: how much has the estimate been revised?
  - coverage: what fraction of expected indicators are available?
"""
from __future__ import annotations

import math
from dataclasses import dataclass, field
from typing import Any


DEFAULT_WEIGHTS = {
    "directional_agreement": 0.30,
    "magnitude_divergence": 0.25,
    "data_freshness": 0.20,
    "revision_stability": 0.15,
    "coverage": 0.10,
}

SCORE_LABEL = (
    "ANALYTICAL DIAGNOSTIC — NOT A TRUTH SCORE. "
    "This score does not determine whether official GDP figures are accurate. "
    "It measures internal consistency across available indicators."
)


@dataclass
class SubScore:
    name: str
    raw_value: float          # 0.0 to 1.0
    weight: float
    explanation: str
    data_available: bool = True


@dataclass
class ConsistencyScoreResult:
    overall_score: float       # 0 to 100
    sub_scores: list[SubScore]
    weights: dict[str, float]
    coverage_fraction: float   # fraction of expected indicators available
    label: str = field(default=SCORE_LABEL)
    period: str = ""
    base_year: str = ""
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return {
            "overall_score": round(self.overall_score, 2),
            "label": self.label,
            "period": self.period,
            "base_year": self.base_year,
            "coverage_fraction": round(self.coverage_fraction, 3),
            "sub_scores": [
                {
                    "name": s.name,
                    "score": round(s.raw_value * 100, 2),
                    "weight": s.weight,
                    "explanation": s.explanation,
                    "data_available": s.data_available,
                }
                for s in self.sub_scores
            ],
            "weights": self.weights,
        }


class ConsistencyScorer:
    """
    Compute a transparent, configurable consistency score.

    Missing indicators reduce the coverage sub-score; they do NOT silently
    become zero in other sub-scores (which would artificially deflate them).
    """

    def __init__(self, weights: dict[str, float] | None = None) -> None:
        self.weights = weights or DEFAULT_WEIGHTS
        total = sum(self.weights.values())
        assert abs(total - 1.0) < 1e-6, f"Weights must sum to 1.0, got {total}"

    def score(
        self,
        gdp_growth: float | None,
        indicator_growths: dict[str, float | None],
        days_since_latest_indicator: int | None,
        revision_magnitude: float | None,
        period: str = "",
        base_year: str = "",
    ) -> ConsistencyScoreResult:
        available = {k: v for k, v in indicator_growths.items() if v is not None}
        total_expected = len(indicator_growths)
        n_available = len(available)
        coverage = n_available / total_expected if total_expected > 0 else 0.0

        sub_scores: list[SubScore] = []

        # 1. Directional agreement
        if gdp_growth is not None and available:
            agrees = sum(1 for v in available.values() if (v > 0) == (gdp_growth > 0))
            dir_score = agrees / n_available
            sub_scores.append(SubScore(
                "directional_agreement", dir_score, self.weights["directional_agreement"],
                f"{agrees}/{n_available} indicators agree with GDP direction"
            ))
        else:
            sub_scores.append(SubScore(
                "directional_agreement", 0.5, self.weights["directional_agreement"],
                "Insufficient data for directional agreement", data_available=False
            ))

        # 2. Magnitude divergence
        if gdp_growth is not None and available:
            diffs = [abs(v - gdp_growth) for v in available.values()]
            avg_diff = sum(diffs) / len(diffs)
            # Score of 1.0 if avg diff <= 0.5pp; 0.0 if avg diff >= 10pp
            mag_score = max(0.0, 1.0 - (avg_diff - 0.5) / 9.5)
            sub_scores.append(SubScore(
                "magnitude_divergence", mag_score, self.weights["magnitude_divergence"],
                f"Average divergence from GDP growth: {avg_diff:.2f}pp"
            ))
        else:
            sub_scores.append(SubScore(
                "magnitude_divergence", 0.5, self.weights["magnitude_divergence"],
                "Insufficient data", data_available=False
            ))

        # 3. Data freshness
        if days_since_latest_indicator is not None:
            freshness = max(0.0, 1.0 - days_since_latest_indicator / 180)
            sub_scores.append(SubScore(
                "data_freshness", freshness, self.weights["data_freshness"],
                f"Latest indicator data is {days_since_latest_indicator} days old"
            ))
        else:
            sub_scores.append(SubScore(
                "data_freshness", 0.0, self.weights["data_freshness"],
                "No indicator date information available", data_available=False
            ))

        # 4. Revision stability
        if revision_magnitude is not None:
            # Score of 1.0 if no revision; 0.0 if revision >= 2pp
            stab = max(0.0, 1.0 - abs(revision_magnitude) / 2.0)
            sub_scores.append(SubScore(
                "revision_stability", stab, self.weights["revision_stability"],
                f"Revision magnitude: {revision_magnitude:.2f}pp"
            ))
        else:
            sub_scores.append(SubScore(
                "revision_stability", 0.5, self.weights["revision_stability"],
                "No revision data available", data_available=False
            ))

        # 5. Coverage
        sub_scores.append(SubScore(
            "coverage", coverage, self.weights["coverage"],
            f"{n_available}/{total_expected} expected indicators available"
        ))

        # Weighted overall
        overall = sum(s.raw_value * s.weight for s in sub_scores) * 100

        return ConsistencyScoreResult(
            overall_score=round(overall, 2),
            sub_scores=sub_scores,
            weights=self.weights,
            coverage_fraction=coverage,
            period=period,
            base_year=base_year,
        )
