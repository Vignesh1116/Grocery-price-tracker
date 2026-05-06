from sqlalchemy import Column, Integer, String, Float, DateTime, Index
from sqlalchemy.sql import func
from .database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String, index=True, nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String, nullable=False)
    shop_name = Column(String, nullable=False)
    shop_location = Column(String, nullable=False)
    mobile_number = Column(String, nullable=True)
    bill_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Index for search optimization
    __table_args__ = (
        Index('ix_product_name_lower', func.lower(product_name)),
    )
