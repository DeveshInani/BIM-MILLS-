from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
from backend.database import get_db
from backend.models import VendorPayment, Vendor
from pydantic import BaseModel
import uuid

router = APIRouter(prefix="/api/vendor-payments", tags=["Vendor Payments"])


# ============ SCHEMAS ============
class VendorPaymentCreate(BaseModel):
    vendor_id: int
    description: Optional[str] = None
    amount: float
    payment_method: Optional[str] = None
    payment_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    status: Optional[str] = "Pending"
    reference_number: Optional[str] = None
    bill_reference: Optional[str] = None
    notes: Optional[str] = None


class VendorPaymentUpdate(BaseModel):
    description: Optional[str] = None
    amount: Optional[float] = None
    payment_method: Optional[str] = None
    payment_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    status: Optional[str] = None
    reference_number: Optional[str] = None
    bill_reference: Optional[str] = None
    notes: Optional[str] = None


class VendorPaymentResponse(BaseModel):
    id: int
    vendor_id: int
    payment_number: str
    description: Optional[str]
    amount: float
    payment_method: Optional[str]
    payment_date: datetime
    due_date: Optional[datetime]
    status: str
    reference_number: Optional[str]
    bill_reference: Optional[str]
    notes: Optional[str]
    created_at: datetime
    vendor: Optional[dict] = None

    class Config:
        from_attributes = True


# ============ ROUTES ============
@router.post("/", response_model=VendorPaymentResponse)
def create_vendor_payment(payment: VendorPaymentCreate, db: Session = Depends(get_db)):
    """Create a new vendor payment record"""
    # Verify vendor exists
    vendor = db.query(Vendor).filter(Vendor.id == payment.vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    
    # Generate unique payment number
    payment_number = f"VP-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
    
    # Create payment
    db_payment = VendorPayment(
        vendor_id=payment.vendor_id,
        payment_number=payment_number,
        description=payment.description,
        amount=payment.amount,
        payment_method=payment.payment_method,
        payment_date=payment.payment_date or datetime.utcnow(),
        due_date=payment.due_date,
        status=payment.status or "Pending",
        reference_number=payment.reference_number,
        bill_reference=payment.bill_reference,
        notes=payment.notes
    )
    
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    
    # Construct response with vendor info
    return VendorPaymentResponse(
        id=db_payment.id,
        vendor_id=db_payment.vendor_id,
        payment_number=db_payment.payment_number,
        description=db_payment.description,
        amount=db_payment.amount,
        payment_method=db_payment.payment_method,
        payment_date=db_payment.payment_date,
        due_date=db_payment.due_date,
        status=db_payment.status,
        reference_number=db_payment.reference_number,
        bill_reference=db_payment.bill_reference,
        notes=db_payment.notes,
        created_at=db_payment.created_at,
        vendor={
            "id": vendor.id,
            "name": vendor.name,
            "company_name": vendor.company_name
        }
    )


@router.get("/", response_model=List[VendorPaymentResponse])
def list_vendor_payments(skip: int = 0, limit: int = 100, status: Optional[str] = None, db: Session = Depends(get_db)):
    """List all vendor payments"""
    query = db.query(VendorPayment)
    if status:
        query = query.filter(VendorPayment.status == status)
    payments = query.order_by(VendorPayment.payment_date.desc()).offset(skip).limit(limit).all()
    
    results = []
    for payment in payments:
        vendor = db.query(Vendor).filter(Vendor.id == payment.vendor_id).first()
        result = VendorPaymentResponse(
            id=payment.id,
            vendor_id=payment.vendor_id,
            payment_number=payment.payment_number,
            description=payment.description,
            amount=payment.amount,
            payment_method=payment.payment_method,
            payment_date=payment.payment_date,
            due_date=payment.due_date,
            status=payment.status,
            reference_number=payment.reference_number,
            bill_reference=payment.bill_reference,
            notes=payment.notes,
            created_at=payment.created_at,
            vendor={"id": vendor.id, "name": vendor.name, "company_name": vendor.company_name} if vendor else None
        )
        results.append(result)
    
    return results


@router.get("/{payment_id}", response_model=VendorPaymentResponse)
def get_vendor_payment(payment_id: int, db: Session = Depends(get_db)):
    """Get a specific vendor payment by ID"""
    payment = db.query(VendorPayment).filter(VendorPayment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Vendor payment not found")
    
    vendor = db.query(Vendor).filter(Vendor.id == payment.vendor_id).first()
    return VendorPaymentResponse(
        id=payment.id,
        vendor_id=payment.vendor_id,
        payment_number=payment.payment_number,
        description=payment.description,
        amount=payment.amount,
        payment_method=payment.payment_method,
        payment_date=payment.payment_date,
        due_date=payment.due_date,
        status=payment.status,
        reference_number=payment.reference_number,
        bill_reference=payment.bill_reference,
        notes=payment.notes,
        created_at=payment.created_at,
        vendor={"id": vendor.id, "name": vendor.name, "company_name": vendor.company_name} if vendor else None
    )


@router.put("/{payment_id}", response_model=VendorPaymentResponse)
def update_vendor_payment(payment_id: int, payment_update: VendorPaymentUpdate, db: Session = Depends(get_db)):
    """Update vendor payment information"""
    payment = db.query(VendorPayment).filter(VendorPayment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Vendor payment not found")
    
    update_data = payment_update.dict(exclude_unset=True)
    prev_status = payment.status
    for key, value in update_data.items():
        setattr(payment, key, value)

    db.commit()
    db.refresh(payment)

    vendor = db.query(Vendor).filter(Vendor.id == payment.vendor_id).first()
    return VendorPaymentResponse(
        id=payment.id,
        vendor_id=payment.vendor_id,
        payment_number=payment.payment_number,
        description=payment.description,
        amount=payment.amount,
        payment_method=payment.payment_method,
        payment_date=payment.payment_date,
        due_date=payment.due_date,
        status=payment.status,
        reference_number=payment.reference_number,
        bill_reference=payment.bill_reference,
        notes=payment.notes,
        created_at=payment.created_at,
        vendor={"id": vendor.id, "name": vendor.name, "company_name": vendor.company_name} if vendor else None
    )


@router.delete("/{payment_id}")
def delete_vendor_payment(payment_id: int, db: Session = Depends(get_db)):
    """Delete a vendor payment"""
    payment = db.query(VendorPayment).filter(VendorPayment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Vendor payment not found")
    
    db.delete(payment)
    db.commit()
    return {"message": "Vendor payment deleted successfully"}


@router.get("/vendor/{vendor_id}", response_model=List[VendorPaymentResponse])
def get_vendor_payments_by_vendor(vendor_id: int, db: Session = Depends(get_db)):
    """Get all payments for a specific vendor"""
    payments = db.query(VendorPayment).filter(VendorPayment.vendor_id == vendor_id).order_by(VendorPayment.payment_date.desc()).all()
    
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    results = []
    for payment in payments:
        result = VendorPaymentResponse(
            id=payment.id,
            vendor_id=payment.vendor_id,
            payment_number=payment.payment_number,
            description=payment.description,
            amount=payment.amount,
            payment_method=payment.payment_method,
            payment_date=payment.payment_date,
            due_date=payment.due_date,
            status=payment.status,
            reference_number=payment.reference_number,
            bill_reference=payment.bill_reference,
            notes=payment.notes,
            created_at=payment.created_at,
            vendor={"id": vendor.id, "name": vendor.name, "company_name": vendor.company_name} if vendor else None
        )
        results.append(result)
    
    return results
