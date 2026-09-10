# ArthaLens — Data Dictionary

Economic terms used throughout the platform, their definitions, and how they appear in the database.

---

## GDP & National Accounts

| Term | Definition | DB Column / Note |
|------|-----------|-----------------|
| **GDP** | Gross Domestic Product — total monetary value of all final goods and services produced in India in a given period | `gdp_observations.value` |
| **Nominal GDP** | GDP measured at current prices (not adjusted for inflation) | `gdp_observations.price_type = 'current'` |
| **Real GDP** | GDP measured at constant prices of a chosen base year, adjusted for inflation | `gdp_observations.price_type = 'constant'` |
| **GDP Growth Rate** | Year-on-year or quarter-on-quarter percentage change in real GDP | Derived; stored in `derived_metrics` |
| **GVA** | Gross Value Added — GDP minus taxes on products plus subsidies. Sum of value added by all producers | `gva_observations.value` |
| **Base Year** | The reference year against which constant-price GDP is measured. Current: 2022-23. Previous: 2011-12 | `base_years.year_label` |
| **2011-12 Series** | Old GDP series with 2011-12 as base year. Historical data only | `base_years.year_label = '2011-12'` |
| **2022-23 Series** | Current GDP series with 2022-23 as base year. Official from 2025 | `base_years.year_label = '2022-23'` |

---

## Price Indices & Deflators

| Term | Definition | DB Column / Note |
|------|-----------|-----------------|
| **GDP Deflator** | Ratio of nominal GDP to real GDP × 100. Measures economy-wide price changes | `deflator_observations.deflator_type = 'gdp'` |
| **CPI** | Consumer Price Index — measures changes in retail prices of a basket of goods consumed by households | `price_indices.index_type = 'cpi'` |
| **WPI** | Wholesale Price Index — measures changes in prices at the wholesale/producer level | `price_indices.index_type = 'wpi'` |
| **Single Deflation** | Deflating GVA using a single price index for both output and inputs | `methodology_versions.deflation_method = 'single'` |
| **Double Deflation** | Deflating output and inputs separately, then computing real value added. More accurate but data-intensive | `methodology_versions.deflation_method = 'double'` |

> ⚠️ CPI, WPI, and GDP Deflator measure **different price baskets and concepts**. They are not interchangeable.

---

## Periods & Frequencies

| Term | Definition | DB Format |
|------|-----------|-----------|
| **Financial Year (FY)** | April to March. FY2024-25 = April 2024 to March 2025 | `period_type = 'FY'`, `period_label = '2024-25'` |
| **Quarter** | Three-month period. Q1 FY = April–June | `period_type = 'Q'`, `period_label = 'Q1FY25'` |
| **Calendar Year** | January to December | `period_type = 'CY'` |
| **Monthly** | Single calendar month | `period_type = 'M'` |

---

## Observation Status

| Status | Meaning |
|--------|---------|
| `official` | Published in official MoSPI/RBI release, not subject to revision in this version |
| `provisional` | First estimate; subject to revision in subsequent releases |
| `revised` | Updated from a prior provisional estimate |
| `estimated` | ArthaLens-derived estimate; not an official government figure |
| `forecast` | ML model prediction; clearly labeled, not an official figure |
| `derived` | Computed from official values (e.g. growth rate from levels) |

---

## Sectors (NAS Classification)

| Sector | Sub-sectors |
|--------|------------|
| Agriculture, Forestry & Fishing | Crops, Livestock, Forestry, Fishing |
| Mining & Quarrying | |
| Manufacturing | |
| Electricity, Gas, Water Supply & Other Utility Services | |
| Construction | |
| Trade, Hotels, Transport, Communication & Broadcasting | |
| Financial, Real Estate & Professional Services | |
| Public Administration, Defence & Other Services | |

---

## Sovereign Ratings

| Term | Definition |
|------|-----------|
| **Sovereign Rating** | Credit rating assigned by a rating agency to a country''s government debt |
| **Investment Grade** | Rating of BBB-/Baa3 or above (Fitch/Moody''s) |
| **Outlook** | Agency''s view on direction of next rating action: Positive, Stable, Negative, Watch |

---

## Ingestion & Provenance

| Term | Definition |
|------|-----------|
| `ingestion_run_id` | UUID identifying a single execution of an ingestion job |
| `source_id` | FK to the `sources` table identifying the publisher |
| `content_hash` | SHA-256 hash of the raw downloaded artifact for deduplication |
| `retrieval_timestamp` | UTC timestamp when the data was fetched from the source |
| `publication_date` | Date the source officially published the data |
