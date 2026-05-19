import os
from pathlib import Path

from dotenv import load_dotenv


BACKEND_ROOT = Path(__file__).resolve().parents[3]
APP_ENV = os.getenv("APP_ENV", "development").lower()
ENV_FILE = BACKEND_ROOT / f".env.{APP_ENV}"
DEFAULT_ENV_FILE = BACKEND_ROOT / ".env"

if ENV_FILE.exists():
    load_dotenv(ENV_FILE)

if DEFAULT_ENV_FILE.exists():
    load_dotenv(DEFAULT_ENV_FILE)


def _get_bool(name: str, default: bool) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _get_list(name: str, default: list[str]) -> list[str]:
    value = os.getenv(name)
    if not value:
        return default
    return [item.strip() for item in value.split(",") if item.strip()]


class Settings:
    APP_ENV: str = APP_ENV
    ENV_FILE: str = str(ENV_FILE)

    MAIL_USERNAME: str = os.getenv("MAIL_USERNAME", "")
    MAIL_PASSWORD: str = os.getenv("MAIL_PASSWORD", "")
    MAIL_FROM: str = os.getenv("MAIL_FROM", "")
    MAIL_SERVER: str = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    MAIL_PORT: int = int(os.getenv("MAIL_PORT", "587"))
    MAIL_STARTTLS: bool = _get_bool("MAIL_STARTTLS", True)
    MAIL_SSL_TLS: bool = _get_bool("MAIL_SSL_TLS", False)
    USE_CREDENTIALS: bool = _get_bool("USE_CREDENTIALS", True)

    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    JWT_SECRET_KEY: str = os.getenv(
        "JWT_SECRET_KEY",
        "DEVELOPMENT_SECRET_KEY_REPLACE_IN_PROD",
    )
    WEBSITE_DOMAIN: str = os.getenv("WEBSITE_DOMAIN", "http://localhost:3000")
    BACKEND_CORS_ORIGINS: list[str] = _get_list(
        "BACKEND_CORS_ORIGINS",
        [
            "http://localhost:3000",
            "http://localhost:5173",
            "https://bim-mills.vercel.app",
        ],
    )
    BACKEND_CORS_ORIGIN_REGEX: str = os.getenv(
        "BACKEND_CORS_ORIGIN_REGEX",
        r"https://.*\.vercel\.app",
    )


settings = Settings()
