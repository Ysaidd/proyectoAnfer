from pydantic import BaseModel
from datetime import datetime
from typing import List
from decimal import Decimal

class OrderItemBase(BaseModel):
    variant_id: int
    quantity: int

class OrderCreate(BaseModel):
    customer_phone: str
    items: List[OrderItemBase]

class OrderItemResponse(BaseModel):
    variant_id: int
    quantity: int
    price: float
    product_name: str
    size: str
    color: str
    stock: int  # Stock actual (opcional)

    class Config:
        orm_mode = True
        
class OrderResponse(BaseModel):
    id: int
    customer_phone: str
    total: Decimal
    created_at: datetime
    items: List[OrderItemResponse]

    class Config:
        orm_mode = True