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
            "file": f.file,
            "rate": f.rate,
            "quality_code": f.quality_code,
            "fabric_type": f.fabric_type,
            "usage_area": f.usage_area,
            "gsm": f.fabric_gsm,
            "width": f.fabric_width
        }
        for f in fabrics
    ]

from fastapi.responses import FileResponse, StreamingResponse
import os

@router.get("/pdf/{product_id}", tags=["Catalogue"])
def serve_catalogue_pdf(product_id: int, db: Session = Depends(get_db)):
    """Serve PDF from the catalogue folder with robust headers"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product or not product.file:
        return {"error": "PDF not found for this product"}
    
    # Extract filename and ensure it's normalized (underscores)
    raw_path = product.file.replace('bimillscatalogue', 'bimmills_catalogue')
    filename = raw_path.split("/")[-1].replace(" ", "_").replace("%20", "_")
    
    # Path to frontend/public/bimmills_catalogue
    current_file = os.path.abspath(__file__)
    # shop_router.py is in backend/backend/shop/
    backend_root = os.path.dirname(os.path.dirname(os.path.dirname(current_file))) # backend/
    project_root = os.path.dirname(backend_root)
    
    file_path = os.path.join(project_root, "frontend", "public", "bimmills_catalogue", filename)
    
    if not os.path.exists(file_path):
        # Try one more: maybe it's just in the folder without the bimmills_catalogue prefix
        alternative_path = os.path.join(project_root, "frontend", "public", filename)
        if os.path.exists(alternative_path):
            file_path = alternative_path
        else:
            print(f"File not found on disk: {file_path}")
            return {"error": "File not found on disk"}

    return FileResponse(
        path=file_path,
        media_type='application/pdf',
        filename=filename,
        content_disposition_type='inline' # Try to show in browser first
    )
