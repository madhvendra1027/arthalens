# services/ingestion

Python 3.13 data ingestion service for ArthaLens.

## Setup

```bash
python -m venv .venv
.venv\Scripts\activate       # Windows
# or: source .venv/bin/activate  # macOS/Linux
pip install -e ".[dev]"
```

## Run Tests

```bash
pytest --cov=ingestion --cov-report=term-missing
```

## Pipeline

```
fetch -> archive raw -> parse -> normalize -> validate -> reconcile -> upsert -> provenance -> metrics
```

- Invalid rows go to **quarantine**, never silently dropped
- Raw files are immutably archived by `ingestion_run_id` + content hash
- Each run gets a unique `ingestion_run_id` UUID

## Adapters

| Adapter | Publisher | Data |
|---------|-----------|------|
| `mospi.py` | MoSPI | GDP, GVA, NAS, deflators |
| `rbi.py` | RBI DBIE | CPI, WPI, monetary, trade |
| `pib.py` | GoI PIB | Press releases, ratings |

## Source Registry

`ingestion/source_registry.yaml` — canonical source URLs, schedules, parser versions.
Do NOT invent URLs; only confirmed official sources are listed.

## Scheduler

APScheduler-based; schedules follow each source''s official release calendar.
Run: `python -m ingestion.scheduler`
