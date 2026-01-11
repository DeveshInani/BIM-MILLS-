# Backend API Setup Guide - BIM Mills

## Database Schema Complete ✅

All database models have been created and migrated successfully. Here's a guide to integrate these with your REST APIs.

---

## Models Overview

### 1. Product (Fabric Manufacturing)
```python
from backend.models import Product

# Fields:
# - id: Integer (Primary Key)
# - name: String(255)
# - description: String(1000)
# - price: Integer
# - quantity: String(255) [NEW]
# - quality: String(1000) [NEW]
```

### 2. ReadymadeProduct (Shop Items)
```python
from backend.models import ReadymadeProduct

# Fields:
# - id: Integer (Primary Key)
# - name: String(255) - Product name (e.g., "Premium PPE Kit")
# - quantity: String(255) - Min order quantity
# - quality: String(255) - Quality specs
# - price: Integer (optional)
```

### 3. Order (Customer Orders)
```python
from backend.models import Order

# Fields:
# - id: Integer (Primary Key)
# - user_id: Integer (FK to users.id)
# - user_name: String(255) - Customer name
# - user_email: String(255) - Customer email  
# - user_phone: String(255) - Customer phone
# - product_id: Integer (FK to products.id) [for fabric orders]
# - readymade_product_id: Integer (FK to readymade_products.id) [for shop orders]
# - product_name: String(255) - Product name (denormalized)
# - quantity: String(255) - Order quantity
# - quality: String(255) - Quality specs
# - amount: Float - Order total
# - created_at: DateTime - Order timestamp
```

### 4. Sales (Transaction Records)
```python
from backend.models import Sales

# Fields:
# - id: Integer (Primary Key)
# - date: DateTime - Transaction date
# - amount: Float - Sale amount
# - day: String(20) - Day of week (Monday, Tuesday, etc.)
# - transaction_id: String(255) - Unique transaction ID
# - order_id: Integer (FK to orders.id)
```

---

## API Endpoints to Create

### Product Endpoints

#### GET /products
Fetch all fabric products
```python
@router.get("/products")
async def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()
```

#### POST /products
Create a new fabric product
```python
@router.post("/products")
async def create_product(
    name: str,
    description: str,
    price: int,
    quantity: str,
    quality: str,
    db: Session = Depends(get_db)
):
    product = Product(
        name=name,
        description=description,
        price=price,
        quantity=quantity,
        quality=quality
    )
    db.add(product)
    db.commit()
    return product
```

---

### ReadymadeProduct Endpoints

#### GET /readymade-products
Fetch all readymade products
```python
@router.get("/readymade-products")
async def get_readymade_products(db: Session = Depends(get_db)):
    return db.query(ReadymadeProduct).all()
```

#### POST /readymade-products
Create a new readymade product
```python
@router.post("/readymade-products")
async def create_readymade_product(
    name: str,
    quantity: str,
    quality: str,
    price: int = None,
    db: Session = Depends(get_db)
):
    product = ReadymadeProduct(
        name=name,
        quantity=quantity,
        quality=quality,
        price=price
    )
    db.add(product)
    db.commit()
    return product
```

---

### Order Endpoints

#### POST /orders
Create a new order from Shop cart
```python
from datetime import datetime

@router.post("/orders")
async def create_order(
    user_id: int,
    user_name: str,
    user_email: str,
    user_phone: str,
    product_id: int = None,
    readymade_product_id: int = None,
    product_name: str,
    quantity: str,
    quality: str,
    amount: float,
    db: Session = Depends(get_db)
):
    order = Order(
        user_id=user_id,
        user_name=user_name,
        user_email=user_email,
        user_phone=user_phone,
        product_id=product_id,
        readymade_product_id=readymade_product_id,
        product_name=product_name,
        quantity=quantity,
        quality=quality,
        amount=amount,
        created_at=datetime.utcnow()
    )
    db.add(order)
    db.commit()
    
    # Create corresponding sales record
    sales = Sales(
        amount=amount,
        day=datetime.now().strftime("%A"),
        transaction_id=f"TXN-{order.id}-{datetime.now().timestamp()}",
        order_id=order.id
    )
    db.add(sales)
    db.commit()
    
    return order
```

