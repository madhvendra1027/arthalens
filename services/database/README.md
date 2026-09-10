# services/database — Schema & Migrations

This directory contains the single source of truth for ArthaLens PostgreSQL schema.

## Migration Files

Managed by **Flyway**. Migrations run automatically when the Spring Boot backend starts,
or can be run manually (see root README).

| Version | File | Description |
|---------|------|-------------|
| V1 | `V1__init_extensions.sql` | uuid-ossp, pgcrypto, pgvector, pg_trgm |
| V2 | `V2__sources.sql` | Source registry, source_documents |
| V3 | `V3__economic_series.sql` | Base years, methodology versions, economic series |
| V4 | `V4__observations.sql` | economic_observations, gdp_observations, gva_observations, sector_observations |
| V5 | `V5__price_indices.sql` | price_indices, deflator_observations |
| V6 | `V6__revisions.sql` | revisions, revision_events |
| V7 | `V7__ratings.sql` | sovereign_ratings, rating_events |
| V8 | `V8__documents.sql` | documents, document_chunks, embedding_metadata (pgvector) |
| V9 | `V9__analytics.sql` | analytics_runs, derived_metrics |
| V10 | `V10__ingestion.sql` | ingestion_runs, ingestion_errors |
| V11 | `V11__audit.sql` | api_audit_events |

## Seeds

Seeds are in `seeds/` and contain **metadata only** — no fabricated economic observations.

- `seed_sources.sql` — source registry entries (MoSPI, RBI, PIB, rating agencies)
- `seed_methodology.sql` — base year (2011-12, 2022-23) and methodology version records

## Key Design Principles

- Every economic observation carries `base_year_id` + `methodology_version_id` — never mix series silently
- Composite unique constraints prevent duplicate observations
- `observation_status` ENUM: official | provisional | revised | estimated | derived | forecast
- All monetary values in INR Crore; `NUMERIC` type for precision
- `ingestion_run_id` on every observation row for full audit trail
- `pgvector` `embedding` column in `embedding_metadata` for RAG
