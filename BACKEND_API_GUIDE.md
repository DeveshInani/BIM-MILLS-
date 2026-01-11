// ...existing code...
# Backend API Implementation Guide

## Quick Summary
The frontend has been converted to use **live API data**. You now need to create the backend endpoints to serve that data.

## 5 Required Endpoints

### 1. GET /api/readymade-products
**Purpose**: Fetch all shop products (PPE, masks, uniforms, etc.)
**Used By**: Shop.jsx
**Database Table**: `readymade_products`

```python
# In your FastAPI backend
@router.get('/api/readymade-products')
def get_readymade_products():
    """Return all readymade products for shop"""
    products = db.query(ReadymadeProduct).all()
    return products
```

---

### 2. GET /api/products
**Purpose**: Fetch all fabric products with quality and quantity specs
**Used By**: Products.jsx (catalog display)
**Database Table**: `products`

```python
@router.get('/api/products')
def get_products():
    """Return all fabric products"""
    products = db.query(Product).all()
    return products
```

---

### 3. POST /api/orders
**Purpose**: Create a new order
**Used By**: Shop.jsx (checkout)
**Database Table**: `orders`

Expected Request Body:
```json
{
  "user_id": 1,
  "user_name": "John Doe",
  "user_email": "john@example.com",
  "user_phone": "9876543210",
  "readymade_product_id": 1,
  "product_name": "PPE Kit",
  "quantity": "100",
  "quality": "Standard",
  "amount": 49900
}
```

```python
@router.post('/api/orders')
def create_order(order: OrderCreate):
    """Create new order and sales record"""
    new_order = Order(
        user_id=order.user_id,
        user_name=order.user_name,
        user_email=order.user_email,
        user_phone=order.user_phone,
        readymade_product_id=order.readymade_product_id,
        product_name=order.product_name,
        quantity=order.quantity,
        quality=order.quality,
        amount=order.amount,
        status='pending'
    )
    db.add(new_order)
    db.commit()
    
    # Create sales record
    sale = Sales(
        order_id=new_order.id,
        customer_name=order.user_name,
        product_name=order.product_name,
        amount=order.amount,
        status='pending'
    )
    db.add(sale)
    db.commit()
    
    return new_order
```

---

### 4. GET /api/orders
**Purpose**: Fetch all orders (for transaction display)
**Used By**: AdminAnalyticsBoard.jsx
**Database Table**: `orders`

```python
@router.get('/api/orders')
def get_orders():
    """Return all orders"""
    orders = db.query(Order).order_by(Order.id.desc()).all()
    return orders
```

---

### 5. GET /api/sales/analytics
**Purpose**: Fetch sales analytics and KPIs
**Used By**: AdminAnalyticsBoard.jsx (dashboard)
**Database Tables**: `sales`, `orders`

Expected Response:
```json
{
  "total_sales": 500000,
  "todays_sales": 50000,
  "weekly_sales": 350000,
  "sales_by_day": [
    {"date": "2024-01-15", "sales": 45000},
    {"date": "2024-01-16", "sales": 52000},
    {"date": "2024-01-17", "sales": 48000}
  ]
}
```

```python
from sqlalchemy import func
from datetime import datetime, timedelta

@router.get('/api/sales/analytics')
def get_sales_analytics():
    """Return sales analytics and KPIs"""
    
    # Total sales
    total_sales = db.query(func.sum(Sales.amount)).scalar() or 0
    
    # Today's sales
    today = datetime.now().date()
    todays_sales = db.query(func.sum(Sales.amount)).filter(
        func.date(Sales.created_at) == today
    ).scalar() or 0
    
    # Weekly sales (last 7 days)
    seven_days_ago = datetime.now() - timedelta(days=7)
    weekly_sales = db.query(func.sum(Sales.amount)).filter(
        Sales.created_at >= seven_days_ago
    ).scalar() or 0
    
    # Sales by day (last 30 days)
    thirty_days_ago = datetime.now() - timedelta(days=30)
    sales_by_day = db.query(
        func.date(Sales.created_at).label('date'),
        func.sum(Sales.amount).label('sales')
    ).filter(
        Sales.created_at >= thirty_days_ago
    ).group_by(
        func.date(Sales.created_at)
    ).order_by(
        'date'
    ).all()
    
    # Format response
    sales_data = [
        {
            'date': str(item.date),
            'sales': float(item.sales) if item.sales else 0
        }
        for item in sales_by_day
    ]
    
    return {
        'total_sales': float(total_sales),
        'todays_sales': float(todays_sales),
        'weekly_sales': float(weekly_sales),
        'sales_by_day': sales_data
    }
```

---

## Implementation Checklist

- [ ] Create `/api/readymade-products` GET endpoint
- [ ] Create `/api/products` GET endpoint
- [ ] Create `/api/orders` POST endpoint (with sales record creation)
- [ ] Create `/api/orders` GET endpoint
- [ ] Create `/api/sales/analytics` GET endpoint with aggregations
- [ ] Add CORS headers to all endpoints
- [ ] Add error handling for all endpoints
- [ ] Add authentication/authorization if needed
- [ ] Test each endpoint with frontend
- [ ] Verify sales records are created when orders are placed
- [ ] Verify analytics calculations are correct

---

## File Locations

### Frontend Files Updated
- `frontend/src/pages/Shop.jsx` - Shop with API integration
- `frontend/src/pages/Products.jsx` - Catalog with API integration  
- `frontend/src/admin/AdminAnalyticsBoard.jsx` - Dashboard with live data

### Backend File Locations (to create)
- `backend/backend/routers/products.py` - Product endpoints
- `backend/backend/routers/orders.py` - Order endpoints
- `backend/backend/routers/sales.py` - Sales analytics endpoints

Or add these endpoints to existing routers in:
- `backend/backend/admin/admin_router.py`
- `backend/routers/` (if exists)

---

## Database Tables (Already Created)

Verify these tables exist:
- ✅ `readymade_products` - Shop products
- ✅ `products` - Fabric products with quality/quantity
- ✅ `orders` - Customer orders
- ✅ `sales` - Sales records for analytics

---

## Testing the Integration

### Test Shop.jsx
```
1. Open Shop page
2. Should see products from API (or demo if API down)
3. Add items to cart
4. Click checkout
5. Should see "Order submitted" message
6. Check database for new order records
```

### Test AdminAnalyticsBoard.jsx
```
1. Open Admin Dashboard
2. Should see real KPIs from database
3. Sales chart should show data
4. Transactions table should show recent orders
5. Wait 30 seconds, data should auto-refresh
```

### Test Products.jsx
```
1. Open Products page
2. Should see fabric catalogs
3. PDF downloads should work
4. Dark mode toggle should work
```

---

## Current API Base URL
```
https://unmonarchic-unlauded-thiago.ngrok-free.dev
```

Update this in `frontend/src/api/axiosClient.js` if changed.

---

## Error Scenarios Handled

- ✅ API unavailable → Fallback to demo data
- ✅ Empty response → Default values/empty state
- ✅ Missing fields → Safe defaults applied
- ✅ Network errors → Graceful error display

---

**Status**: Frontend ready. Backend endpoints needed.