#### GET /orders
Fetch all orders
```python
@router.get("/orders")
async def get_orders(db: Session = Depends(get_db)):
    return db.query(Order).all()
```

#### GET /orders/{order_id}
Fetch a specific order
```python
@router.get("/orders/{order_id}")
async def get_order(order_id: int, db: Session = Depends(get_db)):
    return db.query(Order).filter(Order.id == order_id).first()
```

---

### Sales Endpoints

#### GET /sales
Fetch all sales records
```python
@router.get("/sales")
async def get_sales(db: Session = Depends(get_db)):
    return db.query(Sales).all()
```

#### GET /sales/analytics
Get sales analytics data for dashboard
```python
from sqlalchemy import func, extract
from datetime import datetime, timedelta

@router.get("/sales/analytics")
async def get_sales_analytics(db: Session = Depends(get_db)):
    # Total sales
    total_sales = db.query(func.sum(Sales.amount)).scalar() or 0
    
    # Sales by day
    sales_by_day = db.query(
        Sales.day,
        func.sum(Sales.amount).label('amount'),
        func.count(Sales.id).label('count')
    ).group_by(Sales.day).all()
    
    # Today's sales
    today = datetime.now().date()
    todays_sales = db.query(func.sum(Sales.amount)).filter(
        func.date(Sales.date) == today
    ).scalar() or 0
    
    # Last 7 days
    week_ago = datetime.now() - timedelta(days=7)
    weekly_sales = db.query(func.sum(Sales.amount)).filter(
        Sales.date >= week_ago
    ).scalar() or 0
    
    return {
        "total_sales": total_sales,
        "todays_sales": todays_sales,
        "weekly_sales": weekly_sales,
        "sales_by_day": [
            {"day": sale[0], "amount": sale[1], "count": sale[2]}
            for sale in sales_by_day
        ]
    }
```

---

## Frontend Integration (Shop.jsx → API)

### Current Shop Checkout Flow
When user clicks "Proceed to Checkout" in Shop.jsx:

```javascript
// Current: Shows confirmation dialog
// Future: Should call API

const handleCheckout = async (cartData) => {
    try {
        // Get user data
        const userId = localStorage.getItem('userId');
        const userEmail = localStorage.getItem('userEmail');
        
        // Call order creation API
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                user_name: cartData.userName,
                user_email: userEmail,
                user_phone: cartData.userPhone,
                readymade_product_id: cartData.productId,
                product_name: cartData.productName,
                quantity: cartData.quantity,
                quality: cartData.quality,
                amount: cartData.totalAmount
            })
        });
        
        const order = await response.json();
        // Handle success
    } catch (error) {
        // Handle error
    }
};
```

---

## Admin Dashboard Integration

### Get Dashboard Data
```python
@router.get("/admin/dashboard")
async def get_dashboard(db: Session = Depends(get_db)):
    # Get sales analytics
    total_orders = db.query(Order).count()
    total_revenue = db.query(func.sum(Order.amount)).scalar() or 0
    
    # Recent orders
    recent_orders = db.query(Order).order_by(Order.created_at.desc()).limit(10).all()
    
    # Top products
    top_products = db.query(
        Order.product_name,
        func.count(Order.id).label('count'),
        func.sum(Order.amount).label('revenue')
    ).group_by(Order.product_name).order_by(
        func.sum(Order.amount).desc()
    ).limit(5).all()
    
    return {
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "recent_orders": recent_orders,
        "top_products": top_products
    }
```

---

## Migration Status

- ✅ Migration File: `002_add_product_models.py`
- ✅ Status: Applied
- ✅ Current Version: 002_add_product_models (head)

## To Verify Tables Exist

Run in MySQL:
```sql
SHOW TABLES;
DESC products;
DESC readymade_products;
DESC orders;
DESC sales;
```

---

## Next Steps

1. **Create product_router.py** - Handle fabric product CRUD
2. **Create order_router.py** - Handle order creation and retrieval  
3. **Create sales_router.py** - Handle sales analytics
4. **Update Shop.jsx** - Send cart data to `/api/orders` endpoint
5. **Update Admin Dashboard** - Fetch real data from `/api/sales/analytics`

---

**Database Setup Status: ✅ Complete**
**API Implementation: Ready for Development**
