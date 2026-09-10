"""RBI (Reserve Bank of India) DBIE adapter.

Fetches CPI, WPI, monetary, and trade data from the RBI Database on Indian Economy.
"""
from __future__ import annotations

from typing import Any, Iterator

import structlog

from ingestion.core.provenance import Provenance, compute_content_hash
from ingestion.core.run_manager import IngestionRun
from .base import SourceAdapter

logger = structlog.get_logger()

RBI_DBIE_BASE = "https://dbie.rbi.org.in/DBIE/dbie.rbi"


class RBIAdapter(SourceAdapter):
    """Adapter for RBI Database on Indian Economy (DBIE)."""

    adapter_id = "rbi_dbie"
    adapter_version = "1.0"

    def __init__(self, endpoint_url: str, source_id: str, **kwargs: Any) -> None:
        super().__init__(**kwargs)
        self.endpoint_url = endpoint_url
        self.source_id = source_id

    def fetch_raw(self, run: IngestionRun) -> tuple[bytes, Provenance]:
        response = self._get(self.endpoint_url)
        run.http_status_code = response.status_code
        raw = response.content
        run.content_hash = compute_content_hash(raw)
        from ingestion.core.provenance import now_utc
        run.retrieval_timestamp = now_utc()
        provenance = self.get_provenance(self.endpoint_url, self.source_id, run)
        provenance.content_hash = run.content_hash
        return raw, provenance

    def parse(self, raw: bytes, provenance: Provenance) -> Iterator[dict[str, Any]]:
        """Parse RBI DBIE response (JSON or CSV depending on endpoint)."""
        try:
            import json
            data = json.loads(raw)
            if isinstance(data, list):
                for item in data:
                    yield {**item, "_adapter": self.adapter_id, "_provenance": provenance.to_dict()}
            elif isinstance(data, dict) and "data" in data:
                for item in data["data"]:
                    yield {**item, "_adapter": self.adapter_id, "_provenance": provenance.to_dict()}
        except Exception as exc:
            raise RuntimeError(f"[RBI] Failed to parse response: {exc}") from exc

    def normalize(self, row: dict[str, Any], provenance: Provenance) -> dict[str, Any]:
        return {
            **row,
            "source_id": provenance.source_id,
            "retrieval_timestamp": provenance.retrieval_timestamp.isoformat(),
            "ingestion_run_id": provenance.ingestion_run_id,
        }
