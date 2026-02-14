import sys
import os
from sqlalchemy import text

# Add the parent directory to sys.path to resolve 'backend' imports
sys.path.append(os.getcwd())

from backend.database import engine

def check_columns():
    try:
        with engine.connect() as conn:
            print("Checking columns in 'readymade_products'...")
            result = conn.execute(text("DESCRIBE readymade_products"))
            found = False
            for row in result:
                print(row)
                if row[0] == 'image':
                    found = True
            
            if found:
                print("\n✅ 'image' column EXISTS.")
            else:
                print("\n❌ 'image' column mismatch: MISSING.")

            print("\nChecking alembic version...")
            version = conn.execute(text("SELECT * FROM alembic_version")).fetchall()
            print(f"Current Revision: {version}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_columns()
