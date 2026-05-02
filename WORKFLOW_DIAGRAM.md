# School Equipment Lending Portal - Workflow Diagram

This document provides visual representations of the project creation workflow and system architecture.

---

## 📊 Project Creation Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 1: SPECIFICATION                        │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│  │ Requirements │ -> │    Design    │ -> │    Tasks     │     │
│  │   Document   │    │   Document   │    │     List     │     │
│  └──────────────┘    └──────────────┘    └──────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 2: DATABASE SETUP                       │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│  │   Create DB  │ -> │  Create User │ -> │  Load Sample │     │
│  │   & Tables   │    │  & Privileges│    │     Data     │     │
│  └──────────────┘    └──────────────┘    └──────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  PHASE 3: BACKEND DEVELOPMENT                    │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│  │   Models &   │ -> │     Auth     │ -> │     API      │     │
│  │   Schemas    │    │   (JWT)      │    │  Endpoints   │     │
│  └──────────────┘    └──────────────┘    └──────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  PHASE 4: FRONTEND DEVELOPMENT                   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│  │  Components  │ -> │    Pages     │ -> │   Services   │     │
│  │  & Context   │    │  & Routes    │    │   (API)      │     │
│  └──────────────┘    └──────────────┘    └──────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   PHASE 5: AUTHENTICATION FIX                    │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│  │  JWT "sub"   │ -> │   Config     │ -> │    Test      │     │
│  │  as String   │    │   Loading    │    │    & Verify  │     │
│  └──────────────┘    └──────────────┘    └──────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  PHASE 6: DEPLOYMENT & TESTING                   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│  │   Scripts    │ -> │     Test     │ -> │  Document    │     │
│  │  & Guides    │    │   & Verify   │    │  & Deploy    │     │
│  └──────────────┘    └──────────────┘    └──────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                     http://localhost:3000                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────────────┐
                    │  React Frontend │
                    │   (Port 3000)   │
                    │                 │
                    │  - Login Page   │
                    │  - Dashboard    │
                    │  - Equipment    │
                    │  - Requests     │
                    └─────────────────┘
                              ↓
                    HTTP Requests (Axios)
                    with JWT Token
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    FastAPI Backend (Port 8000)                   │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │     Auth     │  │     API      │  │   Business   │         │
│  │  Middleware  │->│  Endpoints   │->│    Logic     │         │
│  │  (JWT)       │  │  (REST)      │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                              ↓                   │
│                                    ┌──────────────┐             │
│                                    │  SQLAlchemy  │             │
│                                    │     ORM      │             │
│                                    └──────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    PyMySQL Connection
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    MySQL Database (Port 3306)                    │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    users     │  │  categories  │  │  equipment_  │         │
│  │              │  │              │  │    items     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                   │
│  ┌──────────────┐                                               │
│  │   borrow_    │                                               │
│  │   requests   │                                               │
│  └──────────────┘                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌──────────┐                                              ┌──────────┐
│  User    │                                              │ Database │
└────┬─────┘                                              └────┬─────┘
     │                                                          │
     │  1. POST /api/auth/login                                │
     │     {email, password}                                   │
     ├──────────────────────────────>┌──────────┐             │
     │                                │ Backend  │             │
     │                                └────┬─────┘             │
     │                                     │                   │
     │                                     │ 2. Query user     │
     │                                     ├──────────────────>│
     │                                     │                   │
     │                                     │ 3. User data      │
     │                                     │<──────────────────┤
     │                                     │                   │
     │                                     │ 4. Verify password│
     │                                     │    (bcrypt)       │
     │                                     │                   │
     │                                     │ 5. Create JWT     │
     │                                     │    {"sub": "1"}   │
     │                                     │                   │
     │  6. Return token & user             │                   │
     │<────────────────────────────────────┤                   │
     │                                                          │
     │  7. Store token in localStorage                         │
     │                                                          │
     │  8. GET /api/dashboard/stats                            │
     │     Authorization: Bearer <token>                       │
     ├──────────────────────────────>┌──────────┐             │
     │                                │ Backend  │             │
     │                                └────┬─────┘             │
     │                                     │                   │
     │                                     │ 9. Decode JWT     │
     │                                     │    Validate token │
     │                                     │                   │
     │                                     │ 10. Get user      │
     │                                     ├──────────────────>│
     │                                     │                   │
     │                                     │ 11. User data     │
     │                                     │<──────────────────┤
     │                                     │                   │
     │                                     │ 12. Query stats   │
     │                                     ├──────────────────>│
     │                                     │                   │
     │                                     │ 13. Stats data    │
     │                                     │<──────────────────┤
     │                                     │                   │
     │  14. Return dashboard data          │                   │
     │<────────────────────────────────────┤                   │
     │                                                          │
