from sqlalchemy import Column, Integer, String, Boolean, Enum, DateTime, Date, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class UserRole(str, enum.Enum):
    STUDENT = "student"
    STAFF = "staff"
    ADMINISTRATOR = "administrator"

class EquipmentStatus(str, enum.Enum):
    AVAILABLE = "available"
    CHECKED_OUT = "checked_out"
    UNDER_MAINTENANCE = "under_maintenance"
    RETIRED = "retired"

class EquipmentCondition(str, enum.Enum):
    EXCELLENT = "excellent"
    GOOD = "good"
    FAIR = "fair"
    POOR = "poor"
    DAMAGED = "damaged"

class BorrowRequestStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    RETURNED = "returned"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    phone = Column(String(20))
    role = Column(Enum(UserRole, values_callable=lambda x: [e.value for e in x]), nullable=False, default=UserRole.STUDENT)
    is_active = Column(Boolean, nullable=False, default=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    borrow_requests = relationship("BorrowRequest", back_populates="user", foreign_keys="BorrowRequest.user_id")
    approved_requests = relationship("BorrowRequest", foreign_keys="BorrowRequest.approved_by")

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text)
    default_lending_days = Column(Integer, nullable=False, default=7)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    equipment_items = relationship("EquipmentItem", back_populates="category")

class EquipmentItem(Base):
    __tablename__ = "equipment_items"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    serial_number = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    available_quantity = Column(Integer, nullable=False, default=1)
    status = Column(Enum(EquipmentStatus, values_callable=lambda x: [e.value for e in x]), nullable=False, default=EquipmentStatus.AVAILABLE, index=True)
    condition_status = Column(Enum(EquipmentCondition, values_callable=lambda x: [e.value for e in x]), nullable=False, default=EquipmentCondition.GOOD)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    category = relationship("Category", back_populates="equipment_items")
    borrow_requests = relationship("BorrowRequest", back_populates="equipment")

class BorrowRequest(Base):
    __tablename__ = "borrow_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    equipment_id = Column(Integer, ForeignKey("equipment_items.id"), nullable=False)
    request_date = Column(DateTime(timezone=True), server_default=func.now())
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    purpose = Column(Text)
    status = Column(Enum(BorrowRequestStatus, values_callable=lambda x: [e.value for e in x]), nullable=False, default=BorrowRequestStatus.PENDING, index=True)
    approved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    approved_at = Column(DateTime(timezone=True), nullable=True)
    returned_at = Column(DateTime(timezone=True), nullable=True)
    return_condition = Column(Enum(EquipmentCondition, values_callable=lambda x: [e.value for e in x]), nullable=True)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="borrow_requests", foreign_keys=[user_id])
    equipment = relationship("EquipmentItem", back_populates="borrow_requests")
    approver = relationship("User", foreign_keys=[approved_by], overlaps="approved_requests")
