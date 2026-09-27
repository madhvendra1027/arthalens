-- V13__seed_official_macro_data.sql
-- Authoritative, official macroeconomic observations for ArthaLens
-- Sources: MoSPI National Accounts Statistics (NAS), RBI DBIE, Office of Economic Adviser (DPIIT), World Bank, S&P, Moody's, Fitch

-- 1. Ensure deterministic sources exist
INSERT INTO sources (id, name, authority, canonical_url, data_types, update_frequency, access_method, parser_version)
VALUES
  ('s1111111-1111-1111-1111-111111111111', 'MoSPI National Accounts Statistics', 'Ministry of Statistics and Programme Implementation', 'https://mospi.gov.in/national-accounts-statistics', ARRAY['GDP','GVA','NAS','deflators','sector'], 'quarterly (advance + revised); annual', 'download', '1.0'),
  ('s2222222-2222-2222-2222-222222222222', 'RBI Database on Indian Economy', 'Reserve Bank of India', 'https://dbie.rbi.org.in', ARRAY['CPI','WPI','monetary','banking','trade','fiscal'], 'monthly', 'api', '1.0'),
  ('s3333333-3333-3333-3333-333333333333', 'Government of India Press Information Bureau', 'Press Information Bureau, GoI', 'https://pib.gov.in', ARRAY['press_release','fiscal','ratings'], 'as released', 'download', '1.0'),
  ('s4444444-4444-4444-4444-444444444444', 'Fitch Ratings - India Sovereign', 'Fitch Ratings', 'https://www.fitchratings.com/entity/india', ARRAY['sovereign_rating'], 'as released', 'download', '1.0'),
  ('s5555555-5555-5555-5555-555555555555', 'Moody''s Ratings - India', 'Moody''s Ratings', 'https://www.moodys.com/research/India-Baa3-Stable', ARRAY['sovereign_rating'], 'as released', 'download', '1.0'),
  ('s6666666-6666-6666-6666-666666666666', 'S&P Global Ratings - India', 'S&P Global Ratings', 'https://disclosure.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3183563', ARRAY['sovereign_rating'], 'as released', 'download', '1.0'),
  ('s7777777-7777-7777-7777-777777777777', 'World Bank Open Data', 'The World Bank Group', 'https://data.worldbank.org', ARRAY['global_macro','gdp','inflation','debt'], 'annual', 'api', '1.0'),
  ('s8888888-8888-8888-8888-888888888888', 'MoSPI State Domestic Product', 'National Accounts Division & State DES', 'https://mospi.gov.in/data', ARRAY['gsdp','gva_state','regional'], 'annual', 'download', '1.0')
ON CONFLICT (id) DO NOTHING;

-- 2. Base Years
INSERT INTO base_years (id, year_label, description, is_current, effective_from)
VALUES
  ('b1111111-1111-1111-1111-111111111111', '2011-12', 'Previous GDP base year series. Reference year 2011-12. Released by MoSPI.', FALSE, '2015-01-30'),
  ('b2222222-2222-2222-2222-222222222222', '2022-23', 'Current GDP base year series. Reference year 2022-23. Released by MoSPI. Uses double deflation and expanded administrative GSTN/MCA-21 data.', TRUE, '2025-01-01')
ON CONFLICT (id) DO UPDATE SET
  year_label = EXCLUDED.year_label,
  description = EXCLUDED.description,
  is_current = EXCLUDED.is_current,
  effective_from = EXCLUDED.effective_from;

-- Also update any existing by year_label if exists
UPDATE base_years SET id = 'b1111111-1111-1111-1111-111111111111' WHERE year_label = '2011-12' AND id <> 'b1111111-1111-1111-1111-111111111111';
UPDATE base_years SET id = 'b2222222-2222-2222-2222-222222222222' WHERE year_label = '2022-23' AND id <> 'b2222222-2222-2222-2222-222222222222';

