# ADR-002: PostgreSQL as Primary Database with pgvector

**Date:** 2026-09-10
**Status:** Accepted

## Context
ArthaLens stores economic time-series data, document chunks for RAG, ML analytics runs,
and audit logs. The AI/RAG pipeline needs vector similarity search for embeddings.

## Decision
Use PostgreSQL 16+ as the single primary database for all services.
Enable the `pgvector` extension for embedding storage and semantic search.
Use Flyway for schema migration management.

## Rationale
- PostgreSQL handles relational (economic series, provenance) and vector (embeddings) in one system
- Reduces operational complexity vs separate vector store (Qdrant/Pinecone) for initial deployment
- pgvector supports HNSW and IVFFlat indexes for production-scale similarity search
- Flyway provides auditable, versioned, rollback-capable migrations
- NUMERIC type preserves precision for monetary/statistical values

## Consequences
- Embedding dimensions must be fixed per model (stored in `embedding_metadata`)
- Large-scale vector workloads may require migration to dedicated vector DB later (Qdrant supported)
- All services share connection pool via backend API; Python services get direct DB access
