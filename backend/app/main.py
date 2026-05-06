from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import product

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Price Tracker API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(product.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Smart Price Tracker API"}
