-- V5__price_indices.sql

CREATE TABLE price_indices (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    index_type      TEXT NOT NULL CHECK (index_type IN ('cpi','wpi','iip','pce')),
    series_name     TEXT NOT NULL,
    base_year       TEXT NOT NULL,
    period_type     TEXT NOT NULL CHECK (period_type IN ('FY','Q','M','CY')),
    period_label    TEXT NOT NULL,
    index_value     NUMERIC NOT NULL,
    yoy_change_pct  NUMERIC,
    source_id       UUID NOT NULL REFERENCES sources(id),
    status          observation_status NOT NULL DEFAULT 'official',
    publication_date DATE,
    retrieval_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ingestion_run_id UUID,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT price_indices_unique UNIQUE (index_type, series_name, period_label)
);
CREATE INDEX idx_price_indices_type_period ON price_indices(index_type, period_label);

CREATE TABLE deflator_observations (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deflator_type           TEXT NOT NULL DEFAULT 'gdp',
    period_type             TEXT NOT NULL CHECK (period_type IN ('FY','Q','CY')),
    period_label            TEXT NOT NULL,
    deflator_value          NUMERIC NOT NULL,
    base_year_id            UUID NOT NULL REFERENCES base_years(id),
    methodology_version_id  UUID REFERENCES methodology_versions(id),
    source_id               UUID NOT NULL REFERENCES sources(id),
    status                  observation_status NOT NULL DEFAULT 'official',
    publication_date        DATE,
    retrieval_timestamp     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ingestion_run_id        UUID,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT deflator_obs_unique UNIQUE (deflator_type, period_label, base_year_id)
);
CREATE INDEX idx_deflator_obs_period ON deflator_observations(period_label);
