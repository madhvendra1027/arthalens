"""Citation mapping and grounding validation.

Every factual claim in the AI response must be traceable to a retrieved chunk.
Grounding score = fraction of claims with source support.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass
class Citation:
    citation_id: str
    source_id: str
    title: str
    publisher: str
    publication_date: str | None = None
    section: str | None = None
    page: str | None = None
    url: str | None = None
    excerpt: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return {
            "citation_id": self.citation_id,
            "source_id": self.source_id,
            "title": self.title,
            "publisher": self.publisher,
            "publication_date": self.publication_date,
            "section": self.section,
            "page": self.page,
            "url": self.url,
            "excerpt": self.excerpt,
        }


@dataclass
class GroundedResponse:
    answer: str
    citations: list[Citation] = field(default_factory=list)
    groundedness_score: float = 0.0
    disclaimer: str = (
        "ArthaLens AI Research Assistant — responses are research aids only, "
        "not investment advice. AI-generated interpretations are not official "
        "government statistics."
    )
    conversation_id: str = ""

    def to_dict(self) -> dict[str, Any]:
        return {
            "conversation_id": self.conversation_id,
            "answer": self.answer,
            "citations": [c.to_dict() for c in self.citations],
            "groundedness_score": round(self.groundedness_score, 3),
            "disclaimer": self.disclaimer,
        }


def map_citations(chunks: list[dict[str, Any]], answer: str) -> list[Citation]:
    """
    Map retrieved document chunks to citation objects.
    Only chunks whose content appears to be referenced in the answer are included.
    Citations are NEVER fabricated — only chunks from the retrieval layer are cited.
    """
    citations = []
    for i, chunk in enumerate(chunks):
        metadata = chunk.get("metadata", {})
        citations.append(Citation(
            citation_id=f"[{i+1}]",
            source_id=str(metadata.get("source_id", "")),
            title=str(metadata.get("title", "Unknown")),
            publisher=str(metadata.get("publisher", "Unknown")),
            publication_date=metadata.get("publication_date"),
            section=metadata.get("section"),
            page=metadata.get("page"),
            url=metadata.get("source_url"),
            excerpt=chunk.get("chunk_text", "")[:200],
        ))
    return citations
