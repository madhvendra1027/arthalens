-- V2__sources.sql
-- Source registry and document catalog

CREATE TABLE sources (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                    TEXT NOT NULL,
    authority               TEXT NOT NULL,
    canonical_url           TEXT NOT NULL,
    data_types              TEXT[] NOT NULL DEFAULT '{}',
    update_frequency        TEXT,
    access_method           TEXT,                          -- api | download | scrape
    terms_limitations       TEXT,
    parser_version          TEXT NOT NULL DEFAULT '1.0',
    last_successful_retrieval   TIMESTAMPTZ,
    last_observed_pub_date  DATE,
    is_active               BOOLEAN NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT sources_name_authority_uq UNIQUE (name, authority)
);
CREATE INDEX idx_sources_authority ON sources(authority);

CREATE TABLE source_documents (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id           UUID NOT NULL REFERENCES sources(id),
    title               TEXT NOT NULL,
    document_type       TEXT NOT NULL,                     -- release | dataset | report | press_release
    canonical_url       TEXT,
    publication_date    DATE,
    retrieval_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    content_hash        TEXT,                              -- SHA-256 of raw downloaded file
    file_format         TEXT,                             -- pdf | xlsx | json | csv
    language            TEXT NOT NULL DEFAULT 'en',
    base_year           TEXT,                             -- applicable GDP base year if relevant
    data_period_from    TEXT,
    data_period_to      TEXT,
    metadata            JSONB NOT NULL DEFAULT '{}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT source_documents_hash_uq UNIQUE (content_hash)
);
CREATE INDEX idx_source_documents_source ON source_documents(source_id);
CREATE INDEX idx_source_documents_pub_date ON source_documents(publication_date);
