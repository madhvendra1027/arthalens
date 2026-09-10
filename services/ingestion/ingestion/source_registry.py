"""Load the source registry YAML configuration."""
from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml


def load_registry() -> dict[str, Any]:
    registry_path = Path(__file__).parent / "source_registry.yaml"
    with open(registry_path, encoding="utf-8") as f:
        data = yaml.safe_load(f)
    return data.get("sources", {})