```

---

## 📦 Data Flow - Borrow Request

```
┌─────────────────────────────────────────────────────────────────┐
│                        STUDENT WORKFLOW                          │
└─────────────────────────────────────────────────────────────────┘

Student                    Backend                    Database
   │                          │                          │
   │ 1. Browse equipment      │                          │
   ├─────────────────────────>│                          │
   │                          │ 2. Query equipment       │
   │                          ├─────────────────────────>│
   │                          │                          │
   │                          │ 3. Equipment list        │
   │                          │<─────────────────────────┤
   │ 4. Equipment list        │                          │
   │<─────────────────────────┤                          │
   │                          │                          │
   │ 5. Create borrow request │                          │
   │    {equipment_id,        │                          │
   │     start_date,          │                          │
   │     end_date}            │                          │
   ├─────────────────────────>│                          │
   │                          │ 6. Check availability    │
   │                          ├─────────────────────────>│
   │                          │                          │
   │                          │ 7. Check overlaps        │
   │                          ├─────────────────────────>│
   │                          │                          │
   │                          │ 8. Create request        │
   │                          ├─────────────────────────>│
   │                          │                          │
   │ 9. Request created       │                          │
   │<─────────────────────────┤                          │
   │                          │                          │

┌─────────────────────────────────────────────────────────────────┐
│                      ADMIN/STAFF WORKFLOW                        │
└─────────────────────────────────────────────────────────────────┘

Admin/Staff                Backend                    Database
   │                          │                          │
   │ 1. View pending requests │                          │
   ├─────────────────────────>│                          │
   │                          │ 2. Query requests        │
   │                          ├─────────────────────────>│
   │                          │                          │
   │                          │ 3. Requests list         │
   │                          │<─────────────────────────┤
   │ 4. Requests list         │                          │
   │<─────────────────────────┤                          │
   │                          │                          │
   │ 5. Approve request       │                          │
   ├─────────────────────────>│                          │
   │                          │ 6. Update request status │
   │                          ├─────────────────────────>│
   │                          │                          │
   │                          │ 7. Update equipment qty  │
   │                          ├─────────────────────────>│
   │                          │                          │
   │ 8. Approval confirmed    │                          │
   │<─────────────────────────┤                          │
   │                          │                          │
```

---

## 🔄 JWT Token Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                      TOKEN CREATION                              │
└─────────────────────────────────────────────────────────────────┘

User Login
    ↓
Verify Credentials
    ↓
Create Token Payload:
{
  "sub": "1",              ← User ID as STRING (CRITICAL!)
  "role": "administrator",
  "exp": 1777693857        ← Expiration timestamp
}
    ↓
Sign with SECRET_KEY using HS256
    ↓
Generate JWT Token:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicm9sZSI6ImFkbWluaXN0cmF0b3IiLCJleHAiOjE3Nzc2OTM4NTd9.uB-6mj6A-pjfdqZvm5Z3b-Lpifta0Q7Ux2F_pJ4m_OI
    ↓
Return to Client
    ↓
Store in localStorage

┌─────────────────────────────────────────────────────────────────┐
│                      TOKEN VALIDATION                            │
└─────────────────────────────────────────────────────────────────┘

Client Request with Token
    ↓
Extract Token from Authorization Header
    ↓
Decode Token with SECRET_KEY
    ↓
Verify Signature
    ↓
Check Expiration
    ↓
Extract "sub" claim (as string)
    ↓
Convert to Integer: int("1") = 1
    ↓
Query Database for User ID = 1
    ↓
Check User is Active
    ↓
Return User Object
    ↓
Process Request
```

---

## 🗂️ File Structure

