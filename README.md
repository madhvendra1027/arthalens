# ArthaLens 🇮🇳

> India Macroeconomic Intelligence Platform

**Transparent, provenance-first analysis of India's economic data.**  
Official statistics from MoSPI, RBI, and GoI — with provenance metadata, methodology explainers, ML diagnostics, and a citation-grounded AI research assistant.

---

## Architecture

```
arthalens/
├── apps/web/           - Next.js 15 + TypeScript frontend (11 interactive pages)
├── services/
│   ├── api/            - Spring Boot 4.0.0 REST API (GDP, Methodology, Deflators, Indicators, Ratings, AI orchestration)
│   ├── ingestion/      - Python 3.13 data ingestion (MoSPI, RBI, PIB adapters + Dockerfile)
│   ├── ml/             - Python 3.13 ML/statistics (consistency score, forecasting, deflator anomalies)
│   ├── ai/             - Python 3.13 AI/RAG (provider-agnostic LLM, citation-first)
│   └── database/       - Flyway SQL migrations (V1–V11) + seeds
├── packages/
│   └── contracts/openapi/  - arthalens-api.yaml (OpenAPI 3.1 spec)
├── infra/
│   └── docker-compose.yml
└── docs/
    ├── architecture.md
    ├── data-dictionary.md
    ├── threat-model.md
    ├── ml-model-card.md
    ├── rag-evaluation-guide.md
    ├── troubleshooting.md
    └── adr/ADR-001..004
```

---

## Quickstart (Local Development)

### Prerequisites
- Docker Desktop
- Java 21+
- Python 3.11+
- Node.js 20+

### 1. Configure environment
```bash
cp .env.example .env
# Edit .env - set POSTGRES_PASSWORD and LLM_PROVIDER/API keys
```

### 2. Start database
```bash
docker-compose -f infra/docker-compose.yml up -d postgres
```

### 3. Start Spring Boot API (runs Flyway migrations automatically)
```bash
cd services/api
./mvnw spring-boot:run
# API: http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html
```

### 4. Seed database
```bash
psql -h localhost -U arthalens arthalens < services/database/seeds/seed_sources.sql
psql -h localhost -U arthalens arthalens < services/database/seeds/seed_methodology.sql
```

### 5. Start Python services
```bash
# ML service
cd services/ml && pip install -e ".[dev]"
uvicorn ml.api:app --port 8002

# AI service
cd services/ai && pip install -e ".[dev,openai]"
uvicorn rag.api:app --port 8001
```

### 6. Start frontend
```bash
cd apps/web && npm install && npm run dev
# http://localhost:3000
```

---

## API Endpoints

| Domain | Method | Path | Description |
|--------|--------|------|-------------|
| **Dashboard** | `GET` | `/api/v1/dashboard/india` | Composite macroeconomic overview |
| **GDP** | `GET` | `/api/v1/gdp/latest` | Latest official GDP observation |
| **GDP** | `GET` | `/api/v1/gdp/series` | Historical GDP time series with isolation safeguards |
| **GDP** | `GET` | `/api/v1/gdp/sectors` | Sectoral GVA breakdown |
| **GDP** | `GET` | `/api/v1/gdp/revisions` | Revision tracking across MoSPI releases |
| **Methodology** | `GET` | `/api/v1/methodology/series-comparison` | 2011-12 vs 2022-23 base year methodology diff |
| **Deflators** | `GET` | `/api/v1/deflators` | Implicit GDP deflator, CPI, and WPI time series |
| **Indicators** | `GET` | `/api/v1/indicators` | High-frequency economic indicators (IIP, PMI, etc.) |
| **Ratings** | `GET` | `/api/v1/ratings` | Sovereign credit ratings from Moody's, S&P, Fitch |
| **Sources** | `GET` | `/api/v1/sources/{id}` | Source provenance & metadata audit |
| **AI / RAG** | `POST` | `/api/v1/ai/query` | Citation-grounded macroeconomic Q&A |

---

## Test Results & Verification

| Service | Test Suite | Status |
|---------|------------|--------|
| Ingestion | Python unit & integration tests (11/11) | ✅ PASS |
| AI / RAG | Security & Prompt injection suite (6/6) | ✅ PASS |
| ML Service | Statistical diagnostics & consistency suite (18/18) | ✅ PASS |
| Backend API | Spring Boot Domain Service unit tests | ✅ PASS |
| Frontend | TypeScript compile (`tsc --noEmit`) & Next.js production build | ✅ PASS (11 routes) |

---

## Data Policy & Governance

- **Official statistics** reproduced with full provenance (source, publication date, methodology version).
- **2011-12 and 2022-23 series** are never silently mixed — enforced at DB schema and API layer.
- **Derived analytics** (growth rates, sector shares) clearly labelled.
- **ML forecasts** clearly distinguished from official government estimates with visible badges.
- **AI responses** cite only indexed official documents — never fabricated.
- **Investment advice** never provided.

---

## Primary Data Sources

| Source | Authority | Data Types |
|--------|-----------|------------|
| MoSPI NAS | Ministry of Statistics & Programme Implementation | GDP, GVA, deflators, sectors |
| RBI DBIE | Reserve Bank of India | CPI, WPI, monetary, trade |
| PIB | Press Information Bureau, GoI | Press releases, fiscal |
| Moody's / S&P / Fitch | Rating agencies | Sovereign ratings (official only) |

---

## Documentation Links

- [Architecture Guide](./docs/architecture.md) — system topology & component design
- [Data Dictionary & Schema](./docs/data-dictionary.md) — table schemas & relationships
- [ML Model Card](./docs/ml-model-card.md) — diagnostic models & forecasting specs
- [RAG Evaluation Guide](./docs/rag-evaluation-guide.md) — AI safety & grounding protocols
- [Troubleshooting Guide](./docs/troubleshooting.md) — local setup resolutions
- [Threat Model](./docs/threat-model.md) — security architecture & defenses
- [Architecture Decision Records (ADRs)](./docs/adr/) — key architectural choices
- [BUILD_LOG.md](./BUILD_LOG.md) — comprehensive build history & file inventory
