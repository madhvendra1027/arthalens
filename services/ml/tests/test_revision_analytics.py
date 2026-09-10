"""Tests for revision behavior analytics."""
from ml.consistency.revision_analytics import compute_revision_stats


def test_upward_bias_detected():
    revisions = [
        {"from_release": "Advance", "to_release": "FirstRevised", "from_value": 100.0, "to_value": 102.0},
        {"from_release": "Advance", "to_release": "FirstRevised", "from_value": 200.0, "to_value": 203.0},
    ]
    stats = compute_revision_stats(revisions)
    assert stats.mean_revision > 0
    assert stats.pct_upward == 100.0


def test_downward_bias_detected():
    revisions = [
        {"from_release": "Advance", "to_release": "FirstRevised", "from_value": 100.0, "to_value": 98.0},
        {"from_release": "Advance", "to_release": "FirstRevised", "from_value": 200.0, "to_value": 197.0},
    ]
    stats = compute_revision_stats(revisions)
    assert stats.mean_revision < 0
    assert stats.pct_upward == 0.0


def test_empty_revisions():
    stats = compute_revision_stats([])
    assert stats.n_observations == 0
    assert stats.mean_revision is None
