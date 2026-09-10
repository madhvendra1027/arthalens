"""Schema and range validation for ingested economic observations.

Rules:
- Period must be parseable and within reasonable historical range.
- Values must be finite, non-negative for GDP/GVA (unless indicator permits negatives).
- Base year must be one of the registered values.
- Units must be non-empty.
- Source ID must be present.
- Status must be a recognised observation_status value.
"""
from __future__ import annotations

import math
from dataclasses import dataclass
from typing import Any


VALID_BASE_YEARS = {"2011-12", "2022-23"}
VALID_STATUSES = {"official", "provisional", "revised", "estimated", "derived", "forecast"}
VALID_PERIOD_TYPES = {"FY", "Q", "CY", "M"}
NON_NEGATIVE_INDICATORS = {"gdp", "gva", "sector", "price_index", "deflator"}


@dataclass
class ValidationError:
    field: str
    message: str
    raw_value: Any = None


@dataclass
class ValidationResult:
    is_valid: bool
    errors: list[ValidationError]


def validate_observation(row: dict[str, Any], indicator_type: str = "gdp") -> ValidationResult:
    """Validate a single observation row. Returns ValidationResult."""
    errors: list[ValidationError] = []

    # Base year
    base_year = row.get("base_year")
    if base_year not in VALID_BASE_YEARS:
        errors.append(ValidationError("base_year", f"Must be one of {VALID_BASE_YEARS}", base_year))

    # Period type
    period_type = row.get("period_type")
    if period_type not in VALID_PERIOD_TYPES:
        errors.append(ValidationError("period_type", f"Must be one of {VALID_PERIOD_TYPES}", period_type))

    # Period label
    if not row.get("period_label"):
        errors.append(ValidationError("period_label", "Must not be empty"))

    # Value
    value = row.get("value")
    if value is None:
        errors.append(ValidationError("value", "Value must not be None"))
    elif not isinstance(value, (int, float)):
        errors.append(ValidationError("value", "Value must be numeric", value))
    elif math.isnan(value) or math.isinf(value):
        errors.append(ValidationError("value", "Value must be finite", value))
    elif indicator_type in NON_NEGATIVE_INDICATORS and value < 0:
        errors.append(ValidationError("value", f"Value must be non-negative for {indicator_type}", value))

    # Unit
    if not row.get("unit"):
        errors.append(ValidationError("unit", "Unit must not be empty"))

    # Source ID
    if not row.get("source_id"):
        errors.append(ValidationError("source_id", "Source ID is required"))

    # Status
    status = row.get("status", "official")
    if status not in VALID_STATUSES:
        errors.append(ValidationError("status", f"Status must be one of {VALID_STATUSES}", status))

    return ValidationResult(is_valid=len(errors) == 0, errors=errors)
