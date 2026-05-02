from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from datetime import datetime, date
from typing import List, Optional
import logging

from app.database import get_db, engine, Base
from app.models import User, Category, EquipmentItem, BorrowRequest, UserRole, BorrowRequestStatus, EquipmentStatus
from app.schemas import (
    UserCreate, UserLogin, UserResponse, Token,
    CategoryResponse,
    EquipmentCreate, EquipmentUpdate, EquipmentResponse,
    BorrowRequestCreate, BorrowRequestUpdate, BorrowRequestResponse
)
from app.auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_user, get_current_admin_user, get_current_staff_or_admin_user
)

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="School Equipment Lending Portal API",
    description="API for managing school equipment lending operations",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Equipment Portal API"}

# ==================== Authentication Endpoints ====================

@app.post("/api/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        password_hash=hashed_password,
        name=user_data.name,
        phone=user_data.phone,
        role=user_data.role,
        is_active=True
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@app.post("/api/auth/login", response_model=Token)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    logger.debug("=" * 80)
    logger.debug("LOGIN FLOW STARTED")
    logger.debug("=" * 80)
    logger.debug(f"Step 1: Received login request for email: {credentials.email}")
    
    # Find user by email
    logger.debug(f"Step 2: Querying database for user with email: {credentials.email}")
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if not user:
        logger.debug(f"Step 3: FAILED - User not found in database for email: {credentials.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    logger.debug(f"Step 3: SUCCESS - User found in database")
    logger.debug(f"  - User ID: {user.id}")
    logger.debug(f"  - User Name: {user.name}")
    logger.debug(f"  - User Role: {user.role.value}")
    logger.debug(f"  - User Active Status: {user.is_active}")
    
    # Verify password
    logger.debug(f"Step 4: Verifying password for user: {credentials.email}")
    password_valid = verify_password(credentials.password, user.password_hash)
    
    if not password_valid:
        logger.debug(f"Step 4: FAILED - Password verification failed for user: {credentials.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    logger.debug(f"Step 4: SUCCESS - Password verified successfully")
    
    # Check if user is active
    logger.debug(f"Step 5: Checking if user account is active")
    if not user.is_active:
        logger.debug(f"Step 5: FAILED - User account is deactivated for: {credentials.email}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated"
        )
    
    logger.debug(f"Step 5: SUCCESS - User account is active")
    
    # Create access token
    logger.debug(f"Step 6: Creating JWT access token")
    token_data = {"sub": str(user.id), "role": user.role.value}
    logger.debug(f"  - Token payload: {token_data}")
    
    access_token = create_access_token(data=token_data)
    logger.debug(f"Step 6: SUCCESS - JWT token created")
    logger.debug(f"  - Token (first 20 chars): {access_token[:20]}...")
    
    # Prepare response
    logger.debug(f"Step 7: Preparing login response")
    response = {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }
    
    logger.debug(f"Step 7: SUCCESS - Response prepared")
    logger.debug(f"  - Token Type: bearer")
    logger.debug(f"  - User ID: {user.id}")
    logger.debug(f"  - User Email: {user.email}")
    logger.debug(f"  - User Role: {user.role.value}")
    
    logger.debug("=" * 80)
    logger.debug(f"LOGIN FLOW COMPLETED SUCCESSFULLY for {credentials.email}")
    logger.debug("=" * 80)
    
    return response

@app.get("/api/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

# ==================== Category Endpoints ====================

@app.get("/api/categories", response_model=List[CategoryResponse])
async def list_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    return categories

# ==================== Equipment Endpoints ====================

@app.get("/api/equipment", response_model=List[EquipmentResponse])
async def list_equipment(
    search: Optional[str] = Query(None, description="Search in name, description, or serial number"),
    category_id: Optional[int] = Query(None, description="Filter by category ID"),
    status: Optional[EquipmentStatus] = Query(None, description="Filter by status"),
    db: Session = Depends(get_db)
):
    query = db.query(EquipmentItem)
    
    # Apply filters
    if search:
        search_filter = or_(
            EquipmentItem.name.ilike(f"%{search}%"),
            EquipmentItem.description.ilike(f"%{search}%"),
            EquipmentItem.serial_number.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)
    
    if category_id:
        query = query.filter(EquipmentItem.category_id == category_id)
    
    if status:
        query = query.filter(EquipmentItem.status == status)
    
    equipment_items = query.all()
    return equipment_items

@app.get("/api/equipment/{equipment_id}", response_model=EquipmentResponse)
async def get_equipment(equipment_id: int, db: Session = Depends(get_db)):
    equipment = db.query(EquipmentItem).filter(EquipmentItem.id == equipment_id).first()
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment not found"
        )
    return equipment

@app.post("/api/equipment", response_model=EquipmentResponse, status_code=status.HTTP_201_CREATED)
async def create_equipment(
    equipment_data: EquipmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    # Check if serial number already exists
    existing = db.query(EquipmentItem).filter(
        EquipmentItem.serial_number == equipment_data.serial_number
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Serial number already exists"
        )
    
    # Check if category exists
    category = db.query(Category).filter(Category.id == equipment_data.category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    new_equipment = EquipmentItem(**equipment_data.dict())
    db.add(new_equipment)
    db.commit()
    db.refresh(new_equipment)
    
    return new_equipment

@app.put("/api/equipment/{equipment_id}", response_model=EquipmentResponse)
async def update_equipment(
    equipment_id: int,
    equipment_data: EquipmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    equipment = db.query(EquipmentItem).filter(EquipmentItem.id == equipment_id).first()
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment not found"
        )
    
    # Update fields
    update_data = equipment_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(equipment, field, value)
    
    db.commit()
    db.refresh(equipment)
    
    return equipment

@app.delete("/api/equipment/{equipment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_equipment(
    equipment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    equipment = db.query(EquipmentItem).filter(EquipmentItem.id == equipment_id).first()
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment not found"
        )
    
    # Check if equipment has active borrow requests
    active_requests = db.query(BorrowRequest).filter(
        BorrowRequest.equipment_id == equipment_id,
        BorrowRequest.status.in_([BorrowRequestStatus.PENDING, BorrowRequestStatus.APPROVED])
    ).first()
    
    if active_requests:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete equipment with active borrow requests"
        )
    
    db.delete(equipment)
    db.commit()
    
    return None

# ==================== Borrow Request Endpoints ====================

@app.get("/api/borrow-requests", response_model=List[BorrowRequestResponse])
async def list_borrow_requests(
    status_filter: Optional[BorrowRequestStatus] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(BorrowRequest)
    
    # Students can only see their own requests
    if current_user.role == UserRole.STUDENT:
        query = query.filter(BorrowRequest.user_id == current_user.id)
    
    # Apply status filter
    if status_filter:
        query = query.filter(BorrowRequest.status == status_filter)
    
    requests = query.order_by(BorrowRequest.created_at.desc()).all()
    return requests

@app.get("/api/borrow-requests/my-requests", response_model=List[BorrowRequestResponse])
async def get_my_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    requests = db.query(BorrowRequest).filter(
        BorrowRequest.user_id == current_user.id
    ).order_by(BorrowRequest.created_at.desc()).all()
    return requests

@app.post("/api/borrow-requests", response_model=BorrowRequestResponse, status_code=status.HTTP_201_CREATED)
async def create_borrow_request(
    request_data: BorrowRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Validate dates
    if request_data.start_date < date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start date cannot be in the past"
        )
    
    if request_data.end_date < request_data.start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date must be after start date"
        )
    
    # Check if equipment exists
    equipment = db.query(EquipmentItem).filter(
        EquipmentItem.id == request_data.equipment_id
    ).first()
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment not found"
        )
    
    # Check if equipment is available
    if equipment.available_quantity < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Equipment is not available"
        )
    
    # Check for overlapping requests
    overlapping = db.query(BorrowRequest).filter(
        BorrowRequest.equipment_id == request_data.equipment_id,
        BorrowRequest.status.in_([BorrowRequestStatus.PENDING, BorrowRequestStatus.APPROVED]),
        or_(
            and_(
                BorrowRequest.start_date <= request_data.start_date,
                BorrowRequest.end_date >= request_data.start_date
            ),
            and_(
                BorrowRequest.start_date <= request_data.end_date,
                BorrowRequest.end_date >= request_data.end_date
            ),
            and_(
                BorrowRequest.start_date >= request_data.start_date,
                BorrowRequest.end_date <= request_data.end_date
            )
        )
    ).first()
    
    if overlapping:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Equipment is already booked for the requested period"
        )
    
    # Create borrow request
    new_request = BorrowRequest(
        user_id=current_user.id,
        equipment_id=request_data.equipment_id,
        start_date=request_data.start_date,
        end_date=request_data.end_date,
        purpose=request_data.purpose,
        status=BorrowRequestStatus.PENDING
    )
    
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    
    return new_request

@app.put("/api/borrow-requests/{request_id}/approve", response_model=BorrowRequestResponse)
async def approve_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_staff_or_admin_user)
):
    borrow_request = db.query(BorrowRequest).filter(BorrowRequest.id == request_id).first()
    if not borrow_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Borrow request not found"
        )
    
    if borrow_request.status != BorrowRequestStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending requests can be approved"
        )
    
    # Update request status
    borrow_request.status = BorrowRequestStatus.APPROVED
    borrow_request.approved_by = current_user.id
    borrow_request.approved_at = datetime.utcnow()
    
    # Update equipment availability
    equipment = db.query(EquipmentItem).filter(
        EquipmentItem.id == borrow_request.equipment_id
    ).first()
    if equipment:
        equipment.available_quantity -= 1
        if equipment.available_quantity == 0:
            equipment.status = EquipmentStatus.CHECKED_OUT
    
    db.commit()
    db.refresh(borrow_request)
    
    return borrow_request

