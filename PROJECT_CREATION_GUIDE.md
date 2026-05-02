# School Equipment Lending Portal - Complete Creation Guide

This document contains refined prompts that can be used to recreate this project from beginning to end. Each prompt is designed to be clear, specific, and actionable.

---

## Phase 1: Project Specification

### Prompt 1.1: Initial Project Request

```
Create a School Equipment Lending Portal with the following requirements:

CORE FEATURES:
1. User Authentication & Roles
   - Login/signup for students, staff, and admins
   - Role-based access (student, staff, administrator)
   - Token-based authentication

2. Equipment Management
   - Add, edit, or delete items (by admin)
   - Each item has: name, category, condition, quantity, and availability
   - Track serial numbers and equipment status

3. Borrowing & Return Requests
   - Students can request equipment
   - Staff/admin approves or rejects requests
   - Mark as returned when complete
   - Prevent overlapping bookings for the same item

4. Dashboard - Equipment Listing & Search
   - List all available equipment
   - Search/filter by category or availability
   - Display statistics (total equipment, pending requests, etc.)

5. Basic UI & Navigation
   - Responsive React frontend with clear navigation
   - Clean, modern interface

TECHNICAL STACK:
- Frontend: React
- Backend: Python (FastAPI)
- Database: MySQL

DEPLOYMENT:
- Must run locally without Docker
- Use existing local MySQL database

Please create a complete specification for this project.
```

**Expected Output**: Requirements document, design document, and task list

---

## Phase 2: Database Setup

### Prompt 2.1: Database Schema Creation

```
Set up the MySQL database for the School Equipment Lending Portal with the following:

DATABASE REQUIREMENTS:
1. Create database named 'equipment_portal'
2. Create user 'portal_user' with password 'portal_password'
3. Grant appropriate privileges

TABLES NEEDED:
1. users - Store user accounts with roles (student, staff, administrator)
2. categories - Equipment categories (Laptops, Tablets, Projectors, etc.)
3. equipment_items - Individual equipment with serial numbers, status, quantity
4. borrow_requests - Borrowing requests with approval workflow

SAMPLE DATA:
- 1 admin user (email: admin@school.edu, password: Admin123!)
- 6 equipment categories
- 10 sample equipment items

Please create:
1. SQL initialization script (init.sql)
2. Database setup instructions
3. Commands to verify the setup
```

**Expected Output**: init.sql file, setup instructions, verification commands

---

## Phase 3: Backend Development

### Prompt 3.1: Backend Project Structure

```
Create a Python FastAPI backend for the School Equipment Lending Portal with:

PROJECT STRUCTURE:
backend/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI application with all endpoints
│   ├── models.py        # SQLAlchemy database models
│   ├── schemas.py       # Pydantic schemas for request/response
│   ├── auth.py          # Authentication logic (JWT tokens)
│   ├── database.py      # Database connection
│   └── config.py        # Configuration (loads from .env)
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables
└── init.sql            # Database initialization

REQUIREMENTS:
- FastAPI for REST API
- SQLAlchemy for ORM
- PyMySQL for MySQL connection
- Pydantic for data validation
- python-jose for JWT tokens
- passlib with bcrypt for password hashing
- CORS enabled for frontend communication

IMPORTANT:
- JWT "sub" claim MUST be a string (not integer)
- Use pydantic-settings to load .env file
- Password hashing with bcrypt
- Proper error handling and validation

Please create all backend files with complete implementation.
```

**Expected Output**: Complete backend code with all files

### Prompt 3.2: Backend Configuration

```
Create the backend configuration files:

1. requirements.txt with these dependencies:
   - fastapi==0.104.1
   - uvicorn[standard]==0.24.0
   - sqlalchemy==2.0.23
   - pymysql==1.1.0
   - cryptography==41.0.7
   - pydantic[email]==2.5.0
   - pydantic-settings==2.1.0
   - python-jose[cryptography]==3.3.0
   - passlib==1.7.4
   - bcrypt==4.0.1
   - python-multipart==0.0.6
   - python-dotenv==1.0.0

2. .env file with:
   - DATABASE_URL=mysql+pymysql://portal_user:portal_password@localhost:3306/equipment_portal
   - SECRET_KEY=your-secret-key-change-in-production-make-it-long-and-random-string-here
   - ALGORITHM=HS256
   - ACCESS_TOKEN_EXPIRE_HOURS=24
   - ENVIRONMENT=development

3. config.py that properly loads .env using pydantic-settings

CRITICAL: Ensure config.py uses pydantic-settings with env_file=".env" in Config class
```

