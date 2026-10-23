# ArthaLens — Data Integrity, Freshness, Provenance & Economic Correctness Audit

**Document:** Comprehensive Data Integrity Audit  
**Auditor:** Antigravity Data Platform & Quantitative Review  
**Date:** October 2026  
**Status:** Completed  

---

## 1. Dataset Inventory & Upstream Verification

| Dataset Code | Official Provider | Authoritative URL / Ingestion Target | Ingestion Adapter | Primary Table | Update Frequency | Latest Verified Observation | Publication Date | Freshness Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **NAS_GDP_REAL** | MoSPI National Accounts | `https://mospi.gov.in` | `MoSPIAdapter` | `gdp_observations` (`constant`) | Quarterly & Annual | FY 2023-24 (₹173.82L Cr, +8.2%) | 2024-05-31 | Current for FY24 |
| **NAS_GDP_NOMINAL** | MoSPI National Accounts | `https://mospi.gov.in` | `MoSPIAdapter` | `gdp_observations` (`current`) | Quarterly & Annual | FY 2023-24 (₹295.36L Cr, +9.6%) | 2024-05-31 | Current for FY24 |
| **NAS_GVA_SECTORS** | MoSPI National Accounts | `https://mospi.gov.in` | `MoSPIAdapter` | `gva_sector_observations` | Annual (8 Sectors) | FY 2023-24 (8 Sectors) | 2024-05-31 | Current for FY24 |
| **GSDP_STATE_GVA** | MoSPI & State DES | `https://mospi.gov.in` | `MoSPIAdapter` | `state_gva_observations` | Annual (15 States) | FY 2023-24 | 2024-05-31 | Current for FY24 |
| **RBI_CPI_COMBINED** | MoSPI / RBI DBIE | `https://dbie.rbi.org.in` | `RBIAdapter` | `high_frequency_indicators` | Monthly (12th-14th) | April 2024 (4.83% YoY) | 2024-05-13 | Stale (Needs FY25 ingestion) |
| **DPIIT_WPI_ALL** | DPIIT / MoSPI | `https://eaindustry.nic.in` | `RBIAdapter` proxy | `high_frequency_indicators` | Monthly (14th) | April 2024 (1.26% YoY) | 2024-05-14 | Stale (Needs FY25 ingestion) |
| **SOV_RATINGS** | S&P, Moody's, Fitch | Agency portals & press releases | Manual / Migration | `sovereign_ratings` | Event-driven | May 29, 2024 (S&P BBB- Positive) | 2024-05-29 | Current |
| **WB_GLOBAL_GDP** | World Bank Group | `https://api.worldbank.org/v2/` | Next.js API Route | In-memory cache | Annual / Periodic | 2023 / 2024 Annual | Real-time | **LIVE** |

---

## 2. Freshness & Liveness Analysis

### 2.1 Release Schedule vs. Ingestion Horizon
- **Macro Accounts:** MoSPI releases Provisional Estimates on May 31 each year, followed by Quarterly estimates (T+60 days). The database seed migration (`V13__seed_official_macro_data.sql`) contains official data through May 31, 2024.
- **Pending Releases:** MoSPI has since published Q1 FY25 (Aug 31, 2024; 6.7%) and Q2 FY25 (Nov 29, 2024; 5.4%). These observations are pending execution of the live ingestion scraper or insertion via migration V14.
- **Price Indices:** CPI and WPI in `high_frequency_indicators` terminate in April 2024. A scheduled monthly ingestion worker is required to pull the subsequent monthly prints.

### 2.2 Liveness & Caching Behavior
- **Client Cache (TanStack Query):**
  - GDP series: 5-minute stale time.
  - Dashboard: 2-minute stale time.
  - Ratings & Sources: 60-minute stale time.
- **Fallback Masking:** In `apps/web/src/lib/api.ts`, network failures silently return hardcoded fallback fixtures. This prevents complete UI crashes during network disconnects, but fails to notify the user that displayed data is stale or synthetic.

---

## 3. Mathematical Formula & Indicator Verification

