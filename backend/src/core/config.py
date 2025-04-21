from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Usa variable de entorno (y un valor por defecto vacío para producción)
    DATABASE_URL: str =  "postgresql://postgre:@localhost:5432/nombre_de_base_datos"
    SECRET_KEY: str = "1234"
    ALGORITHM: str = "HS256"

    class Config:
        env_file = ".env"

settings = Settings()