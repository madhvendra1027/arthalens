# ArthaLens RAG Evaluation Guide & Safety Benchmarks

## Overview
ArthaLens AI Research Assistant uses a citation-first Retrieval-Augmented Generation (RAG) architecture. This guide outlines the evaluation framework, metrics, and security testing protocols to ensure zero hallucinations and strict provenance adherence.

## Evaluation Dimensions

### 1. Groundedness & Faithfulness
* **Metric:** Fraction of generated claims directly supported by retrieved citation excerpts.
* **Target:** 100% citation grounding for numeric macroeconomic data.
* **Evaluation Tool:** Automated RAG evaluation (Ragas / G-Eval inspired automated assertions).

### 2. Prompt Injection & Security Defense
* **Tests:** Adversarial inputs attempting system prompt extraction, opinion injection on policy, or non-grounded extrapolation.
* **Guardrails:** Pre-inference sanitization, strict system prompt constraints, post-inference citation validator.

### 3. Source Verification Protocol
* Every answer must contain structured citation references (`sourceId`, `title`, `publisher`, `publicationDate`, `excerpt`).
* If sufficient grounded context is absent in indexed documents, the assistant responds with explicit data unavailability rather than interpolating.
