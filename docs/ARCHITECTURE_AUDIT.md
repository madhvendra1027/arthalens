# ArthaLens — Comprehensive Architecture Audit

**Status:** Completed  
**Audit Date:** October 2026  
**Auditor:** Antigravity Senior Architecture, Systems & Security Review  
**Repository:** `c:/Projects/ArthaLens/arthalens`  
**Classification:** Engineering & Security Audit Document  

---

## 1. Executive Architecture Summary

ArthaLens is architected as a specialized sovereign macroeconomic intelligence platform for India. Its design goal is to synthesize official National Accounts Statistics (NAS) from the Ministry of Statistics and Programme Implementation (MoSPI), macroeconomic aggregates from the Reserve Bank of India (DBIE/RBI), and official releases from the Press Information Bureau (PIB). It models double deflation under UN SNA 2008 standards, guarantees GDP series isolation between the 2011-12 and 2022-23 base-year methodologies, and presents interactive econometric workspaces.

### High-Level Subsystem Breakdown
```
                               ┌────────────────────────────────────────────────────────┐
                               │                    Browser / Client                    │
                               │           Next.js 16 App Router (React 19)             │
                               │        VisX / Bklit UI · Three.js · TanStack Query     │
                               └───────────────────────────┬────────────────────────────┘
                                                           │ HTTP / REST (CORS)
                                            ┌──────────────▼─────────────┐
                                            │      Spring Boot 3 API     │
                                            │     Java 24 · Port 8080    │
                                            │     Hibernate · Flyway     │
                                            └──────┬────────┬────────┬───┘
                                                   │        │        │
                                    ┌──────────────▼──┐  ┌──▼──┐  ┌──▼──────────────┐
                                    │ AI/RAG Service  │  │ ML  │  │ Ingestion Engine│
                                    │ Python FastAPI  │  │ Svc │  │ Python CLI/Sched│
                                    │ Port 8001       │  │8002 │  │ (Local / Cron)  │
                                    └──────┬──────────┘  └──┬──┘  └──┬──────────────┘
                                           │                │        │
                                           └────────────────▼────────┘
                                                         PostgreSQL 16
                                               (pgvector · uuid-ossp · Flyway)
```

---

## 2. Subsystem Inventory & Responsibilities

| Subsystem | Primary Technology | Directory Location | Primary Responsibility | Critical Invariants |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend Web App** | Next.js 16.3.4, React 19.2.8, Tailwind CSS, TanStack Query 5 | `apps/web/` | Presentation layer, 37 App Router routes, 3D Macro Constellation, interactive chart suites (`bklit`), client session management | Must never splice incompatible base years; must distinguish official data from projections. |
| **Backend REST API** | Java 24, Spring Boot 3.4.3, Spring Data JPA, Flyway 10 | `services/api/` | Canonical API gateway (`/api/v1/*`), domain orchestration (`gdp`, `dashboard`, `deflator`, `indicators`, `ratings`), base-year query enforcement | Must strictly enforce `base_year_id` isolation; reject invalid series; provide OpenAPI specs. |
| **Database Migrations** | PostgreSQL 16, pgvector, Flyway | `services/database/migrations/` & `services/api/src/main/resources/db/migration/` | Schema management (V1–V13), entity definitions, relational constraints, official seed data | Composite unique constraints on `(period_label, period_type, price_type, base_year_id, methodology_version_id, status)`. |
| **Ingestion Pipeline** | Python 3.12, httpx, BeautifulSoup4, structlog | `services/ingestion/` | External data fetching (`MoSPIAdapter`, `RBIAdapter`, `PIBAdapter`), immutable raw archiving (`/data/raw`), quarantine manager | Raw byte immutability, SHA-256 provenance calculation, schema validation before DB upsert. |
| **ML Diagnostics** | Python 3.12, FastAPI, numpy, scikit-learn | `services/ml/` | Econometric diagnostics (`deflator_diagnostics`, `consistency_scorer`, `revision_analytics`, `sector_contribution`) | Flags large discrepancies as analytical warnings without declaring source government data erroneous. |
| **AI / RAG Service** | Python 3.12, FastAPI, pydantic | `services/ai/` | Source-grounded research assistant, query classification, citation mapping, prompt injection sanitization | Disallows investment advice; enforces SSRF allowlist on outbound fetches; sanitizes retrieved chunks. |

---

## 3. Runtime Entry Points & Critical Execution Flows

### 3.1 End-to-End Observation Retrieval Flow
1. **User Request:** Client navigates to `/gdp` or `/observatory`.
2. **Hook Execution:** `useGdpSeries({ base_year: "2022-23", price_type: "constant" })` in `apps/web/src/hooks/useApi.ts` triggers TanStack Query.
3. **API Client:** `api.gdp.series(...)` in `apps/web/src/lib/api.ts` makes `GET /api/v1/gdp/series?base_year=2022-23&price_type=constant`.
4. **Controller Binding:** `GdpController.java` validates `base_year` against permitted values (`2011-12`, `2022-23`), throwing HTTP 400 if invalid.
5. **Relational Resolution:** `BaseYearRepository.findByYearLabel("2022-23")` resolves the UUID.
6. **Isolated SQL Execution:** `GdpObservationRepository.findSeries(baseYearId, priceType, ...)` executes parameterized query with `WHERE g.baseYearId = :baseYearId`.
7. **DTO Serialization:** `GdpService.java` transforms entities to `GdpObservationDto`, embedding provenance IDs and methodology version.
8. **Client Rendering:** `BklitGdpLineChart.tsx` transforms Lakh Crore values and renders VisX SVG paths.

