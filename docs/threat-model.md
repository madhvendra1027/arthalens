# ArthaLens — Threat Model

## Assets to Protect

| Asset | Threat | Control |
|-------|--------|---------|
| LLM API keys | Leakage via env, logs, source control | Env vars only; `.gitignore`; no log output |
| PostgreSQL credentials | Leakage or brute force | Env vars; Docker network isolation; pg_hba.conf |
| AI query context | Prompt injection from retrieved docs | `security.py` sanitization; pattern matching |
| Admin endpoints | Unauthorized mutation | JWT-ready role gates (disabled by default) |
| User queries | PII in AI prompts | PII redaction before logging |
| External data fetches | SSRF via user-controlled URLs | `validate_url_for_fetch()` allowlist |
| Official statistical data | Misrepresentation | Provenance metadata; clear status labels |

## Trust Boundaries

- **Browser → API**: CORS restricted to `API_CORS_ALLOWED_ORIGINS`
- **API → AI service**: internal network only (not exposed to internet)
- **AI service → LLM provider**: HTTPS; API key in env var
- **Ingestion → official sources**: HTTPS; SSRF allowlist

## Out of Scope (Initial Release)

- User authentication (JWT-ready architecture in place)
- Rate limiting (hooks in place; implementation deferred)
- Uploaded document scanning

## Notes

- Never log: secrets, authorization headers, full AI prompts (may contain PII), DB credentials
- Sanitize markdown rendered in the frontend (prevent XSS from AI-generated content)
