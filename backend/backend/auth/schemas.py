from pydantic import BaseModel, EmailStr, Field, validator

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

class LoginUserSchema(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
