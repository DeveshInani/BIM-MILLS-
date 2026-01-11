// ...existing code...
# Frontend Integration Guide - Shop & Admin Dashboard

## Overview
This guide explains how to integrate the new database models with the Frontend (Shop.jsx and Admin Dashboard).

---

## 1. Shop.jsx Integration

### Current State
- Shop has static products array with hardcoded data
- Cart functionality shows confirmation dialog
- No backend integration

### Integration Steps

#### Step 1: Update Product Loading
Replace static products with API call:

```javascript
// In Shop.jsx - useEffect hook
import { useEffect, useState } from 'react';

export default function Shop({ mode = 'light' }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  
  useEffect(() => {
    // Fetch readymade products from API
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/readymade-products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
        // Fallback to static products if API fails
      }
    };
    
    fetchProducts();
  }, []);
  
  // Rest of component remains the same...
}
```

#### Step 2: Update Checkout Handler
```javascript
const handleCheckout = async () => {
  try {
    // Get user info from localStorage/context
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userPhone = localStorage.getItem('userPhone');
    
    if (!userId || !userEmail) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }
    
    // Create order for each cart item
    for (const item of cart) {
      const orderData = {
        user_id: parseInt(userId),
        user_name: userName,
        user_email: userEmail,
        user_phone: userPhone,
        readymade_product_id: item.id,
        product_name: item.name,
        quantity: item.quantity.toString(),
        quality: item.category, // or add separate quality field
        amount: item.price * item.quantity
      };
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
    }
    
    // Show success message
    setShowCheckout(true);
    setCart([]);
    setShowCart(false);
    
  } catch (error) {
    console.error('Checkout failed:', error);
    alert('Order creation failed. Please try again.');
  }
};
```

---

## 2. User Authentication Integration

### Store User Data After Login
In your login/auth flow (e.g., login.jsx or auth_router):

```javascript
// After successful login
const handleLoginSuccess = (userData) => {
  // Store in localStorage
  localStorage.setItem('userId', userData.id);
  localStorage.setItem('userName', userData.name);
  localStorage.setItem('userEmail', userData.email);
  localStorage.setItem('userPhone', userData.phone);
  
  // Redirect to shop
  window.location.href = '/shop';
};
```

---

## 3. Admin Dashboard Updates

### Current State
- AdminAnalyticsBoard.jsx and AdminDashboard.jsx use static data
- No real sales/order data

### Integration Steps

#### Step 1: Create API Service
Create `frontend/src/admin/api/salesApi.js`:

```javascript
import axiosClient from '../../api/axiosClient';

export const salesApi = {
  getAnalytics: () => axiosClient.get('/api/sales/analytics'),
  getSales: () => axiosClient.get('/api/sales'),
  getOrders: () => axiosClient.get('/api/orders'),
};

export default salesApi;
```

#### Step 2: Update AdminAnalyticsBoard.jsx
```javascript
import { useEffect, useState } from 'react';
import salesApi from './api/salesApi';

export default function AdminAnalyticsBoard() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await salesApi.getAnalytics();
        setAnalyticsData(response.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (!analyticsData) return <div>No data available</div>;
  
  return (
    <div className="dashboard">
      {/* Display real data from API */}
      <div className="stat-card">
        <h3>Total Sales</h3>
        <p className="amount">₹{analyticsData.total_sales?.toLocaleString()}</p>
      </div>
      
      <div className="stat-card">
        <h3>Today's Sales</h3>
        <p className="amount">₹{analyticsData.todays_sales?.toLocaleString()}</p>
      </div>
      
      <div className="stat-card">
        <h3>Weekly Sales</h3>
        <p className="amount">₹{analyticsData.weekly_sales?.toLocaleString()}</p>
      </div>
      
      {/* Chart showing sales by day */}
      <div className="sales-by-day">
        <h3>Sales by Day</h3>
        {analyticsData.sales_by_day?.map(sale => (
          <div key={sale.day} className="day-stat">
            <span>{sale.day}</span>
            <span className="amount">₹{sale.amount?.toLocaleString()}</span>
            <span className="count">({sale.count} orders)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### Step 3: Update AdminDashboard.jsx
```javascript
import { useEffect, useState } from 'react';
import salesApi from './api/salesApi';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await salesApi.getOrders();
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchOrders, 60000);
    return () => clearInterval(interval);
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="dashboard">
      <h2>Recent Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.user_name}</td>
              <td>{order.user_email}</td>
              <td>{order.user_phone}</td>
              <td>{order.product_name}</td>
              <td>{order.quantity}</td>
              <td>₹{order.amount?.toLocaleString()}</td>
              <td>{new Date(order.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 4. Data Flow Diagram

```
Shop.jsx
    │
    ├─→ [User adds items to cart]
    │
    ├─→ [User clicks "Proceed to Checkout"]
    │
    └─→ POST /api/orders
         │
         ├─→ Creates Order record in database
         │
         ├─→ Auto-creates Sales record
         │
         └─→ Returns order confirmation
         
Admin Dashboard
    │
    ├─→ useEffect on mount
    │
    ├─→ GET /api/sales/analytics
    │   │
    │   ├─→ Calculate total_sales
    │   ├─→ Calculate todays_sales
    │   ├─→ Calculate weekly_sales
    │   └─→ Get sales_by_day breakdown
    │
    └─→ Display real analytics data
```

---

## 5. API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/readymade-products` | Fetch all shop products |
| GET | `/api/products` | Fetch all fabric products |
| POST | `/api/orders` | Create a new order |
| GET | `/api/orders` | Fetch all orders |
| GET | `/api/sales` | Fetch all sales records |
| GET | `/api/sales/analytics` | Get dashboard analytics |

---

## 6. Error Handling

Add error handling to all API calls:

```javascript
const handleAPIError = (error) => {
  if (error.response?.status === 401) {
    // Unauthorized - redirect to login
    window.location.href = '/login';
  } else if (error.response?.status === 400) {
    // Bad request - show user-friendly error
    alert('Please fill in all required fields');
  } else if (error.response?.status === 500) {
    // Server error
    alert('Server error. Please try again later.');
  } else {
    // Network error
    alert('Connection error. Please check your internet.');
  }
};
```

---

## 7. Sample CSS Styling

```css
/* Admin Dashboard Table */
.orders-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.orders-table th, .orders-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.orders-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.orders-table tr:hover {
  background-color: #f5f5f5;
}

/* Analytics Cards */
.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin: 10px;
}

.stat-card .amount {
  font-size: 24px;
  font-weight: bold;
  color: #4CAF50;
  margin-top: 10px;
}
```

---

## 8. Testing the Integration

### Backend Testing
```bash
# Test API endpoints
curl http://localhost:8000/api/readymade-products
curl http://localhost:8000/api/sales/analytics

# Or use Postman/Insomnia
```

### Frontend Testing
1. Start frontend: `npm start`
2. Open Shop page
3. Add items to cart
4. Login with valid credentials
5. Proceed to checkout
6. Check admin dashboard for new order

---

## 9. Troubleshooting

### Issue: Products not loading
- Check if backend server is running
- Verify API endpoint is correct
- Check browser console for errors

### Issue: Orders not being saved
- Verify user is logged in
- Check if all required fields are provided
- Check backend logs for errors

### Issue: Analytics showing empty
- Ensure sales records exist in database
- Check if API is returning data
- Verify date ranges in queries

---

**Integration Status: Ready for Development**
**Database: ✅ Setup Complete**
**API Layer: Ready for Implementation**
**Frontend: Ready for Integration**
