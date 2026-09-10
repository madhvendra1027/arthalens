# ArthaLens — Developer Makefile
# Usage: make <target>

.PHONY: help setup db-up db-down db-seed api-dev ml-dev ai-dev web-dev \
        ingest test-ingestion test-ml test-ai test-web build-all clean

POSTGRES_HOST ?= localhost
POSTGRES_DB   ?= arthalens
POSTGRES_USER ?= arthalens

help:
	@echo ""
	@echo "ArthaLens — available targets:"
	@echo "  setup          Install all dependencies"
	@echo "  db-up          Start PostgreSQL via Docker Compose"
	@echo "  db-down        Stop PostgreSQL"
	@echo "  db-seed        Run seed SQL files against local database"
	@echo "  api-dev        Start Spring Boot API (port 8080)"
	@echo "  ml-dev         Start ML service (port 8002)"
	@echo "  ai-dev         Start AI service (port 8001)"
	@echo "  web-dev        Start Next.js dev server (port 3000)"
	@echo "  test-ingestion Run ingestion unit tests"
	@echo "  test-ml        Run ML unit tests"
	@echo "  test-ai        Run AI unit tests"
	@echo "  test-web       Run frontend type-check + build"
	@echo "  build-all      Build all services"
	@echo ""

setup:
	cd apps/web && npm install
	cd services/ingestion && pip install -e ".[dev]"
	cd services/ml && pip install -e ".[dev]"
	cd services/ai && pip install -e ".[dev,openai]"

db-up:
	docker-compose -f infra/docker-compose.yml up -d postgres
	@echo "PostgreSQL started. Run 'make db-seed' after migrations."

db-down:
	docker-compose -f infra/docker-compose.yml stop postgres

db-seed:
	psql -h $(POSTGRES_HOST) -U $(POSTGRES_USER) $(POSTGRES_DB) -f services/database/seeds/seed_sources.sql
	psql -h $(POSTGRES_HOST) -U $(POSTGRES_USER) $(POSTGRES_DB) -f services/database/seeds/seed_methodology.sql
	@echo "Seeds applied."

api-dev:
	cd services/api && ./mvnw spring-boot:run

ml-dev:
	cd services/ml && uvicorn ml.api:app --port 8002 --reload

ai-dev:
	cd services/ai && uvicorn rag.api:app --port 8001 --reload

web-dev:
	cd apps/web && npm run dev

test-ingestion:
	cd services/ingestion && pytest tests/ -v

test-ml:
	cd services/ml && pytest tests/ -v

test-ai:
	cd services/ai && pytest tests/ -v

test-web:
	cd apps/web && npx tsc --noEmit && npm run build

build-all: test-ingestion test-ml test-ai test-web
	@echo "All services tested and frontend built successfully."
