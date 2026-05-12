import asyncio
from app.api.email.templates import user_success_template
from app.api.email.templates import admin_notification_template

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User, Enquiry
from app.api.auth.hashing import Hash
from app.api.auth.jwt_handler import create_access_token
from app.api.auth.schemas import UserCreate, UserUpdate, UserResponse, LoginUserSchema
from app.api.user.schemas import EnquiryCreate

import os
import logging
from dotenv import load_dotenv
from app.api.email.send_email import send_user_email, send_admin_email

router = APIRouter(prefix="/users", tags=["Users"])
logger = logging.getLogger(__name__)


# REGISTER USER
@router.post("/register", status_code=201)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        name=user.name,
        phone=user.phone,
        email=user.email,
        password=Hash.hash(user.password),
        age=user.age,
        dob=user.dob,
        address=user.address,
        company_name=user.company_name
    )

    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}


# LOGIN
@router.post("/login")
def login_user(credentials: LoginUserSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()


    if not user or not Hash.verify(user.password, credentials.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account is inactive")

    token = create_access_token({"sub": user.email, "role": "user"})
    return {"access_token": token, "token_type": "bearer"}

from app.api.auth.dependencies import get_current_user

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """
    Get current user profile. Access restricted to the authenticated user.
    """
    return current_user

@router.patch("/me", response_model=UserResponse)
def update_current_user_profile(
    data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update current user profile.
    """
    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(current_user, key, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user


# SUBMIT ENQUIRY
@router.post("/enquiry", status_code=201)
def submit_enquiry(
    data: EnquiryCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    enquiry = Enquiry(**data.dict())
    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)

    # ✅ Send user email
    background_tasks.add_task(
        send_user_email,
        data.email,
        user_success_template(data.name),
    )

    # ✅ Send admin email (now loaded from environment variable)
    load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '..', '.env'))
    admin_email = os.getenv("ADMIN_EMAIL")
    if not admin_email:
        logger.error("ADMIN_EMAIL is not configured, so admin enquiry notification cannot be sent.")

    background_tasks.add_task(
        send_admin_email,
        admin_email,
        admin_notification_template(data)
    )
    

    return {"message": "Enquiry submitted successfully"}

