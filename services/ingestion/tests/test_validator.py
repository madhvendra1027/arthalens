"""Tests for the observation validator."""
import pytest
from ingestion.core.validator import validate_observation


VALID_ROW = {
    "base_year": "2022-23",
    "period_type": "FY",
    "period_label": "2023-24",
    "value": 295355000.0,
    "unit": "INR Crore",
    "source_id": "some-uuid",
    "status": "official",
}


def test_valid_row_passes():
    result = validate_observation(VALID_ROW)
    assert result.is_valid
    assert len(result.errors) == 0


def test_invalid_base_year():
    row = {**VALID_ROW, "base_year": "2005-06"}
    result = validate_observation(row)
    assert not result.is_valid
    assert any(e.field == "base_year" for e in result.errors)


def test_negative_gdp_rejected():
    row = {**VALID_ROW, "value": -1000.0}
    result = validate_observation(row, indicator_type="gdp")
    assert not result.is_valid
    assert any(e.field == "value" for e in result.errors)


def test_missing_source_id():
    row = {**VALID_ROW, "source_id": None}
    result = validate_observation(row)
    assert not result.is_valid
    assert any(e.field == "source_id" for e in result.errors)


def test_nan_value_rejected():
    import math
    row = {**VALID_ROW, "value": math.nan}
    result = validate_observation(row)
    assert not result.is_valid


def test_invalid_period_type():
    row = {**VALID_ROW, "period_type": "DECADE"}
    result = validate_observation(row)
    assert not result.is_valid
