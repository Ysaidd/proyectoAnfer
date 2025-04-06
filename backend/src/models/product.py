from sqlalchemy import Column, Integer, String, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from ..db.base import Base

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)  # Nombre único para evitar duplicados
    products = relationship("Product", back_populates="category")  # Relación directa con productos

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    price = Column(Numeric(10, 2), nullable=False)  # Nueva columna <--
    category_id = Column(Integer, ForeignKey("categories.id"))  # Clave foránea
    category = relationship("Category", back_populates="products")  # Relación inversa
    variants = relationship("ProductVariant", back_populates="product", lazy="selectin")  # Relación con variantes
    image_url = Column(String, nullable=True)  # Nuevo campo para la imagen

class ProductVariant(Base):
    __tablename__ = "product_variants"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    size = Column(String)
    color = Column(String)
    stock = Column(Integer)
    product = relationship("Product", back_populates="variants", lazy="joined")  # Relación inversa