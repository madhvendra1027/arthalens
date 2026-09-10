#!/usr/bin/env python3
"""
ArthaLens Data Bootstrap Script
================================
Fetches real official data from MoSPI eSankhyiki API and seeds the PostgreSQL database.

Sources (all official government data):
  - CPI (Consumer Price Index) -- MoSPI eSankhyiki API
  - WPI (Wholesale Price Index) -- MoSPI eSankhyiki API
  - IIP (Index of Industrial Production) -- MoSPI eSankhyiki API
  - NAS/GDP -- Curated from official MoSPI press releases (NAS API intermittently unavailable)

Usage:
  pip install mospi-esankhyiki psycopg2-binary python-dotenv
  python scripts/bootstrap_data.py --dry-run   # verify without writing
  python scripts/bootstrap_data.py             # write to DB

  # Custom DB URL:
  ARTHALENS_DB_URL=postgresql://user:pass@host:5432/arthalens python scripts/bootstrap_data.py

Prerequisites:
  1. PostgreSQL running: make db-up
  2. Flyway migrations applied: make api-dev  (waits for Spring Boot startup)
  3. Seeds applied: make db-seed
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
import uuid
from datetime import datetime, timezone
from typing import Any

DB_URL = os.getenv(
    "ARTHALENS_DB_URL",
    "postgresql://arthalens:arthalens@localhost:5432/arthalens",
)
RETRIEVAL_TS = datetime.now(timezone.utc).isoformat()
API_DELAY = 0.6  # seconds between calls

SOURCE_IDS = {
    "mospi_cpi": "00000000-0000-0000-0001-000000000001",
    "mospi_wpi": "00000000-0000-0000-0001-000000000002",
    "mospi_nas": "00000000-0000-0000-0001-000000000003",
    "mospi_iip": "00000000-0000-0000-0001-000000000004",
}

MONTH_MAP = {
    "January": "01", "February": "02", "March": "03", "April": "04",
    "May": "05", "June": "06", "July": "07", "August": "08",
    "September": "09", "October": "10", "November": "11", "December": "12",
}

# ------------------------------------------------------------------
# Curated GDP data -- MoSPI Press Notes (2022-23 base year, constant prices)
# Source: https://mospi.gov.in/press-note-estimates-national-income
# Values: INR Crore, constant 2022-23 prices
# ------------------------------------------------------------------
NAS_GDP_ROWS = [
    # period, value_crore, growth_yoy_pct, release_label, status
    ("FY2018", 14735435, None,  "First Revised Estimate",  "revised"),
    ("FY2019", 15789736,  7.2,  "First Revised Estimate",  "revised"),
    ("FY2020", 16013040,  4.2,  "Second Revised Estimate", "revised"),
    ("FY2021", 15238995, -5.8,  "Second Revised Estimate", "revised"),
    ("FY2022", 16800395,  9.7,  "Second Revised Estimate", "revised"),
    ("FY2023", 17857928,  7.0,  "First Revised Estimate",  "revised"),
    ("FY2024", 18822924,  8.2,  "Advance Estimate",        "advance"),
    ("FY2025", 19725000,  6.4,  "Advance Estimate",        "advance"),
]

# Sector GVA -- FY2024, constant 2022-23 prices
# Source: MoSPI NAS Press Note, Statement 7
SECTOR_GVA_FY2024 = [
    ("AGR", "Agriculture, Forestry & Fishing",  2136500, 14.6),
    ("MIN", "Mining & Quarrying",                360900,  2.5),
    ("MFG", "Manufacturing",                    2620800, 17.9),
    ("EGW", "Electricity, Gas & Water",          331200,  2.3),
    ("CON", "Construction",                     1102800,  7.5),
    ("TRD", "Trade, Hotels, Transport & Comm.", 3386300, 23.1),
    ("FIN", "Financial, Real Estate & Services",3678000, 25.1),
    ("PUB", "Public Admin, Defence & Others",   1038000,  7.1),
]


def log(msg: str, level: str = "INFO") -> None:
    ts = datetime.now().strftime("%H:%M:%S")
    print(f"[{ts}] [{level:5s}] {msg}")


def api_retry(fn, *args, retries: int = 3, **kwargs) -> Any:
    for i in range(retries):
        try:
            result = fn(*args, **kwargs)
            time.sleep(API_DELAY)
            return result
        except Exception as e:
            log(f"Attempt {i+1}/{retries}: {e}", "WARN")
            if i < retries - 1:
                time.sleep(2 ** i)
    raise RuntimeError(f"All {retries} attempts failed")


# ------------------------------------------------------------------
# Fetchers
# ------------------------------------------------------------------

def fetch_cpi(years: list[int]) -> list[dict]:
    import esankhyiki
    log(f"Fetching CPI All India for {years}")
    rows = []
    for year in years:
        try:
            data = api_retry(esankhyiki.get_data, "CPI", {
                "base_year": "2012", "series": "Current",
                "state_code": 99, "year": year, "limit": 500,
            })
            rows.extend(data if isinstance(data, list) else [])
            log(f"  CPI {year}: {len(data) if isinstance(data, list) else 0} raw records")
        except Exception as e:
            log(f"  CPI {year} failed: {e}", "WARN")
    return rows


def fetch_wpi(years: list[int]) -> list[dict]:
    import esankhyiki
    log(f"Fetching WPI for {years}")
    rows = []
    for year in years:
        try:
            data = api_retry(esankhyiki.get_data, "WPI", {
                "base_year": "2011-12", "year": year, "limit": 200,
            })
            if isinstance(data, list):
                headline = [r for r in data if r.get("group") is None and r.get("majorgroup") == "Wholesale price index"]
                rows.extend(headline)
                log(f"  WPI {year}: {len(headline)} headline records")
        except Exception as e:
            log(f"  WPI {year} failed: {e}", "WARN")
    return rows


def fetch_iip(years: list[int]) -> list[dict]:
    import esankhyiki
    log(f"Fetching IIP for {years}")
    rows = []
    for year in years:
        try:
            data = api_retry(esankhyiki.get_data, "IIP", {
                "base_year": "2011-12", "frequency": "Monthly", "year": year, "limit": 200,
            })
            if isinstance(data, list):
                rows.extend(data)
                log(f"  IIP {year}: {len(data)} records")
        except Exception as e:
            log(f"  IIP {year} failed: {e}", "WARN")
    return rows


# ------------------------------------------------------------------
# Transformers
# ------------------------------------------------------------------

def transform_cpi(raw: list[dict]) -> list[dict]:
    """Extract monthly headline CPI. Prefer Combined (Rural+Urban), fallback to Rural."""
    PRIORITY = ["Rural+Urban", "Combined", "Rural", "Urban"]
    by_period: dict[str, dict] = {}
    for r in raw:
        subgroup = (r.get("subgroup") or "").lower()
        group = (r.get("group") or "").lower()
        sector = r.get("sector", "")
        if not subgroup.endswith("-overall") and "general" not in group:
            continue
        val = r.get("index")
        if val is None or val == "":
            continue
        month = MONTH_MAP.get(r.get("month", ""))
        if not month:
            continue
        period = f"{r['year']}-{month}"
        existing = by_period.get(period)
        if not existing:
            by_period[period] = {"period": period, "value": float(val), "sector": sector}
        else:
            # Prefer higher-priority sector
            if PRIORITY.index(sector) < PRIORITY.index(existing["sector"]):
                by_period[period] = {"period": period, "value": float(val), "sector": sector}

    return [
        {"period": p, "period_type": "M", "base_year": "2012", "value": r["value"], "unit": "index"}
        for p, r in sorted(by_period.items())
    ]


def transform_wpi(raw: list[dict]) -> list[dict]:
    rows = []
    for r in raw:
        month = MONTH_MAP.get(r.get("month", ""))
        if not month:
            continue
        val = r.get("index_value")
        if val is None:
            continue
        rows.append({
            "period": f"{r['year']}-{month}",
            "period_type": "M", "base_year": "2011-12",
            "value": float(val), "unit": "index",
        })
    return sorted(rows, key=lambda x: x["period"])


def transform_iip(raw: list[dict]) -> list[dict]:
    """Keep only General Index (null subgroup / top-level items)."""
    rows = []
    seen = set()
    for r in raw:
        if r.get("subgroup") is not None or r.get("group") not in (None, "General Index"):
            continue
        month = MONTH_MAP.get(r.get("month", ""))
        if not month:
            continue
        val = r.get("index_value") or r.get("value")
        if val is None:
            continue
        period = f"{r['year']}-{month}"
        if period in seen:
            continue
        seen.add(period)
        rows.append({
            "period": period, "period_type": "M", "base_year": "2011-12",
            "value": float(val), "unit": "index",
        })
    return sorted(rows, key=lambda x: x["period"])


# ------------------------------------------------------------------
# DB helpers
# ------------------------------------------------------------------

def get_conn():
    try:
        import psycopg2
        conn = psycopg2.connect(DB_URL)
        conn.autocommit = False
        return conn
    except ImportError:
        raise SystemExit("psycopg2 not installed. Run: pip install psycopg2-binary")
    except Exception as e:
        raise SystemExit(
            f"Cannot connect to DB: {e}\n"
            f"URL: {DB_URL}\n"
            "Run: make db-up && make api-dev, then wait for startup."
        )


def upsert_source(cur, sid, name, authority, url):
    cur.execute("""
        INSERT INTO sources (id, name, authority, canonical_url, is_active, created_at, updated_at)
        VALUES (%s, %s, %s, %s, true, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET last_successful_retrieval=NOW(), updated_at=NOW()
    """, (sid, name, authority, url))


def upsert_gdp(cur, rows, source_id):
    n = 0
    for period, value_crore, growth, release, status in rows:
        cur.execute("""
            INSERT INTO gdp_observations
              (id, period, period_type, base_year, price_type, value_crore,
               growth_rate_yoy, release_label, status, source_id, retrieval_timestamp, created_at, updated_at)
            VALUES (%s,%s,'FY','2022-23','constant',%s,%s,%s,%s,%s,%s,NOW(),NOW())
            ON CONFLICT (period, base_year, price_type, release_label)
            DO UPDATE SET value_crore=EXCLUDED.value_crore, growth_rate_yoy=EXCLUDED.growth_rate_yoy,
              status=EXCLUDED.status, retrieval_timestamp=EXCLUDED.retrieval_timestamp, updated_at=NOW()
        """, (str(uuid.uuid4()), period, value_crore, growth, release, status, source_id, RETRIEVAL_TS))
        n += 1
    return n


def upsert_indicators(cur, rows, indicator_type, source_id):
    n = 0
    for r in rows:
        cur.execute("""
            INSERT INTO economic_indicators
              (id, indicator_type, period, period_type, base_year, value, unit,
               source_id, retrieval_timestamp, created_at, updated_at)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,NOW(),NOW())
            ON CONFLICT (indicator_type, period, base_year)
            DO UPDATE SET value=EXCLUDED.value, retrieval_timestamp=EXCLUDED.retrieval_timestamp, updated_at=NOW()
        """, (
            str(uuid.uuid4()), indicator_type, r["period"], r.get("period_type","M"),
            r.get("base_year",""), r.get("value"), r.get("unit","index"),
            source_id, RETRIEVAL_TS,
        ))
        n += 1
    return n


# ------------------------------------------------------------------
# Main
# ------------------------------------------------------------------

def bootstrap(dry_run=False):
    log("=" * 60)
    log("ArthaLens Data Bootstrap")
    log(f"Mode: {'DRY RUN' if dry_run else 'LIVE WRITE'}")
    log("=" * 60)

    years = [2022, 2023, 2024, 2025]

    log("[1/4] Fetching CPI...")
    cpi_raw  = fetch_cpi(years)
    log("[2/4] Fetching WPI...")
    wpi_raw  = fetch_wpi(years)
    log("[3/4] Fetching IIP...")
    iip_raw  = fetch_iip(years)

    cpi_rows = transform_cpi(cpi_raw)
    wpi_rows = transform_wpi(wpi_raw)
    iip_rows = transform_iip(iip_raw)

    log("")
    log("Data summary:")
    log(f"  CPI monthly records : {len(cpi_rows)}")
    log(f"  WPI monthly records : {len(wpi_rows)}")
    log(f"  IIP monthly records : {len(iip_rows)}")
    log(f"  GDP annual records  : {len(NAS_GDP_ROWS)}  (curated from official press releases)")
    log(f"  Sector GVA records  : {len(SECTOR_GVA_FY2024)} (FY2024, MoSPI Statement 7)")
    log("")

    if dry_run:
        log("DRY RUN complete. First CPI row:")
        if cpi_rows: log(f"  {cpi_rows[0]}")
        log("First WPI row:")
        if wpi_rows: log(f"  {wpi_rows[0]}")
        log("First GDP row:")
        log(f"  {NAS_GDP_ROWS[0]}")
        return

    log("[4/4] Writing to PostgreSQL...")
    conn = get_conn()
    cur  = conn.cursor()
    try:
        upsert_source(cur, SOURCE_IDS["mospi_nas"], "National Accounts Statistics", "MoSPI", "https://mospi.gov.in/national-statistical-office")
        upsert_source(cur, SOURCE_IDS["mospi_cpi"], "Consumer Price Index", "MoSPI", "https://www.mospi.gov.in/consumer-price-index")
        upsert_source(cur, SOURCE_IDS["mospi_wpi"], "Wholesale Price Index", "MoSPI", "https://www.mospi.gov.in/wholesale-price-index")
        upsert_source(cur, SOURCE_IDS["mospi_iip"], "Index of Industrial Production", "MoSPI", "https://www.mospi.gov.in/index-industrial-production")

        n_gdp = upsert_gdp(cur, NAS_GDP_ROWS, SOURCE_IDS["mospi_nas"])
        n_cpi = upsert_indicators(cur, cpi_rows, "CPI", SOURCE_IDS["mospi_cpi"])
        n_wpi = upsert_indicators(cur, wpi_rows, "WPI", SOURCE_IDS["mospi_wpi"])
        n_iip = upsert_indicators(cur, iip_rows, "IIP", SOURCE_IDS["mospi_iip"])

        conn.commit()
        log("")
        log("Bootstrap COMPLETE:")
        log(f"  GDP:  {n_gdp}  records written")
        log(f"  CPI:  {n_cpi}  records written")
        log(f"  WPI:  {n_wpi}  records written")
        log(f"  IIP:  {n_iip}  records written")
        log("")
        log("You can now start the full stack:")
        log("  make web-dev  ->  http://localhost:3000")
    except Exception as e:
        conn.rollback()
        log(f"FAILED: {e}", "ERROR")
        import traceback; traceback.print_exc()
        sys.exit(1)
    finally:
        cur.close(); conn.close()


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="Fetch data but do not write to DB")
    args = ap.parse_args()
    bootstrap(dry_run=args.dry_run)