@app.put("/api/borrow-requests/{request_id}/reject", response_model=BorrowRequestResponse)
async def reject_request(
    request_id: int,
    notes: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_staff_or_admin_user)
):
    borrow_request = db.query(BorrowRequest).filter(BorrowRequest.id == request_id).first()
    if not borrow_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Borrow request not found"
        )
    
    if borrow_request.status != BorrowRequestStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending requests can be rejected"
        )
    
    borrow_request.status = BorrowRequestStatus.REJECTED
    borrow_request.approved_by = current_user.id
    borrow_request.approved_at = datetime.utcnow()
    if notes:
        borrow_request.notes = notes
    
    db.commit()
    db.refresh(borrow_request)
    
    return borrow_request

@app.put("/api/borrow-requests/{request_id}/return", response_model=BorrowRequestResponse)
async def mark_returned(
    request_id: int,
    update_data: BorrowRequestUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_staff_or_admin_user)
):
    borrow_request = db.query(BorrowRequest).filter(BorrowRequest.id == request_id).first()
    if not borrow_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Borrow request not found"
        )
    
    if borrow_request.status != BorrowRequestStatus.APPROVED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only approved requests can be marked as returned"
        )
    
    # Update request status
    borrow_request.status = BorrowRequestStatus.RETURNED
    borrow_request.returned_at = datetime.utcnow()
    if update_data.return_condition:
        borrow_request.return_condition = update_data.return_condition
    if update_data.notes:
        borrow_request.notes = update_data.notes
    
    # Update equipment availability
    equipment = db.query(EquipmentItem).filter(
        EquipmentItem.id == borrow_request.equipment_id
    ).first()
    if equipment:
        equipment.available_quantity += 1
        if equipment.available_quantity > 0:
            equipment.status = EquipmentStatus.AVAILABLE
    
    db.commit()
    db.refresh(borrow_request)
    
    return borrow_request

