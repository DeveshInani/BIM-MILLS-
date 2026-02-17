"""Add payment and invoice tables - Invoice, Vendor, VendorPayment, PaymentReminder

Revision ID: 003_add_payment_models
Revises: 002_add_product_models
Create Date: 2026-01-08 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '003_add_payment_models'
down_revision: Union[str, Sequence[str], None] = '002_add_product_models'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    
    # Create invoices table
    try:
        op.create_table(
            'invoices',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('invoice_number', sa.String(length=255), nullable=False),
            sa.Column('order_id', sa.Integer(), nullable=False),
            sa.Column('customer_name', sa.String(length=255), nullable=False),
            sa.Column('customer_email', sa.String(length=255), nullable=True),
            sa.Column('customer_address', sa.String(length=1000), nullable=True),
            sa.Column('customer_phone', sa.String(length=255), nullable=True),
            sa.Column('product_name', sa.String(length=255), nullable=True),
            sa.Column('quantity', sa.String(length=255), nullable=True),
            sa.Column('quality', sa.String(length=255), nullable=True),
            sa.Column('subtotal', sa.Float(), nullable=False),
            sa.Column('tax_rate', sa.Float(), nullable=True, server_default='0.0'),
            sa.Column('tax_amount', sa.Float(), nullable=True, server_default='0.0'),
            sa.Column('total_amount', sa.Float(), nullable=False),
            sa.Column('payment_status', sa.String(length=50), nullable=True, server_default='Paid'),
            sa.Column('payment_method', sa.String(length=100), nullable=True),
            sa.Column('issue_date', sa.DateTime(), nullable=True),
            sa.Column('due_date', sa.DateTime(), nullable=True),
            sa.Column('notes', sa.String(length=1000), nullable=True),
            sa.Column('created_at', sa.DateTime(), nullable=True),
            sa.PrimaryKeyConstraint('id'),
            sa.UniqueConstraint('invoice_number')
        )
        op.create_index(op.f('ix_invoices_invoice_number'), 'invoices', ['invoice_number'], unique=True)
        op.create_foreign_key('fk_invoices_order_id', 'invoices', 'orders', ['order_id'], ['id'])
    except Exception as e:
        print(f"Invoice table creation skipped: {e}")
        pass
    
    # Create vendors table
    try:
        op.create_table(
            'vendors',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('name', sa.String(length=255), nullable=False),
            sa.Column('company_name', sa.String(length=255), nullable=True),
            sa.Column('contact_person', sa.String(length=255), nullable=True),
            sa.Column('email', sa.String(length=255), nullable=True),
            sa.Column('phone', sa.String(length=255), nullable=True),
            sa.Column('address', sa.String(length=1000), nullable=True),
            sa.Column('vendor_type', sa.String(length=100), nullable=True),
            sa.Column('gstin', sa.String(length=50), nullable=True),
            sa.Column('pan', sa.String(length=50), nullable=True),
            sa.Column('bank_account', sa.String(length=255), nullable=True),
            sa.Column('bank_name', sa.String(length=255), nullable=True),
            sa.Column('ifsc_code', sa.String(length=50), nullable=True),
            sa.Column('notes', sa.String(length=1000), nullable=True),
            sa.Column('created_at', sa.DateTime(), nullable=True),
            sa.PrimaryKeyConstraint('id')
        )
    except Exception as e:
        print(f"Vendor table creation skipped: {e}")
        pass
    
    # Create vendor_payments table
    try:
        op.create_table(
            'vendor_payments',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('vendor_id', sa.Integer(), nullable=False),
            sa.Column('payment_number', sa.String(length=255), nullable=False),
            sa.Column('description', sa.String(length=500), nullable=True),
            sa.Column('amount', sa.Float(), nullable=False),
            sa.Column('payment_method', sa.String(length=100), nullable=True),
            sa.Column('payment_date', sa.DateTime(), nullable=True),
            sa.Column('due_date', sa.DateTime(), nullable=True),
            sa.Column('status', sa.String(length=50), nullable=True, server_default='Pending'),
            sa.Column('reference_number', sa.String(length=255), nullable=True),
            sa.Column('bill_reference', sa.String(length=255), nullable=True),
            sa.Column('notes', sa.String(length=1000), nullable=True),
            sa.Column('created_at', sa.DateTime(), nullable=True),
            sa.PrimaryKeyConstraint('id'),
            sa.UniqueConstraint('payment_number')
        )
        op.create_index(op.f('ix_vendor_payments_payment_number'), 'vendor_payments', ['payment_number'], unique=True)
        op.create_foreign_key('fk_vendor_payments_vendor_id', 'vendor_payments', 'vendors', ['vendor_id'], ['id'])
    except Exception as e:
        print(f"VendorPayment table creation skipped: {e}")
        pass
    
    # Create payment_reminders table
    try:
        op.create_table(
            'payment_reminders',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('vendor_payment_id', sa.Integer(), nullable=True),
            sa.Column('vendor_id', sa.Integer(), nullable=True),
            sa.Column('title', sa.String(length=255), nullable=False),
            sa.Column('description', sa.String(length=1000), nullable=True),
            sa.Column('reminder_date', sa.DateTime(), nullable=False),
            sa.Column('amount', sa.Float(), nullable=True),
            sa.Column('status', sa.String(length=50), nullable=True, server_default='Pending'),
            sa.Column('reminder_type', sa.String(length=50), nullable=True, server_default='Payment Due'),
            sa.Column('created_at', sa.DateTime(), nullable=True),
            sa.PrimaryKeyConstraint('id')
        )
        op.create_foreign_key('fk_reminders_vendor_payment_id', 'payment_reminders', 'vendor_payments', ['vendor_payment_id'], ['id'])
        op.create_foreign_key('fk_reminders_vendor_id', 'payment_reminders', 'vendors', ['vendor_id'], ['id'])
    except Exception as e:
        print(f"PaymentReminder table creation skipped: {e}")
        pass


def downgrade() -> None:
    """Downgrade schema."""
    # Drop payment_reminders table
    try:
        op.drop_constraint('fk_reminders_vendor_id', 'payment_reminders', type_='foreignkey')
        op.drop_constraint('fk_reminders_vendor_payment_id', 'payment_reminders', type_='foreignkey')
        op.drop_table('payment_reminders')
    except Exception:
        pass
    
    # Drop vendor_payments table
    try:
        op.drop_constraint('fk_vendor_payments_vendor_id', 'vendor_payments', type_='foreignkey')
        op.drop_index(op.f('ix_vendor_payments_payment_number'), table_name='vendor_payments')
        op.drop_table('vendor_payments')
    except Exception:
        pass
    
    # Drop vendors table
    try:
        op.drop_table('vendors')
    except Exception:
        pass
    
    # Drop invoices table
    try:
        op.drop_constraint('fk_invoices_order_id', 'invoices', type_='foreignkey')
        op.drop_index(op.f('ix_invoices_invoice_number'), table_name='invoices')
        op.drop_table('invoices')
    except Exception:
        pass
