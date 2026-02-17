"""Add product fields and new tables - ReadymadeProduct, Order updates, Sales

Revision ID: 002_add_product_models
Revises: 23060da87790
Create Date: 2026-01-08 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '002_add_product_models'
down_revision: Union[str, Sequence[str], None] = '23060da87790'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add columns to products table if they don't exist
    try:
        op.add_column('products', sa.Column('quantity', sa.String(length=255), nullable=True))
    except Exception:
        pass
    
    try:
        op.add_column('products', sa.Column('quality', sa.String(length=1000), nullable=True))
    except Exception:
        pass
    
    # Create readymade_products table if it doesn't exist
    try:
        op.create_table(
            'readymade_products',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('name', sa.String(length=255), nullable=False),
            sa.Column('quantity', sa.String(length=255), nullable=False),
            sa.Column('quality', sa.String(length=255), nullable=False),
            sa.Column('price', sa.Integer(), nullable=True),
            sa.PrimaryKeyConstraint('id')
        )
    except Exception:
        pass
    
    # Update orders table
    try:
        op.add_column('orders', sa.Column('user_id', sa.Integer(), nullable=True))
    except Exception:
        pass
    
    try:
        op.add_column('orders', sa.Column('user_name', sa.String(length=255), nullable=True))
    except Exception:
        pass
    
    try:
        op.add_column('orders', sa.Column('user_email', sa.String(length=255), nullable=True))
    except Exception:
        pass
    
    try:
        op.add_column('orders', sa.Column('user_phone', sa.String(length=255), nullable=True))
    except Exception:
        pass
    
    try:
        op.add_column('orders', sa.Column('product_id', sa.Integer(), nullable=True))
    except Exception:
        pass
    
    try:
        op.add_column('orders', sa.Column('readymade_product_id', sa.Integer(), nullable=True))
    except Exception:
        pass
    
    try:
        op.add_column('orders', sa.Column('product_name', sa.String(length=255), nullable=True))
    except Exception:
        pass
    
    try:
        op.add_column('orders', sa.Column('quantity', sa.String(length=255), nullable=True))
    except Exception:
        pass
    
    try:
        op.add_column('orders', sa.Column('quality', sa.String(length=255), nullable=True))
    except Exception:
        pass
    
    try:
        op.add_column('orders', sa.Column('amount', sa.Float(), nullable=True))
    except Exception:
        pass
    
    try:
        op.add_column('orders', sa.Column('created_at', sa.DateTime(), nullable=True))
    except Exception:
        pass
    
    # Add foreign keys for orders table
    try:
        op.create_foreign_key('fk_orders_user_id', 'orders', 'users', ['user_id'], ['id'])
    except Exception:
        pass
    
    try:
        op.create_foreign_key('fk_orders_product_id', 'orders', 'products', ['product_id'], ['id'])
    except Exception:
        pass
    
    try:
        op.create_foreign_key('fk_orders_readymade_product_id', 'orders', 'readymade_products', ['readymade_product_id'], ['id'])
    except Exception:
        pass
    
    # Create sales table if it doesn't exist
    try:
        op.create_table(
            'sales',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('date', sa.DateTime(), nullable=True),
            sa.Column('amount', sa.Float(), nullable=False),
            sa.Column('day', sa.String(length=20), nullable=True),
            sa.Column('transaction_id', sa.String(length=255), nullable=False),
            sa.Column('order_id', sa.Integer(), nullable=True),
            sa.PrimaryKeyConstraint('id'),
            sa.UniqueConstraint('transaction_id')
        )
    except Exception:
        pass
    
    # Add foreign key for sales table
    try:
        op.create_foreign_key('fk_sales_order_id', 'sales', 'orders', ['order_id'], ['id'])
    except Exception:
        pass


def downgrade() -> None:
    """Downgrade schema."""
    # Drop sales table
    try:
        op.drop_constraint('fk_sales_order_id', 'sales', type_='foreignkey')
    except Exception:
        pass
    
    try:
        op.drop_table('sales')
    except Exception:
        pass
    
    # Drop foreign keys for orders table
    try:
        op.drop_constraint('fk_orders_readymade_product_id', 'orders', type_='foreignkey')
    except Exception:
        pass
    
    try:
        op.drop_constraint('fk_orders_product_id', 'orders', type_='foreignkey')
    except Exception:
        pass
    
    try:
        op.drop_constraint('fk_orders_user_id', 'orders', type_='foreignkey')
    except Exception:
        pass
    
    # Remove columns from orders table
    try:
        op.drop_column('orders', 'created_at')
    except Exception:
        pass
    
    try:
        op.drop_column('orders', 'amount')
    except Exception:
        pass
    
    try:
        op.drop_column('orders', 'quality')
    except Exception:
        pass
    
    try:
        op.drop_column('orders', 'quantity')
    except Exception:
        pass
    
    try:
        op.drop_column('orders', 'product_name')
    except Exception:
        pass
    
    try:
        op.drop_column('orders', 'readymade_product_id')
    except Exception:
        pass
    
    try:
        op.drop_column('orders', 'product_id')
    except Exception:
        pass
    
    try:
        op.drop_column('orders', 'user_phone')
    except Exception:
        pass
    
    try:
        op.drop_column('orders', 'user_email')
    except Exception:
        pass
    
    try:
        op.drop_column('orders', 'user_name')
    except Exception:
        pass
    
    try:
        op.drop_column('orders', 'user_id')
    except Exception:
        pass
    
    # Drop readymade_products table
    try:
        op.drop_table('readymade_products')
    except Exception:
        pass
    
    # Remove columns from products table
    try:
        op.drop_column('products', 'quality')
    except Exception:
        pass
    
    try:
        op.drop_column('products', 'quantity')
    except Exception:
        pass
