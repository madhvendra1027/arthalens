-- V1__init_extensions.sql
-- Enable required PostgreSQL extensions

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";        -- pgvector for RAG embeddings
CREATE EXTENSION IF NOT EXISTS "pg_trgm";       -- trigram for text search
