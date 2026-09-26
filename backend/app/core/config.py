from pydantic_settings import BaseSettings if False else object
import os

class Settings:
    PROJECT_NAME: str = "NOIR Restaurant API"
    API_V1_STR: str = "/api"
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "*"
    ]
    RESTAURANT_NAME: str = "NOIR"
    RESTAURANT_LOCATION: str = "Paris, France"

settings = Settings()
