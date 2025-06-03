# app/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True) # `echo=True` para ver las queries SQL

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def create_db_tables():
    """
    Crea todas las tablas definidas en los modelos de SQLAlchemy que han sido cargados.
    Esta función debe ser llamada después de que todos los modelos de la aplicación
    (ej. User, Product) hayan sido importados en algún lugar del código,
    para que Base.metadata conozca todas las tablas a crear.
    """
    print("Intentando crear tablas en la base de datos...")
    Base.metadata.create_all(bind=engine)
    print("Tablas verificadas/creadas exitosamente.")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()