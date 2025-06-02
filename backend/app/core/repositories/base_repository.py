from sqlalchemy.orm import Session
from typing import TypeVar, Type, Generic

# Define un tipo genérico para el modelo SQLAlchemy (usado para typing hints)
ModelType = TypeVar("ModelType", bound=object)

class BaseRepository(Generic[ModelType]):
    """
    Clase base abstracta para repositorios.
    Proporciona métodos CRUD genéricos.
    """
    def __init__(self, db: Session, model: Type[ModelType]):
        self.db = db
        self.model = model

    def get_by_id(self, item_id: int) -> ModelType | None:
        """Obtiene un elemento por su ID."""
        return self.db.query(self.model).filter(self.model.id == item_id).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> list[ModelType]:
        """Obtiene una lista de todos los elementos con paginación."""
        return self.db.query(self.model).offset(skip).limit(limit).all()

    def create(self, obj_in: dict) -> ModelType:
        """Crea un nuevo elemento en la base de datos."""
        db_obj = self.model(**obj_in)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def update(self, db_obj: ModelType, obj_in: dict) -> ModelType:
        """Actualiza un elemento existente en la base de datos."""
        for key, value in obj_in.items():
            setattr(db_obj, key, value)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def delete(self, db_obj: ModelType) -> None:
        """Elimina un elemento de la base de datos."""
        self.db.delete(db_obj)
        self.db.commit()