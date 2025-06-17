# app/modules/products/product_service.py
from sqlalchemy.orm import Session
from app.modules.productos import product_model as models
from app.modules.productos import product_schema as schemas
from app.modules.categorias import categoria_model as categoria_models  # 👈 Importamos el modelo de categoría
from app.core.exceptions import NotFoundException, DuplicateEntryException, HTTPException
from typing import List

class ProductService:
    def __init__(self, db: Session):
        self.db = db

    def get_all_products(self) -> list[models.Producto]:
        return self.db.query(models.Producto).all()

    def get_product_by_id(self, product_id: int) -> models.Producto:
        product = self.db.query(models.Producto).filter(models.Producto.id == product_id).first()
        if not product:
            raise NotFoundException("Product not found")
        return product

    def create_product(self, product_data: schemas.ProductCreate):
        # 1. Validar existencia de categoría
        categoria = self.db.query(categoria_models.Categoria).filter_by(id=product_data.categoria_id).first()
        if not categoria:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")

        # 2. Crear el producto
        new_product = models.Producto(
            nombre=product_data.nombre,
            descripcion=product_data.descripcion,
            precio=product_data.precio,
            categoria_id=product_data.categoria_id,
            proveedor_id=product_data.proveedor_id  # Asegúrate de que el proveedor_id esté en el esquema
        )
        self.db.add(new_product)
        self.db.flush()  # ❗ Para obtener new_product.id antes del commit

        # 3. Crear variantes
        variantes = []
        for variant_data in product_data.variantes:
            variant = models.VarianteProducto(
                color=variant_data.color,
                talla=variant_data.talla,
                stock=variant_data.stock,
                producto_id=new_product.id  # Usa el id del producto recién creado
            )
            self.db.add(variant)
            variantes.append(variant)

        self.db.commit()
        self.db.refresh(new_product)

        return new_product

    def update_product(self, product_id: int, update_data: schemas.ProductUpdate) -> models.Producto:
        product = self.get_product_by_id(product_id)
        for field, value in update_data.dict(exclude_unset=True).items():
            setattr(product, field, value)
        self.db.commit()
        self.db.refresh(product)
        return product

    def delete_product(self, product_id: int) -> None:
        product = self.get_product_by_id(product_id)
        self.db.delete(product)
        self.db.commit()




# CRUD DE LAS VARIANTES DE PRODUCTO
# CRUD DE LAS VARIANTES DE PRODUCTO
# CRUD DE LAS VARIANTES DE PRODUCTO
# CRUD DE LAS VARIANTES DE PRODUCTO


    def create_variant(self, product_id: int, variant_data: schemas.VarianteProductoCreate) -> models.VarianteProducto:
        producto = self.db.query(models.Producto).filter_by(id=product_id).first()
        if not producto:
            raise HTTPException(status_code=404, detail="Producto no encontrado")

        nueva_variante = models.VarianteProducto(
            producto_id=product_id,
            color=variant_data.color,
            talla=variant_data.talla,
            stock=variant_data.stock
        )
        self.db.add(nueva_variante)
        self.db.commit()
        self.db.refresh(nueva_variante)
        return nueva_variante

    def get_variants_by_product(self, product_id: int) -> List[models.VarianteProducto]:
        return self.db.query(models.VarianteProducto).filter_by(producto_id=product_id).all()

    def get_variant_by_id(self, variant_id: int) -> models.VarianteProducto:
        variante = self.db.query(models.VarianteProducto).filter_by(id=variant_id).first()
        if not variante:
            raise HTTPException(status_code=404, detail="Variante no encontrada")
        return variante

    def update_variant(self, variant_id: int, updated_data: schemas.VarianteProductoCreate) -> models.VarianteProducto:
        variante = self.get_variant_by_id(variant_id)
        variante.color = updated_data.color
        variante.talla = updated_data.talla
        variante.stock = updated_data.stock
        self.db.commit()
        self.db.refresh(variante)
        return variante

    def delete_variant(self, variant_id: int):
        variante = self.get_variant_by_id(variant_id)
        self.db.delete(variante)
        self.db.commit()