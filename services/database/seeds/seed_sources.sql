-- seed_sources.sql
-- Metadata-only seeds. No fabricated economic values.
-- Official source URLs confirmed from documentation.

INSERT INTO sources (name, authority, canonical_url, data_types, update_frequency, access_method, parser_version)
VALUES
  ('MoSPI National Accounts Statistics',
   'Ministry of Statistics and Programme Implementation',
   'https://mospi.gov.in/national-accounts-statistics',
   ARRAY['GDP','GVA','NAS','deflators','sector'],
   'quarterly (advance + revised); annual',
   'download',
   '1.0'),

  ('RBI Database on Indian Economy',
   'Reserve Bank of India',
   'https://dbie.rbi.org.in',
   ARRAY['CPI','WPI','monetary','banking','trade','fiscal'],
   'monthly',
   'api',
   '1.0'),

  ('Government of India Press Information Bureau',
   'Press Information Bureau, GoI',
   'https://pib.gov.in',
   ARRAY['press_release','fiscal','ratings'],
   'as released',
   'download',
   '1.0'),

  ('Fitch Ratings - India Sovereign',
   'Fitch Ratings',
   'https://www.fitchratings.com/sovereigns/india',
   ARRAY['sovereign_rating'],
   'as released',
   'download',
   '1.0'),

  ('Moody''s Ratings - India',
   'Moody''s Ratings',
   'https://www.moodys.com/credit-ratings/India-Government-of-credit-rating-806456888',
   ARRAY['sovereign_rating'],
   'as released',
   'download',
   '1.0'),

  ('S&P Global Ratings - India',
   'S&P Global Ratings',
   'https://www.spglobal.com/ratings/en/research/india',
   ARRAY['sovereign_rating'],
   'as released',
   'download',
   '1.0');
