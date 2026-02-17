from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional

class AdminCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)

    @validator("password")
    def strong_password(cls, v):
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain a number")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain an uppercase letter")
        return v

class LoginAdminSchema(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str = Field(..., min_length=6)
    address: Optional[str] = None
    age: Optional[int] = None
    dob: Optional[str] = None
    company_name: Optional[str] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    age: Optional[int] = None
    dob: Optional[str] = None
    company_name: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str
    address: Optional[str]
    age: Optional[int]
    dob: Optional[str]
    company_name: Optional[str]
    is_active: bool

    class Config:
        from_attributes = True

class LoginUserSchema(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
