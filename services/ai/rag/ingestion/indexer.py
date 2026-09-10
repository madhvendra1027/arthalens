"""
RAG Document Ingestion Pipeline.

Indexes official documents (PDF/HTML) into the PostgreSQL pgvector store for retrieval.

Pipeline:
  1. Fetch document from approved official source (SSRF-protected)
  2. Extract text (PDF → text, HTML → markdown)
  3. Split into chunks (token-aware, with overlap)
  4. Embed each chunk via configured embedding provider
  5. Upsert to document_chunks table with full provenance metadata

Requires: PostgreSQL with pgvector extension enabled (Flyway V8 migration).
"""
from __future__ import annotations

import hashlib
import re
from dataclasses import dataclass, field
from typing import Any


@dataclass
class DocumentChunk:
    document_id: str
    chunk_index: int
    chunk_text: str
    token_count: int
    embedding: list[float] | None = None
    metadata: dict[str, Any] = field(default_factory=dict)

    @property
    def content_hash(self) -> str:
        return hashlib.sha256(self.chunk_text.encode()).hexdigest()


def split_text_into_chunks(
    text: str,
    max_tokens: int = 400,
    overlap_tokens: int = 50,
) -> list[str]:
    """
    Split text into overlapping chunks by approximate token count.
    Uses word-boundary splits — not exact tokenization, which requires the
    actual embedding model tokenizer.

    For production: replace with tiktoken.encode() for the active embedding model.
    """
    # Normalize whitespace
    text = re.sub(r"\s+", " ", text).strip()
    words = text.split(" ")

    # ~0.75 words per token is a rough approximation
    words_per_chunk = max(1, int(max_tokens * 0.75))
    overlap_words = int(overlap_tokens * 0.75)

    chunks: list[str] = []
    i = 0
    while i < len(words):
        chunk_words = words[i : i + words_per_chunk]
        chunks.append(" ".join(chunk_words))
        i += words_per_chunk - overlap_words

    return [c for c in chunks if len(c.split()) > 5]  # drop tiny trailing chunks


def build_chunk_metadata(
    source_id: str,
    title: str,
    publisher: str,
    publication_date: str | None,
    source_url: str,
    section: str | None = None,
    page: str | None = None,
) -> dict[str, Any]:
    """Build provenance metadata for a document chunk."""
    return {
        "source_id": source_id,
        "title": title,
        "publisher": publisher,
        "publication_date": publication_date,
        "source_url": source_url,
        "section": section,
        "page": page,
    }


class DocumentIndexer:
    """
    Orchestrates embedding and storage of document chunks.

    Requires an embedding provider (EmbeddingProvider) and a database connection.
    Both are injected at construction — the class itself does not hold secrets.
    """

    def __init__(self, embedding_provider: Any, db_conn: Any) -> None:
        self.embed = embedding_provider
        self.db = db_conn

    async def index_document(
        self,
        text: str,
        metadata: dict[str, Any],
        document_id: str,
    ) -> int:
        """
        Index a document into the vector store.

        Returns
        -------
        Number of chunks indexed.
        """
        raw_chunks = split_text_into_chunks(text)
        chunks = [
            DocumentChunk(
                document_id=document_id,
                chunk_index=i,
                chunk_text=c,
                token_count=len(c.split()),   # approximation
                metadata=metadata,
            )
            for i, c in enumerate(raw_chunks)
        ]

        # Embed all chunks
        texts = [c.chunk_text for c in chunks]
        embeddings = await self.embed.embed(texts)

        for chunk, emb in zip(chunks, embeddings):
            chunk.embedding = emb

        # Upsert to DB (requires pgvector)
        # Production: INSERT ... ON CONFLICT DO UPDATE using content_hash
        # Stub here since we don'\''t have a live DB in tests
        if self.db is not None:
            for chunk in chunks:
                await self._upsert_chunk(chunk)

        return len(chunks)

    async def _upsert_chunk(self, chunk: DocumentChunk) -> None:
        """Upsert a single chunk. Uses content_hash for deduplication."""
        # Placeholder — actual implementation uses asyncpg or psycopg3
        pass
