"""Security defenses for the RAG pipeline.

1. Prompt injection defense: sanitize retrieved document content before
   including it in LLM context. Removes common injection patterns.
2. PII redaction: redact phone numbers, emails, Aadhaar patterns from context.
3. SSRF protection: validate URLs before any outbound fetch.
"""
from __future__ import annotations

import re
from urllib.parse import urlparse


ALLOWED_DOMAINS = {
    "mospi.gov.in", "rbi.org.in", "pib.gov.in",
    "dbie.rbi.org.in", "data.gov.in",
    "fitchratings.com", "moodys.com", "spglobal.com",
}

# Prompt injection patterns — phrases that attempt to hijack instruction following
INJECTION_PATTERNS = [
    r"ignore\s+(previous|above|all)\s+instructions",
    r"disregard\s+.{0,30}instructions",
    r"you\s+are\s+now\s+a",
    r"act\s+as\s+(if\s+you\s+are|an?)\s+",
    r"system\s*:\s*",
    r"<\s*/?system\s*>",
]

# PII patterns
EMAIL_RE = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b")
PHONE_RE = re.compile(r"\b(\+91[-\s]?)?[6-9]\d{9}\b")
AADHAAR_RE = re.compile(r"\b\d{4}\s?\d{4}\s?\d{4}\b")


def sanitize_retrieved_content(text: str) -> str:
    """Remove prompt injection patterns from retrieved document content."""
    result = text
    for pattern in INJECTION_PATTERNS:
        result = re.sub(pattern, "[REDACTED_INJECTION_ATTEMPT]", result, flags=re.IGNORECASE)
    return result


def redact_pii(text: str) -> str:
    """Redact PII from text before logging or LLM context inclusion."""
    result = EMAIL_RE.sub("[EMAIL_REDACTED]", text)
    result = PHONE_RE.sub("[PHONE_REDACTED]", result)
    result = AADHAAR_RE.sub("[AADHAAR_REDACTED]", result)
    return result


def validate_url_for_fetch(url: str) -> bool:
    """SSRF protection: only allow fetches to approved official domains."""
    try:
        parsed = urlparse(url)
        return parsed.netloc in ALLOWED_DOMAINS and parsed.scheme in ("http", "https")
    except Exception:
        return False
