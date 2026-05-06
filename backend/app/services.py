import redis
import json
import os
from typing import Optional, List
from .models import Product
from sqlalchemy.orm import Session
from sqlalchemy import func

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
try:
    redis_client = redis.from_url(REDIS_URL, decode_responses=True)
    redis_client.ping()
    redis_available = True
except Exception:
    redis_available = False
    print("Redis not available, caching disabled.")

class ProductService:
    @staticmethod
    def get_cached_search(product_name: str) -> Optional[dict]:
        if not redis_available: return None
        try:
            cached = redis_client.get(f"search:{product_name.lower()}")
            if cached:
                return json.loads(cached)
        except Exception:
            return None
        return None

    @staticmethod
    def cache_search(product_name: str, data: dict):
        if not redis_available: return
        try:
            redis_client.setex(
                f"search:{product_name.lower()}",
                300,  # 5 minutes cache
                json.dumps(data)
            )
        except Exception:
            pass

    @staticmethod
    def check_duplicate(db: Session, product: Product) -> bool:
        return db.query(Product).filter(
            Product.product_name == product.product_name,
            Product.shop_name == product.shop_name,
            Product.price == product.price,
            Product.unit == product.unit
        ).first() is not None

    @staticmethod
    def invalidate_cache(product_name: str):
        if not redis_available: return
        try:
            redis_client.delete(f"search:{product_name.lower()}")
        except Exception:
            pass
