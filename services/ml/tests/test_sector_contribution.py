"""Tests for sector contribution analytics."""
import pytest
from ml.consistency.sector_contribution import compute_sector_contributions, SectorContribution


SAMPLE_CURRENT = [
    {"sector_code": "AGR", "sector_name": "Agriculture", "value": 2000.0, "period": "FY2024"},
    {"sector_code": "IND", "sector_name": "Industry",    "value": 3000.0, "period": "FY2024"},
    {"sector_code": "SVC", "sector_name": "Services",    "value": 5000.0, "period": "FY2024"},
]

SAMPLE_PRIOR = [
    {"sector_code": "AGR", "sector_name": "Agriculture", "value": 1800.0, "period": "FY2023"},
    {"sector_code": "IND", "sector_name": "Industry",    "value": 2800.0, "period": "FY2023"},
    {"sector_code": "SVC", "sector_name": "Services",    "value": 4600.0, "period": "FY2023"},
]


def test_shares_sum_to_one():
    results = compute_sector_contributions(SAMPLE_CURRENT)
    total_share = sum(r.share_of_total for r in results)
    assert abs(total_share - 1.0) < 1e-6


def test_largest_sector_first():
    results = compute_sector_contributions(SAMPLE_CURRENT)
    assert results[0].sector_code == "SVC"


def test_contributions_with_prior():
    results = compute_sector_contributions(SAMPLE_CURRENT, SAMPLE_PRIOR)
    # All sectors should have contribution when prior is provided
    for r in results:
        assert r.contribution_to_growth is not None


def test_contributions_sum_approx_total_growth():
    """Sum of contributions should ≈ total GDP growth."""
    results = compute_sector_contributions(SAMPLE_CURRENT, SAMPLE_PRIOR)
    total_prior = sum(s["value"] for s in SAMPLE_PRIOR)
    total_current = sum(s["value"] for s in SAMPLE_CURRENT)
    expected_total_growth = (total_current - total_prior) / total_prior
    summed_contributions = sum(r.contribution_to_growth for r in results if r.contribution_to_growth)
    assert abs(summed_contributions - expected_total_growth) < 0.001


def test_zero_total_raises():
    with pytest.raises(ValueError):
        compute_sector_contributions([{"sector_code": "A", "sector_name": "A", "value": 0.0}])
