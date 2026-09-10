"""Ingestion service configuration loaded from environment variables."""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_db: str = "arthalens"
    postgres_user: str = "arthalens"
    postgres_password: str

    ingestion_raw_archive_path: str = "./raw_archive"
    ingestion_quarantine_path: str = "./quarantine"
    ingestion_log_level: str = "INFO"

    http_timeout_seconds: int = 30
    http_max_retries: int = 3
    http_backoff_factor: int = 2

    @property
    def db_url(self) -> str:
        return (
            f"postgresql+psycopg2://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )


settings = Settings()
