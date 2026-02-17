"""merge heads

Revision ID: aa53f263ec78
Revises: 003_add_payment_models, add_cancellation_requested_001
Create Date: 2026-01-23 16:52:17.229109

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'aa53f263ec78'
down_revision: Union[str, Sequence[str], None] = ('003_add_payment_models', 'add_cancellation_requested_001')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
