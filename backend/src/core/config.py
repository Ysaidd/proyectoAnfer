from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:1234@localhost:5432/anfer"
    SECRET_KEY: str = "1234"
    ALGORITHM: str = "HS256"

    class Config:
        env_file = ".env"

settings = Settings()