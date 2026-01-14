# BIM Mills Project

## 📋 Overview
BIM Mills is a full-stack web application for fabric manufacturing and sales. It features a public-facing shop for readymade products, a catalogue for fabric products, and an admin dashboard for analytics and order management.

## 💻 Technology Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MySQL 8.0+
- **ORM**: SQLAlchemy
- **Migrations**: Alembic
- **Validation**: Pydantic

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React

---

## 🏗️ Project Structure

```
d:\DATA2\bim-mills\
├── backend\
│   ├── backend\
│   │   ├── models.py           # Database models
│   │   ├── routers\            # API endpoints
│   │   └── alembic\            # Database migrations
│   └── requirements.txt        # Python dependencies
├── frontend\
│   ├── src\
│   │   ├── pages\              # React pages (Shop, Products, etc.)
│   │   ├── admin\              # Admin dashboard components
│   │   └── api\                # API integration (axiosClient)
│   └── package.json            # Node.js dependencies
└── README.md                   # This file
```

---

## 🗄️ Database Architecture

The database is designed to handle users, products, orders, and sales analytics.

### Tables & Relationships

1.  **USERS**: Stores customer information.
    -   `id` (PK), `email` (Unique), `name`, `phone`.
2.  **PRODUCTS** (Fabrics): Manufacturing details.
    -   `id` (PK), `name`, `price`, `quality`, `quantity`.
3.  **READYMADE_PRODUCTS** (Shop): Items for direct sale (PPE, Masks, etc.).
    -   `id` (PK), `name`, `price`, `quality`, `quantity` (min order).
4.  **ORDERS**: Tracks customer purchases.
    -   Links to `USERS`, `PRODUCTS`, and `READYMADE_PRODUCTS`.
    -   `user_id` (FK), `product_id` (FK), `readymade_product_id` (FK).
5.  **SALES**: Analytics data for the admin dashboard.
    -   `order_id` (FK to Orders).
    -   `transaction_id` (Unique), `amount`, `date`.

### Key Features
-   **Real-time Analytics**: Every order automatically creates a sales record.
-   **Data Integrity**: Enforced via Foreign Keys and Unique constraints.
-   **Scalability**: Indexed columns for fast querying.

---

## 🔌 Backend Integration

### 5 Required API Endpoints

| Method | Endpoint | Purpose | Database Table |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/readymade-products` | Fetch shop items (PPE, etc.) | `readymade_products` |
| `GET` | `/api/products` | Fetch fabric catalogue | `products` |
| `POST` | `/api/orders` | Create new order & sales record | `orders`, `sales` |
| `GET` | `/api/orders` | List all transactions | `orders` |
| `GET` | `/api/sales/analytics` | Dashboard KPIs & Charts | `sales` |

### Setup Steps
1.  **Install Dependencies**:
    ```bash
    cd backend
    pip install -r requirements.txt
    ```
2.  **Run Migrations**:
    ```bash
    cd backend
    alembic upgrade head
    ```
3.  **Start Server**:
    ```bash
    uvicorn backend.main:app --reload
    ```

---

## 🎨 Frontend Integration

### Shop & Cart (`Shop.jsx`)
-   Fetches products from `/api/readymade-products`.
-   **Checkout Flow**:
    1.  User adds items to cart.
    2.  User logs in (localStorage stores `userId`).
    3.  Checkout sends `POST /api/orders` for each item.
    4.  Backend creates Order + Sales records.

### Admin Dashboard (`AdminAnalyticsBoard.jsx`)
-   Fetches live data from `/api/sales/analytics`.
-   **Displays**:
    -   Total Sales, Today's Sales, Weekly Revenue.
    -   Sales by Day chart.
    -   Recent Transactions table.

### API Client
Configure the base URL in `frontend/src/api/axiosClient.js`:
```javascript
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8000', // Update with your backend URL
});

export default axiosClient;
```

---

## 🚀 Getting Started

1.  **Backend**: Ensure MySQL is running and the database is created. Run migrations and start the FastAPI server.
2.  **Frontend**:
    ```bash
    cd frontend
    npm install
    npm start
    ```
3.  **Verify**:
    -   Visit `http://localhost:3000/shop` to see products.
    -   Place an order.
    -   Visit `http://localhost:3000/admin` to see the analytics update in real-time.
