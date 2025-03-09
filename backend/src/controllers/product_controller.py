from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.db.base import SessionLocal
from src.schemas.products import ProductBase, ProductResponse, ProductUpdate, ProductVariantResponse
from src.services.product_services import create_product, get_product, get_products, update_product, delete_product, get_variants, update_variant, delete_variant

router = APIRouter(prefix="/products", tags=["products"])

# Dependency para obtener la sesión de la DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=ProductResponse)
def create_new_product(product: ProductBase, db: Session = Depends(get_db)):
    try:
        return create_product(db, product)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{product_id}", response_model=ProductResponse)
def read_product(product_id: int, db: Session = Depends(get_db)):
    try:
        db_product = get_product(db, product_id)
        if not db_product:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        return db_product
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=list[ProductResponse])
def read_products(db: Session = Depends(get_db)):
    return get_products(db)

@router.put("/{product_id}", response_model=ProductResponse)
def update_existing_product(product_id: int, product: ProductUpdate, db: Session = Depends(get_db)):
    try:
        return update_product(db, product_id, product)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{product_id}")
def delete_existing_product(product_id: int, db: Session = Depends(get_db)):
    try:
        return delete_product(db, product_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
@router.get("/{product_id}", response_model=list[ProductVariantResponse])
def read_variants(product_id: int, db: Session = Depends(get_db)):
    return get_variants(db, product_id)

@router.patch("/{variant_id}", response_model=ProductVariantResponse)
def update_variant_stock(variant_id: int, stock: int, db: Session = Depends(get_db)):
    try:
        return update_variant(db, variant_id, stock)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/{variant_id}")
def delete_existing_variant(variant_id: int, db: Session = Depends(get_db)):
    try:
        return delete_variant(db, variant_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))