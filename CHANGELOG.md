# Changelog

All notable changes to ArthaLens are documented here.
Format: Keep a Changelog | Versioning: Semantic Versioning

---

## [0.5.0] - 2026-09-10

### Added
- **Backend API Domains**:
  - `MethodologyController` + DTOs + Service (`GET /api/v1/methodology/series-comparison`)
  - `DeflatorController` + DTOs + Service (`GET /api/v1/deflators`)
  - `IndicatorController` + DTOs + Service (`GET /api/v1/indicators`)
  - `RatingsController` + `SovereignRating` entity + DTOs + Service (`GET /api/v1/ratings`)
- **Backend Unit Tests**:
  - `GdpServiceTest` covering latest observation retrieval, isolation safeguards, and error branches
  - `SourceServiceTest` verifying source lookup and 404 responses
  - `RatingsServiceTest` testing current vs historical ratings segregation
- **Infrastructure & Ingestion**:
  - `services/ingestion/Dockerfile` container packaging
  - Flyway migrations synced into API classpath
- **Documentation**:
  - `docs/ml-model-card.md` detailing ML diagnostics, forecasting, and anomaly models
  - `docs/rag-evaluation-guide.md` specifying AI safety and citation grounding standards
  - `docs/troubleshooting.md` covering Docker, database, Node.js, and Python setup
- **Frontend & Integration**:
  - Full TanStack query hooks in `useApi.ts` for methodology, deflators, indicators, ratings, and sources
  - Interactive page enhancements across Next.js routes

---

## [0.1.0] - 2026-09-10

### Added
- Monorepo skeleton, root config, ADRs, data dictionary, OpenAPI contract
- PostgreSQL Flyway migrations V1–V11 + seeds
- Data ingestion service adapters (MoSPI, RBI, PIB)
- ML/Statistics service (consistency, forecasting, deflator)
- AI/RAG service (citation grounding, prompt injection defenses)
- Next.js 15 frontend with 11 routes and ECharts
- Docker Compose and GitHub Actions CI pipelines
