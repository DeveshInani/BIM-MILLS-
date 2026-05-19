from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.db.database import get_db
from datetime import datetime
from typing import Optional
from app.api.auth.schemas import UserCreate
from app.api.auth.dependencies import get_current_user, get_current_admin, get_current_auth
from app.db.models import Order, Sales, ReadymadeProduct, User, Admin
from app.api.email.send_email import (
    send_order_confirmation, 
    send_cancellation_confirmation,
    send_user_email,
    send_admin_email
)
from app.api.core.config import settings
from app.api.email.templates import (
    order_confirmation_template, 
    cancellation_confirmation_template,
    cancellation_request_received_template,
    admin_cancellation_alert_template,
    cancellation_rejected_template
)
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
def create_order(
    order_data: OrderCreate, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new order from shop checkout"""
    
    # Force use of current user's email for security
    user_email = current_user.email
    user_name = current_user.name
    
    # Validate product exists (if readymade_product_id provided)
    if order_data.readymade_product_id:
        product = db.query(ReadymadeProduct).filter(
            ReadymadeProduct.id == order_data.readymade_product_id
        ).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
    
    # Create order
    new_order = Order(
        user_id=current_user.id,
        user_name=user_name,
        user_email=user_email,
        user_phone=order_data.user_phone,
        user_address=order_data.user_address,
        readymade_product_id=order_data.readymade_product_id,
        product_id=order_data.product_id,
        product_name=order_data.product_name,
        quantity=order_data.quantity,
        quality=order_data.quality,
        amount=order_data.amount,
        status="Active",
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
    if user_email:
        email_html = order_confirmation_template(
            name=user_name,
            order_id=new_order.id,
            products=order_data.product_name,
            quantity=order_data.quantity,
            phone=order_data.user_phone,
            address=order_data.user_address,
            amount=order_data.amount or 0
        )
        background_tasks.add_task(send_order_confirmation, user_email, email_html)
    
    return {
        "id": new_order.id,
        "user_name": new_order.user_name,
        "product_name": new_order.product_name,
        "quantity": new_order.quantity,
        "amount": new_order.amount,
        "created_at": new_order.created_at,
        "status": new_order.status,
        "cancellation_requested": new_order.cancellation_requested,
        "message": "Order created successfully"
    }


@router.get("/", response_model=list)
def get_all_orders(
    db: Session = Depends(get_db),
    auth: dict = Depends(get_current_auth)
):
    """Get all orders (Admin sees all, User sees only their own)"""
    query = db.query(Order).order_by(Order.created_at.desc())
    
    if auth["role"] == "user":
        query = query.filter(Order.user_email == auth["auth"].email)
    
    orders = query.all()
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
            "status": o.status,
            "cancellation_requested": o.cancellation_requested,
            "cancellation_reason": o.cancellation_reason,
            "cancellation_note": o.cancellation_note
        }
        for o in orders
    ]


@router.get("/{order_id}")
def get_order(
    order_id: int, 
    db: Session = Depends(get_db),
    auth: dict = Depends(get_current_auth)
):
    """Get specific order by ID (with ownership check)"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Ownership Check
    if auth["role"] == "user" and order.user_email != auth["auth"].email:
        raise HTTPException(status_code=403, detail="Not authorized to view this order")
    
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
        "status": order.status,
        "cancellation_requested": order.cancellation_requested,
        "cancellation_reason": order.cancellation_reason,
        "cancellation_note": order.cancellation_note
    }

class CancellationRequest(BaseModel):
    email: str
    reason: Optional[str] = None

@router.post("/{order_id}/request-cancellation")
def request_cancellation(
    order_id: int, 
    request: CancellationRequest, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """User requests order cancellation"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Verify ownership via JWT email
    if order.user_email != current_user.email:
        raise HTTPException(status_code=403, detail="Not authorized to cancel this order")
    
    # Mark as cancellation requested
    order.cancellation_requested = 1
    order.cancellation_reason = request.reason
    order.status = "Pending Cancellation"
    db.commit()
    db.refresh(order)
    
    # ✅ Send "Request Received" email to user
    user_email_html = cancellation_request_received_template(
        name=order.user_name,
        order_id=order.id
    )
    background_tasks.add_task(send_user_email, order.user_email, user_email_html)

    # ✅ Send Alert to Admin
    admin_email = settings.ADMIN_EMAIL
    admin_email_html = admin_cancellation_alert_template(
        order_id=order.id,
        user_name=order.user_name,
        product_name=order.product_name
    )
    background_tasks.add_task(send_admin_email, admin_email, admin_email_html)
    
    return {
        "id": order.id,
        "message": "Cancellation request submitted. Admin will process your request shortly.",
        "cancellation_requested": order.cancellation_requested
    }

class ProcessCancellation(BaseModel):
    action: str # "approve" or "reject"
    note: str

@router.post("/{order_id}/admin-process-cancellation")
def admin_process_cancellation(
    order_id: int,
    data: ProcessCancellation,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    """Admin approves or rejects cancellation with a note"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.cancellation_note = data.note
    
    if data.action == "approve":
        order.status = "Cancelled"
        order.cancellation_requested = 0 # Reset request flag as it's processed
        
        # Optionally delete sales or keep for history (User asked to delete approach, so maybe delete?)
        # For now, let's keep the order but mark as Cancelled. 
        # Actually, the user's previous logic was to delete the order and sales.
        # "if admin cancels the order the user will get a sucessfull order canceld mail"
        
        # Send Success Email
        email_html = cancellation_confirmation_template(
            name=order.user_name,
            order_id=order.id,
            products=order.product_name,
            amount=order.amount or 0
        )
        background_tasks.add_task(send_user_email, order.user_email, email_html)
        
        # The user wants a robust dashboard, so maybe don't DELETE, but just mark as Cancelled?
        # Let's mark as Cancelled so it stays in history.
        
    elif data.action == "reject":
        order.status = "Active" # Back to active
        order.cancellation_requested = 0
        
        # Send Rejection Email
        email_html = cancellation_rejected_template(
            name=order.user_name,
            order_id=order.id,
            note=data.note
        )
        background_tasks.add_task(send_user_email, order.user_email, email_html)
    
    db.commit()
    return {"message": f"Order cancellation {data.action}ed successfully"}

@router.delete("/{order_id}", status_code=200)
def delete_order(
    order_id: int, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(get_db),
    admin: Admin = Depends(get_current_admin)
):
    """Admin hard delete/cancel an order by ID"""
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
