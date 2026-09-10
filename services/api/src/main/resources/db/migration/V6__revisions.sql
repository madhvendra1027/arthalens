-- V6__revisions.sql

CREATE TABLE revisions (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type         TEXT NOT NULL,     -- gdp_observation | sector_observation | gva_observation
    entity_id           UUID NOT NULL,
    revision_sequence   INTEGER NOT NULL,
    from_value          NUMERIC,
    to_value            NUMERIC,
    from_status         observation_status,
    to_status           observation_status,
    revision_date       DATE NOT NULL,
    release_label       TEXT,
    revision_reason     TEXT,
    source_id           UUID REFERENCES sources(id),
    source_document_id  UUID REFERENCES source_documents(id),
    ingestion_run_id    UUID,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_revisions_entity ON revisions(entity_type, entity_id);
CREATE INDEX idx_revisions_date ON revisions(revision_date);

CREATE TABLE revision_events (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    revision_id     UUID NOT NULL REFERENCES revisions(id),
    event_type      TEXT NOT NULL,
    event_details   JSONB NOT NULL DEFAULT '{}',
    occurred_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
