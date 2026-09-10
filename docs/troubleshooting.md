# ArthaLens Local Setup & Troubleshooting Guide

## Common Issues and Solutions

### 1. PostgreSQL / pgvector Connection
* **Symptom:** `org.postgresql.util.PSQLException: Connection to localhost:5432 refused`
* **Resolution:** Ensure Docker is running and run `docker-compose -f infra/docker-compose.yml up -d postgres`.
* **Symptom:** `extension "vector" is not available`
* **Resolution:** The Docker compose uses `pgvector/pgvector:pg16` image which includes both `pgvector` and `uuid-ossp` extensions.

### 2. Flyway Migration Failures
* **Symptom:** `FlywayException: Migration checksum mismatch`
* **Resolution:** Clean database state or run `docker-compose down -v` followed by `docker-compose up -d postgres`.

### 3. Node.js & Next.js Build
* **Symptom:** `Type error: Route ... does not match the required types`
* **Resolution:** Ensure parameters in dynamic routes (e.g. `[id]`) are awaited in Next.js 15: `const { id } = await params;`.

### 4. Python Virtual Environments
* **Symptom:** `ModuleNotFoundError: No module named 'fastapi'`
* **Resolution:** Install dependencies per service: `pip install -e ".[dev]"` inside `services/ml` or `services/ai`.
