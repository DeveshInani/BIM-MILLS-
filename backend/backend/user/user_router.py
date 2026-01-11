import asyncio
from backend.email.templates import user_success_template
from backend.email.templates import admin_notification_template

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import User, Enquiry
from backend.auth.hashing import Hash
from backend.auth.jwt_handler import create_access_token
from backend.user.schemas import UserCreate, UserLogin, EnquiryCreate

import os
from dotenv import load_dotenv
from backend.email.send_email import send_user_email, send_admin_email

router = APIRouter(prefix="/users", tags=["Users"])


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
        password=Hash.hash(user.password)
    )

    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}


# LOGIN
@router.post("/login")
def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()

    if not user or not Hash.verify(user.password, credentials.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_access_token({"sub": user.email, "role": "user"})
    return {"access_token": token, "token_type": "bearer"}


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
    load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))
    admin_email = os.getenv("ADMIN_EMAIL")
    background_tasks.add_task(
        send_admin_email,
        admin_email,
        admin_notification_template(data)
    )
    

    return {"message": "Enquiry submitted successfully"}

