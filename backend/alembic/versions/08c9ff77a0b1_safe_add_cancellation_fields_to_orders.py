"""safe add cancellation fields to orders

Revision ID: 08c9ff77a0b1
Revises: 210589569b1c
Create Date: 2026-02-17 18:43:00.113501

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '08c9ff77a0b1'
down_revision: Union[str, Sequence[str], None] = '210589569b1c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Get database inspector
    conn = op.get_bind()
    columns = [col['name'] for col in sa.inspect(conn).get_columns('orders')]
    
    if 'cancellation_reason' not in columns:
        op.add_column('orders', sa.Column('cancellation_reason', sa.String(length=1000), nullable=True))
    
    if 'cancellation_requested' not in columns:
        op.add_column('orders', sa.Column('cancellation_requested', sa.Integer(), server_default='0', nullable=True))


def downgrade() -> None:
    op.drop_column('orders', 'cancellation_reason')
    op.drop_column('orders', 'cancellation_requested')
