from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import ReadymadeProduct
from pydantic import BaseModel

router = APIRouter(prefix="/api/readymade-products", tags=["Shop Products"])

class ReadymadeProductResponse(BaseModel):
    id: int
    name: str
    quantity: str
    quality: str
    price: int = None

    class Config:
        from_attributes = True

@router.get("/", response_model=list)
def get_readymade_products(db: Session = Depends(get_db)):
    """Get all readymade products for shop"""
    products = db.query(ReadymadeProduct).all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "quantity": p.quantity or "1 unit",
            "quality": p.quality or "Standard",
            "price": int(p.price) if p.price else 0,
            "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400"
        }
        for p in products
    ]


@router.get("/{product_id}")
def get_readymade_product(product_id: int, db: Session = Depends(get_db)):
    """Get specific readymade product"""
    product = db.query(ReadymadeProduct).filter(ReadymadeProduct.id == product_id).first()
    if not product:
        return {"error": "Product not found"}
    
    return {
        "id": product.id,
        "name": product.name,
        "quantity": product.quantity or "1 unit",
        "quality": product.quality or "Standard",
        "price": int(product.price) if product.price else 0,
        "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400"
    }

# --- Bulk Fabrics (Product Model) ---
from backend.models import Product

@router.get("/cat/all", tags=["Catalogue"])
def get_catalogue_products(db: Session = Depends(get_db)):
    """Get all bulk fabrics for the Products page"""
    fabrics = db.query(Product).all()
    return [
        {
            "id": f.id,
            "title": f.name, # Mapped from name
            "desc": f.description,
            "category": f.category,
            "features": (f.features or "").split(",") if f.features else [],
            "image": f.image,
            "file": f.file
        }
        for f in fabrics
    ]

