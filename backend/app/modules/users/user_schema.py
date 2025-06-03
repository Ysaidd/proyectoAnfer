from pydantic import BaseModel, EmailStr, Field
from enum import Enum # Importar Enum

# --- Definición de Roles ---
class UserRole(str, Enum):
    """
    Define los posibles roles de usuario en el sistema.
    """
    CLIENT = "cliente"
    MANAGER = "gerente"
    ADMIN = "admin"


class UserBase(BaseModel):
    email: EmailStr = Field(..., example="john.doe@example.com")
    full_name: str | None = Field(None, example="John Doe")

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, example="securepassword123")
    role: UserRole = Field(UserRole.CLIENT, example=UserRole.CLIENT) 

class UserUpdate(UserBase):
    email: EmailStr | None = None
    full_name: str | None = None
    password: str | None = Field(None, min_length=8)
    is_active: bool | None = None
    role: UserRole | None = Field(None, example=UserRole.MANAGER)

class UserInDBBase(UserBase):
    id: int
    is_active: bool
    role: UserRole
    class Config:
        from_attributes = True

class User(UserInDBBase):
    pass

