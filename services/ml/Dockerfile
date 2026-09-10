# services/ml/Dockerfile
FROM python:3.13-slim
WORKDIR /app
RUN addgroup --system arthalens && adduser --system --group arthalens
COPY pyproject.toml .
RUN pip install --no-cache-dir -e "."
COPY . .
USER arthalens
EXPOSE 8002
CMD ["uvicorn", "ml.api:app", "--host", "0.0.0.0", "--port", "8002"]
