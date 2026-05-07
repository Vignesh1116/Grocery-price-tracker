from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime, date

class ProductBase(BaseModel):
    product_name: str = Field(..., min_length=1)
    price: float = Field(..., gt=0)
    quantity: float = Field(..., gt=0)
    unit: str = Field(..., min_length=1)
    shop_name: str = Field(..., min_length=1)
    shop_location: str = Field(..., min_length=1)
    mobile_number: Optional[str] = None
    bill_date: Optional[date] = None

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class SearchResult(BaseModel):
    products: list[ProductResponse]
    average_price: float
    cheapest_id: Optional[int]
