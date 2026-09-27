# ArthaLens Official Data Sources & Provenance Registry

## Overview

ArthaLens operates under a zero-mock, zero-hardcoding mandate. Every macroeconomic data point, statistical series, deflator, sectoral share, and sovereign credit rating served by the platform originates from verified, authoritative public institutions. 

This document serves as the master directory of all data providers, ingestion mechanisms, update frequencies, canonical endpoints, and data integrity guarantees implemented across ArthaLens.

---

## 1. Primary Official Data Authorities

| Authority | Domain / Scope | Data Coverage | Canonical Portal / API | Update Cadence |
|---|---|---|---|---|
| **MoSPI (CSO/NAD)** | Ministry of Statistics and Programme Implementation — National Accounts Division | Real GDP, Nominal GDP, GVA at Basic Prices, Sectoral Output, GDP Deflator, Annual/Quarterly Estimates | `https://mospi.gov.in/national-accounts-statistics` | Quarterly (Last working day of Feb, May, Aug, Nov) |
| **MoSPI (SDP)** & **State DES** | State Directorates of Economics and Statistics | Gross State Domestic Product (GSDP), State GVA (GSVA), State Sectoral Distribution | `https://mospi.gov.in/data` | Annual (with lag by state) |
| **RBI DBIE** | Reserve Bank of India — Database on Indian Economy | High-frequency monetary aggregates, Banking, Foreign Exchange, Liquidity, Benchmark Rates | `https://dbie.rbi.org.in` | Weekly, Fortnightly, Monthly |
| **MoSPI (FOD)** | MoSPI Field Operations Division | Consumer Price Index (CPI Headline, Rural, Urban, Combined, Core) | `https://mospi.gov.in/cpi` | Monthly (12th of every month) |
| **Office of Economic Adviser (DPIIT)** | Department for Promotion of Industry and Internal Trade, Ministry of Commerce & Industry | Wholesale Price Index (WPI All Commodities, Primary Articles, Fuel & Power, Manufactured Products) | `https://eaindustry.nic.in` | Monthly (14th of every month) |
| **PIB** | Press Information Bureau, Government of India | Official Press Releases for Advance Estimates, Provisional Estimates, Revised Estimates | `https://pib.gov.in` | Synchronous with release events |
| **World Bank Open Data** | International Bank for Reconstruction and Development / IDA | Global macroeconomic benchmarks (GDP current USD, GDP growth %, GDP per capita, CPI, Population) | `https://api.worldbank.org/v2/` | Annual / Periodic via Open REST API |
| **Sovereign Rating Agencies** | S&P Global, Moody's Investors Service, Fitch Ratings | Foreign & Local Currency Sovereign Ratings, Outlooks, Assessment Summaries | Official Agency Research & Rating Action Bulletins | Event-driven / Semi-annual review |

---

## 2. Detailed Series Specifications & Methodological Mappings

### 2.1 National Accounts Statistics (MoSPI NAS)
- **Base Years Supported:**
  - **Base Year 2011-12**: Effective from January 2015 to present series. Uses MCA-21 database for corporate sector coverage and GVA at Basic Prices.
  - **Base Year 2022-23**: The upcoming rebasing methodology incorporating updated Input-Output tables, expanded digital economy metrics, and ASI/MCA-21 harmonized sampling.
- **Aggregates Tracked:**
  - **GDP at Constant Market Prices (Real GDP)**: In INR Crore and YoY Growth Rate (%).
  - **GDP at Current Market Prices (Nominal GDP)**: In INR Crore and YoY Growth Rate (%).
  - **Gross Value Added (GVA) at Basic Prices**: Sum of 8 major sectors plus net taxes on products ($GDP = GVA + \text{Taxes on Products} - \text{Subsidies on Products}$).
- **Database Tables:** `gdp_observations`, `gva_observations`, `base_years`, `methodology_versions`.

### 2.2 Sectoral Breakdown (8 Key Economic Sectors)
National accounts categorize economic activity into 8 standard industrial classifications:
1. `AGR`: Agriculture, Forestry & Fishing
2. `MIN`: Mining & Quarrying
3. `MFG`: Manufacturing
4. `EGW`: Electricity, Gas, Water Supply & Other Utility Services
5. `CON`: Construction
6. `THC`: Trade, Hotels, Transport, Communication & Services related to Broadcasting
7. `FIN`: Financial, Real Estate & Professional Services
8. `PUB`: Public Administration, Defence & Other Services

- **Metrics Computed & Seeded:**
  - Sector GVA Value (INR Crore, Constant and Current prices).
  - Share of Total National GVA (percentage share).
  - Year-on-Year Growth Rate (%).
- **Database Table:** `sector_observations`.

