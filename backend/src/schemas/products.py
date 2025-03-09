from pydantic import BaseModel
from typing import List, Optional
from ..schemas.category import CategoryResponse

class ProductVariantBase(BaseModel):
    size: str
    color: str
    stock: int

class ProductVariantResponse(ProductVariantBase):
    id: int

class ProductVariantBase(BaseModel):
    size: str
    color: str
    stock: int

class ProductVariantResponse(ProductVariantBase):
    id: int

class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    category_id: int
    variants: List[ProductVariantBase]

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None

class ProductResponse(ProductBase):
    id: int
    category: CategoryResponse
    variants: List[ProductVariantResponse]

    class Config:
        orm_mode = True