"""
Script to import fabrics from Excel file into the database via Admin API
"""
import pandas as pd
import requests
import os
import sys
from pathlib import Path

# Add backend to path for imports
backend_path = Path(__file__).parent.parent
sys.path.insert(0, str(backend_path))

# Configuration
EXCEL_FILE_PATH = r"d:\DATA2\bim-mills\frontend\public\bimmills_catalogue\FINAL-FABRICS_corrected.xlsx"
API_BASE_URL = "http://localhost:8000"
ADMIN_EMAIL = "admin@bimmills.com"
ADMIN_PASSWORD = "Admin@123"

def get_admin_token():
    """Login as admin and get JWT token"""
    login_url = f"{API_BASE_URL}/auth/login"
    try:
        response = requests.post(login_url, json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        
        if response.status_code == 200:
            token = response.json().get("access_token")
            print(f"✅ Successfully logged in as admin")
            return token
        else:
            print(f"❌ Failed to login: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error during login: {e}")
        return None

def read_excel_file():
    """Read and parse the Excel file"""
    print(f"\n📖 Reading Excel file: {EXCEL_FILE_PATH}")
    
    try:
        # Read Excel file
        df = pd.read_excel(EXCEL_FILE_PATH)
        print(f"✅ Successfully read Excel file with {len(df)} rows")
        return df
    except Exception as e:
        print(f"❌ Error reading Excel file: {e}")
        return None

def parse_rate(rate_val):
    """Extract numeric value from rate string like '110/- + Gst 5%'"""
    if pd.isna(rate_val):
        return 0, 0.0
    
    rate_str = str(rate_val).strip()
    if not rate_str:
        return 0, 0.0
    
    # Try to extract the first number found
    import re
    match = re.search(r'(\d+(\.\d+)?)', rate_str)
    if match:
        val = float(match.group(1))
        return int(val), val
    
    return 0, 0.0

def map_excel_to_fabric(row):
    """Map Excel row to Fabric API format"""
    # Excel columns based on investigation:
    # ['Unnamed: 0', 'Sl no', 'p/c/pv/pc', 'Usage Area', 'fabric_name', 
    #  'fabric_quality', 'fabric_quality_code', 'fabric_gsm', 'fabric_width', 'rate']
    
    name = str(row.get("fabric_name", "Unknown Fabric")).strip()
    quality = str(row.get("fabric_quality", "Premium")).strip()
    
    price_int, rate_float = parse_rate(row.get("rate"))
    
    fabric_data = {
        "name": name,
        "description": f"Premium {quality} fabric designed for {str(row.get('Usage Area', 'various applications')).lower()}.",
        "price": price_int,
        "rate": rate_float,
        "quantity": "50 meters", # Default min order for bulk
        "quality": quality,
        "quality_code": str(row.get("fabric_quality_code", "")).strip(),
        "fabric_type": str(row.get("p/c/pv/pc", "")).strip(),
        "usage_area": str(row.get("Usage Area", "Multi-purpose")).strip(),
        "fabric_gsm": str(row.get("fabric_gsm", "")).strip(),
        "fabric_width": str(row.get("fabric_width", "")).strip(),
        "image": "", # To be filled with defaults in frontend or updated later
        "file": "", # To be filled with defaults in frontend or updated later
        "category": str(row.get("p/c/pv/pc", "General")).strip(),
        "features": "Premium Quality, Durable, Professional Grade"
    }
    
    return fabric_data

def create_fabric(fabric_data, token):
    """Create a fabric via Admin API"""
    create_url = f"{API_BASE_URL}/admin/fabrics"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(create_url, json=fabric_data, headers=headers)
    
    if response.status_code == 200:
        return True, response.json()
    else:
        return False, response.text

def main():
    print("=" * 80)
    print("🚀 FABRIC IMPORT SCRIPT - BIM MILLS")
    print("=" * 80)
    
    # Step 1: Login and get token
    print("\n📝 Step 1: Authenticating as Admin...")
    token = get_admin_token()
    if not token:
        print("\n❌ Cannot proceed without authentication. Please check credentials.")
        return
    
    # Step 2: Read Excel file
    print("\n📝 Step 2: Reading Excel file...")
    df = read_excel_file()
    if df is None or df.empty:
        print("\n❌ Cannot proceed without data. Please check Excel file.")
        return
    
    # Display first few rows for verification
    print("\n📊 First 3 rows preview:")
    print(df.head(3).to_string())
    
    # Step 3: Confirm before proceeding
    print(f"\n⚠️  About to import {len(df)} fabrics into the database.")
    confirm = input("Do you want to proceed? (yes/no): ").strip().lower()
    
    if confirm != 'yes':
        print("\n❌ Import cancelled by user.")
        return
    
    # Step 4: Import fabrics
    print("\n📝 Step 3: Importing fabrics...")
    print("-" * 80)
    
    success_count = 0
    error_count = 0
    errors = []
    
    for index, row in df.iterrows():
        fabric_data = map_excel_to_fabric(row)
        fabric_name = fabric_data.get("name", "Unknown")
        
        print(f"\n[{index + 1}/{len(df)}] Processing: {fabric_name}")
        
        success, result = create_fabric(fabric_data, token)
        
        if success:
            print(f"  ✅ Successfully created fabric ID: {result.get('id')}")
            success_count += 1
        else:
            print(f"  ❌ Failed to create fabric: {result}")
            error_count += 1
            errors.append({
                "row": index + 1,
                "name": fabric_name,
                "error": result
            })
    
    # Step 5: Summary
    print("\n" + "=" * 80)
    print("📊 IMPORT SUMMARY")
    print("=" * 80)
    print(f"✅ Successfully imported: {success_count} fabrics")
    print(f"❌ Failed imports: {error_count} fabrics")
    
    if errors:
        print("\n❌ Error Details:")
        for err in errors:
            print(f"  Row {err['row']}: {err['name']} - {err['error']}")
    
    print("\n✨ Import process completed!")

if __name__ == "__main__":
    main()
