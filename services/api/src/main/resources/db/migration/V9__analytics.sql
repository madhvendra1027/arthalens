-- V9__analytics.sql
-- ML analytics runs and derived metrics

CREATE TABLE analytics_runs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_type        TEXT NOT NULL,           -- forecast | anomaly | consistency | deflator | revision
    model_version   TEXT NOT NULL,
    feature_version TEXT NOT NULL,
    training_window TEXT,
    data_snapshot_id UUID,
    status          TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running','complete','failed')),
    started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMPTZ,
    metrics         JSONB NOT NULL DEFAULT '{}',
    config          JSONB NOT NULL DEFAULT '{}',
    error_message   TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_analytics_runs_type ON analytics_runs(run_type, started_at DESC);

CREATE TABLE derived_metrics (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analytics_run_id UUID NOT NULL REFERENCES analytics_runs(id),
    metric_type     TEXT NOT NULL,
    entity_type     TEXT NOT NULL,          -- gdp | sector | indicator
    entity_key      TEXT NOT NULL,          -- series_code or sector_code
    period_label    TEXT NOT NULL,
    base_year_id    UUID REFERENCES base_years(id),
    value           NUMERIC,
    lower_bound     NUMERIC,                -- for prediction intervals
    upper_bound     NUMERIC,
    confidence      NUMERIC,
    unit            TEXT,
    metadata        JSONB NOT NULL DEFAULT '{}',
    prediction_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_derived_metrics_run ON derived_metrics(analytics_run_id);
CREATE INDEX idx_derived_metrics_type_entity ON derived_metrics(metric_type, entity_type, entity_key);
