-- V11__audit.sql

CREATE TABLE api_audit_events (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id      TEXT NOT NULL,
    event_type      TEXT NOT NULL,      -- query | mutation | admin_action
    endpoint        TEXT NOT NULL,
    method          TEXT NOT NULL,
    status_code     INTEGER,
    user_id         TEXT,               -- future: JWT subject
    ip_address      TEXT,               -- stored as text; hash for PII compliance if needed
    user_agent      TEXT,
    duration_ms     INTEGER,
    metadata        JSONB NOT NULL DEFAULT '{}',
    occurred_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_api_audit_occurred ON api_audit_events(occurred_at DESC);
CREATE INDEX idx_api_audit_request ON api_audit_events(request_id);
CREATE INDEX idx_api_audit_endpoint ON api_audit_events(endpoint, occurred_at DESC);
