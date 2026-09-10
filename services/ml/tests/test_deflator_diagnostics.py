"""Tests for deflator diagnostics."""
from ml.consistency.deflator_diagnostics import check_deflator_identity


def test_identity_passes_when_consistent():
    # Nominal = 110, Real = 100 → Deflator = 110.0
    diag = check_deflator_identity(
        nominal_gdp=110.0, real_gdp=100.0,
        published_deflator=110.0, period="Q1FY24",
    )
    assert diag.identity_check_passed is True
    assert diag.flags == []


def test_identity_fails_on_large_mismatch():
    # Implied = 110, published = 105 → 5pp gap > 0.5 threshold
    diag = check_deflator_identity(
        nominal_gdp=110.0, real_gdp=100.0,
        published_deflator=105.0, period="Q2FY24",
    )
    assert diag.identity_check_passed is False
    assert len(diag.flags) >= 1


def test_cpi_divergence_flagged():
    # GDP deflator 115, CPI 108 → 7pp gap > 5pp threshold
    diag = check_deflator_identity(
        nominal_gdp=115.0, real_gdp=100.0,
        published_deflator=115.0, period="Q3FY24",
        cpi=108.0,
    )
    assert any("CPI" in f for f in diag.flags)


def test_small_cpi_gap_not_flagged():
    # GDP deflator 108, CPI 106 → 2pp gap < 5pp — normal, not flagged
    diag = check_deflator_identity(
        nominal_gdp=108.0, real_gdp=100.0,
        published_deflator=108.0, period="Q4FY24",
        cpi=106.0,
    )
    assert not any("CPI" in f for f in diag.flags)


def test_handles_none_inputs():
    diag = check_deflator_identity(
        nominal_gdp=None, real_gdp=None,
        published_deflator=None, period="Q1FY25",
    )
    assert diag.implied_deflator is None
    assert diag.identity_check_passed is None
