from sqlalchemy.orm import Session
from ..models import Category 
from ..schemas.category import CategoryBase, CategoryUpdate

def create_category(db: Session, category: CategoryBase):
    # Verificar si la categoría ya existe
    existing_category = db.query(Category).filter(Category.name == category.name).first()
    if existing_category:
        raise ValueError("La categoría ya existe")
    
    db_category = Category(name=category.name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def get_categories(db: Session):
    return db.query(Category).all()


def get_category(db: Session, category_id: int):
    return db.query(Category).filter(Category.id == category_id).first()


def update_category(db: Session, category_id: int, category: CategoryUpdate):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise ValueError("Categoría no encontrada")
    
    db_category.name = category.name
    db.commit()
    db.refresh(db_category)
    return db_category

def delete_category(db: Session, category_id: int):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise ValueError("Categoría no encontrada")
    
    db.delete(db_category)
    db.commit()
    return {"message": "Categoría eliminada"}