**Expected Output**: requirements.txt, .env, and config.py files

---

## Phase 4: Frontend Development

### Prompt 4.1: Frontend Project Structure

```
Create a React frontend for the School Equipment Lending Portal with:

PROJECT STRUCTURE:
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── Navbar.js       # Navigation component
│   ├── context/
│   │   └── AuthContext.js  # Authentication context
│   ├── pages/
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   ├── DashboardPage.js
│   │   ├── EquipmentListPage.js
│   │   ├── MyRequestsPage.js
│   │   ├── ManageRequestsPage.js (staff/admin)
│   │   └── ManageEquipmentPage.js (admin)
│   ├── services/
│   │   └── api.js          # Axios API service
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
└── .env

REQUIREMENTS:
- React Router for navigation
- Axios for API calls
- Context API for authentication state
- Role-based route protection
- Responsive design with clean CSS
- API base URL from environment variable

FEATURES:
- Login/Register forms
- Dashboard with statistics
- Equipment list with search/filter
- Borrow request creation
- Request management (approve/reject/return)
- Equipment management (CRUD for admin)

Please create all frontend files with complete implementation.
```

**Expected Output**: Complete React frontend with all components and pages

### Prompt 4.2: Frontend Configuration

```
Create the frontend configuration files:

1. package.json with dependencies:
   - react
   - react-dom
   - react-router-dom
   - axios
   - react-scripts

2. .env file with:
   - REACT_APP_API_URL=http://localhost:8000/api

3. API service (api.js) with:
   - Axios instance with base URL
   - Request interceptor to add JWT token
   - Response interceptor for 401 handling
   - API methods for all endpoints

IMPORTANT: Ensure API service properly handles authentication tokens
```

**Expected Output**: package.json, .env, and api.js service

---

## Phase 5: Authentication Implementation

### Prompt 5.1: JWT Authentication Setup

```
Implement JWT authentication with these CRITICAL requirements:

BACKEND (auth.py):
1. Password hashing with bcrypt
2. JWT token creation with:
   - "sub" claim as STRING (convert user.id to string)
   - "role" claim with user role
   - Expiration time from settings
3. Token validation that:
   - Decodes JWT token
   - Converts "sub" from string back to integer
   - Retrieves user from database
   - Checks if user is active

BACKEND (main.py - login endpoint):
1. Verify email and password
2. Create token with: {"sub": str(user.id), "role": user.role.value}
3. Return token and user info

FRONTEND (AuthContext.js):
1. Store token in localStorage
2. Include token in all API requests
3. Handle login/logout
4. Provide authentication state

CRITICAL FIX:
- JWT "sub" claim MUST be a string, not integer
- Convert: user.id → str(user.id) when creating token
- Convert: payload["sub"] → int(payload["sub"]) when validating

This prevents "Subject must be a string" JWT validation errors.
```

**Expected Output**: Working authentication with proper JWT handling

---

## Phase 6: API Endpoints Implementation

### Prompt 6.1: Complete API Endpoints

```
Implement all REST API endpoints in main.py:

AUTHENTICATION ENDPOINTS:
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login and get JWT token
- GET /api/auth/me - Get current user info

CATEGORY ENDPOINTS:
- GET /api/categories - List all categories (public)

EQUIPMENT ENDPOINTS:
- GET /api/equipment - List equipment (with search/filter)
- GET /api/equipment/{id} - Get equipment details
- POST /api/equipment - Create equipment (admin only)
- PUT /api/equipment/{id} - Update equipment (admin only)
- DELETE /api/equipment/{id} - Delete equipment (admin only)

BORROW REQUEST ENDPOINTS:
- GET /api/borrow-requests - List requests (filtered by role)
- GET /api/borrow-requests/my-requests - Get user's own requests
- POST /api/borrow-requests - Create borrow request
- PUT /api/borrow-requests/{id}/approve - Approve request (staff/admin)
- PUT /api/borrow-requests/{id}/reject - Reject request (staff/admin)
- PUT /api/borrow-requests/{id}/return - Mark as returned (staff/admin)

DASHBOARD ENDPOINTS:
- GET /api/dashboard/stats - Get statistics (role-based)

REQUIREMENTS:
- Proper authentication with JWT tokens
- Role-based access control
- Input validation with Pydantic
- Error handling with appropriate HTTP status codes
- CORS enabled for frontend
- Prevent overlapping bookings
```

