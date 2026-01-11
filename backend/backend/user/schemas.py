from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, Union

class UserCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=50)
    phone: str = Field(..., min_length=10, max_length=12)
    email: EmailStr
    password: str = Field(..., min_length=8)

    @validator("password")
    def strong_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain a number")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain an uppercase letter")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)


class EnquiryCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    phone: Union[str, int]  # ✅ accepts both
    email: EmailStr
    company: Optional[str] = None
    message: str = Field(..., min_length=10, max_length=1000)

    @validator("phone", pre=True)
    def normalize_phone(cls, v):
        return str(v)
    