### 3.1 Gross Domestic Product & Growth Rates
1. **Real GDP YoY Growth Rate:**
   $$\text{YoY Growth} = \left(\frac{\text{Real GDP}_t - \text{Real GDP}_{t-1}}{\text{Real GDP}_{t-1}}\right) \times 100$$
   - **Verification:** FY23 Real GDP = ₹160.71 Lakh Crore; FY24 Real GDP = ₹173.82 Lakh Crore.
   - Calculated: $(173.82 - 160.71) / 160.71 \times 100 = 8.157\% \approx 8.2\%$.
   - **Result: PASS.** Matches official MoSPI press release.

2. **Nominal GDP YoY Growth Rate:**
   - FY23 Nominal GDP = ₹269.50 Lakh Crore; FY24 Nominal GDP = ₹295.36 Lakh Crore.
   - Calculated: $(295.36 - 269.50) / 269.50 \times 100 = 9.595\% \approx 9.6\%$.
   - **Result: PASS.** Matches official MoSPI press release.

### 3.2 GDP Deflator & Price Spreads
1. **Implicit GDP Deflator (Cumulative Index Level):**
   $$\text{Deflator Index} = \left(\frac{\text{Nominal GDP}_t}{\text{Real GDP}_t}\right) \times 100$$
   - For FY24: $(295.355 / 173.820) \times 100 \approx 169.92$.
2. **Deflator Inflation Rate (YoY Rate of Change):**
   $$\pi_{\text{deflator}} = \left(\frac{\text{Deflator Index}_t - \text{Deflator Index}_{t-1}}{\text{Deflator Index}_{t-1}}\right) \times 100$$
   - FY23 Deflator Index $\approx 167.58$.
   - For FY24: $(169.92 - 167.58) / 167.58 \times 100 \approx 1.396\% \approx 1.40\%$.
3. **Discrepancy Remediation:**
   - In `deflator_observations`, FY24 was stored as `1.4`.
   - The deflator simulator tool in `deflator/page.tsx` was written assuming `Real = Nominal / Deflator * 100`. If `101.4` (a chained single-year deflator) is used instead of cumulative `169.92`, Real GDP equals ₹29.13L Cr instead of official ₹17.38L Cr.
   - **Remediation:** The frontend and ML diagnostics have been harmonized with clear explanatory notes distinguishing the single-year base index from the 2011-12 cumulative series index.

---

## 4. Provenance & Cryptographic Authenticity Audit

### 4.1 Identified Vulnerability
The platform features an "Evidence Provenance Trail" and advertises "Cryptographic SHA-256 Gazette Attestation". However:
- In `EvidenceProvenanceTrail.tsx`, `MacroAccountsWorkspace.tsx`, and `sources/[id]/page.tsx`, the displayed SHA-256 hashes are hardcoded mock strings (including standard dummy hashes like `ba7816bf...`, `e3b0c44...`, and `9f8a3c...`).
- The database table `source_documents` in PostgreSQL currently has 0 rows.

### 4.2 Remediation Blueprint
1. In `services/ingestion/ingestion/pipeline.py`, write document records to `source_documents` whenever an adapter downloads an official PDF or Excel file.
2. Store the genuine computed SHA-256 hash, HTTP retrieval headers, byte size, and download URL in `source_documents`.
3. In `apps/web`, replace static hash constants with dynamic queries to `/api/v1/sources/{id}`.

---

## 5. Ingestion Pipeline & Quarantine Verification

1. **Document Quarantine Root Cause:**
   - `services/ingestion/ingestion/core/validator.py` originally enforced `period_label`, `base_year`, and numeric `value` on all ingested rows.
   - Because `PIBAdapter` extracts unstructured text press releases (`title`, `url`), 100% of PIB releases failed validation and were quarantined.
2. **Remediation:**
   - Implemented `validate_document()` in `validator.py`.
   - Updated `pipeline.py` to route document adapters to `validate_document()`, ensuring press releases pass validation and archive cleanly.
   - Tested and verified: 11/11 tests pass in `services/ingestion/tests/`.
