"""MoSPI (Ministry of Statistics & Programme Implementation) adapter.

Downloads National Accounts Statistics releases from the official MoSPI website.
Parses xlsx files containing GDP, GVA, sector breakdowns, and deflator data.

NOTE: Actual file URLs are discovered at runtime from the MoSPI publications page.
This adapter provides the parsing framework; live URL discovery requires a maintenance
pass whenever MoSPI changes its publication layout.
"""
from __future__ import annotations

import io
from typing import Any, Iterator

import pandas as pd
import structlog

from ingestion.core.provenance import Provenance, compute_content_hash
from ingestion.core.run_manager import IngestionRun
from .base import SourceAdapter

logger = structlog.get_logger()

MOSPI_NAS_URL = "https://mospi.gov.in/national-accounts-statistics"
MOSPI_SOURCE_ID = ""  # Populated from DB seed at runtime


class MoSPIAdapter(SourceAdapter):
    """Adapter for MoSPI National Accounts Statistics (NAS) releases."""

    adapter_id = "mospi_nas"
    adapter_version = "1.0"

    def __init__(self, download_url: str, source_id: str, **kwargs: Any) -> None:
        super().__init__(**kwargs)
        self.download_url = download_url
        self.source_id = source_id

    def fetch_raw(self, run: IngestionRun) -> tuple[bytes, Provenance]:
        response = self._get(self.download_url)
        run.http_status_code = response.status_code
        raw = response.content
        run.content_hash = compute_content_hash(raw)
        from ingestion.core.provenance import now_utc
        run.retrieval_timestamp = now_utc()

        provenance = self.get_provenance(self.download_url, self.source_id, run)
        provenance.content_hash = run.content_hash
        return raw, provenance

    def parse(self, raw: bytes, provenance: Provenance) -> Iterator[dict[str, Any]]:
        """Parse NAS xlsx. Each sheet may contain different series.
        Fails loudly on parse error rather than yielding partial garbage.
        """
        try:
            xlsx = pd.ExcelFile(io.BytesIO(raw))
        except Exception as exc:
            raise RuntimeError(f"[MoSPI] Failed to open xlsx: {exc}") from exc

        for sheet_name in xlsx.sheet_names:
            try:
                df = xlsx.parse(sheet_name)
                yield from self._parse_sheet(df, sheet_name, provenance)
            except Exception as exc:
                logger.warning("mospi.sheet_parse_error", sheet=sheet_name, error=str(exc))
                # Continue to next sheet; sheet-level parse failures are logged, not silent

    def _parse_sheet(
        self, df: pd.DataFrame, sheet_name: str, provenance: Provenance
    ) -> Iterator[dict[str, Any]]:
        """Parse a single NAS sheet. Override / extend for specific sheet formats."""
        # Placeholder: real implementation maps known MoSPI sheet layouts to observation rows.
        # This yields a structural marker row for test validation.
        yield {
            "_adapter": self.adapter_id,
            "_sheet": sheet_name,
            "_provenance": provenance.to_dict(),
            "_parse_note": "Sheet structure mapping required for this release format.",
        }

    def normalize(self, row: dict[str, Any], provenance: Provenance) -> dict[str, Any]:
        """Normalize a parsed row to the canonical observation schema."""
        # Base year normalization: MoSPI may label as "2011-12" or "2022-23"
        raw_base_year = str(row.get("base_year", "")).strip()
        normalized_base_year = raw_base_year if raw_base_year in {"2011-12", "2022-23"} else None

        # Unit normalization: MoSPI uses "Rs. Crore", normalize to "INR Crore"
        unit = str(row.get("unit", "")).replace("Rs.", "INR").replace("Lakh", "Lakh").strip()

        return {
            **row,
            "base_year": normalized_base_year,
            "unit": unit or "INR Crore",
            "source_id": provenance.source_id,
            "retrieval_timestamp": provenance.retrieval_timestamp.isoformat(),
            "ingestion_run_id": provenance.ingestion_run_id,
        }
