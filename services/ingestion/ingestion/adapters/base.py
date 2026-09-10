"""Abstract base class for all source adapters.

Each publisher (MoSPI, RBI, PIB) has its own adapter implementing this interface.
A broken adapter does not affect other adapters.
"""
from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Iterator

import httpx
import structlog
from tenacity import retry, stop_after_attempt, wait_exponential

from ingestion.core.provenance import Provenance, compute_content_hash, now_utc
from ingestion.core.run_manager import IngestionRun

logger = structlog.get_logger()


class SourceAdapter(ABC):
    """Base class for all data source adapters."""

    adapter_id: str = ""
    adapter_version: str = "1.0"

    def __init__(self, http_client: httpx.Client | None = None) -> None:
        self._client = http_client or httpx.Client(timeout=30)

    @abstractmethod
    def fetch_raw(self, run: IngestionRun) -> tuple[bytes, Provenance]:
        """Download the raw artifact from the source.
        Returns (raw_bytes, Provenance). Must set run.content_hash and run.retrieval_timestamp.
        Raises on unrecoverable errors.
        """
        ...

    @abstractmethod
    def parse(self, raw: bytes, provenance: Provenance) -> Iterator[dict[str, Any]]:
        """Parse raw bytes into an iterator of observation dicts.
        Never silently skip rows — yield them even if partially parsed, mark status.
        Reject documents with failed parsing via exception rather than yielding garbage.
        """
        ...

    @abstractmethod
    def normalize(self, row: dict[str, Any], provenance: Provenance) -> dict[str, Any]:
        """Normalize units, period labels, base years, and status fields to canonical forms."""
        ...

    def get_provenance(self, url: str, source_id: str, run: IngestionRun) -> Provenance:
        return Provenance(
            source_id=source_id,
            source_name=self.adapter_id,
            source_url=url,
            retrieval_timestamp=now_utc(),
            ingestion_run_id=str(run.run_id),
            parser_version=self.adapter_version,
        )

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=2, min=4, max=30))
    def _get(self, url: str, **kwargs: Any) -> httpx.Response:
        """HTTP GET with retry / backoff."""
        logger.info("http.get", url=url)
        response = self._client.get(url, **kwargs)
        response.raise_for_status()
        return response
