"""Add image to readymade_products

Revision ID: 210589569b1c
Revises: d8fcae0c007c
Create Date: 2026-01-23 17:20:44.956778

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = '210589569b1c'
down_revision: Union[str, Sequence[str], None] = 'd8fcae0c007c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('readymade_products', sa.Column('image', sa.String(length=1000), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('readymade_products', 'image')