### 3.2 Ingestion & Archival Flow
1. **Invocation:** CLI script or scheduled worker executes `pipeline.py`.
2. **Raw Ingestion:** Adapter issues HTTP GET to official portal (e.g. `pib.gov.in`, `mospi.gov.in`).
3. **Cryptographic Fingerprint:** Ingestion computes SHA-256 of raw bytes and archives them to `data/raw/{adapter}_{run_id}_{hash}.bin`.
4. **Validation Separation:** Observation records route to `validate_observation()`; document records route to `validate_document()`.
5. **Quarantine Gate:** Invalid rows are written to `data/quarantine/{run_id}.json` rather than dropped silently.
6. **Database Persistence:** Idempotent upsert commits verified observations to PostgreSQL.

---

## 4. Architectural Decision Records (ADR) Compliance Matrix

| ADR ID | Decision & Core Requirement | Implementation Evidence | Verification Status | Deviations / Notes |
| :--- | :--- | :--- | :---: | :--- |
| **ADR-001** | **Monorepo Structure** (`apps/`, `services/`, `packages/`, `infra/`, `docs/`, `tests/`) | Root structure adheres to ADR layout. Maven wrapper used in `services/api/`. | **PASS** | Monorepo structure is consistent. Dependency boundaries are respected. |
| **ADR-002** | **PostgreSQL as Primary Database with pgvector & Flyway** | PostgreSQL 16 target in `infra/docker-compose.yml`. Flyway V1–V13 migrations manage relational & vector tables. | **PASS** | Flyway migrations compile and apply cleanly. NUMERIC type preserves statistical precision. |
| **ADR-003** | **Provider-Agnostic LLM & Embedding Interfaces** | `services/ai/rag/` structured around abstract provider interfaces. `security.py` enforces prompt sanitization. | **PASS** | Default adapter configured; local deployment with Ollama or mocked providers supported. |
| **ADR-004** | **Strict GDP Series Isolation (2011-12 vs 2022-23)** | Schema enforces `base_year_id NOT NULL` and unique constraints. Backend queries filter strictly on `baseYearId`. | **PASS** | Frontend UI includes base year switcher; backend SQL queries enforce series parameter isolation. |

---

## 5. Architectural Inconsistencies & Structural Weaknesses

1. **Missing Ingestion Worker in Container Orchestration:**
   - `infra/docker-compose.yml` configures `postgres`, `api`, `ai`, `ml`, and `web`. It does NOT define a container for `services/ingestion/ingestion/scheduler.py`. Ingestion cannot run continuously without manual host process execution.
2. **Missing Redis Service in Docker Compose:**
   - `apps/web/.env.local` defaults to `REDIS_URL=redis://127.0.0.1:6379`. `infra/docker-compose.yml` lacks a Redis service definition. While the web app has an in-memory fallback map in `apps/web/src/lib/redis.ts`, multi-replica container deployments will experience session fragmentation without a shared Redis store.
3. **Docker Build Context Disconnect in Frontend:**
   - In `apps/web/next.config.ts`, `output: "standalone"` is conditionally enabled only when `process.env.DOCKER_BUILD === "1"`. However, `apps/web/Dockerfile` executes `RUN npm run build` without declaring `ENV DOCKER_BUILD=1`. Building the Docker container fails on `COPY --from=builder /app/.next/standalone ./`.
4. **Single-Stage Dockerfile in Backend:**
   - `services/api/Dockerfile` starts from `eclipse-temurin:21-jre-alpine` and executes `COPY target/*.jar app.jar`. It requires a pre-built JAR on the host machine rather than using a multi-stage Docker build with Maven.
5. **Silent Fallback Degradation in Web Client:**
   - In `apps/web/src/lib/api.ts`, `apiFetch` catches network and HTTP exceptions and returns static fallback constants without alerting the user or surfacing error flags to TanStack Query.

---

## 6. Prioritized Architectural Remediation Roadmap

1. **Phase 1 — Operational Deployment Fixes (P1):**
   - Add `ENV DOCKER_BUILD=1` to `apps/web/Dockerfile`.
   - Add `redis:7-alpine` service to `infra/docker-compose.yml`.
   - Convert `services/api/Dockerfile` to a multi-stage Maven build.
2. **Phase 2 — Ingestion Daemonization (P1):**
   - Add an `ingestion` service container in `infra/docker-compose.yml` mounting `/data/raw` and `/data/quarantine`.
3. **Phase 3 — Telemetry & Fallback Observability (P2):**
   - Introduce an `isFallback: boolean` property on API client responses to render a persistent banner whenever live backend connectivity is lost.

---

## 7. Audit Limitations

- Audit was performed in a local development environment. Production cluster configuration (Kubernetes, AWS/GCP IAM policies, TLS termination proxies) was not inspected.
- Live PostgreSQL instance was verified on localhost:5432, but external government endpoints (MoSPI, RBI) were evaluated via archived responses and synthetic test fixtures to avoid uncoordinated scraping of third-party infrastructure.
