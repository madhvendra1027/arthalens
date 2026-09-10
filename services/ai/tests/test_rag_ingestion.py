"""Tests for RAG document ingestion — text splitting and metadata."""
import pytest
from rag.ingestion.indexer import split_text_into_chunks, build_chunk_metadata, DocumentChunk


def _make_long_text(words: int = 1000) -> str:
    return " ".join([f"word{i}" for i in range(words)])


def test_split_produces_chunks():
    text = _make_long_text(500)
    chunks = split_text_into_chunks(text, max_tokens=100, overlap_tokens=10)
    assert len(chunks) > 1


def test_chunks_have_overlap():
    """Last words of chunk N should appear at start of chunk N+1."""
    text = _make_long_text(300)
    chunks = split_text_into_chunks(text, max_tokens=100, overlap_tokens=20)
    if len(chunks) >= 2:
        # Last word of first chunk should appear somewhere in second chunk
        last_word_first = chunks[0].split()[-1]
        second_chunk_words = chunks[1].split()
        assert last_word_first in second_chunk_words


def test_tiny_chunks_filtered():
    chunks = split_text_into_chunks("hi", max_tokens=400)
    assert chunks == []   # single word filtered out


def test_metadata_structure():
    meta = build_chunk_metadata(
        source_id="mospi-nas-2024",
        title="National Accounts Statistics 2024",
        publisher="MoSPI",
        publication_date="2024-01-15",
        source_url="https://mospi.gov.in/nas2024",
        section="Chapter 2",
        page="14",
    )
    assert meta["publisher"] == "MoSPI"
    assert meta["source_id"] == "mospi-nas-2024"
    assert meta["section"] == "Chapter 2"


def test_chunk_content_hash_deterministic():
    c = DocumentChunk(document_id="d1", chunk_index=0, chunk_text="India GDP grew", token_count=3)
    assert c.content_hash == c.content_hash
    c2 = DocumentChunk(document_id="d1", chunk_index=0, chunk_text="India GDP grew", token_count=3)
    assert c.content_hash == c2.content_hash
