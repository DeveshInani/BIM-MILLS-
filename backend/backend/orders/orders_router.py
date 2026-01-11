from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from backend.database import get_db
from backend.models import Order, Sales, ReadymadeProduct
from backend.email.send_email import send_order_confirmation, send_cancellation_confirmation
from backend.email.templates import order_confirmation_template, cancellation_confirmation_template
from pydantic import BaseModel

router = APIRouter(prefix="/api/orders", tags=["Orders"])

# ============ SCHEMAS ============
class OrderCreate(BaseModel):
    user_id: Optional[int] = None
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    user_phone: Optional[str] = None
    user_address: Optional[str] = None
    readymade_product_id: Optional[int] = None
    product_id: Optional[int] = None
    product_name: Optional[str] = None
    quantity: Optional[str] = None
    quality: Optional[str] = None
    amount: Optional[float] = None

class OrderResponse(BaseModel):
    id: int
    user_name: str
    product_name: str
    quantity: str
    amount: float
    created_at: datetime

    class Config:
        from_attributes = True

# ============ ENDPOINTS ============

@router.post("/", status_code=201)
def create_order(order_data: OrderCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Create a new order from shop checkout"""
    
    # Validate product exists (if readymade_product_id provided)
    if order_data.readymade_product_id:
        product = db.query(ReadymadeProduct).filter(
            ReadymadeProduct.id == order_data.readymade_product_id
        ).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
    
    # Create order
    new_order = Order(
        user_id=order_data.user_id,
        user_name=order_data.user_name,
        user_email=order_data.user_email,
        user_phone=order_data.user_phone,
        user_address=order_data.user_address,
        readymade_product_id=order_data.readymade_product_id,
        product_id=order_data.product_id,
        product_name=order_data.product_name,
        quantity=order_data.quantity,
        quality=order_data.quality,
        amount=order_data.amount,
        created_at=datetime.utcnow()
    )
    
    db.add(new_order)
    db.flush()  # Get the ID without committing yet
    
    # Create corresponding sales record
    sales = Sales(
        amount=order_data.amount or 0,
        transaction_id=f"TXN-{new_order.id}-{datetime.utcnow().timestamp()}",
        order_id=new_order.id,
        date=datetime.utcnow(),
        day=datetime.utcnow().strftime("%A")
    )
    
    db.add(sales)
    db.commit()
    db.refresh(new_order)
    
    # Send confirmation email in background
    if order_data.user_email:
        email_html = order_confirmation_template(
            name=order_data.user_name,
            order_id=new_order.id,
            products=order_data.product_name,
            quantity=order_data.quantity,
            phone=order_data.user_phone,
            address=order_data.user_address,
            amount=order_data.amount or 0
        )
        background_tasks.add_task(send_order_confirmation, order_data.user_email, email_html)
    
    return {
        "id": new_order.id,
        "user_name": new_order.user_name,
        "product_name": new_order.product_name,
        "quantity": new_order.quantity,
        "amount": new_order.amount,
        "created_at": new_order.created_at,
        "message": "Order created successfully"
    }


@router.get("/", response_model=list)
def get_all_orders(db: Session = Depends(get_db)):
    """Get all orders"""
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    return [
        {
            "id": o.id,
            "user_name": o.user_name,
            "user_email": o.user_email,
            "user_phone": o.user_phone,
            "user_address": o.user_address,
            "product_name": o.product_name,
            "quantity": o.quantity,
            "amount": o.amount,
            "created_at": o.created_at,
            "cancellation_requested": o.cancellation_requested
        }
        for o in orders
    ]


@router.get("/{order_id}")
def get_order(order_id: int, db: Session = Depends(get_db)):
    """Get specific order by ID"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {
        "id": order.id,
        "user_name": order.user_name,
        "user_email": order.user_email,
        "user_phone": order.user_phone,
        "user_address": order.user_address,
        "product_name": order.product_name,
        "quantity": order.quantity,
        "amount": order.amount,
        "created_at": order.created_at,
        "cancellation_requested": order.cancellation_requested
    }

class CancellationRequest(BaseModel):
    email: str

@router.post("/{order_id}/request-cancellation")
def request_cancellation(order_id: int, request: CancellationRequest, db: Session = Depends(get_db)):
    """User requests order cancellation via email verification"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Verify email matches
    if order.user_email != request.email:
        raise HTTPException(status_code=403, detail="Email does not match order")
    
    # Mark as cancellation requested
    order.cancellation_requested = 1
    db.commit()
    db.refresh(order)
    
    return {
        "id": order.id,
        "message": "Cancellation request submitted. Admin will process your request shortly.",
        "cancellation_requested": order.cancellation_requested
    }

@router.delete("/{order_id}", status_code=200)
def delete_order(order_id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Delete/Cancel an order by ID and send confirmation email"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Store order details before deletion for response
    order_details = {
        "id": order.id,
        "user_name": order.user_name,
        "user_email": order.user_email,
        "user_phone": order.user_phone,
        "product_name": order.product_name,
        "message": "Order cancelled successfully"
    }
    
    # Delete associated sales records first
    db.query(Sales).filter(Sales.order_id == order_id).delete()
    
    # Delete the order
    db.delete(order)
    db.commit()
    
    # Send cancellation confirmation email
    if order.user_email:
        email_html = cancellation_confirmation_template(
            name=order.user_name,
            order_id=order_id,
            products=order.product_name,
            amount=order.amount or 0
        )
        background_tasks.add_task(send_cancellation_confirmation, order.user_email, email_html)
    
    return order_details