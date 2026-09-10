"""Quarantine manager for invalid ingestion records.

Invalid rows are never silently dropped. They are written to a quarantine file
with full context for manual inspection and reprocessing.
"""
from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


class QuarantineManager:
    def __init__(self, quarantine_path: str) -> None:
        self.quarantine_dir = Path(quarantine_path)
        self.quarantine_dir.mkdir(parents=True, exist_ok=True)

    def quarantine(
        self,
        row: dict[str, Any],
        errors: list[dict[str, Any]],
        source_name: str,
        ingestion_run_id: str,
    ) -> str:
        """Write a row to the quarantine directory. Returns the quarantine file path."""
        ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S")
        filename = f"{source_name}_{ts}_{ingestion_run_id[:8]}.jsonl"
        filepath = self.quarantine_dir / filename

        record = {
            "quarantined_at": datetime.now(timezone.utc).isoformat(),
            "ingestion_run_id": ingestion_run_id,
            "source_name": source_name,
            "validation_errors": errors,
            "raw_row": row,
        }

        with open(filepath, "a", encoding="utf-8") as f:
            f.write(json.dumps(record) + "\n")

        return str(filepath)
