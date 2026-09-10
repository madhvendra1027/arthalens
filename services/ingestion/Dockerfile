# services/ingestion/Dockerfile
# Run ingestion jobs as a one-shot container or cron trigger
FROM python:3.13-slim
WORKDIR /app

RUN addgroup --system arthalens && adduser --system --group arthalens

COPY pyproject.toml .
RUN pip install --no-cache-dir -e "."

COPY . .
USER arthalens

# Default: run a full pipeline check; override CMD to run specific adapters
CMD ["python", "-m", "ingestion.pipeline", "--help"]
