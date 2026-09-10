"""Ingestion run lifecycle manager.

Each ingestion execution gets a unique ingestion_run_id (UUID). This ID is
attached to every row written to the database during the run for a full audit trail.
"""
from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any


@dataclass
class IngestionRun:
    """Tracks state for a single ingestion job execution."""

    run_id: uuid.UUID = field(default_factory=uuid.uuid4)
    source_id: str = ""
    source_name: str = ""
    started_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: datetime | None = None
    status: str = "running"  # running | complete | partial | failed
    http_status_code: int | None = None
    content_hash: str | None = None
    retrieval_timestamp: datetime | None = None
    parser_version: str = "1.0"
    rows_fetched: int = 0
    rows_validated: int = 0
    rows_upserted: int = 0
    rows_quarantined: int = 0
    changed_observations: int = 0
    validation_errors: list[dict[str, Any]] = field(default_factory=list)
    error_message: str | None = None

    def complete(self) -> None:
        self.status = "complete"
        self.completed_at = datetime.now(timezone.utc)

    def fail(self, message: str) -> None:
        self.status = "failed"
        self.error_message = message
        self.completed_at = datetime.now(timezone.utc)

    def partial(self, message: str) -> None:
        self.status = "partial"
        self.error_message = message
        self.completed_at = datetime.now(timezone.utc)

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": str(self.run_id),
            "source_id": self.source_id,
            "run_started_at": self.started_at.isoformat(),
            "run_completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "status": self.status,
            "http_status_code": self.http_status_code,
            "content_hash": self.content_hash,
            "retrieval_timestamp": self.retrieval_timestamp.isoformat()
            if self.retrieval_timestamp
            else None,
            "parser_version": self.parser_version,
            "rows_fetched": self.rows_fetched,
            "rows_validated": self.rows_validated,
            "rows_upserted": self.rows_upserted,
            "rows_quarantined": self.rows_quarantined,
            "changed_observations": self.changed_observations,
            "validation_errors": self.validation_errors,
            "error_message": self.error_message,
        }
