# ADR-001: Monorepo Structure

**Date:** 2026-09-10
**Status:** Accepted

## Context
ArthaLens requires a frontend (Next.js), backend API (Java/Spring Boot), AI/RAG service (Python),
ML service (Python), and data ingestion jobs (Python). These services share database schemas
and API contracts.

## Decision
Use a monorepo at the root `arthalens/` with top-level `apps/`, `services/`, `packages/`,
`infra/`, `docs/`, and `tests/` directories. Each service has its own language-appropriate
build tooling and virtual environment / dependency manifest.

## Rationale
- Shared OpenAPI contracts in `packages/contracts/` prevent independent contract drift
- Flyway migrations in `services/database/` are the single source of truth for schema
- Easier cross-service integration testing and end-to-end test orchestration
- Simpler for a small team; monorepo overhead is justified by shared contracts

## Consequences
- Each service manages its own dependencies (no cross-language package sharing at runtime)
- CI must run per-service pipelines and a full integration pass
- Maven Wrapper (`mvnw`) used for Java — no global Maven installation required
