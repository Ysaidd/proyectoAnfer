from datetime import datetime
from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime, Numeric
from sqlalchemy.orm import relationship
from src.db.base import Base

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_phone = Column(String)  # Número de WhatsApp del cliente
    total = Column(Numeric(10, 2))  # Total de la orden
    created_at = Column(DateTime, default=datetime.utcnow)
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    variant_id = Column(Integer, ForeignKey("product_variants.id"))
    quantity = Column(Integer)
    price = Column(Float)  # Precio en el momento de la venta
    
    order = relationship("Order", back_populates="items")
    variant = relationship("ProductVariant", lazy="joined")