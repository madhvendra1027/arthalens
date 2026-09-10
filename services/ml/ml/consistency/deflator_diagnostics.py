"""
Deflator Diagnostics — nominal/real identity checks and cross-index divergence.

Checks:
1. Arithmetic identity: Deflator = (Nominal GDP / Real GDP) × 100
   Flags if the implied deflator diverges from the published deflator.
2. Divergence between GDP Deflator, CPI, and WPI with explanatory notes.
3. Large divergence flags for human review (NOT a claim of error).

All flags are for analytical review. GDP Deflator, CPI, and WPI measure
different price baskets and SHOULD diverge — divergence is only flagged
when unexpectedly large by historical standards.
"""
from __future__ import annotations

from dataclasses import dataclass


@dataclass
class DeflatorDiagnostic:
    period: str
    nominal_gdp: float | None
    real_gdp: float | None
    published_deflator: float | None
    implied_deflator: float | None
    identity_residual: float | None       # published - implied (should be ~0)
    identity_check_passed: bool | None
    cpi: float | None
    wpi: float | None
    gdp_vs_cpi_gap: float | None
    gdp_vs_wpi_gap: float | None
    flags: list[str]
    note: str = (
        "CPI, WPI, and GDP Deflator measure different baskets. "
        "Divergence is expected and normal. Large gaps are flagged for review, "
        "not declared incorrect."
    )


IDENTITY_TOLERANCE = 0.5    # percentage points — tighter than CPI/WPI gap
DIVERGENCE_THRESHOLD = 5.0  # percentage points for cross-index gap flag


def check_deflator_identity(
    nominal_gdp: float | None,
    real_gdp: float | None,
    published_deflator: float | None,
    period: str = "",
    cpi: float | None = None,
    wpi: float | None = None,
) -> DeflatorDiagnostic:
    """
    Check the arithmetic identity: Deflator = Nominal / Real × 100.
    Flags large discrepancies for human review.
    """
    flags: list[str] = []

    # Compute implied deflator
    implied_deflator: float | None = None
    identity_residual: float | None = None
    identity_ok: bool | None = None

    if nominal_gdp is not None and real_gdp is not None and real_gdp != 0:
        implied_deflator = (nominal_gdp / real_gdp) * 100
        if published_deflator is not None:
            identity_residual = abs(published_deflator - implied_deflator)
            identity_ok = identity_residual < IDENTITY_TOLERANCE
            if not identity_ok:
                flags.append(
                    f"Deflator identity mismatch: published={published_deflator:.2f}, "
                    f"implied={implied_deflator:.2f}, gap={identity_residual:.2f}pp. "
                    "Warrants investigation."
                )

    # Cross-index divergence
    gdp_vs_cpi: float | None = None
    gdp_vs_wpi: float | None = None
    if published_deflator is not None and cpi is not None:
        gdp_vs_cpi = published_deflator - cpi
        if abs(gdp_vs_cpi) > DIVERGENCE_THRESHOLD:
            flags.append(
                f"Large GDP Deflator vs CPI gap: {gdp_vs_cpi:+.1f}pp for {period}. "
                "Note: different baskets — divergence is often explained by tradeable vs non-tradeable goods mix."
            )
    if published_deflator is not None and wpi is not None:
        gdp_vs_wpi = published_deflator - wpi
        if abs(gdp_vs_wpi) > DIVERGENCE_THRESHOLD:
            flags.append(
                f"Large GDP Deflator vs WPI gap: {gdp_vs_wpi:+.1f}pp for {period}."
            )

    return DeflatorDiagnostic(
        period=period,
        nominal_gdp=nominal_gdp,
        real_gdp=real_gdp,
        published_deflator=published_deflator,
        implied_deflator=round(implied_deflator, 4) if implied_deflator else None,
        identity_residual=round(identity_residual, 4) if identity_residual else None,
        identity_check_passed=identity_ok,
        cpi=cpi,
        wpi=wpi,
        gdp_vs_cpi_gap=round(gdp_vs_cpi, 4) if gdp_vs_cpi is not None else None,
        gdp_vs_wpi_gap=round(gdp_vs_wpi, 4) if gdp_vs_wpi is not None else None,
        flags=flags,
    )
