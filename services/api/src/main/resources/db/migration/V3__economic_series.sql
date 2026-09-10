-- V3__economic_series.sql
-- Base years, methodology versions, and economic series definitions

CREATE TABLE base_years (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year_label      TEXT NOT NULL UNIQUE,              -- "2011-12" | "2022-23"
    description     TEXT,
    is_current      BOOLEAN NOT NULL DEFAULT FALSE,
    effective_from  DATE,
    deprecated_on   DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE methodology_versions (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    base_year_id        UUID NOT NULL REFERENCES base_years(id),
    version_label       TEXT NOT NULL,                 -- e.g. "NAS-2022-23-v1"
    deflation_method    TEXT NOT NULL CHECK (deflation_method IN ('single','double','mixed')),
    primary_data_sources TEXT[] NOT NULL DEFAULT '{}',
    coverage_from       TEXT,
    coverage_to         TEXT,
    key_changes         TEXT[] NOT NULL DEFAULT '{}',
    release_date        DATE,
    notes               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT methodology_base_version_uq UNIQUE (base_year_id, version_label)
);

CREATE TABLE economic_series (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    series_code             TEXT NOT NULL,
    series_name             TEXT NOT NULL,
    description             TEXT,
    indicator_type          TEXT NOT NULL,             -- gdp | gva | cpi | wpi | iip | fiscal | trade
    frequency               TEXT NOT NULL CHECK (frequency IN ('annual','quarterly','monthly')),
    unit                    TEXT NOT NULL,
    unit_multiplier         NUMERIC NOT NULL DEFAULT 1,
    geography               TEXT NOT NULL DEFAULT 'India',
    base_year_id            UUID REFERENCES base_years(id),
    methodology_version_id  UUID REFERENCES methodology_versions(id),
    source_id               UUID REFERENCES sources(id),
    is_official             BOOLEAN NOT NULL DEFAULT TRUE,
    is_active               BOOLEAN NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT economic_series_code_baseyear_uq UNIQUE (series_code, base_year_id)
);
CREATE INDEX idx_economic_series_type ON economic_series(indicator_type);
CREATE INDEX idx_economic_series_base_year ON economic_series(base_year_id);
