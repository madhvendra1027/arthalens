# services/ai — AI/RAG/LLM Service

Python 3.13 + FastAPI AI research assistant for ArthaLens.

## Setup

```bash
cd services/ai
python -m venv .venv && .venv\Scripts\activate
pip install -e ".[dev]"
# For OpenAI support:
pip install -e ".[openai]"
```

## Configuration

Copy root `.env.example` to `.env` and set:
- `LLM_PROVIDER` — openai | anthropic | google | ollama
- `LLM_MODEL` — model name for your provider
- Corresponding API key

## Run

```bash
uvicorn rag.api:app --port 8001 --reload
```

## Behavior Contract

- NEVER invents numbers, dates, citations, or sources
- ALL factual claims cite retrieved document chunks
- Refusal when evidence is insufficient
- Investment advice is explicitly rejected
- Prompt injection from retrieved documents is sanitized

## Source Priority

1. MoSPI (primary — official GDP/GVA statistics)
2. RBI (CPI, WPI, monetary data)
3. GoI/PIB (press releases, fiscal policy)
4. Rating agencies (official press releases only)
