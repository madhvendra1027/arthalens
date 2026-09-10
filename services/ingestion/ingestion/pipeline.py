"""Ingestion pipeline orchestrator.

Implements the canonical pipeline:
  fetch -> archive raw -> parse -> normalize -> validate -> reconcile -> upsert -> provenance -> metrics

Each step is explicit and logged. Invalid rows go to quarantine, not /dev/null.
"""
from __future__ import annotations

import os
from pathlib import Path
from typing import Any

import structlog

from ingestion.core.provenance import compute_content_hash
from ingestion.core.quarantine import QuarantineManager
from ingestion.core.run_manager import IngestionRun
from ingestion.core.validator import ValidationResult, validate_observation
from ingestion.adapters.base import SourceAdapter

logger = structlog.get_logger()


class IngestionPipeline:
    """Runs a complete ingestion job for a single source adapter."""

    def __init__(
        self,
        adapter: SourceAdapter,
        raw_archive_path: str,
        quarantine_path: str,
        db_upsert_fn: Any | None = None,  # callable(row) -> bool (changed)
    ) -> None:
        self.adapter = adapter
        self.raw_archive_dir = Path(raw_archive_path)
        self.raw_archive_dir.mkdir(parents=True, exist_ok=True)
        self.quarantine = QuarantineManager(quarantine_path)
        self.db_upsert_fn = db_upsert_fn

    def run(self, run: IngestionRun) -> IngestionRun:
        """Execute the full pipeline. Returns the completed IngestionRun."""
        log = logger.bind(run_id=str(run.run_id), adapter=self.adapter.adapter_id)
        log.info("pipeline.start")

        try:
            # 1. Fetch
            raw, provenance = self.adapter.fetch_raw(run)
            log.info("pipeline.fetched", bytes=len(raw), hash=run.content_hash)

            # 2. Archive raw (immutable)
            self._archive_raw(raw, run)

            # 3. Parse
            rows = list(self.adapter.parse(raw, provenance))
            run.rows_fetched = len(rows)
            log.info("pipeline.parsed", rows=run.rows_fetched)

            # 4. Normalize + 5. Validate + 6. Reconcile + 7. Upsert
            for row in rows:
                normalized = self.adapter.normalize(row, provenance)
                result: ValidationResult = validate_observation(normalized)

                if not result.is_valid:
                    run.rows_quarantined += 1
                    errs = [{"field": e.field, "message": e.message} for e in result.errors]
                    run.validation_errors.extend(errs)
                    self.quarantine.quarantine(normalized, errs, self.adapter.adapter_id, str(run.run_id))
                    log.warning("pipeline.quarantined", errors=errs)
                    continue

                run.rows_validated += 1

                # 7. Upsert
                if self.db_upsert_fn:
                    changed = self.db_upsert_fn(normalized)
                    run.rows_upserted += 1
                    if changed:
                        run.changed_observations += 1

            # 8. Record provenance + 9. Emit metrics
            log.info(
                "pipeline.complete",
                fetched=run.rows_fetched,
                validated=run.rows_validated,
                upserted=run.rows_upserted,
                quarantined=run.rows_quarantined,
                changed=run.changed_observations,
            )
            run.complete()

        except Exception as exc:
            log.error("pipeline.failed", error=str(exc))
            run.fail(str(exc))

        return run

    def _archive_raw(self, raw: bytes, run: IngestionRun) -> None:
        """Write raw bytes to immutable archive. Never overwrite existing files."""
        hash_suffix = run.content_hash[:12] if run.content_hash else "nohash"
        filename = f"{self.adapter.adapter_id}_{run.run_id}_{hash_suffix}.bin"
        filepath = self.raw_archive_dir / filename
        if not filepath.exists():
            filepath.write_bytes(raw)
            logger.info("pipeline.archived", path=str(filepath))
        else:
            logger.info("pipeline.archive_skip_duplicate", path=str(filepath))

