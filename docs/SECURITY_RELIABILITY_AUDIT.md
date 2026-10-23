# ArthaLens — Security, API Integrity & Operational Reliability Audit

**Document:** Application Security & Reliability Review  
**Auditor:** Antigravity AppSec & Platform Engineering  
**Date:** October 2026  
**Status:** Completed  

---

## 1. Threat Model & Attack Surface Summary

ArthaLens operates across multiple network boundaries:
1. **Public Web Browser → Next.js Frontend:** Public internet traffic over HTTPS.
2. **Next.js Frontend → Spring Boot API:** REST API over port 8080 (gated by CORS).
3. **Spring Boot API → FastAPI Microservices:** Internal network traffic (ML on 8002, AI on 8001).
4. **FastAPI AI → External LLM Providers:** Outbound HTTPS traffic to OpenAI/Anthropic/Ollama APIs.
5. **Python Ingestion → Government Portals:** Outbound HTTPS traffic to MoSPI, RBI, and PIB.

---

## 2. Security Findings Ledger (OWASP / CWE Mapped)

| Finding ID | Severity | Category | Description | Affected Component | CWE Reference | Verification & Status |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | **P0** | Cryptographic Provenance | Mock SHA-256 hashes displayed in UI giving simulated proof of official PDF integrity while `source_documents` is empty. | `EvidenceProvenanceTrail.tsx`, `MacroAccountsWorkspace.tsx` | CWE-345: Insufficient Verification of Data Authenticity | Confirmed defect. Plan created to wire real SHA-256 hashes during ingestion. |
| **SEC-02** | **P1** | Cross-Origin Policy | `CORSMiddleware` in `services/ai/rag/api.py` sets `allow_origins=["*"]`. | `services/ai/rag/api.py` line 26 | CWE-942: Permissive Cross-Origin Resource Sharing | Internal service currently, but must be restricted to `localhost:8080` / internal docker network. |
| **SEC-03** | **P1** | Build Reliability | `apps/web/Dockerfile` missing `ENV DOCKER_BUILD=1`, causing standalone container build failure. | `apps/web/Dockerfile`, `apps/web/next.config.ts` | CWE-693: Protection Mechanism Failure | Confirmed build defect. Remediated in deployment roadmap. |
| **SEC-04** | **P2** | Secrets in Git History | `.env.example` contains clear text placeholder credentials; must ensure no real production keys are committed. | Root `.env.example` | CWE-522: Insufficiently Protected Credentials | Verified clean: only sample/placeholder strings present in git tracking. |
| **SEC-05** | **P2** | Prompt Injection | User-supplied prompts or retrieved document chunks could attempt to hijack model instructions. | `services/ai/rag/security.py` | CWE-707: Improper Neutralization of Input | **Mitigated:** `sanitize_retrieved_content()` strips instruction override patterns; 11/11 tests pass. |
| **SEC-06** | **P2** | SSRF Vulnerability | Ingestion or AI service fetching arbitrary outbound URLs. | `services/ai/rag/security.py` | CWE-918: Server-Side Request Forgery | **Mitigated:** `validate_url_for_fetch()` enforces `ALLOWED_DOMAINS` allowlist (`mospi.gov.in`, `rbi.org.in`, `pib.gov.in`). |

---

## 3. Authentication & Session Security Audit

### 3.1 Next.js Cookie Session Configuration
In `apps/web/src/app/api/auth/login/route.ts`:
```typescript
response.cookies.set({
  name: "arthalens_session",
  value: token,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 86400,
  path: "/",
});
```
- `httpOnly: true` prevents JavaScript access to session tokens via XSS.
- `secure: true` in production ensures cookies transmit only over HTTPS.
- `sameSite: "lax"` protects against Cross-Site Request Forgery (CSRF).
- `maxAge: 86400` enforces a 24-hour expiration window.

### 3.2 Redis Cache & In-Memory Fallback
- `apps/web/src/lib/redis.ts` implements a resilient singleton Redis client. If the local Redis daemon is unreachable, it logs a warning and gracefully transitions to an in-memory session map (`_inMemoryFallbackSessions`).
- **Production Note:** For distributed multi-pod deployments, a managed Redis cluster (e.g. AWS ElastiCache or Redis Cloud) must be configured to prevent session invalidation upon container restarts.

---

## 4. API Integrity & Reliability Audit

### 4.1 Input Validation & Exception Handling
- **Query Parameter Whitelisting:**
  - `GdpController.java` validates `base_year` against `{"2011-12", "2022-23"}`.
  - `GdpSectorController.java` validates `price_type` against `{"constant", "current"}`.
  - Invalid parameters immediately throw `IllegalArgumentException` and return HTTP 400.
- **REST Exception Advice:**
  - `RestExceptionHandler.java` captures `ResourceNotFoundException`, `IllegalArgumentException`, and validation errors, returning structured RFC 7807 problem details with error timestamps.

### 4.2 Database Transaction Boundaries
- All mutating repository operations in Spring Boot are wrapped in `@Transactional` to prevent partial updates.
- Flyway migrations apply transactions per migration file (`V1` through `V13`), preventing broken intermediate schema states upon failure.

---

## 5. Operational Reliability & Observability Gaps

1. **Ingestion Daemon Absency:**
   - Ingestion jobs currently execute via manual Python invocations. No cron worker or Celery daemon is registered in `infra/docker-compose.yml`.
2. **Correlation ID Tracking:**
   - While Spring Boot and FastAPI use structured logging (`structlog` and Logback JSON), there is currently no distributed correlation ID passed from the frontend through the Spring Boot API to the downstream FastAPI services.
3. **Health Check Probes:**
   - Spring Boot exposes `/actuator/health`.
   - FastAPI services expose `/health`.
   - Docker Compose specifies health checks for Postgres, API, AI, and ML, but requires container curl utilities in production base images.
