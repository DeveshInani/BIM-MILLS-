// ...existing code...
# Database Architecture - Visual Reference

## Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE STRUCTURE                         │
│                    BIM Mills Project (2026)                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│     ADMINS       │
├──────────────────┤
│ id (PK)          │
│ email (UNIQUE)   │
│ password         │
└──────────────────┘

┌──────────────────┐          ┌─────────────────────────┐
│     USERS        │          │     ENQUIRIES           │
├──────────────────┤          ├─────────────────────────┤
│ id (PK)          │          │ id (PK)                 │
│ name             │          │ name                    │
│ phone            │          │ phone                   │
│ email (UNIQUE)   │          │ email                   │
│ password         │          │ company                 │
└──────────────────┘          │ message                 │
       │                       │ created_at              │
       │                       └─────────────────────────┘
       │
       │ (1:N)
       │ user_id
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│                       ORDERS                                     │
├──────────────────────────────────────────────────────────────────┤
│ id (PK)                                                          │
│ user_id (FK) ──────────────────────┐                            │
│ user_name                          │ (from USERS)              │
│ user_email                         │                            │
│ user_phone                         │                            │
│                                    │                            │
│ product_id (FK) ───────────────────┼──────┐                    │
│ readymade_product_id (FK) ─────────┼──┐   │ (from PRODUCTS)   │
│                                    │  │   │                    │
│ product_name                       │  │   │                    │
│ quantity                           │  │   │                    │
│ quality                            │  │   │                    │
│ amount                             │  │   │                    │
│ created_at                         │  │   │                    │
└──────────────────────────────────────┼──┼───────────────────────┘
       │                               │  │
       │ (1:N)                         │  │
       │ order_id                      │  │
       │                               │  │
       ▼                               │  │
┌────────────────────┐               │  │
│     SALES          │               │  │
├────────────────────┤               │  │
│ id (PK)            │               │  │
│ date               │               │  │
│ amount             │               │  │
│ day                │               │  │
│ transaction_id (UK)               │  │
│ order_id (FK) ◄────────────────────┘  │
└────────────────────┘                  │
                                        │
        ┌──────────────────────────────┘
        │
        │ FK relationship
        │
        ▼
┌──────────────────────────────────┐
│      PRODUCTS (Fabric)           │
├──────────────────────────────────┤
│ id (PK)                          │
│ name                             │
│ description                      │
│ price                            │
│ quantity (NEW)                   │
│ quality (NEW)                    │
└──────────────────────────────────┘

                AND/OR

┌──────────────────────────────────┐
│   READYMADE_PRODUCTS (Shop)      │
├──────────────────────────────────┤
│ id (PK)                          │
│ name                             │
│ quantity (min order)             │
│ quality (specs)                  │
│ price                            │
└──────────────────────────────────┘
```

---

## Data Flow - Shop Order to Sales

```
CUSTOMER JOURNEY
════════════════════════════════════════════════════════════════════

1. Browse Shop
   ↓
   Shop.jsx → GET /api/readymade-products
   ↓
   [Display ReadymadeProducts from database]

2. Add to Cart
   ↓
   [Client-side cart state]

3. Checkout
   ↓
   [Collect user info from localStorage]

4. Create Order
   ↓
   POST /api/orders
   ├─ user_id: 5
   ├─ user_name: "John Doe"
   ├─ user_email: "john@example.com"
   ├─ user_phone: "9876543210"
   ├─ readymade_product_id: 2
   ├─ product_name: "Premium PPE Kit"
   ├─ quantity: "100"
   ├─ quality: "High Quality"
   └─ amount: 49900
   ↓
   [INSERT into ORDERS table]
   ↓
   order_id = 42 (auto-generated)

5. Auto-Create Sales Record
   ↓
   [Triggered by order creation API]
   ↓
   [INSERT into SALES table]
   ├─ date: 2026-01-08 13:30:00
   ├─ amount: 49900
   ├─ day: "Wednesday"
   ├─ transaction_id: "TXN-42-1704701400"
   └─ order_id: 42

