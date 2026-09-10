"""Tests for ML consistency scorer."""
import pytest
from ml.consistency.scorer import ConsistencyScorer, DEFAULT_WEIGHTS


def test_scorer_weights_sum_to_one():
    total = sum(DEFAULT_WEIGHTS.values())
    assert abs(total - 1.0) < 1e-6


def test_perfect_agreement_scores_high():
    scorer = ConsistencyScorer()
    result = scorer.score(
        gdp_growth=7.0,
        indicator_growths={"iip": 7.2, "gst": 6.8, "pmi": 7.1},
        days_since_latest_indicator=10,
        revision_magnitude=0.0,
        period="Q1FY25",
        base_year="2022-23",
    )
    assert result.overall_score > 75


def test_no_data_returns_midrange():
    scorer = ConsistencyScorer()
    result = scorer.score(
        gdp_growth=None,
        indicator_growths={},
        days_since_latest_indicator=None,
        revision_magnitude=None,
    )
    # Should return something in middle range, not crash
    assert 0 <= result.overall_score <= 100
    assert result.coverage_fraction == 0.0


def test_missing_indicators_reduce_coverage():
    scorer = ConsistencyScorer()
    result = scorer.score(
        gdp_growth=7.0,
        indicator_growths={"iip": 7.2, "gst": None, "pmi": None},
        days_since_latest_indicator=30,
        revision_magnitude=0.2,
    )
    assert result.coverage_fraction < 1.0


def test_result_has_label():
    scorer = ConsistencyScorer()
    result = scorer.score(7.0, {"iip": 7.0}, 30, 0.1)
    assert "ANALYTICAL DIAGNOSTIC" in result.label
    assert "NOT A TRUTH SCORE" in result.label
