from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Enquiry, Product, ReadymadeProduct, Order, Employee
from backend.email.send_email import send_custom_email
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter(prefix="/admin", tags=["Admin"])

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
async def send_email(email_req: EmailRequest):
    try:
        await send_custom_email(email_req.to_email, email_req.subject, email_req.body)
        return {"message": "Email sent successfully"}
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
    price: int
    quantity: Optional[str] = None
    quality: Optional[str] = None
    image: Optional[str] = None
    file: Optional[str] = None
    category: Optional[str] = None
    features: Optional[str] = None

@router.get("/fabrics")
def get_fabrics(db: Session = Depends(get_db)):
    return db.query(Product).all()

@router.post("/fabrics")
def create_fabric(fabric: FabricCreate, db: Session = Depends(get_db)):
    # Product model corresponds to Bulk Fabrics
    new_fabric = Product(
        name=fabric.name,
        description=fabric.description,
        price=fabric.price,
        quantity=fabric.quantity,
        quality=fabric.quality,
        image=fabric.image,
        file=fabric.file,
        category=fabric.category,
        features=fabric.features
    )
    db.add(new_fabric)
    db.commit()
    db.refresh(new_fabric)
    return new_fabric

@router.put("/fabrics/{fabric_id}")
def update_fabric(fabric_id: int, fabric: FabricCreate, db: Session = Depends(get_db)):
    db_fabric = db.query(Product).filter(Product.id == fabric_id).first()
    if not db_fabric:
        raise HTTPException(status_code=404, detail="Fabric not found")
    
    db_fabric.name = fabric.name
    db_fabric.description = fabric.description
    db_fabric.price = fabric.price
    db_fabric.quantity = fabric.quantity
    db_fabric.quality = fabric.quality
    db_fabric.image = fabric.image
    db_fabric.file = fabric.file
    db_fabric.category = fabric.category
    db_fabric.features = fabric.features
    
    db.commit()
    return db_fabric

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
