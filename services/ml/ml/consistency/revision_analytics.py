"""
Revision Behavior Analytics.

Analyses patterns in GDP revision history:
- Average revision magnitude (AE, MAE) from Advance to Final estimate
- Directional bias (upward vs downward revisions)
- Vintage comparison across releases

Used to assess the stability and reliability of preliminary estimates.
Results are purely analytical — they characterize historical revision patterns,
not the accuracy of current estimates.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass
class RevisionStats:
    from_release: str
    to_release: str
    n_observations: int
    mean_revision: float | None           # positive = upward revision bias
    mean_absolute_revision: float | None  # magnitude
    max_upward_revision: float | None
    max_downward_revision: float | None
    pct_upward: float | None              # % of periods revised upward
    note: str = (
        "Revision statistics are historical patterns only. "
        "They do not predict the direction of future revisions."
    )


def compute_revision_stats(
    revisions: list[dict[str, Any]],
) -> RevisionStats:
    """
    Parameters
    ----------
    revisions:
        List of dicts with keys: from_release, to_release, from_value, to_value.

    Returns
    -------
    RevisionStats with magnitude and direction analytics.
    """
    if not revisions:
        return RevisionStats(
            from_release="unknown", to_release="unknown",
            n_observations=0, mean_revision=None,
            mean_absolute_revision=None, max_upward_revision=None,
            max_downward_revision=None, pct_upward=None,
        )

    diffs = []
    for r in revisions:
        fv, tv = r.get("from_value"), r.get("to_value")
        if fv is not None and tv is not None and fv != 0:
            diffs.append((tv - fv) / abs(fv))   # percentage revision

    n = len(diffs)
    if n == 0:
        return RevisionStats(
            from_release=revisions[0].get("from_release", ""),
            to_release=revisions[0].get("to_release", ""),
            n_observations=len(revisions),
            mean_revision=None, mean_absolute_revision=None,
            max_upward_revision=None, max_downward_revision=None, pct_upward=None,
        )

    mean_rev = sum(diffs) / n
    mae = sum(abs(d) for d in diffs) / n
    upward = [d for d in diffs if d > 0]

    return RevisionStats(
        from_release=revisions[0].get("from_release", ""),
        to_release=revisions[0].get("to_release", ""),
        n_observations=n,
        mean_revision=round(mean_rev * 100, 4),
        mean_absolute_revision=round(mae * 100, 4),
        max_upward_revision=round(max(diffs) * 100, 4) if diffs else None,
        max_downward_revision=round(min(diffs) * 100, 4) if diffs else None,
        pct_upward=round(len(upward) / n * 100, 2) if n else None,
    )
