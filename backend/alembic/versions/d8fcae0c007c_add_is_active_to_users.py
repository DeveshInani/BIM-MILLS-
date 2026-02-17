"""Add is_active to users

Revision ID: d8fcae0c007c
Revises: aa53f263ec78
Create Date: 2026-01-23 16:52:31.206962

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd8fcae0c007c'
down_revision: Union[str, Sequence[str], None] = 'aa53f263ec78'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Get database inspector to check existing columns
    conn = op.get_bind()
    columns = [col['name'] for col in sa.inspect(conn).get_columns('users')]
    
    # Safely add is_active ONLY if it doesn't exist
    if 'is_active' not in columns:
        op.add_column('users', sa.Column('is_active', sa.Boolean(), server_default='1', nullable=True))


def downgrade() -> None:
    op.drop_column('users', 'is_active')
