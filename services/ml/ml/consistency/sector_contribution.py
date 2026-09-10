"""
Sector Contribution Analytics — GVA share and contribution to growth.

For each sector, computes:
  - share of total GVA/GDP in a given period
  - contribution to YoY growth (sector growth × previous share)
  - rolling 4-period contribution trend

All results are labelled as derived analytics, not official GDP figures.
Source data must come from official MoSPI sector tables.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass
class SectorContribution:
    sector_code: str
    sector_name: str
    period: str
    value: float
    share_of_total: float
    yoy_growth: float | None
    contribution_to_growth: float | None   # sector_weight_prev × sector_growth
    status: str = "derived"
    methodology_note: str = (
        "Contribution = previous period share × current growth rate. "
        "Derived from official MoSPI data. Not an official MoSPI figure."
    )


def compute_sector_contributions(
    sector_data: list[dict[str, Any]],
    prior_sector_data: list[dict[str, Any]] | None = None,
) -> list[SectorContribution]:
    """
    Compute sector shares and contributions for a given period.

    Parameters
    ----------
    sector_data:
        List of dicts with keys: sector_code, sector_name, value (INR Crore)
    prior_sector_data:
        Same structure for the prior-year period. Required for contribution computation.

    Returns
    -------
    List of SectorContribution with shares and optional contributions.
    """
    total = sum(s["value"] for s in sector_data if s.get("value") is not None)
    if total <= 0:
        raise ValueError("Total GVA/GDP must be positive")

    prior_map: dict[str, dict[str, Any]] = {}
    if prior_sector_data:
        prior_map = {s["sector_code"]: s for s in prior_sector_data}
        prior_total = sum(s["value"] for s in prior_sector_data if s.get("value") is not None)
    else:
        prior_total = None

    results: list[SectorContribution] = []
    for s in sector_data:
        code = s["sector_code"]
        val = s.get("value")
        if val is None:
            continue

        share = val / total

        # YoY growth and contribution
        yoy_growth = None
        contribution = None
        if code in prior_map and prior_total and prior_total > 0:
            prior_val = prior_map[code].get("value")
            if prior_val and prior_val > 0:
                yoy_growth = (val - prior_val) / prior_val
                prior_share = prior_val / prior_total
                contribution = prior_share * yoy_growth  # additive contribution

        results.append(SectorContribution(
            sector_code=code,
            sector_name=s.get("sector_name", code),
            period=s.get("period", ""),
            value=val,
            share_of_total=round(share, 6),
            yoy_growth=round(yoy_growth, 6) if yoy_growth is not None else None,
            contribution_to_growth=round(contribution, 6) if contribution is not None else None,
        ))

    return sorted(results, key=lambda x: x.share_of_total, reverse=True)
