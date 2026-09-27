-- V12__state_gva.sql
-- State-level GVA / GSDP observations and schema enhancements

ALTER TABLE gva_observations ADD COLUMN IF NOT EXISTS growth_rate_yoy NUMERIC;

CREATE TABLE IF NOT EXISTS state_gva_observations (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state_code              TEXT NOT NULL,              -- e.g. "MH", "TN", "GJ", "KA", "UP"
    state_name              TEXT NOT NULL,              -- e.g. "Maharashtra", "Tamil Nadu"
    period_type             TEXT NOT NULL CHECK (period_type IN ('FY','CY')),
    period_label            TEXT NOT NULL,              -- e.g. "FY 2023-24", "FY 2022-23"
    gsdp_crore              NUMERIC NOT NULL,           -- Nominal GSDP in INR Crore
    gva_crore               NUMERIC,                    -- Real GSVA in INR Crore
    growth_rate_yoy         NUMERIC,                    -- YoY Growth Rate %
    share_of_national_gva   NUMERIC,                    -- % share of national economic activity
    base_year_id            UUID REFERENCES base_years(id),
    source_id               UUID REFERENCES sources(id),
    status                  observation_status NOT NULL DEFAULT 'official',
    publication_date        DATE,
    retrieval_timestamp     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT state_gva_unique UNIQUE (state_code, period_label, base_year_id)
);

CREATE INDEX IF NOT EXISTS idx_state_gva_period ON state_gva_observations(period_label);
CREATE INDEX IF NOT EXISTS idx_state_gva_state ON state_gva_observations(state_code);
CREATE INDEX IF NOT EXISTS idx_state_gva_base_year ON state_gva_observations(base_year_id);