# ==================== Dashboard/Stats Endpoints ====================

@app.get("/api/dashboard/stats")
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role == UserRole.ADMINISTRATOR or current_user.role == UserRole.STAFF:
        # Admin/Staff dashboard
        total_equipment = db.query(EquipmentItem).count()
        available_equipment = db.query(EquipmentItem).filter(
            EquipmentItem.status == EquipmentStatus.AVAILABLE
        ).count()
        pending_requests = db.query(BorrowRequest).filter(
            BorrowRequest.status == BorrowRequestStatus.PENDING
        ).count()
        active_borrows = db.query(BorrowRequest).filter(
            BorrowRequest.status == BorrowRequestStatus.APPROVED
        ).count()
        
        return {
            "total_equipment": total_equipment,
            "available_equipment": available_equipment,
            "pending_requests": pending_requests,
            "active_borrows": active_borrows
        }
    else:
        # Student dashboard
        my_pending = db.query(BorrowRequest).filter(
            BorrowRequest.user_id == current_user.id,
            BorrowRequest.status == BorrowRequestStatus.PENDING
        ).count()
        my_approved = db.query(BorrowRequest).filter(
            BorrowRequest.user_id == current_user.id,
            BorrowRequest.status == BorrowRequestStatus.APPROVED
        ).count()
        
        return {
            "my_pending_requests": my_pending,
            "my_active_borrows": my_approved
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
