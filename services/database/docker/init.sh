#!/bin/bash
# init.sh — PostgreSQL initialization script for Docker
# Creates the arthalens database and enables required extensions.
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  CREATE EXTENSION IF NOT EXISTS "pgcrypto";
  CREATE EXTENSION IF NOT EXISTS "vector";
  CREATE EXTENSION IF NOT EXISTS "pg_trgm";
  -- Flyway migrations will create all tables on first backend startup.
  \echo 'Extensions enabled. Flyway will handle schema migration.'
EOSQL