```
school-equipment-lending-portal/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app + all endpoints
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── auth.py              # JWT authentication
│   │   ├── database.py          # DB connection
│   │   └── config.py            # Settings (loads .env)
│   ├── venv/                    # Python virtual environment
│   ├── .env                     # Environment variables
│   ├── requirements.txt         # Python dependencies
│   └── init.sql                 # Database initialization
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js
│   │   ├── context/
│   │   │   └── AuthContext.js   # Auth state management
│   │   ├── pages/
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── DashboardPage.js
│   │   │   ├── EquipmentListPage.js
│   │   │   ├── MyRequestsPage.js
│   │   │   ├── ManageRequestsPage.js
│   │   │   └── ManageEquipmentPage.js
│   │   ├── services/
│   │   │   └── api.js           # Axios API service
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── node_modules/
│   ├── .env                     # Frontend env vars
│   └── package.json
│
├── start-local.sh               # Startup script (macOS/Linux)
├── start-local.bat              # Startup script (Windows)
├── test-authentication.sh       # Auth test script
│
├── PROJECT_CREATION_GUIDE.md    # Complete creation guide
├── PROMPTS_SUMMARY.md           # Quick prompts reference
├── WORKFLOW_DIAGRAM.md          # This file
├── LOCAL_DEPLOYMENT.md          # Deployment instructions
├── SETUP_DATABASE.md            # Database setup guide
├── QUICK_REFERENCE.md           # Quick reference card
├── AUTHENTICATION_FIX.md        # JWT fix explanation
├── DEPLOYMENT_STATUS.md         # Current status
├── PROJECT_SUMMARY.md           # Project overview
├── QUICK_START.md               # Quick start guide
└── README.md                    # Main documentation
```

---

## 🎯 Decision Tree - User Actions

```
                        ┌─────────────┐
                        │  User Login │
                        └──────┬──────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
              ┌─────▼─────┐         ┌────▼────┐
              │  Student  │         │  Admin  │
              └─────┬─────┘         └────┬────┘
                    │                    │
        ┌───────────┼───────────┐        │
        │           │           │        │
   ┌────▼────┐ ┌───▼────┐ ┌───▼────┐   │
   │  View   │ │ Create │ │  View  │   │
   │Equipment│ │Request │ │  My    │   │
   │         │ │        │ │Requests│   │
   └─────────┘ └────────┘ └────────┘   │
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
              ┌─────▼─────┐      ┌─────▼─────┐      ┌─────▼─────┐
              │  Manage   │      │  Manage   │      │  Approve  │
              │ Equipment │      │   Users   │      │  Requests │
              │  (CRUD)   │      │           │      │           │
              └───────────┘      └───────────┘      └───────────┘
```

---

## 📊 Database Schema Relationships

```
┌─────────────────┐
│     users       │
│─────────────────│
│ id (PK)         │◄─────────┐
│ email           │          │
│ password_hash   │          │
│ name            │          │
│ role            │          │
│ is_active       │          │
└─────────────────┘          │
                             │
                             │ user_id (FK)
                             │
                    ┌────────┴────────┐
                    │ borrow_requests │
                    │─────────────────│
                    │ id (PK)         │
                    │ user_id (FK)    │
                    │ equipment_id(FK)│◄──────┐
                    │ start_date      │       │
                    │ end_date        │       │
                    │ status          │       │
                    │ approved_by(FK) │       │
                    └─────────────────┘       │
                                              │
                                              │ equipment_id (FK)
                                              │
┌─────────────────┐                  ┌───────┴────────┐
│   categories    │                  │ equipment_items│
│─────────────────│                  │────────────────│
│ id (PK)         │◄─────────────────┤ id (PK)        │
│ name            │  category_id(FK) │ name           │
│ description     │                  │ serial_number  │
│ lending_days    │                  │ category_id(FK)│
└─────────────────┘                  │ quantity       │
                                     │ available_qty  │
                                     │ status         │
                                     │ condition      │
                                     └────────────────┘
```

---

## 🔄 State Management Flow (Frontend)

