# services/ml — ML & Statistics Service

Python 3.13 + FastAPI ML service for ArthaLens.

## Setup

```bash
cd services/ml
python -m venv .venv && .venv\Scripts\activate
pip install -e ".[dev]"
```

## Run

```bash
uvicorn ml.api:app --port 8002 --reload
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/ml/v1/consistency/score` | Economic consistency score (analytical diagnostic) |
| GET | `/ml/v1/forecast/gdp` | GDP growth forecast (not official) |

## Key Design Principles

- All outputs are **analytical diagnostics**, not official government figures
- Consistency score is explicitly labeled: NOT a truth score
- Walk-forward validation; no train/test leakage
- Missing indicators reduce coverage, not silently become zero
- Fixed random seed (`ML_RANDOM_SEED=42`) for reproducibility
