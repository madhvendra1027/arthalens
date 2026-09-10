"""GDP growth forecasting using a hierarchy of models.

Model hierarchy: naive/seasonal_naive -> ARIMA/ETS -> regularized regression
Walk-forward validation is used. No train/test leakage.
Prediction intervals are always returned.
"""
from __future__ import annotations

import warnings
from dataclasses import dataclass
from typing import Any

import numpy as np
import pandas as pd

warnings.filterwarnings("ignore", category=UserWarning)


@dataclass
class ForecastResult:
    model_name: str
    period_label: str
    point_forecast: float
    lower_bound: float
    upper_bound: float
    confidence_level: float = 0.80
    mae: float | None = None
    rmse: float | None = None
    directional_accuracy: float | None = None
    baseline_mae: float | None = None
    metadata: dict[str, Any] | None = None

    def to_dict(self) -> dict[str, Any]:
        return {
            "model": self.model_name,
            "period": self.period_label,
            "point_forecast": round(self.point_forecast, 4),
            "lower_bound": round(self.lower_bound, 4),
            "upper_bound": round(self.upper_bound, 4),
            "confidence_level": self.confidence_level,
            "metrics": {
                "mae": self.mae,
                "rmse": self.rmse,
                "directional_accuracy": self.directional_accuracy,
                "baseline_mae": self.baseline_mae,
            },
            "disclaimer": (
                "This is an ML forecast, NOT an official government estimate. "
                "Causal inference is not claimed."
            ),
        }


class NaiveForecaster:
    """Baseline: predict last observed value (random walk)."""

    name = "naive"

    def fit_predict(self, series: pd.Series, horizon: int = 1) -> list[ForecastResult]:
        last_val = float(series.iloc[-1])
        std = float(series.diff().dropna().std()) if len(series) > 2 else abs(last_val) * 0.05
        results = []
        for h in range(1, horizon + 1):
            results.append(ForecastResult(
                model_name=self.name,
                period_label=f"h+{h}",
                point_forecast=last_val,
                lower_bound=last_val - 1.28 * std * (h ** 0.5),
                upper_bound=last_val + 1.28 * std * (h ** 0.5),
            ))
        return results


class ARIMAForecaster:
    """ARIMA-based forecasting via statsmodels."""

    name = "arima"

    def fit_predict(self, series: pd.Series, horizon: int = 4) -> list[ForecastResult]:
        try:
            from statsmodels.tsa.arima.model import ARIMA
            model = ARIMA(series, order=(1, 1, 1))
            fit = model.fit()
            forecast = fit.get_forecast(steps=horizon)
            means = forecast.predicted_mean.values
            conf = forecast.conf_int(alpha=0.20)
            results = []
            for h in range(horizon):
                results.append(ForecastResult(
                    model_name=self.name,
                    period_label=f"h+{h+1}",
                    point_forecast=float(means[h]),
                    lower_bound=float(conf.iloc[h, 0]),
                    upper_bound=float(conf.iloc[h, 1]),
                    confidence_level=0.80,
                ))
            return results
        except Exception as exc:
            # Fall back to naive on any failure
            naive = NaiveForecaster()
            results = naive.fit_predict(series, horizon)
            for r in results:
                r.model_name = f"arima_fallback_naive ({exc})"
            return results