```
┌─────────────────────────────────────────────────────────────────┐
│                      AuthContext Provider                        │
│                                                                   │
│  State:                                                          │
│  ┌────────────────────────────────────────────────────┐         │
│  │ - user: { id, email, name, role }                  │         │
│  │ - loading: boolean                                 │         │
│  │ - token: string (stored in localStorage)           │         │
│  └────────────────────────────────────────────────────┘         │
│                                                                   │
│  Methods:                                                        │
│  ┌────────────────────────────────────────────────────┐         │
│  │ - login(email, password)                           │         │
│  │ - register(userData)                               │         │
│  │ - logout()                                         │         │
│  │ - isAdmin()                                        │         │
│  │ - isStaffOrAdmin()                                 │         │
│  └────────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Provides context to
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                         App Component                            │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    Login     │  │  Dashboard   │  │  Equipment   │         │
│  │    Page      │  │    Page      │  │    List      │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │     My       │  │   Manage     │  │   Manage     │         │
│  │  Requests    │  │  Requests    │  │  Equipment   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                   │
│  All pages can access:                                          │
│  - user state                                                   │
│  - login/logout methods                                         │
│  - role checking methods                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Deployment Process

```
START
  │
  ├─> Check Prerequisites
  │   ├─> Python 3.12? ──No──> Install Python 3.12
  │   ├─> Node.js 18+? ──No──> Install Node.js
  │   └─> MySQL 8.0+? ──No──> Install MySQL
  │
  ├─> Setup Database
  │   ├─> MySQL running? ──No──> Start MySQL
  │   ├─> Create database
  │   ├─> Create user
  │   └─> Run init.sql
  │
  ├─> Setup Backend
  │   ├─> Create venv (python3.12)
  │   ├─> Install dependencies
  │   ├─> Create .env file
  │   └─> Start server (port 8000)
  │
  ├─> Setup Frontend
  │   ├─> npm install
  │   ├─> Create .env file
  │   └─> Start server (port 3000)
  │
  ├─> Test Authentication
  │   ├─> Login works? ──No──> Check JWT fix
  │   ├─> Token valid? ──No──> Check config
  │   └─> API access? ──No──> Check CORS
  │
  └─> DEPLOYED ✅
      │
      └─> Access at http://localhost:3000
```

---

## 📈 Performance Considerations

```
┌─────────────────────────────────────────────────────────────────┐
│                      OPTIMIZATION POINTS                         │
└─────────────────────────────────────────────────────────────────┘

Database:
  ├─> Indexes on frequently queried columns
  │   ├─> users.email
  │   ├─> equipment_items.serial_number
  │   └─> borrow_requests.status
  │
  ├─> Foreign key constraints for data integrity
  │
  └─> Connection pooling (SQLAlchemy default)

Backend:
  ├─> JWT token caching (localStorage)
  │
  ├─> Async endpoints (FastAPI default)
  │
  └─> Query optimization (eager loading)

Frontend:
  ├─> React.memo for expensive components
  │
  ├─> Lazy loading for routes
  │
  └─> Debouncing for search inputs
```

---

## 🎓 Learning Path

```
Beginner                Intermediate              Advanced
   │                         │                        │
   ├─> HTML/CSS/JS          ├─> React                ├─> System Design
   │                         │                        │
   ├─> Python Basics        ├─> FastAPI              ├─> Microservices
   │                         │                        │
   ├─> SQL Basics           ├─> SQLAlchemy           ├─> Scalability
   │                         │                        │
   └─> Git                  ├─> JWT Auth             ├─> DevOps
                             │                        │
                             ├─> REST APIs            └─> Cloud Deploy
                             │
                             └─> Testing
                                  │
                                  └─> THIS PROJECT ✅
```

---

## 🎯 Success Metrics

```
┌─────────────────────────────────────────────────────────────────┐
│                      PROJECT COMPLETION                          │
└─────────────────────────────────────────────────────────────────┘

Technical Metrics:
  ✅ All 20+ API endpoints working
  ✅ Authentication flow complete
  ✅ Role-based access control
  ✅ Database properly normalized
  ✅ No security vulnerabilities
  ✅ Responsive UI on all devices
  ✅ Error handling implemented
  ✅ Input validation working

Quality Metrics:
  ✅ Code is documented
  ✅ Tests pass (authentication)
  ✅ No console errors
  ✅ Clean code structure
  ✅ Follows best practices
  ✅ Deployment is automated
  ✅ User guide available

User Experience:
  ✅ Login is intuitive
  ✅ Navigation is clear
  ✅ Forms are validated
  ✅ Feedback is immediate
  ✅ Errors are helpful
  ✅ Performance is good
```

---

This workflow diagram provides a visual representation of the entire project creation process, system architecture, and key workflows. Use it alongside the detailed prompts in PROJECT_CREATION_GUIDE.md for complete understanding.
