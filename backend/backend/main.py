from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi import HTTPException
from fastapi.staticfiles import StaticFiles
from backend.database import Base, engine
from backend.auth.auth_router import router as auth_router
from backend.user.user_router import router as user_router
from backend.admin.admin_router import router as admin_router
from backend.orders.orders_router import router as orders_router
from backend.shop.shop_router import router as shop_router
from backend.sales.sales_router import router as sales_router
from backend.payments.invoice_router import router as invoice_router
from backend.payments.vendor_router import router as vendor_router
from backend.payments.vendor_payment_router import router as vendor_payment_router
import os

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




Base.metadata.create_all(bind=engine)  # <--- IMPORTANT

from sqlalchemy import text

@app.on_event("startup")
def run_migrations():
    try:
        with engine.connect() as conn:
            columns = [
                ("image", "VARCHAR(1000)"),
                ("file", "VARCHAR(1000)"),
                ("category", "VARCHAR(255)"),
                ("features", "VARCHAR(1000)"),
                ("rate", "FLOAT"),
                ("quality_code", "VARCHAR(255)"),
                ("fabric_type", "VARCHAR(255)"),
                ("usage_area", "VARCHAR(255)"),
                ("fabric_gsm", "VARCHAR(255)"),
                ("fabric_width", "VARCHAR(255)")
            ]
            for col, dtype in columns:
                check = text(f"SELECT count(*) FROM information_schema.columns WHERE table_schema=DATABASE() AND table_name='products' AND column_name='{col}'")
                if conn.execute(check).scalar() == 0:
                    print(f"Migrating: Adding {col} to products")
                    conn.execute(text(f"ALTER TABLE products ADD COLUMN {col} {dtype}"))
                    conn.commit()
            
            # Migration for enquiries table
            enquiry_columns = [("subject", "VARCHAR(255)")]
            for col, dtype in enquiry_columns:
                check = text(f"SELECT count(*) FROM information_schema.columns WHERE table_schema=DATABASE() AND table_name='enquiries' AND column_name='{col}'")
                if conn.execute(check).scalar() == 0:
                    print(f"Migrating: Adding {col} to enquiries")
                    conn.execute(text(f"ALTER TABLE enquiries ADD COLUMN {col} {dtype}"))
                    conn.commit()

            print("Schema migration checked.")
    except Exception as e:
        print(f"Startup task warning: {e}")



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
