from pydantic import BaseModel
from typing import List
from typing import Optional

class CategoryBase(BaseModel):
    name: str

class CategoryResponse(CategoryBase):
    id: int

    class Config:
        orm_mode = True

class CategoryUpdate(BaseModel):
    name: str