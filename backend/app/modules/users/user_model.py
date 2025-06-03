from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base # Importa la base declarativa de tu archivo database.py

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False) # Para roles de administrador/vendedor

