from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.database import get_db
from backend.models import Sales, Order

router = APIRouter(prefix="/api/sales", tags=["Sales & Analytics"])

@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    """Get sales analytics for dashboard"""
    
    # Total sales amount
    total_sales = db.query(func.sum(Sales.amount)).scalar() or 0
    
    # Total orders
    total_orders = db.query(func.count(Order.id)).scalar() or 0
    
    # Sales by day (last 7 days)
    sales_by_day = db.query(
        Sales.day,
        func.sum(Sales.amount).label('amount')
    ).group_by(Sales.day).all()
    
    sales_by_day_list = [
        {"day": day, "amount": float(amount) if amount else 0}
        for day, amount in sales_by_day
    ]
    
    return {
        "total_revenue": float(total_sales),
        "total_orders": int(total_orders),
        "sales_by_day": sales_by_day_list,
        "message": "Analytics fetched successfully"
    }

@router.get("/")
def get_all_sales(db: Session = Depends(get_db)):
    """Get all sales records"""
    sales = db.query(Sales).order_by(Sales.date.desc()).all()
    return [
        {
            "id": s.id,
            "amount": float(s.amount),
            "date": s.date,
            "day": s.day,
            "transaction_id": s.transaction_id,
            "order_id": s.order_id
        }
        for s in sales
    ]
