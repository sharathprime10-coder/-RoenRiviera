from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Riviera API"
    API_V1_STR: str = "/api/v1"
    
    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    
    # LLM Providers
    LLM_PROVIDER: str = "gemini" # gemini or groq
    LLM_FALLBACK_ENABLED: bool = True
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-3.8-flash"
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "qwen/qwen3.8-27b"
    OPENROUTER_API_KEY: str = ""

    # Voice Assistant - using the unified OpenRouter key
    VOICE_OPENROUTER_MODEL: str = "google/gemini-2.5-flash-lite"

    model_config = SettingsConfigDict(env_file=".env", env_ignore_empty=True, extra="ignore")

settings = Settings()
