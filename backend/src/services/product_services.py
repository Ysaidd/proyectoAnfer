from sqlalchemy.orm import Session
from sqlalchemy import desc
from ..models import Product, ProductVariant, Category
from ..schemas.products import ProductBase, ProductUpdate, VariantUpdate
from sqlalchemy.orm import joinedload
from fastapi import Query

def create_product(db: Session, product_data):
    # Verificar si la categoría existe
    category = db.query(Category).filter(Category.id == product_data["category_id"]).first()
    if not category:
        raise ValueError("La categoría no existe")

    # Crear el producto
    db_product = Product(
        name=product_data["name"],
        description=product_data["description"],
        price=product_data["price"],
        category_id=product_data["category_id"],
        image_url=product_data["image_url"],  
    )
    db.add(db_product)
    db.flush()  # Obtiene el ID del producto sin hacer commit definitivo

    # Crear las variantes
    for variant in product_data["variants"]:
        db_variant = ProductVariant(
            product_id=db_product.id,
            size=variant["size"],
            color=variant["color"],
            stock=variant["stock"],
        )
        db.add(db_variant)

    db.commit()  
    db.refresh(db_product)

    # ✅ Asegurar que `category` y `variants` están cargados antes de devolver el producto
    return db.query(Product).options(joinedload(Product.category), joinedload(Product.variants)).filter(Product.id == db_product.id).first()

def get_product(db: Session, product_id: int):
    return (
        db.query(Product)
        .options(joinedload(Product.variants))  # Carga relaciones (puedes agregar más si es necesario)
        .filter(Product.id == product_id)
        .first()
    )
def get_products(db: Session, limit: int = Query(10, alias="limit")):
    return db.query(Product).options(joinedload(Product.variants)).order_by(desc(Product.id)).limit(limit).all()


def update_product(db: Session, product_id: int, product_data: ProductUpdate):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise ValueError("Producto no encontrado")
    
    if product_data.name:
        db_product.name = product_data.name
    if product_data.description:
        db_product.description = product_data.description
    if product_data.category_id:
        category = db.query(Category).filter(Category.id == product_data.category_id).first()
        if not category:
            raise ValueError("Categoría no válida")
        db_product.category_id = product_data.category_id
    
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise ValueError("Producto no encontrado2")
    
    db.delete(db_product)
    db.commit()
    return {"message": "Producto eliminado"}

def get_variants(db: Session, product_id: int):
    return db.query(ProductVariant).filter(ProductVariant.product_id == product_id).all()

def update_variant(db: Session, variant_id: int, variant_data: VariantUpdate):
    db_variant = db.query(ProductVariant).filter(ProductVariant.id == variant_id).first()
    if not db_variant:
        raise ValueError("Variante no encontrada")
    
    if variant_data.size:
        db_variant.size = variant_data.size
    if variant_data.color:
        db_variant.color = variant_data.color
    if variant_data.stock:
        db_variant.stock = variant_data.stock
    db.commit()
    db.refresh(db_variant)
    
    return db_variant


def delete_variant(db: Session, variant_id: int):
    db_variant = db.query(ProductVariant).filter(ProductVariant.id == variant_id).first()
    if not db_variant:
        raise ValueError("Variante no encontrada")
    
    db.delete(db_variant)
    db.commit()
    return {"message": "Variante eliminada"}