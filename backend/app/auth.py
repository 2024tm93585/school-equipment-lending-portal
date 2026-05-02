from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import logging
from app.config import settings
from app.database import get_db
from app.models import User, UserRole

# Configure logging
logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    logger.debug("  [AUTH] verify_password() called")
    logger.debug(f"    - Plain password length: {len(plain_password)} characters")
    logger.debug(f"    - Hashed password (first 20 chars): {hashed_password[:20]}...")
    
    result = pwd_context.verify(plain_password, hashed_password)
    logger.debug(f"    - Password verification result: {result}")
    
    return result

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    logger.debug("  [AUTH] create_access_token() called")
    logger.debug(f"    - Token data: {data}")
    
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
        logger.debug(f"    - Using custom expiration delta: {expires_delta}")
    else:
        expire = datetime.utcnow() + timedelta(hours=settings.ACCESS_TOKEN_EXPIRE_HOURS)
        logger.debug(f"    - Using default expiration: {settings.ACCESS_TOKEN_EXPIRE_HOURS} hours")
    
    to_encode.update({"exp": expire})
    logger.debug(f"    - Token expiration time: {expire}")
    logger.debug(f"    - Complete token payload: {to_encode}")
    
    logger.debug(f"    - Encoding with SECRET_KEY (first 10 chars): {settings.SECRET_KEY[:10]}...")
    logger.debug(f"    - Algorithm: {settings.ALGORITHM}")
    
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    logger.debug(f"    - JWT token generated successfully")
    logger.debug(f"    - Token length: {len(encoded_jwt)} characters")
    
    return encoded_jwt

def decode_token(token: str) -> dict:
    logger.debug("  [AUTH] decode_token() called")
    logger.debug(f"    - Token (first 20 chars): {token[:20]}...")
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        logger.debug(f"    - Token decoded successfully")
        logger.debug(f"    - Payload: {payload}")
        return payload
    except JWTError as e:
        logger.debug(f"    - Token decode FAILED: {str(e)}")
        return None

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    logger.debug("=" * 80)
    logger.debug("TOKEN VALIDATION FLOW STARTED")
    logger.debug("=" * 80)
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    logger.debug("Step 1: Extracting token from Authorization header")
    token = credentials.credentials
    logger.debug(f"  - Token (first 20 chars): {token[:20]}...")
    
    logger.debug("Step 2: Decoding JWT token")
    payload = decode_token(token)
    
    if payload is None:
        logger.debug("Step 2: FAILED - Token decode failed")
        raise credentials_exception
    
    logger.debug(f"Step 2: SUCCESS - Token decoded")
    
    logger.debug("Step 3: Extracting user ID from token payload")
    user_id_str: str = payload.get("sub")
    if user_id_str is None:
        logger.debug("Step 3: FAILED - 'sub' claim not found in token")
        raise credentials_exception
    
    logger.debug(f"Step 3: SUCCESS - User ID (string): {user_id_str}")
    
    logger.debug("Step 4: Converting user ID to integer")
    try:
        user_id = int(user_id_str)
        logger.debug(f"Step 4: SUCCESS - User ID (integer): {user_id}")
    except (ValueError, TypeError) as e:
        logger.debug(f"Step 4: FAILED - Cannot convert user ID to integer: {str(e)}")
        raise credentials_exception
    
    logger.debug(f"Step 5: Querying database for user with ID: {user_id}")
    user = db.query(User).filter(User.id == user_id).first()
    
    if user is None:
        logger.debug(f"Step 5: FAILED - User not found in database")
        raise credentials_exception
    
    logger.debug(f"Step 5: SUCCESS - User found")
    logger.debug(f"  - User ID: {user.id}")
    logger.debug(f"  - User Email: {user.email}")
    logger.debug(f"  - User Name: {user.name}")
    logger.debug(f"  - User Role: {user.role.value}")
    logger.debug(f"  - User Active: {user.is_active}")
    
    logger.debug("Step 6: Checking if user is active")
    if not user.is_active:
        logger.debug(f"Step 6: FAILED - User account is not active")
        raise credentials_exception
    
    logger.debug(f"Step 6: SUCCESS - User is active")
    
    logger.debug("=" * 80)
    logger.debug(f"TOKEN VALIDATION COMPLETED SUCCESSFULLY for user: {user.email}")
    logger.debug("=" * 80)
    
    return user

async def get_current_admin_user(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != UserRole.ADMINISTRATOR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions. Administrator access required."
        )
    return current_user

async def get_current_staff_or_admin_user(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role not in [UserRole.STAFF, UserRole.ADMINISTRATOR]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions. Staff or Administrator access required."
        )
    return current_user
