-- V4__observations.sql
-- Economic, GDP, GVA and sector observations

-- Observation status domain
CREATE TYPE observation_status AS ENUM (
    'official', 'provisional', 'revised', 'estimated', 'derived', 'forecast'
);

-- Generic economic observations table (catch-all for indicators)
CREATE TABLE economic_observations (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    series_id               UUID NOT NULL REFERENCES economic_series(id),
    period_type             TEXT NOT NULL CHECK (period_type IN ('FY','Q','CY','M')),
    period_label            TEXT NOT NULL,             -- e.g. "2023-24", "Q1FY25", "2024-01"
    period_start            DATE,
    period_end              DATE,
    value                   NUMERIC,
    unit                    TEXT NOT NULL,
    price_type              TEXT CHECK (price_type IN ('current','constant','index','ratio')),
    status                  observation_status NOT NULL DEFAULT 'official',
    base_year_id            UUID NOT NULL REFERENCES base_years(id),
    methodology_version_id  UUID REFERENCES methodology_versions(id),
    source_id               UUID NOT NULL REFERENCES sources(id),
    source_document_id      UUID REFERENCES source_documents(id),
    publication_date        DATE,
    retrieval_timestamp     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ingestion_run_id        UUID,
    notes                   TEXT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT eco_obs_unique UNIQUE (series_id, period_label, price_type, base_year_id, methodology_version_id, status)
);
CREATE INDEX idx_eco_obs_series_period ON economic_observations(series_id, period_label);
CREATE INDEX idx_eco_obs_base_year ON economic_observations(base_year_id);
CREATE INDEX idx_eco_obs_status ON economic_observations(status);

-- GDP-specific observations (richer schema for primary use case)
CREATE TABLE gdp_observations (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    period_type             TEXT NOT NULL CHECK (period_type IN ('FY','Q','CY')),
    period_label            TEXT NOT NULL,
    period_start            DATE,
    period_end              DATE,
    value_crore             NUMERIC NOT NULL,           -- INR Crore
    price_type              TEXT NOT NULL CHECK (price_type IN ('current','constant')),
    growth_rate_yoy         NUMERIC,                   -- DERIVED; stored for caching
    base_year_id            UUID NOT NULL REFERENCES base_years(id),
    methodology_version_id  UUID NOT NULL REFERENCES methodology_versions(id),
    source_id               UUID NOT NULL REFERENCES sources(id),
    source_document_id      UUID REFERENCES source_documents(id),
    status                  observation_status NOT NULL DEFAULT 'official',
    publication_date        DATE,
    retrieval_timestamp     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ingestion_run_id        UUID,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT gdp_obs_unique UNIQUE (period_label, period_type, price_type, base_year_id, methodology_version_id, status)
);
CREATE INDEX idx_gdp_obs_period ON gdp_observations(period_label, period_type);
CREATE INDEX idx_gdp_obs_base_year ON gdp_observations(base_year_id);
CREATE INDEX idx_gdp_obs_price_type ON gdp_observations(price_type);
CREATE INDEX idx_gdp_obs_status ON gdp_observations(status);

-- GVA observations
CREATE TABLE gva_observations (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    period_type             TEXT NOT NULL CHECK (period_type IN ('FY','Q','CY')),
    period_label            TEXT NOT NULL,
    value_crore             NUMERIC NOT NULL,
    price_type              TEXT NOT NULL CHECK (price_type IN ('current','constant')),
    base_year_id            UUID NOT NULL REFERENCES base_years(id),
    methodology_version_id  UUID NOT NULL REFERENCES methodology_versions(id),
    source_id               UUID NOT NULL REFERENCES sources(id),
    status                  observation_status NOT NULL DEFAULT 'official',
    publication_date        DATE,
    retrieval_timestamp     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ingestion_run_id        UUID,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT gva_obs_unique UNIQUE (period_label, price_type, base_year_id, methodology_version_id)
);
CREATE INDEX idx_gva_obs_period ON gva_observations(period_label);

-- Sectoral observations
CREATE TABLE sector_observations (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sector_code             TEXT NOT NULL,
    sector_name             TEXT NOT NULL,
    period_type             TEXT NOT NULL CHECK (period_type IN ('FY','Q','CY')),
    period_label            TEXT NOT NULL,
    value_crore             NUMERIC NOT NULL,
    price_type              TEXT NOT NULL CHECK (price_type IN ('current','constant')),
    share_of_gva            NUMERIC,
    growth_rate_yoy         NUMERIC,                   -- DERIVED
    base_year_id            UUID NOT NULL REFERENCES base_years(id),
    methodology_version_id  UUID NOT NULL REFERENCES methodology_versions(id),
    source_id               UUID NOT NULL REFERENCES sources(id),
    status                  observation_status NOT NULL DEFAULT 'official',
    publication_date        DATE,
    retrieval_timestamp     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ingestion_run_id        UUID,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT sector_obs_unique UNIQUE (sector_code, period_label, price_type, base_year_id, methodology_version_id)
);
CREATE INDEX idx_sector_obs_sector_period ON sector_observations(sector_code, period_label);
CREATE INDEX idx_sector_obs_base_year ON sector_observations(base_year_id);
