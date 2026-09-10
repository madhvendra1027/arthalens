"""PIB (Press Information Bureau) adapter.

Downloads and archives Government of India press releases.
Used primarily to index official rating announcements and fiscal policy statements.
"""
from __future__ import annotations

from typing import Any, Iterator

import structlog

from ingestion.core.provenance import Provenance, compute_content_hash
from ingestion.core.run_manager import IngestionRun
from .base import SourceAdapter

logger = structlog.get_logger()


class PIBAdapter(SourceAdapter):
    """Adapter for PIB press releases."""

    adapter_id = "pib_releases"
    adapter_version = "1.0"

    def __init__(self, source_id: str, **kwargs: Any) -> None:
        super().__init__(**kwargs)
        self.source_id = source_id
        self.base_url = "https://pib.gov.in/allRel.aspx"

    def fetch_raw(self, run: IngestionRun) -> tuple[bytes, Provenance]:
        response = self._get(self.base_url)
        run.http_status_code = response.status_code
        raw = response.content
        run.content_hash = compute_content_hash(raw)
        from ingestion.core.provenance import now_utc
        run.retrieval_timestamp = now_utc()
        provenance = self.get_provenance(self.base_url, self.source_id, run)
        provenance.content_hash = run.content_hash
        return raw, provenance

    def parse(self, raw: bytes, provenance: Provenance) -> Iterator[dict[str, Any]]:
        """Parse PIB HTML listing to extract release links and metadata."""
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(raw, "html.parser")
        for link in soup.find_all("a", href=True):
            href = link.get("href", "")
            if "prid=" in href or "/PressReleasePage.aspx" in href:
                yield {
                    "_adapter": self.adapter_id,
                    "title": link.get_text(strip=True),
                    "url": f"https://pib.gov.in{href}" if href.startswith("/") else href,
                    "_provenance": provenance.to_dict(),
                }

    def normalize(self, row: dict[str, Any], provenance: Provenance) -> dict[str, Any]:
        return {
            **row,
            "source_id": provenance.source_id,
            "retrieval_timestamp": provenance.retrieval_timestamp.isoformat(),
            "ingestion_run_id": provenance.ingestion_run_id,
        }
