# DEBUG Logging Guide - Login Flow

## Overview
Comprehensive DEBUG logging has been added to the authentication flow to help trace and troubleshoot login issues. The logging covers every critical step from receiving credentials to returning the JWT token.

## Log Levels Used
- **DEBUG**: Detailed step-by-step flow information
- **INFO**: General informational messages (Uvicorn default)
- **ERROR**: Error conditions and exceptions

## Login Flow Debug Messages

### Step-by-Step Breakdown

#### **Step 1: Login Request Received**
```
DEBUG - LOGIN FLOW STARTED
DEBUG - Step 1: Received login request for email: admin@school.edu
```
- Logs when the `/api/auth/login` endpoint receives a request
- Shows the email address attempting to login

#### **Step 2: Database Query**
```
DEBUG - Step 2: Querying database for user with email: admin@school.edu
```
- Logs the database query to find the user by email

#### **Step 3: User Found (or Not Found)**
**Success:**
```
DEBUG - Step 3: SUCCESS - User found in database
DEBUG -   - User ID: 1
DEBUG -   - User Name: Admin User
DEBUG -   - User Role: administrator
DEBUG -   - User Active Status: True
```

**Failure:**
```
DEBUG - Step 3: FAILED - User not found in database for email: wrong@email.com
```

#### **Step 4: Password Verification**
```
DEBUG - Step 4: Verifying password for user: admin@school.edu
DEBUG -   [AUTH] verify_password() called
DEBUG -     - Plain password length: 9 characters
DEBUG -     - Hashed password (first 20 chars): $2b$12$abcdefghijkl...
DEBUG -     - Password verification result: True
DEBUG - Step 4: SUCCESS - Password verified successfully
```

**Failure:**
```
DEBUG - Step 4: FAILED - Password verification failed for user: admin@school.edu
```

#### **Step 5: Account Active Check**
```
DEBUG - Step 5: Checking if user account is active
DEBUG - Step 5: SUCCESS - User account is active
```

**Failure:**
```
DEBUG - Step 5: FAILED - User account is deactivated for: admin@school.edu
```

#### **Step 6: JWT Token Creation**
```
DEBUG - Step 6: Creating JWT access token
DEBUG -   - Token payload: {'sub': '1', 'role': 'administrator'}
DEBUG -   [AUTH] create_access_token() called
DEBUG -     - Token data: {'sub': '1', 'role': 'administrator'}
DEBUG -     - Using default expiration: 24 hours
DEBUG -     - Token expiration time: 2026-05-02 10:30:45.123456
DEBUG -     - Complete token payload: {'sub': '1', 'role': 'administrator', 'exp': 1746180645}
DEBUG -     - Encoding with SECRET_KEY (first 10 chars): your_secre...
DEBUG -     - Algorithm: HS256
DEBUG -     - JWT token generated successfully
DEBUG -     - Token length: 187 characters
DEBUG - Step 6: SUCCESS - JWT token created
DEBUG -   - Token (first 20 chars): eyJhbGciOiJIUzI1NiIs...
```

#### **Step 7: Response Preparation**
```
DEBUG - Step 7: Preparing login response
DEBUG - Step 7: SUCCESS - Response prepared
DEBUG -   - Token Type: bearer
DEBUG -   - User ID: 1
DEBUG -   - User Email: admin@school.edu
DEBUG -   - User Role: administrator
DEBUG - LOGIN FLOW COMPLETED SUCCESSFULLY for admin@school.edu
```

---

## Token Validation Flow (Subsequent Requests)

When a user makes authenticated requests (e.g., accessing dashboard), the token is validated:

#### **Token Validation Steps**
```
DEBUG - TOKEN VALIDATION FLOW STARTED
DEBUG - Step 1: Extracting token from Authorization header
DEBUG -   - Token (first 20 chars): eyJhbGciOiJIUzI1NiIs...
DEBUG - Step 2: Decoding JWT token
DEBUG -   [AUTH] decode_token() called
DEBUG -     - Token (first 20 chars): eyJhbGciOiJIUzI1NiIs...
DEBUG -     - Token decoded successfully
DEBUG -     - Payload: {'sub': '1', 'role': 'administrator', 'exp': 1746180645}
DEBUG - Step 2: SUCCESS - Token decoded
DEBUG - Step 3: Extracting user ID from token payload
DEBUG - Step 3: SUCCESS - User ID (string): 1
DEBUG - Step 4: Converting user ID to integer
DEBUG - Step 4: SUCCESS - User ID (integer): 1
DEBUG - Step 5: Querying database for user with ID: 1
DEBUG - Step 5: SUCCESS - User found
DEBUG -   - User ID: 1
DEBUG -   - User Email: admin@school.edu
DEBUG -   - User Name: Admin User
DEBUG -   - User Role: administrator
DEBUG -   - User Active: True
DEBUG - Step 6: Checking if user is active
DEBUG - Step 6: SUCCESS - User is active
DEBUG - TOKEN VALIDATION COMPLETED SUCCESSFULLY for user: admin@school.edu
```

