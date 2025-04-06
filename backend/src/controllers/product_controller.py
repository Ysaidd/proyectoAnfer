from fastapi import APIRouter, Depends, HTTPException, File, Form, UploadFile, Query
from sqlalchemy.orm import Session
from src.db.base import SessionLocal
from src.schemas.products import ProductBase, ProductResponse, ProductUpdate, ProductVariantResponse, VariantUpdate
from src.services.product_services import create_product, get_product, get_products, update_product, delete_product, get_variants, update_variant, delete_variant
import os
import uuid
import json
import shutil

router = APIRouter(prefix="/products", tags=["products"])

UPLOAD_FOLDER = "uploads/"  # 📂 Carpeta donde se guardarán las imágenes

# Dependency para obtener la sesión de la DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=ProductResponse)
def create_new_product(
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    category_id: int = Form(...),
    variants: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    try:
        # Guardar la imagen
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)

        file_location = os.path.join(UPLOAD_FOLDER, image.filename)
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        import json
        variants_list = json.loads(variants)

        # Crear producto
        new_product = create_product(
            db,
            {
                "name": name,
                "description": description,
                "price": price,
                "category_id": category_id,
                "image_url": file_location,  
                "variants": variants_list,
            },
        )

        # ✅ Si `new_product` es None, lanzar error
        if not new_product:
            raise HTTPException(status_code=500, detail="Error al obtener el producto después de crearlo.")

        return new_product

    except Exception as e:
        db.rollback()  # Revertir la transacción en caso de error
        raise HTTPException(status_code=500, detail=f"Error en la creación del producto: {str(e)}")


@router.get("/{product_id}", response_model=ProductResponse)
def read_product(product_id: int, db: Session = Depends(get_db)):
    print(f"🔍 Buscando producto con ID: {product_id}")
    
    # Verificar si el ID realmente es un número
    if not isinstance(product_id, int):
        print("⚠️ El ID no es un número válido:", product_id)
        raise HTTPException(status_code=400, detail="ID inválido")

    db_product = get_product(db, product_id)
    
    if not db_product:
        print("⚠️ Producto no encontrado en la BD")
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    print(f"✅ Producto encontrado: {db_product.name} (ID: {db_product.id})")
    return db_product


@router.get("/", response_model=list[ProductResponse])
def read_products(limit: int = Query(10, alias="limit"), db: Session = Depends(get_db)):
    return get_products(db, limit) 

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
    
@router.get("/{product_id}/variants", response_model=list[ProductVariantResponse])
def read_variants(product_id: int, db: Session = Depends(get_db)):
    return get_variants(db, product_id)

@router.patch("/{variant_id}", response_model=ProductVariantResponse)
def update_variant_stock(variant_id: int, variant: VariantUpdate, db: Session = Depends(get_db)):
    try:
        return update_variant(db, variant_id, variant)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/variant/{variant_id}")
def delete_existing_variant(variant_id: int, db: Session = Depends(get_db)):
    try:
        return delete_variant(db, variant_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))