### 2.3 State-Level GVA & GSDP (State Directorates of Economics & Statistics)
Tracks sub-national accounts for 15+ major Indian states and union territories:
- **States Covered:** Maharashtra (MH), Tamil Nadu (TN), Gujarat (GJ), Karnataka (KA), Uttar Pradesh (UP), West Bengal (WB), Rajasthan (RJ), Telangana (TG), Andhra Pradesh (AP), Madhya Pradesh (MP), Kerala (KL), Haryana (HR), Bihar (BR), Punjab (PB), Odisha (OD).
- **Metrics:** GSDP (INR Crore), GSVA (INR Crore), YoY Growth Rate (%), Share of National GVA (%).
- **Database Table:** `state_gva_observations`.

### 2.4 Price Indices & Derived GDP Deflators
- **CPI (Combined, Base 2012=100)**: Sourced from MoSPI. Used for consumer retail inflation tracking.
- **WPI (Base 2011-12=100)**: Sourced from DPIIT / Office of Economic Adviser. Used for producer/wholesale price tracking.
- **Implicit GDP Deflator**: Calculated systematically as:
  $$\text{GDP Deflator} = \left(\frac{\text{Nominal GDP}}{\text{Real GDP}}\right) \times 100$$
  - Sourced directly from MoSPI paired observations without arbitrary inflation adjustments.
- **Database Tables:** `price_indices`, `deflator_observations`.

### 2.5 Revision Tracking Engine
MoSPI publishes revisions in a multi-stage sequential release cycle:
1. **First Advance Estimates (FAE)**: Released ~January 5–7 before the Union Budget.
2. **Second Advance Estimates (SAE)**: Released on the last day of February with Q3 data.
3. **Provisional Estimates (PE)**: Released on May 31 with Q4 data (covering the full fiscal year).
4. **First Revised Estimates (FRE)**: Released 10 months after fiscal year end (~January of the following year).
5. **Second & Third Revised Estimates (SRE/TRE)**: Benchmark revisions finalized with ASI data.

- **Tracking:** Each release is tracked with date, release label, `from_value`, `to_value`, absolute revision delta, percentage delta, and official MoSPI press release citation.
- **Database Table:** `revisions`.

### 2.6 Global Economy Benchmarks (World Bank Open Data API)
- **API Endpoint:** `https://api.worldbank.org/v2/country/{countryCode}/indicator/{indicatorCode}?format=json`
- **Indicators Integrated:**
  - `NY.GDP.MKTP.CD`: GDP (current US$)
  - `NY.GDP.MKTP.KD.ZG`: GDP growth (annual %)
  - `NY.GDP.PCAP.CD`: GDP per capita (current US$)
  - `FP.CPI.TOTL.ZG`: Inflation, consumer prices (annual %)
  - `SP.POP.TOTL`: Population, total
- **Caching & Resilience:**
  - Next.js server route `/api/global-economies` queries World Bank live.
  - Multi-tier TTL caching (60 minutes server memory cache, stale-while-revalidate).
  - Hardened offline fallback baseline guaranteeing unbroken service during network degradation.

### 2.7 Sovereign Credit Ratings
- **Agencies:** Moody's Ratings, S&P Global Ratings, Fitch Ratings.
- **Tracked Parameters:** Foreign currency long-term debt rating, local currency rating, outlook (Stable, Positive, Negative), evaluation date, and release summaries.
- **Database Table:** `sovereign_ratings`.

---

## 3. Data Integrity & Provenance Architecture

```
[Official Authority Portal / API / PDF]
                   │
                   ▼ (HTTPS Ingestion Adapter)
    [Raw Payload Archive: SHA-256 Hashed]
                   │
                   ▼ (Strict Schema Validator)
   [Cross-Check & Identity Reconciliation]
                   │
                   ▼ (Flyway / Idempotent SQL Upsert)
      [PostgreSQL Database with Provenance]
                   ├── source_id (UUID -> sources table)
                   ├── retrieval_timestamp
                   ├── publication_date
                   ├── base_year_id (Strict isolation)
                   └── status ('official' | 'provisional')
```

### Provenance Attributes on Every Record
Every JSON API response and entity record includes:
- `source_id`: Foreign key to `sources` table containing publisher name, canonical URL, and description.
- `publication_date`: Official date declared on the authority's release bulletin.
- `retrieval_timestamp`: UTC timestamp when ArthaLens ingested the record.
- `status`: Verification status (`official`, `provisional`, `revised`).
- `base_year`: Explicit indicator to prevent accidental cross-methodology aggregation.

---

## 4. Base-Year Isolation Protocol

> **CRITICAL METHODOLOGICAL SAFEGUARD**
>
> Series calculated under Base Year 2011-12 and Base Year 2022-23 cannot be directly chained, averaged, or subtracted without explicit splicing methodology warnings.
>
> 1. The database enforces foreign keys to distinct `base_years` and `methodology_versions`.
> 2. API query endpoints (`/api/v1/gdp/series`, `/api/v1/gdp/sectors`, `/api/v1/gdp/revisions`) enforce base year segregation.
> 3. If a client explicitly passes `allowMixed=true`, responses return a prominent warning banner explaining the methodology discontinuity.
> 4. The frontend UI displays an active base-year badge and highlights methodology boundaries.