**Expected Output**: Complete API implementation with all endpoints

---

## Phase 7: Local Deployment Setup

### Prompt 7.1: Local Deployment Scripts

```
Create deployment scripts for running the application locally without Docker:

1. START SCRIPT (start-local.sh for macOS/Linux):
   - Check MySQL connection
   - Create database if not exists
   - Initialize database with init.sql
   - Create Python virtual environment (use python3.12)
   - Install Python dependencies
   - Start backend server (uvicorn with --reload)
   - Install Node.js dependencies
   - Start frontend server (npm start)
   - Display access URLs and credentials

2. START SCRIPT (start-local.bat for Windows):
   - Same functionality as above but for Windows

3. LOCAL DEPLOYMENT GUIDE (LOCAL_DEPLOYMENT.md):
   - Prerequisites (Python 3.10+, Node.js 18+, MySQL 8.0+)
   - Step-by-step setup instructions
   - Database setup commands
   - Backend setup (venv, dependencies, .env)
   - Frontend setup (npm install, .env)
   - Troubleshooting section

4. QUICK REFERENCE (QUICK_REFERENCE.md):
   - Application URLs
   - Default credentials
   - Quick start commands
   - Common database commands
   - API endpoints list
   - Troubleshooting tips

IMPORTANT:
- Use python3.12 for virtual environment (not python3.14)
- Check MySQL is running before starting
- Provide clear error messages
- Include verification steps
```

**Expected Output**: Startup scripts and comprehensive documentation

---

## Phase 8: Testing and Verification

### Prompt 8.1: Authentication Test Script

```
Create a comprehensive authentication test script (test-authentication.sh) that:

TESTS TO PERFORM:
1. Admin login with credentials
2. Dashboard access with JWT token
3. Get current user info
4. List equipment (authenticated)
5. List categories (public)

REQUIREMENTS:
- Use curl for API testing
- Parse JSON responses with python3
- Display clear success/failure messages
- Exit with error code if any test fails
- Show summary of all tests

OUTPUT FORMAT:
- Test name and description
- ✅ for success, ❌ for failure
- Relevant data from responses
- Final summary

This script should verify that authentication is working correctly end-to-end.
```

**Expected Output**: Automated test script for authentication

---

## Phase 9: Documentation

### Prompt 9.1: Complete Documentation

```
Create comprehensive documentation:

1. PROJECT_SUMMARY.md:
   - Project overview
   - Features list
   - Technology stack
   - Architecture overview
   - File structure

2. DEPLOYMENT_STATUS.md:
   - Current deployment status
   - What's been completed
   - Access information
   - Database contents
   - Next steps for users

3. AUTHENTICATION_FIX.md:
   - Explanation of JWT "sub" claim issue
   - Root cause analysis
   - Solution implemented
   - Code changes made
   - Prevention tips

4. QUICK_START.md:
   - Fastest way to get started
   - One-command startup
   - Login instructions
   - Basic usage guide

5. README.md:
   - Project introduction
   - Features
   - Installation
   - Usage
   - API documentation link
   - Contributing guidelines

All documentation should be clear, concise, and include code examples where appropriate.
```

**Expected Output**: Complete documentation suite

---

## Phase 10: Final Verification

### Prompt 10.1: Complete System Test

```
Perform a complete end-to-end test of the application:

1. DATABASE VERIFICATION:
   - Verify database exists
   - Check all tables created
   - Verify sample data loaded
   - Test admin user credentials

2. BACKEND VERIFICATION:
   - Backend server starts successfully
   - Health check endpoint responds
   - Login endpoint works
   - Token validation works
   - All API endpoints accessible

3. FRONTEND VERIFICATION:
   - Frontend server starts
   - Application loads in browser
   - Login page displays
   - Navigation works
   - All pages render correctly

4. INTEGRATION TESTING:
   - Login flow works end-to-end
   - Dashboard displays data
   - Equipment list loads
   - Borrow request creation works
   - Admin functions work

5. AUTHENTICATION TESTING:
   - Admin login successful
   - Student registration works
   - Token persists across page reloads
   - Logout clears authentication
   - Protected routes require login

Create a checklist and verify each item, documenting any issues found.
```

**Expected Output**: Complete verification checklist with results

---

## Common Issues and Solutions

### Issue 1: JWT "sub" Claim Type Error

**Problem**: `Subject must be a string` error when validating JWT tokens

