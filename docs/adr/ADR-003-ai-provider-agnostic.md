# ADR-003: Provider-Agnostic LLM and Embedding Interfaces

**Date:** 2026-09-10
**Status:** Accepted

## Context
The AI/RAG service needs LLM completion and embedding capabilities. The optimal provider
may change over time and different deployments may use different providers (OpenAI, Anthropic,
Google, Ollama/local).

## Decision
Define internal `LLMProvider` and `EmbeddingProvider` abstract interfaces. Concrete
implementations are selected at startup via the `LLM_PROVIDER` environment variable.
No provider SDK is imported at the module level — only the selected adapter is loaded.

## Rationale
- Avoids vendor lock-in at the code level
- Enables local-only deployment with Ollama (no API keys required)
- Consistent with the principal-engineer model-neutrality requirement
- Simplifies testing — mock provider can be injected without SDK dependencies

## Consequences
- Each new provider requires a new adapter implementation
- Provider capabilities (context window, function calling, streaming) must be abstracted
- `.env.example` defaults to OpenAI for documentation clarity only
