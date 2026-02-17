from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Admin, User
from app.api.auth.schemas import AdminCreate, LoginAdminSchema, UserCreate, LoginUserSchema
from app.api.auth.hashing import Hash
from app.api.auth.jwt_handler import create_access_token

from app.api.auth.dependencies import get_current_user, get_current_admin

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", status_code=201)
def register_admin(data: AdminCreate, db: Session = Depends(get_db), current_admin: Admin = Depends(get_current_admin)):
    if db.query(Admin).filter(Admin.email == data.email).first():
        raise HTTPException(
            status_code=400,
            detail="Admin already exists"
        )

    admin = Admin(
        email=data.email,
        password=Hash.hash(data.password)
    )

    db.add(admin)
    db.commit()
    return {"message": "Admin registered successfully"}


@router.post("/login")
def login_admin(data: LoginAdminSchema, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.email == data.email).first()

    if not admin or not Hash.verify(admin.password, data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_access_token({
        "sub": admin.email,
        "role": "admin"
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# --- User Auth ---

@router.post("/user/register", status_code=201)
def register_user(data: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )
    
    # Check if active is handled by default in model, otherwise we can set it here
    user = User(
        name=data.name,
        email=data.email,
        phone=data.phone,
        password=Hash.hash(data.password),
        address=data.address,
        age=data.age,
        dob=data.dob,
        company_name=data.company_name,
        is_active=True 
    )
    
    db.add(user)
    db.commit()
    return {"message": "User registered successfully"}

@router.post("/user/login")
def login_user(data: LoginUserSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    
    if not user: 
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    if not Hash.verify(user.password, data.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not user.is_active:
         raise HTTPException(status_code=400, detail="Account is inactive")

    token = create_access_token({
        "sub": user.email,
        "role": "user"
    })
    
    return {
        "access_token": token,
        "token_type": "bearer"
    }
