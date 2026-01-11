from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
                ("features", "VARCHAR(1000)")
            ]
            for col, dtype in columns:
                check = text(f"SELECT count(*) FROM information_schema.columns WHERE table_schema=DATABASE() AND table_name='products' AND column_name='{col}'")
                if conn.execute(check).scalar() == 0:
                    print(f"Migrating: Adding {col} to products")
                    conn.execute(text(f"ALTER TABLE products ADD COLUMN {col} {dtype}"))
                    conn.commit()
            print("Schema migration checked.")
            
            # --- Seeding Data ---
            from backend.models import Product
            # Check if empty (using raw SQL for safety in this context or create session)
            # Creating a session manually here
            from sqlalchemy.orm import Session
            session = Session(bind=conn)
            
            # Static data from Products.jsx
            static_catalogs = [
              {
                "title": "Shirting Fabrics",
                "desc": "Premium shirting fabrics for schools, corporates and uniforms",
                "file": "bimmills_catalogue/P.V.SUITING (1).pdf",
                "category": "Shirting",
                "features": "Wrinkle-Free,Breathable,Easy Care",
                "image": "https://images.unsplash.com/photo-1558769132-cb1aea3c6eaa?w=800&q=80"
              },
              {
                "title": "Suiting Fabrics",
                "desc": "Durable suiting fabrics with elegant finishes",
                "file": "bimmills_catalogue/P.V.SUITING (2).pdf",
                "category": "Suiting",
                "features": "Premium Quality,Wrinkle Resistant,Professional Look",
                "image": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80"
              },
              {
                "title": "Yarn Dyed Fabrics",
                "desc": "Colorfast yarn dyed fabrics with rich texture",
                "file": "bimmills_catalogue/ENIGMA YARN DYED SUTING.pdf",
                "category": "Premium",
                "features": "Colorfast,Rich Texture,Long Lasting",
                "image": "https://images.unsplash.com/photo-1604006852748-903fccbc4019?w=800&q=80"
              },
              {
                "title": "Cotton Drill",
                "desc": "Heavy-duty cotton drill fabrics for industrial wear",
                "file": "bimmills_catalogue/100 COTTON DRILL.pdf",
                "category": "Industrial",
                "features": "Heavy Duty,100% Cotton,Durable",
                "image": "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&q=80"
              },
              {
                "title": "Matty Fabrics",
                "desc": "Breathable matty fabrics for comfort uniforms",
                "file": "bimmills_catalogue/E-18 YARN DYED MATTY.pdf",
                "category": "Comfort",
                "features": "Breathable,Comfortable,Uniform Ready",
                "image": "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80"
              },
              {
                "title": "Enigma Series",
                "desc": "Premium enigma yarn dyed exclusive collection",
                "file": "bimmills_catalogue/ENIGMA YARN DYED SUTING.pdf",
                "category": "Exclusive",
                "features": "Exclusive,Premium,Limited Edition",
                "image": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80"
              },
            ]
            
            print("Checking fabric catalogue data...")
            for item in static_catalogs:
                # Check if this specific product exists
                exists = session.query(Product).filter(Product.name == item["title"]).first()
                if not exists:
                    print(f"Seeding: {item['title']}")
                    new_item = Product(
                        name=item["title"],
                        description=item["desc"],
                        price=0,
                        quantity="In Stock",
                        quality="Premium",
                        image=item["image"],
                        file=item["file"],
                        category=item["category"],
                        features=item["features"]
                    )
                    session.add(new_item)
            session.commit()
            session.close()

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
