# ADR-004: Strict GDP Series Isolation (2011-12 vs 2022-23 Base Year)

**Date:** 2026-09-10
**Status:** Accepted

## Context
India's National Accounts Statistics use two active base-year series:
- **2011-12 base year** (old series, historical data)
- **2022-23 base year** (new series, current MoSPI standard)

Silently mixing these series produces incorrect growth rates and comparisons.

## Decision
Every economic observation carries a mandatory `base_year_id` FK and `methodology_version_id` FK.
The database enforces a composite unique constraint per (series, period, base_year, methodology_version).
The backend API rejects requests that mix base years without an explicit `allow_mixed_series=true`
query parameter, which triggers a visible warning in the API response and the UI.

## Rationale
- Prevents silent statistical errors that would mislead users
- Aligns with MoSPI practice — the two series are not directly chain-linked at all points
- Forces frontend to display base-year metadata next to every metric

## Consequences
- Queries filtering by period alone are rejected if base year is ambiguous
- UI must always display the active base year next to GDP figures
- Cross-series charts require explicit user opt-in and a visible disclaimer
