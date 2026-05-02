import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_HOURS: int = 24
    ENVIRONMENT: str = "development"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