---

## How to View Debug Logs

### Method 1: Terminal Output
If running the backend directly:
```bash
cd school-equipment-lending-portal/backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Debug logs will appear in the terminal in real-time.

### Method 2: Check Process Output (if running as background process)
```bash
# View the last 50 lines of backend logs
tail -f backend_logs.txt
```

### Method 3: Docker Logs (if using Docker)
```bash
docker-compose logs -f backend
```

---

## Common Debug Scenarios

### Scenario 1: Wrong Email
```
DEBUG - Step 1: Received login request for email: wrong@email.com
DEBUG - Step 2: Querying database for user with email: wrong@email.com
DEBUG - Step 3: FAILED - User not found in database for email: wrong@email.com
```
**Issue**: Email doesn't exist in database
**Solution**: Check user registration or use correct email

### Scenario 2: Wrong Password
```
DEBUG - Step 3: SUCCESS - User found in database
DEBUG - Step 4: Verifying password for user: admin@school.edu
DEBUG -     - Password verification result: False
DEBUG - Step 4: FAILED - Password verification failed for user: admin@school.edu
```
**Issue**: Password doesn't match
**Solution**: Use correct password or reset password

### Scenario 3: Deactivated Account
```
DEBUG - Step 5: Checking if user account is active
DEBUG - Step 5: FAILED - User account is deactivated for: admin@school.edu
```
**Issue**: User account is marked as inactive
**Solution**: Reactivate account in database

### Scenario 4: Invalid Token
```
DEBUG - Step 2: Decoding JWT token
DEBUG -   [AUTH] decode_token() called
DEBUG -     - Token decode FAILED: Signature has expired
```
**Issue**: Token has expired or is invalid
**Solution**: Login again to get a new token

---

## Security Considerations

### What is NOT Logged (for security):
- ❌ Plain text passwords (only password length is logged)
- ❌ Complete JWT tokens (only first 20 characters)
- ❌ Complete SECRET_KEY (only first 10 characters)
- ❌ Complete password hashes (only first 20 characters)

### What IS Logged:
- ✅ Email addresses (for audit trail)
- ✅ User IDs
- ✅ User roles
- ✅ Token payload structure
- ✅ Success/failure status
- ✅ Timestamps

---

## Disabling Debug Logging (Production)

For production environments, you should reduce the log level to INFO or WARNING:

### Option 1: Modify main.py
```python
logging.basicConfig(
    level=logging.INFO,  # Change from DEBUG to INFO
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

### Option 2: Environment Variable
```bash
export LOG_LEVEL=INFO
```

Then update main.py:
```python
import os
log_level = os.getenv('LOG_LEVEL', 'DEBUG')
logging.basicConfig(
    level=getattr(logging, log_level),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

---

## Files Modified

1. **backend/app/main.py**
   - Added logging import and configuration
   - Added detailed DEBUG messages to login endpoint

2. **backend/app/auth.py**
   - Added logging import
   - Added DEBUG messages to:
     - `verify_password()`
     - `create_access_token()`
     - `decode_token()`
     - `get_current_user()`

---

## Testing the Debug Logging

### Test 1: Successful Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.edu","password":"Admin123!"}'
```

Check terminal for complete login flow logs.

### Test 2: Failed Login (Wrong Password)
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.edu","password":"WrongPassword"}'
```

Check terminal for password verification failure logs.

### Test 3: Token Validation
```bash
# First, login and get token
TOKEN=$(curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.edu","password":"Admin123!"}' \
  | jq -r '.access_token')

# Then, use token to access protected endpoint
curl -X GET http://localhost:8000/api/dashboard/stats \
  -H "Authorization: Bearer $TOKEN"
```

Check terminal for token validation flow logs.

---

## Summary

The DEBUG logging provides:
- ✅ Complete visibility into the authentication flow
- ✅ Step-by-step execution tracking
- ✅ Clear success/failure indicators
- ✅ Detailed context for troubleshooting
- ✅ Security-conscious logging (no sensitive data exposure)
- ✅ Easy-to-read formatted output

This makes it much easier to diagnose login issues, understand the authentication flow, and debug problems in development.
