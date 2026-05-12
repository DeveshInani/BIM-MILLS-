from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Enquiry, Product, ReadymadeProduct, Order, Employee, User
from app.api.email.send_email import send_custom_email
from pydantic import BaseModel
from typing import Optional, List

from app.api.auth.dependencies import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin"], dependencies=[Depends(get_current_admin)])

@router.get("/enquiries")
def get_enquiries(db: Session = Depends(get_db)):
    enquiries = (
        db.query(Enquiry)
        .order_by(Enquiry.created_at.desc())
        .all()
    )
    return enquiries
@router.delete("/enquiries/{enquiry_id}")
def delete_enquiry(enquiry_id: int, db: Session = Depends(get_db)):
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()

    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")

    db.delete(enquiry)
    db.commit()

    return {"message": "Enquiry deleted successfully"}


# --- Email Sending ---
class EmailRequest(BaseModel):
    to_email: str
    subject: str
    body: str

@router.post("/send-email")
async def send_email(email_req: EmailRequest, background_tasks: BackgroundTasks):
    try:
        background_tasks.add_task(
            send_custom_email,
            email_req.to_email,
            email_req.subject,
            email_req.body,
        )
        return {"message": "Email queued successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# --- Product Management (Readymade - Shop) ---

class ProductCreate(BaseModel):
    name: str
    quantity: str
    quality: str
    price: int
    image: Optional[str] = None
    collection: Optional[str] = None # Simulating collection

@router.get("/products")
def get_products(db: Session = Depends(get_db)):
    return db.query(ReadymadeProduct).all()

@router.post("/products")
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    # Assuming ReadymadeProduct is what we want to manage for the shop
    new_product = ReadymadeProduct(
        name=product.name,
        quantity=product.quantity,
        quality=product.quality,
        price=product.price
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@router.put("/products/{product_id}")
def update_product(product_id: int, product: ProductCreate, db: Session = Depends(get_db)):
    db_product = db.query(ReadymadeProduct).filter(ReadymadeProduct.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db_product.name = product.name
    db_product.quantity = product.quantity
    db_product.quality = product.quality
    db_product.price = product.price
    # db_product.collection = product.collection # if we had this field
    
    db.commit()
    return db_product

@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(ReadymadeProduct).filter(ReadymadeProduct.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted"}


# --- Fabric Management (Bulk - Catalogue) ---

class FabricCreate(BaseModel):
    name: str
    description: str
    price: Optional[int] = 0
    rate: Optional[float] = None
    quantity: Optional[str] = None
    quality: Optional[str] = None
    quality_code: Optional[str] = None
    fabric_type: Optional[str] = None
    usage_area: Optional[str] = None
    fabric_gsm: Optional[str] = None
    fabric_width: Optional[str] = None
    image: Optional[str] = None
    file: Optional[str] = None
    category: Optional[str] = None
    features: Optional[str] = None

@router.get("/fabrics")
def get_fabrics(db: Session = Depends(get_db)):
    return db.query(Product).all()

@router.post("/fabrics")
def create_fabric(fabric: FabricCreate, db: Session = Depends(get_db)):
    print(f"Creating fabric: {fabric.name}")
    print(f"PDF file path: {fabric.file}")
    
    new_fabric = Product(
        name=fabric.name,
        description=fabric.description,
        price=fabric.price,
        rate=fabric.rate,
        quantity=fabric.quantity,
        quality=fabric.quality,
        quality_code=fabric.quality_code,
        fabric_type=fabric.fabric_type,
        usage_area=fabric.usage_area,
        fabric_gsm=fabric.fabric_gsm,
        fabric_width=fabric.fabric_width,
        image=fabric.image,
        file=fabric.file,  # This should contain the path like "bimillscatalogue/filename.pdf"
        category=fabric.category,
        features=fabric.features
    )
    db.add(new_fabric)
    db.commit()
    db.refresh(new_fabric)
    print(f"Fabric created with ID: {new_fabric.id}, file: {new_fabric.file}")
    return new_fabric

@router.put("/fabrics/{fabric_id}")
def update_fabric(fabric_id: int, fabric: FabricCreate, db: Session = Depends(get_db)):
    db_fabric = db.query(Product).filter(Product.id == fabric_id).first()
    if not db_fabric:
        raise HTTPException(status_code=404, detail="Fabric not found")
    
    print(f"Updating fabric ID: {fabric_id}, name: {fabric.name}")
    print(f"PDF file path: {fabric.file}")
    
    db_fabric.name = fabric.name
    db_fabric.description = fabric.description
    db_fabric.price = fabric.price
    db_fabric.rate = fabric.rate
    db_fabric.quantity = fabric.quantity
    db_fabric.quality = fabric.quality
    db_fabric.quality_code = fabric.quality_code
    db_fabric.fabric_type = fabric.fabric_type
    db_fabric.usage_area = fabric.usage_area
    db_fabric.fabric_gsm = fabric.fabric_gsm
    db_fabric.fabric_width = fabric.fabric_width
    db_fabric.image = fabric.image
    db_fabric.file = fabric.file  # This should contain the path like "bimillscatalogue/filename.pdf"
    db_fabric.category = fabric.category
    db_fabric.features = fabric.features
    
    db.commit()
    db.refresh(db_fabric)
    print(f"Fabric updated, file: {db_fabric.file}")
    return db_fabric

from fastapi import File, UploadFile
import os
import shutil

@router.post("/fabrics/upload-pdf")
async def upload_fabric_pdf(file: UploadFile = File(...)):
    """
    Upload PDF file to frontend/public/bimmills_catalogue folder
    Returns the relative path that will be stored in database
    """
    # Get the project root directory (assuming backend is in backend/backend/)
    # Go up two levels from this file to reach project root
    current_file = os.path.abspath(__file__)
    backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(current_file)))  # backend/ root
    project_root = os.path.dirname(backend_dir)  # project root (bim-mills/)
    
    # Path to frontend/public/bimmills_catalogue (the actual folder name)
    upload_dir = os.path.join(project_root, "frontend", "public", "bimmills_catalogue")
    
    # Create directory if it doesn't exist
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir, exist_ok=True)
        print(f"Created directory: {upload_dir}")
    
    # Sanitize filename to prevent path traversal and URL issues (replace spaces with underscores)
    safe_filename = os.path.basename(file.filename).replace(" ", "_").replace("%20", "_")
    
    # Full path to save the file
    file_path = os.path.join(upload_dir, safe_filename)
    
    # Save the file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        print(f"File saved successfully to: {file_path}")
        
        # Return path relative to public folder (for serving from frontend)
        # This will be stored in database as: bimmills_catalogue/filename.pdf
        return {"file_url": f"bimmills_catalogue/{safe_filename}", "message": "File uploaded successfully"}
    except Exception as e:
        print(f"Error saving file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

@router.delete("/fabrics/{fabric_id}")
def delete_fabric(fabric_id: int, db: Session = Depends(get_db)):
    db_fabric = db.query(Product).filter(Product.id == fabric_id).first()
    if not db_fabric:
        raise HTTPException(status_code=404, detail="Fabric not found")
    db.delete(db_fabric)
    db.commit()
    return {"message": "Fabric deleted"}


# --- Billing Info ---

@router.get("/billing")
def get_billing_info(db: Session = Depends(get_db)):
    # Aggregating some simple stats
    total_sales = db.query(Order).count()
    total_revenue = 0
    orders = db.query(Order).all()
    for o in orders:
        if o.amount:
            total_revenue += o.amount
            
    return {
        "subscription_plan": "Premium Enterprise",
        "next_billing_date": "2026-02-01",
        "amount_due": 0,
        "payment_method": "Visa ending in 4242",
        "invoices": [
            {"id": "INV-001", "date": "2026-01-01", "amount": 2999, "status": "Paid"},
            {"id": "INV-002", "date": "2025-12-01", "amount": 2999, "status": "Paid"},
        ],
        "usage_stats": {
            "total_orders_processed": total_sales,
            "total_revenue_processed": total_revenue
        }
    }


# --- Employee Management ---

class EmployeeCreate(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    position: Optional[str] = None
    salary: Optional[int] = None

@router.get("/employees")
def get_employees(db: Session = Depends(get_db)):
    return db.query(Employee).all()

@router.post("/employees")
def create_employee(emp: EmployeeCreate, db: Session = Depends(get_db)):
    new_emp = Employee(
        name=emp.name,
        email=emp.email,
        phone=emp.phone,
        position=emp.position,
        salary=emp.salary
    )
    db.add(new_emp)
    db.commit()
    db.refresh(new_emp)
    return new_emp

@router.put("/employees/{emp_id}")
def update_employee(emp_id: int, emp: EmployeeCreate, db: Session = Depends(get_db)):
    db_emp = db.query(Employee).filter(Employee.id == emp_id).first()
    if not db_emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    db_emp.name = emp.name
    db_emp.email = emp.email
    db_emp.phone = emp.phone
    db_emp.position = emp.position
    db_emp.salary = emp.salary
    
    db.commit()
    return db_emp

@router.delete("/employees/{emp_id}")
def delete_employee(emp_id: int, db: Session = Depends(get_db)):
    db_emp = db.query(Employee).filter(Employee.id == emp_id).first()
    if not db_emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(db_emp)
    db.commit()
    return {"message": "Employee deleted"}

# --- User Management ---

@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()
