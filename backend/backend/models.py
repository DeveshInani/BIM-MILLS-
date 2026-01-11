from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from datetime import datetime
import sys
from pathlib import Path

# Handle imports for both runtime and migration scenarios
try:
    from backend.database import Base
except ImportError:
    from database import Base

class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    phone = Column(String(255))
    email = Column(String(255), unique=True)
    password = Column(String(255))


class Enquiry(Base):
    __tablename__ = "enquiries"
    created_at = Column(DateTime, default=datetime.utcnow)
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    company = Column(String(255), nullable=True)
    email = Column(String(255), nullable=False)
    message = Column(String(1000), nullable=False)

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    description = Column(String(1000))
    price = Column(Integer)
    quantity = Column(String(255), nullable=True)
    quality = Column(String(1000), nullable=True)
    image = Column(String(1000), nullable=True)
    file = Column(String(1000), nullable=True) # PDF Link
    category = Column(String(255), nullable=True)
    features = Column(String(1000), nullable=True) # Stored as comma-separated string

class ReadymadeProduct(Base):
    __tablename__ = "readymade_products"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    quantity = Column(String(255), nullable=False)
    quality = Column(String(255), nullable=False)
    price = Column(Integer, nullable=True)

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user_name = Column(String(255), nullable=True)
    user_email = Column(String(255), nullable=True)
    user_phone = Column(String(255), nullable=True)
    user_address = Column(String(1000), nullable=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    readymade_product_id = Column(Integer, ForeignKey("readymade_products.id"), nullable=True)
    product_name = Column(String(255), nullable=True)
    quantity = Column(String(255), nullable=True)
    quality = Column(String(255), nullable=True)
    amount = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    cancellation_requested = Column(Integer, default=0)  # 0=no, 1=yes

class Sales(Base):
    __tablename__ = "sales"
    id = Column(Integer, primary_key=True)
    date = Column(DateTime, default=datetime.utcnow)
    amount = Column(Float, nullable=False)
    day = Column(String(20), nullable=True)
    transaction_id = Column(String(255), nullable=False, unique=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=True)


class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True)
    phone = Column(String(255), nullable=True)
    position = Column(String(255), nullable=True)
    salary = Column(Integer, nullable=True)
    joined_date = Column(DateTime, default=datetime.utcnow)


class Invoice(Base):
    """Customer invoices generated when they pay"""
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True)
    invoice_number = Column(String(255), unique=True, nullable=False, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    customer_name = Column(String(255), nullable=False)
    customer_email = Column(String(255), nullable=True)
    customer_address = Column(String(1000), nullable=True)
    customer_phone = Column(String(255), nullable=True)
    product_name = Column(String(255), nullable=True)
    quantity = Column(String(255), nullable=True)
    quality = Column(String(255), nullable=True)
    subtotal = Column(Float, nullable=False)
    tax_rate = Column(Float, default=0.0)  # GST or tax percentage
    tax_amount = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False)
    payment_status = Column(String(50), default="Paid")  # Paid, Pending, Overdue
    payment_method = Column(String(100), nullable=True)
    issue_date = Column(DateTime, default=datetime.utcnow)
    due_date = Column(DateTime, nullable=True)
    notes = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Vendor(Base):
    """Vendors and dealers we pay"""
    __tablename__ = "vendors"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    company_name = Column(String(255), nullable=True)
    contact_person = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True)
    phone = Column(String(255), nullable=True)
    address = Column(String(1000), nullable=True)
    vendor_type = Column(String(100), nullable=True)  # Supplier, Dealer, Service Provider
    gstin = Column(String(50), nullable=True)
    pan = Column(String(50), nullable=True)
    bank_account = Column(String(255), nullable=True)
    bank_name = Column(String(255), nullable=True)
    ifsc_code = Column(String(50), nullable=True)
    notes = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class VendorPayment(Base):
    """Payments we make to vendors/dealers"""
    __tablename__ = "vendor_payments"
    id = Column(Integer, primary_key=True)
    vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=False)
    payment_number = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(String(500), nullable=True)
    amount = Column(Float, nullable=False)
    payment_method = Column(String(100), nullable=True)  # Bank Transfer, Cash, Cheque, UPI
    payment_date = Column(DateTime, default=datetime.utcnow)
    due_date = Column(DateTime, nullable=True)
    status = Column(String(50), default="Pending")  # Pending, Paid, Overdue, Cancelled
    reference_number = Column(String(255), nullable=True)  # Transaction/Cheque number
    bill_reference = Column(String(255), nullable=True)  # Vendor bill/invoice number
    notes = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

