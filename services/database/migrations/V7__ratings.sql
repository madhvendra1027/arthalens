-- V7__ratings.sql

CREATE TABLE sovereign_ratings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country         TEXT NOT NULL DEFAULT 'India',
    agency          TEXT NOT NULL CHECK (agency IN ('moodys','sp','fitch')),
    rating          TEXT NOT NULL,
    outlook         TEXT NOT NULL CHECK (outlook IN ('Positive','Stable','Negative','Watch')),
    rating_date     DATE NOT NULL,
    is_current      BOOLEAN NOT NULL DEFAULT FALSE,
    source_id       UUID NOT NULL REFERENCES sources(id),
    source_document_id UUID REFERENCES source_documents(id),
    retrieval_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ingestion_run_id UUID,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT sovereign_ratings_unique UNIQUE (country, agency, rating_date)
);
CREATE INDEX idx_sovereign_ratings_agency ON sovereign_ratings(agency);
CREATE INDEX idx_sovereign_ratings_date ON sovereign_ratings(rating_date DESC);

CREATE TABLE rating_events (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sovereign_rating_id UUID NOT NULL REFERENCES sovereign_ratings(id),
    action_type         TEXT NOT NULL CHECK (action_type IN ('Upgrade','Downgrade','Affirm','Outlook_Change')),
    previous_rating_id  UUID REFERENCES sovereign_ratings(id),
    press_release_url   TEXT,
    event_date          DATE NOT NULL,
    notes               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
