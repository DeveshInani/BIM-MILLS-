# BIM-MILLS

BIM-MILLS is a premium, enterprise-grade textile management and e-commerce platform. It integrates a sophisticated customer-facing shop with internal mill operations, providing a seamless experience for both buyers and administrators.

## 🚀 Key Modules & Features

- **🛍️ Shop & Catalog**: Interactive browsing experience for textiles, fabrics, and readymade products featuring high-quality zoomable visuals and 3D product previews.
- **📑 Order & Invoice Management**: Complete lifecycle tracking of customer orders with automated professional invoice generation.
- **🤝 Vendor & Employee CRM**: Dedicated modules to manage vendor relationships, track payments/bills, and maintain detailed employee records.
- **📊 Sales Analytics**: A powerful dashboard providing real-time insights into sales performance, financial health, and transaction history.
- **✉️ Enquiry System**: Integrated communication channel for customer enquiries, sample requests, and quotation management.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js
- **3D Visuals**: Three.js / @react-three/fiber
- **UI Components**: Material UI (MUI), DaisyUI
- **Animations**: Framer Motion
- **Data Visualization**: Recharts
- **State/API**: Axios, React Router

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MySQL
- **ORM**: SQLAlchemy
- **Migrations**: Alembic
- **Asynchronous Tasks**: Python BackgroundTasks
- **Authentication**: JWT-based auth with password hashing

---

## 📂 Project Structure

```text
bim-mills/
├── backend/            # FastAPI application
│   ├── app/            # Core application logic
│   │   ├── api/        # Domain-driven API routes (Auth, Admin, Shop, etc.)
│   │   ├── db/         # Database models and configuration
│   │   └── main.py     # Application entry point
│   ├── alembic/        # Database migration scripts
│   └── requirements.txt # Python dependencies
├── frontend/           # React frontend application
│   ├── public/         # Static assets and catalogues
│   ├── src/            # Component and page logic
│   │   ├── admin/      # Admin dashboard pages
│   │   ├── components/ # Reusable UI components
│   │   └── pages/      # Main application routes
│   └── package.json    # Node.js dependencies
└── README.md           # Project documentation
```

---

## ⚙️ Setup Instructions

### Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment**:
   ```bash
   python -m venv venv
   # Windows
   .\venv\Scripts\activate
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**:
   Create a `.env` file in the `backend/` directory based on the following template:
   ```env
   DATABASE_URL=mysql+pymysql://user:password@localhost/db_name
   SECRET_KEY=your_secret_key_here
   ALGORITHM=HS256
   ADMIN_EMAIL=admin@example.com
   RESEND_API_KEY=your_resend_api_key
   ```

5. **Run Migrations**:
   ```bash
   alembic upgrade head
   ```

6. **Start the API**:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `frontend/` directory:
   ```env
   REACT_APP_API_URL=http://localhost:8000
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

---

## 🧪 Development & Contributions

- **Backend API Docs**: Once the backend is running, visit `http://localhost:8000/docs` for the interactive Swagger UI.
- **Coding Standards**: Follow PEP8 for Python and ESLint configurations for JavaScript.

---

© 2026 BIM-MILLS. All rights reserved.
