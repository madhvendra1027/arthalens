"""World Bank Open Data Adapter.

Fetches authoritative international macroeconomic comparative data from World Bank Open API.
Indicators:
- NY.GDP.MKTP.CD: GDP (current US$)
- NY.GDP.MKTP.KD.ZG: GDP growth (annual %)
- NY.GDP.PCAP.CD: GDP per capita (current US$)
- FP.CPI.TOTL.ZG: Inflation, consumer prices (annual %)
- SP.POP.TOTL: Population, total
"""
from __future__ import annotations

import json
from typing import Any, Iterator

import structlog

from ingestion.core.provenance import Provenance, compute_content_hash, now_utc
from ingestion.core.run_manager import IngestionRun
from .base import SourceAdapter

logger = structlog.get_logger()

WORLD_BANK_API_BASE = "https://api.worldbank.org/v2/country"


class WorldBankAdapter(SourceAdapter):
    """Adapter for World Bank Open Data API."""

    adapter_id = "world_bank_wdi"
    adapter_version = "1.0"

    def __init__(
        self,
        countries: list[str] | None = None,
        indicator: str = "NY.GDP.MKTP.CD",
        source_id: str = "s7777777-7777-7777-7777-777777777777",
        **kwargs: Any,
    ) -> None:
        super().__init__(**kwargs)
        self.countries = countries or ["IND", "USA", "CHN", "DEU", "JPN", "GBR", "FRA", "BRA", "ITA", "CAN"]
        self.indicator = indicator
        self.source_id = source_id

    def _build_url(self) -> str:
        countries_str = ";".join(self.countries)
        return f"{WORLD_BANK_API_BASE}/{countries_str}/indicator/{self.indicator}?date=2021:2024&format=json&per_page=100"

    def fetch_raw(self, run: IngestionRun) -> tuple[bytes, Provenance]:
        url = self._build_url()
        response = self._get(url)
        run.http_status_code = response.status_code
        raw = response.content
        run.content_hash = compute_content_hash(raw)
        run.retrieval_timestamp = now_utc()

        provenance = self.get_provenance(url, self.source_id, run)
        provenance.content_hash = run.content_hash
        return raw, provenance

    def parse(self, raw: bytes, provenance: Provenance) -> Iterator[dict[str, Any]]:
        """Parse World Bank JSON response."""
        try:
            data = json.loads(raw)
            if not isinstance(data, list) or len(data) < 2 or not isinstance(data[1], list):
                logger.warning("world_bank.empty_or_invalid_response")
                return

            records = data[1]
            for item in records:
                if item.get("value") is None:
                    continue
                yield {
                    "country_code": item.get("countryiso3code"),
                    "country_name": item.get("country", {}).get("value"),
                    "indicator_id": item.get("indicator", {}).get("id"),
                    "indicator_name": item.get("indicator", {}).get("value"),
                    "period_type": "CY",
                    "period_label": str(item.get("date")),
                    "value": float(item.get("value")),
                    "unit": "USD" if "CD" in self.indicator else ("%" if "ZG" in self.indicator else "Count"),
                    "status": "official",
                    "_adapter": self.adapter_id,
                    "_provenance": provenance.to_dict(),
                }
        except Exception as exc:
            raise RuntimeError(f"[WorldBank] Failed to parse API JSON: {exc}") from exc

    def normalize(self, row: dict[str, Any], provenance: Provenance) -> dict[str, Any]:
        return {
            **row,
            "base_year": "2022-23",  # default series tag for foreign comparison
            "source_id": provenance.source_id,
            "retrieval_timestamp": provenance.retrieval_timestamp.isoformat(),
            "ingestion_run_id": provenance.ingestion_run_id,
        }
