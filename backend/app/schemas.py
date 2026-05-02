from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, date
from typing import Optional
from app.models import UserRole, EquipmentStatus, EquipmentCondition, BorrowRequestStatus

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=255)
    phone: Optional[str] = Field(None, max_length=20)
    role: UserRole = UserRole.STUDENT

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=100)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Category Schemas
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    default_lending_days: int = 7

class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Equipment Schemas
class EquipmentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    serial_number: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    category_id: int
    quantity: int = Field(default=1, ge=1)
    available_quantity: int = Field(default=1, ge=0)
    condition_status: EquipmentCondition = EquipmentCondition.GOOD

class EquipmentCreate(EquipmentBase):
    pass

class EquipmentUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    category_id: Optional[int] = None
    quantity: Optional[int] = Field(None, ge=1)
    available_quantity: Optional[int] = Field(None, ge=0)
    status: Optional[EquipmentStatus] = None
    condition_status: Optional[EquipmentCondition] = None

class EquipmentResponse(EquipmentBase):
    id: int
    status: EquipmentStatus
    created_at: datetime
    category: CategoryResponse
    
    class Config:
        from_attributes = True

# Borrow Request Schemas
class BorrowRequestBase(BaseModel):
    equipment_id: int
    start_date: date
    end_date: date
    purpose: Optional[str] = None

class BorrowRequestCreate(BorrowRequestBase):
    pass

class BorrowRequestUpdate(BaseModel):
    status: Optional[BorrowRequestStatus] = None
    return_condition: Optional[EquipmentCondition] = None
    notes: Optional[str] = None

class BorrowRequestResponse(BorrowRequestBase):
    id: int
    user_id: int
    request_date: datetime
    status: BorrowRequestStatus
    approved_by: Optional[int] = None
    approved_at: Optional[datetime] = None
    returned_at: Optional[datetime] = None
    return_condition: Optional[EquipmentCondition] = None
    notes: Optional[str] = None
    user: UserResponse
    equipment: EquipmentResponse
    approver: Optional[UserResponse] = None
    
    class Config:
        from_attributes = True
