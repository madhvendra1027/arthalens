-- seed_methodology.sql
-- Base year and methodology version metadata seeds.
-- Descriptions are factual metadata, not economic observations.

INSERT INTO base_years (year_label, description, is_current, effective_from)
VALUES
  ('2011-12',
   'Previous GDP base year series. Reference year 2011-12. Released by MoSPI. Being phased out as 2022-23 series becomes standard.',
   FALSE,
   '2015-01-30'),
  ('2022-23',
   'Current GDP base year series. Reference year 2022-23. Released by MoSPI in 2025. Uses double deflation for manufacturing and services.',
   TRUE,
   '2025-01-01');

-- Methodology versions will be populated by ingestion once full NAS documentation is indexed.
-- Placeholder entries inserted here to satisfy FK constraints in tests.
DO $$
DECLARE
  v_by_old UUID;
  v_by_new UUID;
BEGIN
  SELECT id INTO v_by_old FROM base_years WHERE year_label = '2011-12';
  SELECT id INTO v_by_new FROM base_years WHERE year_label = '2022-23';

  INSERT INTO methodology_versions (base_year_id, version_label, deflation_method, primary_data_sources, release_date, notes)
  VALUES
    (v_by_old, 'NAS-2011-12-v1', 'single',
     ARRAY['MoSPI','RBI','CSO','ASI'],
     '2015-01-30',
     'Original 2011-12 series release.'),
    (v_by_new, 'NAS-2022-23-v1', 'double',
     ARRAY['MoSPI','RBI','GSTN','MCA21','EPFO','NPS'],
     '2025-01-01',
     'New 2022-23 series using double deflation and expanded administrative data sources.');
END;
$$;
