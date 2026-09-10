"""Shared pytest fixtures for ingestion tests."""
import pytest
from unittest.mock import MagicMock
from ingestion.core.run_manager import IngestionRun


@pytest.fixture
def mock_run() -> IngestionRun:
    run = IngestionRun(source_name="test_source", source_id="test-uuid")
    return run


@pytest.fixture
def mock_db_upsert():
    return MagicMock(return_value=True)
