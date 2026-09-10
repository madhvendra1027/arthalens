"""Divergence / anomaly detection across GDP and independent indicators."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import numpy as np
import pandas as pd


@dataclass
class DivergenceResult:
    indicator_name: str
    period: str
    gdp_growth: float
    indicator_growth: float
    divergence: float
    z_score: float | None
    is_anomalous: bool
    note: str

    def to_dict(self) -> dict[str, Any]:
        return {
            "indicator": self.indicator_name,
            "period": self.period,
            "gdp_growth": self.gdp_growth,
            "indicator_growth": self.indicator_growth,
            "divergence_pp": round(self.divergence, 4),
            "z_score": round(self.z_score, 3) if self.z_score is not None else None,
            "is_anomalous": self.is_anomalous,
            "note": self.note,
        }


def detect_divergences(
    gdp_series: pd.Series,
    indicator_series: pd.Series,
    indicator_name: str,
    z_threshold: float = 2.0,
) -> list[DivergenceResult]:
    """
    Detect periods where an indicator diverges significantly from GDP growth.
    Returns anomalous periods. Does NOT claim official GDP is wrong.
    """
    common_idx = gdp_series.index.intersection(indicator_series.index)
    gdp = gdp_series.loc[common_idx]
    ind = indicator_series.loc[common_idx]
    diffs = ind - gdp

    mean_diff = diffs.mean()
    std_diff = diffs.std()

    results = []
    for period in common_idx:
        diff = float(diffs.loc[period])
        z = float((diff - mean_diff) / std_diff) if std_diff > 0 else None
        is_anomalous = abs(z) > z_threshold if z is not None else False

        results.append(DivergenceResult(
            indicator_name=indicator_name,
            period=str(period),
            gdp_growth=float(gdp.loc[period]),
            indicator_growth=float(ind.loc[period]),
            divergence=diff,
            z_score=z,
            is_anomalous=is_anomalous,
            note=(
                "Large divergence flagged for human review. "
                "Does not imply official GDP is incorrect."
            ) if is_anomalous else "",
        ))
    return results
