from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.db.base import SessionLocal
from src.schemas.category import CategoryBase, CategoryResponse, CategoryUpdate
from src.services.category_services import create_category, get_category, get_categories, update_category, delete_category

router = APIRouter(prefix="/categories", tags=["categories"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=CategoryResponse)
def create_new_category(category: CategoryBase, db: Session = Depends(get_db)):
    try:
        return create_category(db, category)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{category_id}", response_model=CategoryResponse)
def read_category(category_id: int, db: Session = Depends(get_db)):
    try:
        db_category = get_category(db, category_id)
        if not db_category:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")
        return db_category
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
@router.get("/", response_model=list[CategoryResponse])
def read_categories(db: Session = Depends(get_db)):
    try:
        return get_categories(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{category_id}", response_model=CategoryResponse)
def update_existing_category(category_id: int, category: CategoryUpdate, db: Session = Depends(get_db)):
    try:
        return update_category(db, category_id, category)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/{category_id}")
def delete_existing_category(category_id: int, db: Session = Depends(get_db)):
    try:
        return delete_category(db, category_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))