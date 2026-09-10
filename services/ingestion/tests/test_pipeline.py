"""Tests for the ingestion pipeline with mocked adapters."""
import pytest
from unittest.mock import MagicMock, patch
from ingestion.pipeline import IngestionPipeline
from ingestion.core.run_manager import IngestionRun
from ingestion.core.provenance import Provenance, now_utc


def make_mock_adapter(rows):
    """Create a mock adapter that returns the given rows."""
    adapter = MagicMock()
    adapter.adapter_id = "test_adapter"
    adapter.adapter_version = "1.0"

    provenance = Provenance(
        source_id="test-uuid",
        source_name="test_adapter",
        source_url="https://example.com",
        retrieval_timestamp=now_utc(),
        ingestion_run_id="test-run-id",
    )
    adapter.fetch_raw.return_value = (b"raw content", provenance)
    adapter.parse.return_value = iter(rows)
    adapter.normalize.side_effect = lambda row, prov: {**row, "source_id": "test-uuid"}
    return adapter, provenance


VALID_ROW = {
    "base_year": "2022-23",
    "period_type": "FY",
    "period_label": "2023-24",
    "value": 295355000.0,
    "unit": "INR Crore",
    "source_id": "test-uuid",
    "status": "official",
}


def test_pipeline_runs_valid_row(tmp_path):
    adapter, _ = make_mock_adapter([VALID_ROW])
    db_upsert = MagicMock(return_value=True)

    pipeline = IngestionPipeline(
        adapter=adapter,
        raw_archive_path=str(tmp_path / "archive"),
        quarantine_path=str(tmp_path / "quarantine"),
        db_upsert_fn=db_upsert,
    )

    run = IngestionRun(source_id="test-uuid", source_name="test")
    result = pipeline.run(run)

    assert result.status == "complete"
    assert result.rows_fetched == 1
    assert result.rows_validated == 1
    assert result.rows_upserted == 1
    assert result.rows_quarantined == 0


def test_pipeline_quarantines_invalid_row(tmp_path):
    invalid_row = {**VALID_ROW, "base_year": "1990-91"}  # invalid base year
    adapter, _ = make_mock_adapter([invalid_row])

    pipeline = IngestionPipeline(
        adapter=adapter,
        raw_archive_path=str(tmp_path / "archive"),
        quarantine_path=str(tmp_path / "quarantine"),
    )

    run = IngestionRun(source_id="test-uuid", source_name="test")
    result = pipeline.run(run)

    assert result.rows_quarantined == 1
    assert result.rows_upserted == 0
    assert len(list((tmp_path / "quarantine").glob("*.jsonl"))) == 1
