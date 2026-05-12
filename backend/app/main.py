from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi import HTTPException
from fastapi.staticfiles import StaticFiles
from app.db.database import Base, engine
from app.api.auth.auth_router import router as auth_router
from app.api.user.user_router import router as user_router
from app.api.admin.admin_router import router as admin_router
from app.api.orders.orders_router import router as orders_router
from app.api.shop.shop_router import router as shop_router
from app.api.sales.sales_router import router as sales_router
from app.api.payments.invoice_router import router as invoice_router
from app.api.payments.vendor_router import router as vendor_router
from app.api.payments.vendor_payment_router import router as vendor_payment_router
import os

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:5173",
        "https://bim-mills.vercel.app"
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




Base.metadata.create_all(bind=engine)  # <--- IMPORTANT


app.include_router(auth_router)
app.include_router(user_router)
app.include_router(admin_router)
app.include_router(orders_router)
app.include_router(shop_router)
app.include_router(sales_router)
app.include_router(invoice_router)
app.include_router(vendor_router)
app.include_router(vendor_payment_router)

@app.get("/")
def home():
    return {"message": "API running with MySQL"}

@app.get("/files/bimmills_catalogue/{filename:path}")
async def serve_pdf(filename: str):
    """
    Serve PDF files from the frontend/public/bimmills_catalogue directory
    """
    current_file = os.path.abspath(__file__)
    backend_dir = os.path.dirname(os.path.dirname(current_file))
    project_root = os.path.dirname(backend_dir)
    file_path = os.path.join(project_root, "frontend", "public", "bimmills_catalogue", filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(
        file_path,
        media_type="application/pdf",
        headers={
            "Content-Disposition": "inline",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    )