-- 3. Methodology Versions
INSERT INTO methodology_versions (id, base_year_id, version_label, deflation_method, primary_data_sources, coverage_from, coverage_to, key_changes, release_date, notes)
VALUES
  ('m1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'NAS-2011-12-v1', 'single',
   ARRAY['MoSPI','RBI','CSO','ASI','MCA-21'], '2011-12', '2024-25',
   ARRAY['Shift from Factor Cost to Market Prices / Basic Prices','Incorporation of corporate financial filings via MCA-21','Updated agriculture value added based on cost of cultivation studies'],
   '2015-01-30', 'Original 2011-12 series release.'),
  ('m2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', 'NAS-2022-23-v1', 'double',
   ARRAY['MoSPI','RBI','GSTN','MCA21','EPFO','NPS','Digital platform aggregates'], '2022-23', 'Active',
   ARRAY['Transition to double deflation methodology for value added precision','High-frequency GST e-way bill & return data integration','Expanded coverage of digital services, renewable energy, and gig economy'],
   '2025-01-01', 'Current 2022-23 series using double deflation and expanded administrative data sources.')
ON CONFLICT (id) DO NOTHING;

-- 4. Official GDP Observations (Annual & Quarterly)
-- 2022-23 Series (Active Official Benchmark)
INSERT INTO gdp_observations (period_type, period_label, value_crore, price_type, growth_rate_yoy, base_year_id, methodology_version_id, source_id, status, publication_date)
VALUES
  ('FY', 'FY 2023-24', 17382000, 'constant', 8.2, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'official', '2024-05-31'),
  ('FY', 'FY 2023-24', 29536000, 'current',  9.6, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'official', '2024-05-31'),
  ('FY', 'FY 2022-23', 16071000, 'constant', 7.0, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'revised',  '2024-02-29'),
  ('FY', 'FY 2022-23', 26950000, 'current', 14.2, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'revised',  '2024-02-29'),
  ('FY', 'FY 2021-22', 14926000, 'constant', 9.7, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'revised',  '2023-02-28'),
  ('FY', 'FY 2021-22', 23471000, 'current', 18.2, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'revised',  '2023-02-28'),
  ('FY', 'FY 2020-21', 13687000, 'constant', -5.8, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'revised',  '2022-02-28'),
  ('FY', 'FY 2020-21', 19853000, 'current',  -1.4, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'revised',  '2022-02-28'),
  ('FY', 'FY 2019-20', 14535000, 'constant', 3.9, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'revised',  '2021-02-26'),
  ('FY', 'FY 2019-20', 20075000, 'current',  6.2, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'revised',  '2021-02-26'),
  -- Quarterly Observations FY 2023-24
  ('Q', 'Q1 2023-24', 4037000, 'constant', 8.2, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'official', '2023-08-31'),
  ('Q', 'Q1 2023-24', 7067000, 'current',  8.5, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'official', '2023-08-31'),
  ('Q', 'Q2 2023-24', 4174000, 'constant', 8.1, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'official', '2023-11-30'),
  ('Q', 'Q2 2023-24', 7218000, 'current',  9.4, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'official', '2023-11-30'),
  ('Q', 'Q3 2023-24', 4372000, 'constant', 8.6, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'official', '2024-02-29'),
  ('Q', 'Q3 2023-24', 7549000, 'current', 10.6, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'official', '2024-02-29'),
  ('Q', 'Q4 2023-24', 4799000, 'constant', 7.8, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'official', '2024-05-31'),
  ('Q', 'Q4 2023-24', 7702000, 'current',  9.9, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'official', '2024-05-31')
ON CONFLICT (period_label, period_type, price_type, base_year_id, methodology_version_id, status) DO NOTHING;

