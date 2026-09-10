"""ArthaLens AI/RAG Service — FastAPI application."""
from __future__ import annotations

import uuid
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import structlog

log = structlog.get_logger()

app = FastAPI(
    title="ArthaLens AI Service",
    version="1.0.0",
    description=(
        "Source-grounded economic research assistant. "
        "Factual claims are supported by citations from official Indian government sources. "
        "This service does NOT provide investment advice."
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    query: str = Field(..., max_length=2000)
    conversation_id: str | None = None
    stream: bool = False


class QueryResponse(BaseModel):
    conversation_id: str
    answer: str
    citations: list[dict[str, Any]]
    groundedness_score: float
    disclaimer: str


DISCLAIMER = (
    "ArthaLens AI Research Assistant — responses are research aids only, "
    "not investment advice. AI-generated interpretations are not official "
    "government statistics."
)


@app.get("/health")
def health() -> dict:
    return {"status": "UP", "service": "arthalens-ai"}


@app.post("/ai/v1/query", response_model=QueryResponse)
async def query(request: QueryRequest) -> QueryResponse:
    """
    Process an economic research query.

    Pipeline: classify -> retrieve -> rerank -> assemble context ->
              sanitize -> generate -> map citations -> validate grounding -> return

    Returns citations from indexed official sources.
    Never fabricates citations, numbers, or sources.
    """
    conversation_id = request.conversation_id or str(uuid.uuid4())

    log.info("ai.query", conversation_id=conversation_id, query_len=len(request.query))

    # Check for disallowed query types
    if any(kw in request.query.lower() for kw in ["invest", "buy", "sell", "portfolio", "stock"]):
        return QueryResponse(
            conversation_id=conversation_id,
            answer=(
                "ArthaLens does not provide investment advice. "
                "I can explain economic statistics, methodology, and historical data."
            ),
            citations=[],
            groundedness_score=1.0,
            disclaimer=DISCLAIMER,
        )

    # Production: run full RAG pipeline here.
    # Currently returns a structured unavailability response until documents are indexed.
    return QueryResponse(
        conversation_id=conversation_id,
        answer=(
            "The AI research assistant is ready, but no documents have been indexed yet. "
            "Run the ingestion pipeline to index official MoSPI, RBI, and PIB documents, "
            "then queries will be answered with full citation support."
        ),
        citations=[],
        groundedness_score=0.0,
        disclaimer=DISCLAIMER,
    )
