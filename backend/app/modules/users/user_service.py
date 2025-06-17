# app/modules/users/user_service.py
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.modules.auth.security import get_password_hash
from app.modules.users import user_model as models
from app.modules.users import user_schema as schemas
from app.core.exceptions import NotFoundException, DuplicateEntryException

class UserService:
    def __init__(self, db: Session): # Ahora el servicio recibe la sesión de DB directamente
        self.db = db

    def get_user(self, user_id: int) -> models.User:
        user = self.db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            raise NotFoundException(detail=f"User with ID {user_id} not found")
        return user

    def get_user_by_email(self, email: str) -> models.User | None:
        return self.db.query(models.User).filter(models.User.email == email).first()

    def get_users(self, skip: int = 0, limit: int = 100) -> list[models.User]:
        return self.db.query(models.User).offset(skip).limit(limit).all()

    def create_user(self, user_data: schemas.UserCreate) -> models.User:
        existing_user = self.get_user_by_email(user_data.email) # Usa el propio servicio
        if existing_user:
            raise DuplicateEntryException(detail="User with this email already exists")

        hashed_password = get_password_hash(user_data.password)
        
        user_in_db = user_data.dict(exclude={"password"}, exclude_unset=True)
        user_in_db["hashed_password"] = hashed_password
        user_in_db["role"] = user_data.role.value

        db_user = models.User(**user_in_db)
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def update_user(self, user_id: int, user_data: schemas.UserUpdate) -> models.User:
        db_user = self.get_user(user_id)

        update_data = user_data.dict(exclude_unset=True)
        if "password" in update_data:
            update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
        
        if "role" in update_data:
            update_data["role"] = update_data["role"].value

        # Aplicar actualizaciones
        for key, value in update_data.items():
            setattr(db_user, key, value)

        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def delete_user(self, user_id: int) -> None:
        db_user = self.get_user(user_id)
        self.db.delete(db_user)
        self.db.commit()