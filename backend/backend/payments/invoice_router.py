from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
from backend.database import get_db
from backend.models import Invoice, Order
from pydantic import BaseModel
import uuid

router = APIRouter(prefix="/api/invoices", tags=["Invoices"])


# ============ SCHEMAS ============
class InvoiceCreate(BaseModel):
    order_id: int
    tax_rate: Optional[float] = 0.0
    payment_method: Optional[str] = None
    payment_status: Optional[str] = "Pending"  # Admin sets this
    due_date: Optional[datetime] = None
    notes: Optional[str] = None


class InvoiceResponse(BaseModel):
    id: int
    invoice_number: str
    order_id: int
    customer_name: str
    customer_email: Optional[str]
    customer_address: Optional[str]
    customer_phone: Optional[str]
    product_name: Optional[str]
    quantity: Optional[str]
    quality: Optional[str]
    subtotal: float
    tax_rate: float
    tax_amount: float
    total_amount: float
    payment_status: str
    payment_method: Optional[str]
    issue_date: datetime
    due_date: Optional[datetime]
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class StatusUpdate(BaseModel):
    status: str


# ============ ROUTES ============
@router.post("/generate", response_model=InvoiceResponse)
def generate_invoice(invoice_data: InvoiceCreate, db: Session = Depends(get_db)):
    """Generate an invoice when a customer pays"""
    # Fetch the order
    order = db.query(Order).filter(Order.id == invoice_data.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Calculate amounts
    subtotal = order.amount or 0.0
    tax_rate = invoice_data.tax_rate or 0.0
    tax_amount = (subtotal * tax_rate) / 100
    total_amount = subtotal + tax_amount
    
    # Generate unique invoice number
    invoice_number = f"INV-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
    
    # Create invoice
    invoice = Invoice(
        invoice_number=invoice_number,
        order_id=order.id,
        customer_name=order.user_name or "Guest Customer",
        customer_email=order.user_email,
        customer_address=order.user_address,
        customer_phone=order.user_phone,
        product_name=order.product_name,
        quantity=order.quantity,
        quality=order.quality,
        subtotal=subtotal,
        tax_rate=tax_rate,
        tax_amount=tax_amount,
        total_amount=total_amount,
        payment_status=invoice_data.payment_status or "Pending",  # Admin sets status
        payment_method=invoice_data.payment_method,
        issue_date=datetime.utcnow(),
        due_date=invoice_data.due_date,
        notes=invoice_data.notes
    )
    
    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    
    return invoice


@router.get("/", response_model=List[InvoiceResponse])
def list_invoices(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all invoices"""
    invoices = db.query(Invoice).order_by(Invoice.created_at.desc()).offset(skip).limit(limit).all()
    return invoices


@router.get("/{invoice_id}", response_model=InvoiceResponse)
def get_invoice(invoice_id: int, db: Session = Depends(get_db)):
    """Get a specific invoice by ID"""
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice


@router.get("/order/{order_id}", response_model=List[InvoiceResponse])
def get_invoices_by_order(order_id: int, db: Session = Depends(get_db)):
    """Get invoices for a specific order"""
    invoices = db.query(Invoice).filter(Invoice.order_id == order_id).all()
    return invoices


@router.put("/{invoice_id}/status", response_model=InvoiceResponse)
def update_invoice_status(invoice_id: int, status_update: StatusUpdate, db: Session = Depends(get_db)):
    """Update invoice payment status - Admin sets status"""
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    invoice.payment_status = status_update.status
    db.commit()
    db.refresh(invoice)
    
    return invoice