6. Dashboard Updates
   ↓
   GET /api/sales/analytics
   ├─ total_sales: 500000 (sum of all sales)
   ├─ todays_sales: 49900 (today's amount)
   ├─ weekly_sales: 150000 (last 7 days)
   └─ sales_by_day: [
        {day: "Monday", amount: 25000, count: 3},
        {day: "Tuesday", amount: 15000, count: 2},
        {day: "Wednesday", amount: 49900, count: 1},
        ...
      ]
   ↓
   [AdminAnalyticsBoard displays real data]

════════════════════════════════════════════════════════════════════
```

---

## Database Operations

### CREATE Operation
```
Frontend: POST /api/orders
   ↓
Backend: 
  1. Receive order data
  2. Create Order record
  3. Create Sales record
  4. Return order_id
   ↓
Database:
  ORDERS table: +1 row
  SALES table: +1 row
```

### READ Operation
```
Frontend: GET /api/sales/analytics
   ↓
Backend:
  1. Query ORDERS and SALES tables
  2. Calculate aggregates
  3. Return analytics data
   ↓
Database:
  SELECT sum(amount) FROM SALES
  SELECT day, sum(amount), count(*) FROM SALES GROUP BY day
  etc.
```

### UPDATE Operation
```
Frontend: PUT /api/orders/{id}
   ↓
Backend:
  1. Find Order by id
  2. Update fields
  3. Return updated record
   ↓
Database:
  UPDATE ORDERS SET ... WHERE id = ?
```

### DELETE Operation
```
Frontend: DELETE /api/orders/{id}
   ↓
Backend:
  1. Delete Sales records for this order
  2. Delete Order record
  3. Return success
   ↓
Database:
  DELETE FROM SALES WHERE order_id = ?
  DELETE FROM ORDERS WHERE id = ?
```

---

## Foreign Key Relationships

```
USERS ──(1:N)──→ ORDERS
├─ user_id in ORDERS references users.id
├─ ON DELETE: SET NULL
└─ Ensures referential integrity

PRODUCTS ──(1:N)──→ ORDERS
├─ product_id in ORDERS references products.id
├─ ON DELETE: SET NULL
└─ For fabric orders

READYMADE_PRODUCTS ──(1:N)──→ ORDERS
├─ readymade_product_id in ORDERS references readymade_products.id
├─ ON DELETE: SET NULL
└─ For shop orders

ORDERS ──(1:N)──→ SALES
├─ order_id in SALES references orders.id
├─ ON DELETE: CASCADE
└─ Auto-delete sales when order deleted
```

---

## Column Types and Sizes

```
Integer/BigInt columns:
├─ id (primary keys)
├─ price
├─ amount
└─ Foreign keys

String columns and their purposes:
├─ VARCHAR(255) - Names, emails, phone numbers
├─ VARCHAR(255) - Unique transaction IDs
├─ VARCHAR(255) - Quantity strings (e.g., "100m", "50 units")
├─ VARCHAR(1000) - Quality/description specifications
└─ VARCHAR(20) - Day of week names

DateTime columns:
├─ created_at - When order was placed
├─ date - When sale was recorded
└─ Default: CURRENT_TIMESTAMP

Float columns:
└─ amount - For decimal money values
```

---

## Key Constraints

```
PRIMARY KEY:
├─ Each table has an auto-incrementing id
└─ Ensures unique identification

FOREIGN KEY:
├─ ORDERS.user_id → USERS.id
├─ ORDERS.product_id → PRODUCTS.id
├─ ORDERS.readymade_product_id → READYMADE_PRODUCTS.id
└─ SALES.order_id → ORDERS.id

UNIQUE:
├─ USERS.email (one email per user)
├─ ADMINS.email (one admin email)
└─ SALES.transaction_id (no duplicate transactions)

NOT NULL:
├─ READYMADE_PRODUCTS.name
├─ READYMADE_PRODUCTS.quantity
├─ READYMADE_PRODUCTS.quality
├─ SALES.amount
├─ SALES.transaction_id
└─ And others for data integrity
```

---

## Sample Data Examples

### Products (Fabric)
```
id | name                  | description      | price | quantity | quality
---|----------------------|------------------|-------|----------|--------
1  | Cotton Blend Fabric   | Premium cotton   | 5000  | 50m      | Grade A
2  | Silk Fabric           | Pure silk        | 8000  | 30m      | Premium
3  | Polyester Mix         | Durable blend    | 3000  | 100m     | Standard
```

### ReadymadeProducts (Shop)
```
id | name                    | quantity    | quality        | price
---|------------------------|-------------|----------------|-------
1  | Premium PPE Kit        | 100 units   | High Quality   | 499
2  | Surgical Face Masks    | 50 units    | 3-Layer        | 299
3  | Lab Coat               | 20 units    | Professional   | 899
4  | N95 Respirators        | 100 units   | NIOSH Approved | 1299
5  | Scrub Suit Set         | 50 units    | Soft Fabric    | 699
```

### Orders
```
id | user_id | user_name   | user_email        | product_name       | quantity | amount | created_at
---|---------|-------------|-------------------|-------------------|----------|--------|------------------
1  | 5       | John Doe    | john@example.com  | Premium PPE Kit    | 100      | 49900  | 2026-01-08 10:30
2  | 8       | Jane Smith  | jane@example.com  | Surgical Masks     | 50       | 14950  | 2026-01-08 11:45
3  | 5       | John Doe    | john@example.com  | Lab Coat           | 20       | 17980  | 2026-01-08 13:30
```

### Sales
```
id | date                | amount | day       | transaction_id        | order_id
---|---------------------|--------|-----------|----------------------|----------
1  | 2026-01-08 10:30    | 49900  | Wednesday | TXN-1-1704705000     | 1
2  | 2026-01-08 11:45    | 14950  | Wednesday | TXN-2-1704709500     | 2
3  | 2026-01-08 13:30    | 17980  | Wednesday | TXN-3-1704716400     | 3
```

---

## Query Examples

### Get all orders for a user
```sql
SELECT * FROM ORDERS WHERE user_id = 5;
```

### Get total sales by day
```sql
SELECT day, SUM(amount) as total FROM SALES GROUP BY day;
```

### Get recent orders with product details
```sql
SELECT o.*, p.description 
FROM ORDERS o
LEFT JOIN PRODUCTS p ON o.product_id = p.id
LEFT JOIN READYMADE_PRODUCTS rp ON o.readymade_product_id = rp.id
ORDER BY o.created_at DESC
LIMIT 10;
```

### Get sales analytics
```sql
SELECT 
  COUNT(*) as total_orders,
  SUM(amount) as total_revenue,
  AVG(amount) as avg_order_value,
  MAX(amount) as max_order,
  MIN(amount) as min_order
FROM SALES
WHERE date >= DATE_SUB(NOW(), INTERVAL 7 DAY);
```

---

## Performance Considerations

```
Indexes for speed:
├─ USERS.email (UNIQUE index)
├─ ORDERS.user_id (for joins)
├─ ORDERS.product_id (for joins)
├─ ORDERS.created_at (for sorting)
├─ SALES.order_id (for joins)
├─ SALES.date (for range queries)
├─ SALES.transaction_id (UNIQUE index)
└─ ADMINS.email (UNIQUE index)

Query optimization:
├─ Use indexes for filtering
├─ Avoid SELECT * for large tables
├─ Use pagination for lists
├─ Cache analytics results
└─ Use database-level aggregation
```

---

**Last Updated: 2026-01-08**
**Status: Production Ready ✅**
