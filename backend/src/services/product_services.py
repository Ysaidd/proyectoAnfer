from sqlalchemy.orm import Session
from ..models import Product, ProductVariant, Category
from ..schemas.products import ProductBase, ProductUpdate
from sqlalchemy.orm import joinedload

def create_product(db: Session, product_data):
    # Verificar si la categoría existe
    category = db.query(Category).filter(Category.id == product_data.category_id).first()
    if not category:
        raise ValueError("La categoría no existe")

    # Crear el producto
    db_product = Product(
        name=product_data.name,
        description=product_data.description,
        price=product_data.price,
        category_id=product_data.category_id
    )
    db.add(db_product)
    db.flush()  # Obtiene el ID del producto sin hacer commit definitivo

    # Crear las variantes
    for variant in product_data.variants:
        db_variant = ProductVariant(
            product_id=db_product.id,
            size=variant.size,
            color=variant.color,
            stock=variant.stock
        )
        db.add(db_variant)

    db.commit()  # Confirma producto y variantes juntos
    db.refresh(db_product)
    return db_product

def get_product(db: Session, product_id: int):
    return db.query(Product).filter(Product.id == product_id).first()

def get_products(db: Session):
    return db.query(Product).options(joinedload(Product.variants)).all()

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
        raise ValueError("Producto no encontrado")
    
    db.delete(db_product)
    db.commit()
    return {"message": "Producto eliminado"}

def get_variants(db: Session, product_id: int):
    return db.query(ProductVariant).filter(ProductVariant.product_id == product_id).all()

def update_variant(db: Session, variant_id: int, stock: int):
    db_variant = db.query(ProductVariant).filter(ProductVariant.id == variant_id).first()
    if not db_variant:
        raise ValueError("Variante no encontrada")
    
    db_variant.stock = stock
    db.commit()
    db.refresh(db_variant)
    return db_variant

def delete_variant(db: Session, variant_id: int):
    db_variant = db.query(ProductVariant).filter(ProductVariant.id == variant_id).first()
    if not db_variant:
        raise ValueError("Variante no encontrada")