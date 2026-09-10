-- V10__ingestion.sql

CREATE TABLE ingestion_runs (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id           UUID NOT NULL REFERENCES sources(id),
    run_started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    run_completed_at    TIMESTAMPTZ,
    status              TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running','complete','partial','failed')),
    http_status_code    INTEGER,
    content_hash        TEXT,
    retrieval_timestamp TIMESTAMPTZ,
    parser_version      TEXT,
    rows_fetched        INTEGER,
    rows_validated      INTEGER,
    rows_upserted       INTEGER,
    rows_quarantined    INTEGER,
    changed_observations INTEGER,
    validation_errors   JSONB NOT NULL DEFAULT '[]',
    error_message       TEXT,
    metadata            JSONB NOT NULL DEFAULT '{}'
);
CREATE INDEX idx_ingestion_runs_source ON ingestion_runs(source_id, run_started_at DESC);
CREATE INDEX idx_ingestion_runs_status ON ingestion_runs(status);

CREATE TABLE ingestion_errors (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ingestion_run_id UUID NOT NULL REFERENCES ingestion_runs(id),
    error_type      TEXT NOT NULL,           -- validation | parse | network | schema
    error_message   TEXT NOT NULL,
    raw_row         JSONB,
    quarantine_path TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_ingestion_errors_run ON ingestion_errors(ingestion_run_id);
