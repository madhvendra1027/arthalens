"""Provider-agnostic LLM and embedding interfaces.

Concrete implementations are selected at startup via LLM_PROVIDER env var.
No vendor SDK is imported at module level.
"""
from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, AsyncIterator


@dataclass
class LLMMessage:
    role: str   # system | user | assistant
    content: str


@dataclass
class LLMResponse:
    content: str
    model: str
    provider: str
    input_tokens: int | None = None
    output_tokens: int | None = None
    finish_reason: str | None = None


class LLMProvider(ABC):
    """Abstract interface for LLM completion."""

    @abstractmethod
    async def complete(
        self,
        messages: list[LLMMessage],
        max_tokens: int = 2048,
        temperature: float = 0.1,
    ) -> LLMResponse: ...

    @abstractmethod
    async def stream(
        self,
        messages: list[LLMMessage],
        max_tokens: int = 2048,
    ) -> AsyncIterator[str]: ...


class EmbeddingProvider(ABC):
    """Abstract interface for text embeddings."""

    @abstractmethod
    async def embed(self, texts: list[str]) -> list[list[float]]: ...

    @property
    @abstractmethod
    def dimensions(self) -> int: ...


class OpenAIProvider(LLMProvider):
    """OpenAI-compatible LLM provider (also works with Azure OpenAI)."""

    def __init__(self, api_key: str, model: str = "gpt-4o") -> None:
        self.model = model
        self._api_key = api_key

    async def complete(self, messages: list[LLMMessage], max_tokens: int = 2048, temperature: float = 0.1) -> LLMResponse:
        try:
            from openai import AsyncOpenAI
            client = AsyncOpenAI(api_key=self._api_key)
            response = await client.chat.completions.create(
                model=self.model,
                messages=[{"role": m.role, "content": m.content} for m in messages],
                max_tokens=max_tokens,
                temperature=temperature,
            )
            return LLMResponse(
                content=response.choices[0].message.content or "",
                model=self.model,
                provider="openai",
                input_tokens=response.usage.prompt_tokens if response.usage else None,
                output_tokens=response.usage.completion_tokens if response.usage else None,
                finish_reason=response.choices[0].finish_reason,
            )
        except ImportError:
            raise RuntimeError("openai package not installed. Run: pip install 'arthalens-ai[openai]'")

    async def stream(self, messages: list[LLMMessage], max_tokens: int = 2048) -> AsyncIterator[str]:
        try:
            from openai import AsyncOpenAI
            client = AsyncOpenAI(api_key=self._api_key)
            async with client.chat.completions.stream(
                model=self.model,
                messages=[{"role": m.role, "content": m.content} for m in messages],
                max_tokens=max_tokens,
            ) as stream:
                async for chunk in stream:
                    if chunk.choices[0].delta.content:
                        yield chunk.choices[0].delta.content
        except ImportError:
            raise RuntimeError("openai package not installed")


def create_llm_provider(settings: Any) -> LLMProvider:
    """Factory: select LLM provider from settings."""
    if settings.llm_provider == "openai":
        return OpenAIProvider(api_key=settings.openai_api_key, model=settings.llm_model)
    # Add anthropic / google / ollama adapters here
    raise ValueError(f"Unsupported LLM_PROVIDER: {settings.llm_provider}")
