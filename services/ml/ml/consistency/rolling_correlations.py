"""
Rolling Correlation Analysis — GDP growth vs independent indicators.

Computes rolling Pearson correlation between official GDP growth
and independent indicator series (IIP, GST, PMI etc.) with configurable window.

Results are diagnostic only: correlation ≠ causation.
Requires scipy and numpy.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import numpy as np


@dataclass
class RollingCorrelationResult:
    indicator_name: str
    periods: list[str]
    correlations: list[float | None]
    window: int
    mean_correlation: float | None
    interpretation: str = "Diagnostic only. Correlation does not imply causation."


def rolling_pearson(
    x: list[float | None],
    y: list[float | None],
    window: int,
) -> list[float | None]:
    """Compute rolling Pearson correlation between two series, handling NaN."""
    n = len(x)
    results: list[float | None] = [None] * (window - 1)
    for i in range(window - 1, n):
        xi = x[i - window + 1 : i + 1]
        yi = y[i - window + 1 : i + 1]
        # Drop paired NaN
        pairs = [(a, b) for a, b in zip(xi, yi) if a is not None and b is not None]
        if len(pairs) < max(3, window // 2):
            results.append(None)
            continue
        xa, ya = np.array([p[0] for p in pairs]), np.array([p[1] for p in pairs])
        if xa.std() == 0 or ya.std() == 0:
            results.append(None)
            continue
        corr = float(np.corrcoef(xa, ya)[0, 1])
        results.append(round(corr, 4))
    return results


def compute_rolling_correlations(
    gdp_growth: list[dict[str, Any]],
    indicators: dict[str, list[dict[str, Any]]],
    window: int = 4,
) -> list[RollingCorrelationResult]:
    """
    Parameters
    ----------
    gdp_growth:
        List of {period, value} dicts (real GDP YoY growth rates).
    indicators:
        Dict mapping indicator name -> list of {period, value} dicts.
    window:
        Rolling window size (default 4 = rolling year for quarterly).

    Returns
    -------
    One RollingCorrelationResult per indicator.
    """
    gdp_periods = [d["period"] for d in gdp_growth]
    gdp_values = [d.get("value") for d in gdp_growth]

    results: list[RollingCorrelationResult] = []
    for name, series in indicators.items():
        # Align by period
        ind_map = {d["period"]: d.get("value") for d in series}
        aligned = [ind_map.get(p) for p in gdp_periods]

        correlations = rolling_pearson(gdp_values, aligned, window)
        valid_corrs = [c for c in correlations if c is not None]
        mean_corr = round(float(np.mean(valid_corrs)), 4) if valid_corrs else None

        results.append(RollingCorrelationResult(
            indicator_name=name,
            periods=gdp_periods,
            correlations=correlations,
            window=window,
            mean_correlation=mean_corr,
        ))

    return results
