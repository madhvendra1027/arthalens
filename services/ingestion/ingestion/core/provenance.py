"""Provenance metadata construction for ingested observations."""
from __future__ import annotations

import hashlib
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any


@dataclass
class Provenance:
    source_id: str
    source_name: str
    source_url: str
    retrieval_timestamp: datetime
    publication_date: str | None = None
    content_hash: str | None = None
    parser_version: str = "1.0"
    ingestion_run_id: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return {
            "source_id": self.source_id,
            "source_name": self.source_name,
            "source_url": self.source_url,
            "retrieval_timestamp": self.retrieval_timestamp.isoformat(),
            "publication_date": self.publication_date,
            "content_hash": self.content_hash,
            "parser_version": self.parser_version,
            "ingestion_run_id": self.ingestion_run_id,
        }


def compute_content_hash(content: bytes) -> str:
    """Compute SHA-256 hash of raw content bytes for deduplication."""
    return hashlib.sha256(content).hexdigest()


def now_utc() -> datetime:
    return datetime.now(timezone.utc)
