# ArthaLens — Architecture Overview

## System Components

```
                        ┌─────────────────────────────────┐
                        │         Browser / Client         │
                        │     Next.js 15 App Router         │
                        │  (ECharts · shadcn/ui · TanStack) │
                        └──────────────┬──────────────────┘
                                       │ HTTP/REST
                          ┌────────────▼────────────┐
                          │   Spring Boot 3 API      │
                          │   Java 24 · /api/v1/     │
                          │   Flyway · springdoc     │
                          └──┬───────┬───────┬──────┘
                             │       │       │
              ┌──────────────▼─┐  ┌──▼──┐  ┌▼──────────────┐
              │ AI/RAG Service │  │ ML  │  │  Ingestion     │
              │ Python FastAPI │  │ Svc │  │  Python jobs   │
              │ Port 8001      │  │8002 │  │  (scheduled)   │
              └──────┬─────────┘  └──┬──┘  └──────┬─────────┘
                     │               │              │
                     └───────────────▼──────────────┘
                               PostgreSQL 16+
                         (pgvector · uuid-ossp · pgcrypto)
```

## Data Flow

### Ingestion Flow
```
Official Source (MoSPI/RBI/PIB)
  → fetch + archive raw
  → parse (xlsx/pdf/json)
  → normalize (units, periods, base years)
  → validate (schema, ranges, provenance)
  → reconcile (cross-check totals)
  → upsert (idempotent, preserves history)
  → record provenance (ingestion_run_id, hash, timestamp)
  → emit metrics
```

### RAG Query Flow
```
User query (via frontend /ai page)
  → POST /api/v1/ai/query (backend orchestrator)
  → POST /ai/v1/query (AI service)
  → query classification
  → hybrid retrieval (pgvector semantic + PostgreSQL FTS lexical)
  → reranking
  → context assembly
  → LLM generation (provider-agnostic)
  → citation mapping
  → grounding validation
  → streaming response to frontend
```

## Series Isolation

GDP base-year series are treated as incompatible by default:
- Every observation carries `base_year_id` (2011-12 or 2022-23)
- Cross-series comparison requires explicit `allow_mixed_series=true`
- UI always displays base year next to official GDP figures

## Security Boundaries

- Secrets only via environment variables
- Backend proxies AI queries — API keys never exposed to browser
- RAG pipeline has prompt-injection defenses on retrieved document content
- SSRF protections on any URL fields
- Admin/mutation endpoints are role-gated (JWT-ready, disabled by default)

## Performance Considerations

- TanStack Query for client-side caching and background refetching
- PostgreSQL materialized views for heavy analytical aggregations (justified by usage)
- HNSW index on embedding vectors for sub-10ms ANN search
- Streaming SSE for long AI responses (no timeout on frontend)
- Skeleton loaders prevent layout jumps during data fetch
