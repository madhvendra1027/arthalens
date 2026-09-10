"""Tests for provenance utilities."""
from ingestion.core.provenance import compute_content_hash


def test_content_hash_is_sha256():
    content = b"test content"
    h = compute_content_hash(content)
    assert len(h) == 64  # SHA-256 hex digest
    assert all(c in "0123456789abcdef" for c in h)


def test_content_hash_deterministic():
    content = b"same content"
    assert compute_content_hash(content) == compute_content_hash(content)


def test_content_hash_different_for_different_content():
    assert compute_content_hash(b"a") != compute_content_hash(b"b")
