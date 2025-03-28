"""Remove default from date in Workout

Revision ID: 1234
Revises: 0b6b464ff309
Create Date: 2025-03-27 18:00:00

"""
from alembic import op
import sqlalchemy as sa

revision = '1234'
down_revision = '0b6b464ff309'
branch_labels = None
depends_on = None

def upgrade():
    with op.batch_alter_table('workouts', schema=None) as batch_op:
        batch_op.alter_column('date', existing_type=sa.DateTime(), server_default=None)

def downgrade():
    with op.batch_alter_table('workouts', schema=None) as batch_op:
        batch_op.alter_column('date', existing_type=sa.DateTime(), server_default=sa.func.now())