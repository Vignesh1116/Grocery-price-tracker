from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Product
from ..schemas import ProductCreate, ProductResponse, SearchResult
from ..services import ProductService
import json

router = APIRouter(prefix="/api/products", tags=["products"])

@router.post("/", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(**product.dict())
    
    if ProductService.check_duplicate(db, db_product):
        raise HTTPException(status_code=400, detail="Duplicate entry already exists.")
    
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    # Invalidate cache for this product name
    ProductService.invalidate_cache(db_product.product_name)
    
    return db_product

@router.get("/search", response_model=SearchResult)
def search_products(name: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    # Try cache first
    cached_data = ProductService.get_cached_search(name)
    if cached_data:
        return cached_data

    # Search in DB
    query = db.query(Product).filter(Product.product_name.ilike(f"%{name}%"))
    products = query.order_by(Product.price.asc()).all()

    if not products:
        return {"products": [], "average_price": 0, "cheapest_id": None}

    # Calculate stats
    total_price = sum(p.price for p in products)
    avg_price = total_price / len(products)
    cheapest_id = products[0].id if products else None

    result = {
        "products": [ProductResponse.from_orm(p).dict() for p in products],
        "average_price": round(avg_price, 2),
        "cheapest_id": cheapest_id
    }

    # Cache result
    ProductService.cache_search(name, result)

    return result