**Solution**:
```python
# In main.py (token creation)
access_token = create_access_token(data={"sub": str(user.id), "role": user.role.value})

# In auth.py (token validation)
user_id_str: str = payload.get("sub")
user_id = int(user_id_str)
```

### Issue 2: Configuration Not Loading

**Problem**: .env file not being loaded by pydantic-settings

**Solution**:
```python
class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    
    class Config:
        env_file = ".env"  # Add this
        case_sensitive = True
```

### Issue 3: Python Version Compatibility

**Problem**: pydantic-core fails to build with Python 3.14

**Solution**: Use Python 3.12 instead
```bash
python3.12 -m venv venv
```

### Issue 4: Password Hash Mismatch

**Problem**: Passwords not verifying correctly

**Solution**: Ensure bcrypt version is compatible
```
passlib==1.7.4
bcrypt==4.0.1
```

---

## Deployment Checklist

Use this checklist when deploying the application:

### Prerequisites
- [ ] Python 3.10+ installed (preferably 3.12)
- [ ] Node.js 18+ installed
- [ ] MySQL 8.0+ installed and running
- [ ] Git installed (optional)

### Database Setup
- [ ] MySQL server is running
- [ ] Database 'equipment_portal' created
- [ ] User 'portal_user' created with privileges
- [ ] init.sql script executed successfully
- [ ] Sample data loaded (1 admin, 6 categories, 10 items)

### Backend Setup
- [ ] Virtual environment created with Python 3.12
- [ ] All dependencies installed from requirements.txt
- [ ] .env file created with correct values
- [ ] Backend server starts without errors
- [ ] Health check endpoint responds
- [ ] Login endpoint works

### Frontend Setup
- [ ] Node modules installed
- [ ] .env file created with API URL
- [ ] Frontend server starts without errors
- [ ] Application loads in browser
- [ ] Can navigate between pages

### Authentication
- [ ] Admin login works (admin@school.edu / Admin123!)
- [ ] JWT tokens are generated correctly
- [ ] Token validation works
- [ ] Protected routes require authentication
- [ ] Role-based access control works

### Testing
- [ ] test-authentication.sh passes all tests
- [ ] Can create new users
- [ ] Can create borrow requests
- [ ] Can approve/reject requests (as admin)
- [ ] Can manage equipment (as admin)

### Documentation
- [ ] All documentation files created
- [ ] README.md is clear and complete
- [ ] Troubleshooting guide is helpful
- [ ] API documentation is accessible

---

## Quick Reference Commands

### Start Application
```bash
cd school-equipment-lending-portal
./start-local.sh
```

### Stop Application
Press `Ctrl+C` in both terminal windows

### Test Authentication
```bash
./test-authentication.sh
```

### Database Commands
```bash
# View users
mysql -u portal_user -pportal_password equipment_portal -e "SELECT id, email, role FROM users;"

# View equipment
mysql -u portal_user -pportal_password equipment_portal -e "SELECT id, name, status FROM equipment_items;"

# Reset database
mysql -u root -e "DROP DATABASE equipment_portal; CREATE DATABASE equipment_portal;"
mysql -u root equipment_portal < backend/init.sql
```

### Backend Commands
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend Commands
```bash
cd frontend
npm start
```

---

## Success Criteria

The project is successfully deployed when:

1. ✅ All services start without errors
2. ✅ Can access frontend at http://localhost:3000
3. ✅ Can access backend at http://localhost:8000
4. ✅ Can access API docs at http://localhost:8000/docs
5. ✅ Can login with admin credentials
6. ✅ Dashboard displays correct statistics
7. ✅ Can view equipment list
8. ✅ Can create borrow requests
9. ✅ Can approve/reject requests (as admin)
10. ✅ Can manage equipment (as admin)
11. ✅ All authentication tests pass
12. ✅ No console errors in browser
13. ✅ No errors in backend logs
14. ✅ Database contains expected data

---

## Conclusion

This guide provides a complete, step-by-step approach to creating the School Equipment Lending Portal from scratch. Each prompt is designed to be specific and actionable, with clear requirements and expected outputs.

By following these prompts in order, you can recreate the entire project with all features working correctly, including the critical JWT authentication fix.

**Key Takeaways**:
1. Always use string for JWT "sub" claim
2. Use pydantic-settings properly for configuration
3. Use Python 3.12 for compatibility
4. Test authentication end-to-end
5. Document everything clearly

**Final Result**: A fully functional equipment lending portal with authentication, role-based access control, and complete CRUD operations for equipment and borrow requests.