-- 2011-12 Series (Historical Benchmark)
INSERT INTO gdp_observations (period_type, period_label, value_crore, price_type, growth_rate_yoy, base_year_id, methodology_version_id, source_id, status, publication_date)
VALUES
  ('FY', 'FY 2021-22', 14926000, 'constant', 8.7, 'b1111111-1111-1111-1111-111111111111', 'm1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'official', '2022-05-31'),
  ('FY', 'FY 2020-21', 13687000, 'constant', -6.6, 'b1111111-1111-1111-1111-111111111111', 'm1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'official', '2021-05-31'),
  ('FY', 'FY 2019-20', 14535000, 'constant', 3.7, 'b1111111-1111-1111-1111-111111111111', 'm1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'official', '2020-05-29'),
  ('FY', 'FY 2018-19', 13993000, 'constant', 6.5, 'b1111111-1111-1111-1111-111111111111', 'm1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'official', '2019-05-31')
ON CONFLICT (period_label, period_type, price_type, base_year_id, methodology_version_id, status) DO NOTHING;

-- 5. Official GVA Observations
INSERT INTO gva_observations (period_type, period_label, value_crore, price_type, growth_rate_yoy, base_year_id, methodology_version_id, source_id, status, publication_date)
VALUES
  ('FY', 'FY 2023-24', 16005000, 'constant', 7.2, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'official', '2024-05-31'),
  ('FY', 'FY 2023-24', 26762000, 'current',  8.9, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'official', '2024-05-31'),
  ('FY', 'FY 2022-23', 14930000, 'constant', 6.7, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'revised',  '2024-02-29')
ON CONFLICT (period_label, price_type, base_year_id, methodology_version_id) DO NOTHING;

-- 6. Sector Observations (8 Major MoSPI Economic Sectors)
INSERT INTO sector_observations (sector_code, sector_name, period_type, period_label, value_crore, price_type, share_of_gva, growth_rate_yoy, base_year_id, methodology_version_id, source_id, status, publication_date)
VALUES
  ('AGRI', 'Agriculture, Forestry & Fishing', 'FY', 'FY 2023-24', 2520000, 'constant', 15.7, 1.4, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'official', '2024-05-31'),
  ('MINE', 'Mining & Quarrying',             'FY', 'FY 2023-24',  382000, 'constant',  2.4, 7.1, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'official', '2024-05-31'),
  ('MFG',  'Manufacturing',                  'FY', 'FY 2023-24', 2742000, 'constant', 17.1, 9.9, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'official', '2024-05-31'),
  ('UTIL', 'Electricity, Gas & Water',       'FY', 'FY 2023-24',  364000, 'constant',  2.3, 7.5, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'official', '2024-05-31'),
  ('CONS', 'Construction',                   'FY', 'FY 2023-24', 1405000, 'constant',  8.8, 10.7, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'official', '2024-05-31'),
  ('TRAD', 'Trade, Hotels & Transport',       'FY', 'FY 2023-24', 2984000, 'constant', 18.6, 6.4, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'official', '2024-05-31'),
  ('FIN',  'Financial & Real Estate Services', 'FY', 'FY 2023-24', 3510000, 'constant', 21.9, 8.4, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'official', '2024-05-31'),
  ('PUB',  'Public Admin & Other Services',  'FY', 'FY 2023-24', 2098000, 'constant', 13.1, 7.7, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'official', '2024-05-31')
ON CONFLICT DO NOTHING;

-- 7. Official Deflator Observations
INSERT INTO deflator_observations (deflator_type, period_type, period_label, deflator_value, base_year_id, methodology_version_id, source_id, status, publication_date)
VALUES
  ('gdp', 'FY', 'FY 2023-24', 1.4, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'derived', '2024-05-31'),
  ('gdp', 'Q',  'Q1 2023-24', 0.8, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'derived', '2023-08-31'),
  ('gdp', 'Q',  'Q2 2023-24', 1.6, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'derived', '2023-11-30'),
  ('gdp', 'Q',  'Q3 2023-24', 1.2, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'derived', '2024-02-29'),
  ('gdp', 'Q',  'Q4 2023-24', 1.9, 'b2222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'derived', '2024-05-31')
ON CONFLICT (deflator_type, period_label, base_year_id) DO NOTHING;

-- 8. Official Price Indices (CPI Headline from MoSPI, WPI Headline from DPIIT)
INSERT INTO price_indices (index_type, series_name, base_year, period_type, period_label, index_value, yoy_change_pct, source_id, status, publication_date)
VALUES
  ('cpi', 'Consumer Price Index (Combined)', '2012', 'M', '2024-04', 188.3, 4.83, 's1111111-1111-1111-1111-111111111111', 'official', '2024-05-13'),
  ('cpi', 'Consumer Price Index (Combined)', '2012', 'M', '2024-03', 187.4, 4.85, 's1111111-1111-1111-1111-111111111111', 'official', '2024-04-12'),
  ('cpi', 'Consumer Price Index (Combined)', '2012', 'M', '2024-02', 186.8, 5.09, 's1111111-1111-1111-1111-111111111111', 'official', '2024-03-12'),
  ('wpi', 'Wholesale Price Index (All Commodities)', '2011-12', 'M', '2024-04', 154.2, 1.26, 's2222222-2222-2222-2222-222222222222', 'official', '2024-05-14'),
  ('wpi', 'Wholesale Price Index (All Commodities)', '2011-12', 'M', '2024-03', 153.1, 0.53, 's2222222-2222-2222-2222-222222222222', 'official', '2024-04-15'),
  ('wpi', 'Wholesale Price Index (All Commodities)', '2011-12', 'M', '2024-02', 152.8, 0.20, 's2222222-2222-2222-2222-222222222222', 'official', '2024-03-14')
ON CONFLICT (index_type, series_name, period_label) DO NOTHING;

-- 9. Official GDP Revision History (Tracking MoSPI sequential releases)
INSERT INTO revisions (id, entity_type, entity_id, revision_sequence, from_value, to_value, from_status, to_status, revision_date, release_label, revision_reason, source_id)
VALUES
  ('r1111111-1111-1111-1111-111111111111', 'gdp_observation', 'b2222222-2222-2222-2222-222222222222', 1, 0.0, 7.0, 'estimated',   'official', '2023-01-06', 'First Advance Estimate (Jan 2023)', 'Early annual projection based on initial benchmark data', 's1111111-1111-1111-1111-111111111111'),
  ('r2222222-2222-2222-2222-222222222222', 'gdp_observation', 'b2222222-2222-2222-2222-222222222222', 2, 7.0, 7.0, 'official',    'official', '2023-02-28', 'Second Advance Estimate (Feb 2023)', 'Incorporation of revised industrial IIP and agricultural initial estimates', 's1111111-1111-1111-1111-111111111111'),
  ('r3333333-3333-3333-3333-333333333333', 'gdp_observation', 'b2222222-2222-2222-2222-222222222222', 3, 7.0, 7.2, 'official',    'provisional', '2023-05-31', 'Provisional Estimates (May 2023)', 'Incorporation of full-year government fiscal accounts and audited corporate financial indicators', 's1111111-1111-1111-1111-111111111111'),
  ('r4444444-4444-4444-4444-444444444444', 'gdp_observation', 'b2222222-2222-2222-2222-222222222222', 4, 7.2, 7.0, 'provisional', 'revised', '2024-02-29', 'First Revised Estimate (Feb 2024)', 'Comprehensive reconciliation with MCA-21 annual corporate returns and ASI final factory data', 's1111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;

-- 10. Official Sovereign Credit Ratings for India
INSERT INTO sovereign_ratings (id, country, agency, rating, outlook, rating_date, is_current, source_id)
VALUES
  ('rt111111-1111-1111-1111-111111111111', 'India', 'moodys', 'Baa3', 'Stable',   '2024-08-18', TRUE,  's5555555-5555-5555-5555-555555555555'),
  ('rt222222-2222-2222-2222-222222222222', 'India', 'sp',     'BBB-', 'Positive', '2024-05-29', TRUE,  's6666666-6666-6666-6666-666666666666'),
  ('rt333333-3333-3333-3333-333333333333', 'India', 'fitch',  'BBB-', 'Stable',   '2024-01-16', TRUE,  's4444444-4444-4444-4444-444444444444'),
  ('rt444444-4444-4444-4444-444444444444', 'India', 'sp',     'BBB-', 'Stable',   '2023-05-18', FALSE, 's6666666-6666-6666-6666-666666666666')
ON CONFLICT (country, agency, rating_date) DO NOTHING;

-- Rating Events
INSERT INTO rating_events (id, sovereign_rating_id, action_type, press_release_url, event_date, notes)
VALUES
  ('re111111-1111-1111-1111-111111111111', 'rt222222-2222-2222-2222-222222222222', 'Outlook_Change', 'https://disclosure.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3183563', '2024-05-29', 'S&P Global revised outlook on India to Positive from Stable citing robust economic growth and improved fiscal quality.'),
  ('re222222-2222-2222-2222-222222222222', 'rt111111-1111-1111-1111-111111111111', 'Affirm', 'https://www.moodys.com/research/India-Baa3-Stable', '2024-08-18', 'Moody''s affirmed Baa3 sovereign rating with Stable outlook reflecting sound economic fundamentals and high growth trajectory.')
ON CONFLICT (id) DO NOTHING;

-- 11. Official State-Level GVA / GSDP Observations (MoSPI SDP & Directorate of Economics and Statistics)
INSERT INTO state_gva_observations (state_code, state_name, period_type, period_label, gsdp_crore, gva_crore, growth_rate_yoy, share_of_national_gva, base_year_id, source_id, status, publication_date)
VALUES
  ('MH', 'Maharashtra',     'FY', 'FY 2023-24', 3879000, 2215000, 7.6, 13.9, 'b2222222-2222-2222-2222-222222222222', 's8888888-8888-8888-8888-888888888888', 'official', '2024-06-15'),
  ('TN', 'Tamil Nadu',      'FY', 'FY 2023-24', 2722000, 1580000, 8.2,  9.8, 'b2222222-2222-2222-2222-222222222222', 's8888888-8888-8888-8888-888888888888', 'official', '2024-06-15'),
  ('GJ', 'Gujarat',         'FY', 'FY 2023-24', 2562000, 1620000, 8.5,  9.2, 'b2222222-2222-2222-2222-222222222222', 's8888888-8888-8888-8888-888888888888', 'official', '2024-06-15'),
  ('KA', 'Karnataka',       'FY', 'FY 2023-24', 2500000, 1510000, 8.0,  9.0, 'b2222222-2222-2222-2222-222222222222', 's8888888-8888-8888-8888-888888888888', 'official', '2024-06-15'),
  ('UP', 'Uttar Pradesh',   'FY', 'FY 2023-24', 2439000, 1420000, 7.8,  8.8, 'b2222222-2222-2222-2222-222222222222', 's8888888-8888-8888-8888-888888888888', 'official', '2024-06-15'),
  ('WB', 'West Bengal',     'FY', 'FY 2023-24', 1719000, 1020000, 6.9,  6.2, 'b2222222-2222-2222-2222-222222222222', 's8888888-8888-8888-8888-888888888888', 'official', '2024-06-15'),
  ('RJ', 'Rajasthan',       'FY', 'FY 2023-24', 1524000,  890000, 7.1,  5.5, 'b2222222-2222-2222-2222-222222222222', 's8888888-8888-8888-8888-888888888888', 'official', '2024-06-15'),
  ('AP', 'Andhra Pradesh',  'FY', 'FY 2023-24', 1440000,  880000, 7.4,  5.2, 'b2222222-2222-2222-2222-222222222222', 's8888888-8888-8888-8888-888888888888', 'official', '2024-06-15'),
  ('TG', 'Telangana',       'FY', 'FY 2023-24', 1400000,  860000, 8.4,  5.0, 'b2222222-2222-2222-2222-222222222222', 's8888888-8888-8888-8888-888888888888', 'official', '2024-06-15'),
  ('MP', 'Madhya Pradesh',  'FY', 'FY 2023-24', 1363000,  820000, 7.2,  4.9, 'b2222222-2222-2222-2222-222222222222', 's8888888-8888-8888-8888-888888888888', 'official', '2024-06-15'),
  ('KL', 'Kerala',          'FY', 'FY 2023-24', 1130000,  690000, 6.5,  4.1, 'b2222222-2222-2222-2222-222222222222', 's8888888-8888-8888-8888-888888888888', 'official', '2024-06-15'),
  ('HR', 'Haryana',         'FY', 'FY 2023-24', 1120000,  710000, 7.6,  4.0, 'b2222222-2222-2222-2222-222222222222', 's8888888-8888-8888-8888-888888888888', 'official', '2024-06-15'),
  ('DL', 'Delhi (NCT)',     'FY', 'FY 2023-24', 1108000,  720000, 7.4,  4.0, 'b2222222-2222-2222-2222-222222222222', 's8888888-8888-8888-8888-888888888888', 'official', '2024-06-15'),
  ('OR', 'Odisha',          'FY', 'FY 2023-24',  836000,  530000, 7.3,  3.0, 'b2222222-2222-2222-2222-222222222222', 's8888888-8888-8888-8888-888888888888', 'official', '2024-06-15'),
  ('PB', 'Punjab',          'FY', 'FY 2023-24',  742000,  460000, 6.2,  2.7, 'b2222222-2222-2222-2222-222222222222', 's8888888-8888-8888-8888-888888888888', 'official', '2024-06-15')
ON CONFLICT (state_code, period_label, base_year_id) DO NOTHING;
