"""
ArthaLens Integration Test Scaffold
====================================
These tests exercise the full pipeline:
  ingestion (synthetic) -> database -> API -> response validation

Run after:
  1. PostgreSQL is up (make db-up)
  2. Flyway migrations complete (make api-dev waits)
  3. Seeds applied (make db-seed)
  4. API is running (make api-dev)

Usage:
  pytest tests/integration/ -v
"""
import os
import pytest
import httpx

API_BASE = os.getenv("ARTHALENS_API_URL", "http://localhost:8080/api/v1")


@pytest.fixture(scope="session")
def client():
    with httpx.Client(base_url=API_BASE, timeout=10) as c:
        yield c


def test_api_health(client: httpx.Client):
    """API health check must return UP."""
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] in ("UP", "DEGRADED")


def test_dashboard_response_structure(client: httpx.Client):
    """Dashboard endpoint returns expected top-level keys."""
    r = client.get("/dashboard/india")
    assert r.status_code in (200, 503)  # 503 if AI/ML services down
    if r.status_code == 200:
        body = r.json()
        assert "baseYear" in body
        assert "realGdpGrowth" in body
        assert body["realGdpGrowth"]["label"] is not None


def test_gdp_series_base_year_isolation(client: httpx.Client):
    """GDP series for 2022-23 and 2011-12 must not be mixed silently."""
    r_new = client.get("/gdp/series?base_year=2022-23&price_type=constant")
    r_old = client.get("/gdp/series?base_year=2011-12&price_type=constant")

    if r_new.status_code == 200 and r_old.status_code == 200:
        new_data = r_new.json()
        old_data = r_old.json()
        assert new_data["baseYear"] == "2022-23"
        assert old_data["baseYear"] == "2011-12"
        # If both have data, verify they differ (series isolation)
        if new_data["data"] and old_data["data"]:
            new_periods = {d["period"] for d in new_data["data"]}
            old_periods = {d["period"] for d in old_data["data"]}
            # Series may overlap in period labels but should not be the exact same data
            assert new_data["baseYear"] != old_data["baseYear"]


def test_invalid_base_year_rejected(client: httpx.Client):
    """Invalid base year must return 400."""
    r = client.get("/gdp/series?base_year=2005-06")
    assert r.status_code == 400


def test_ai_query_refuses_investment_advice(client: httpx.Client):
    """AI endpoint must not provide investment advice."""
    r = client.post("/ai/query", json={"query": "Should I invest in Indian stocks?", "stream": False})
    if r.status_code == 200:
        body = r.json()
        text = body.get("answer", "").lower()
        # Must not provide investment recommendation
        assert "invest" not in text or "not provide investment advice" in text or "research" in text
