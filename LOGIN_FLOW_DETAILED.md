# Login Flow - Detailed Component Call Trace

This document traces every component, function, and API call that happens when a user logs in.

---

## 🔄 Complete Login Flow

### Step-by-Step Execution

```
USER ENTERS CREDENTIALS AND CLICKS "LOGIN"
    ↓
┌─────────────────────────────────────────────────────────────────┐
│ 1. FRONTEND - LoginPage.js                                      │
└─────────────────────────────────────────────────────────────────┘
    │
    ├─> handleSubmit(e)
    │   ├─> e.preventDefault()              // Prevent form reload
    │   ├─> setError('')                    // Clear previous errors
    │   ├─> setLoading(true)                // Show loading state
    │   └─> Calls: login(email, password)   // From AuthContext
    │
    ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. FRONTEND - AuthContext.js                                    │
└─────────────────────────────────────────────────────────────────┘
    │
    ├─> login(email, password)
    │   └─> Calls: authAPI.login({ email, password })
    │
    ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. FRONTEND - api.js (services)                                 │
└─────────────────────────────────────────────────────────────────┘
    │
    ├─> authAPI.login(data)
    │   └─> api.post('/auth/login', data)
    │       │
    │       ├─> Axios Request Interceptor
    │       │   └─> Adds headers (Content-Type: application/json)
    │       │
    │       └─> HTTP POST Request
    │           ├─> URL: http://localhost:8000/api/auth/login
    │           ├─> Method: POST
    │           ├─> Headers: { Content-Type: application/json }
    │           └─> Body: { email: "admin@school.edu", password: "Admin123!" }
    │
    ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. BACKEND - main.py (FastAPI)                                  │
└─────────────────────────────────────────────────────────────────┘
    │
    ├─> @app.post("/api/auth/login")
    │   └─> async def login(credentials: UserLogin, db: Session)
    │       │
    │       ├─> Pydantic validates UserLogin schema
    │       │   └─> Checks email and password are present
    │       │
    │       ├─> db.query(User).filter(User.email == credentials.email).first()
    │       │   │
    │       │   └─> Calls: database.py → get_db()
    │       │       │
    │       │       └─> SQLAlchemy Query
    │       │           ├─> SELECT * FROM users WHERE email = 'admin@school.edu'
    │       │           └─> Returns: User object or None
    │       │
    │       ├─> if not user:
    │       │   └─> raise HTTPException(401, "Incorrect email or password")
    │       │
    │       ├─> Calls: verify_password(credentials.password, user.password_hash)
    │       │   │
    │       │   └─> Goes to: auth.py
    │       │
    │       ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. BACKEND - auth.py                                            │
└─────────────────────────────────────────────────────────────────┘
    │
    ├─> verify_password(plain_password, hashed_password)
    │   └─> pwd_context.verify(plain_password, hashed_password)
    │       │
    │       └─> passlib with bcrypt
    │           ├─> Hashes the plain password with same salt
    │           ├─> Compares with stored hash
    │           └─> Returns: True or False
    │
    ├─> if not verify_password(...):
    │   └─> raise HTTPException(401, "Incorrect email or password")
    │
    ├─> if not user.is_active:
    │   └─> raise HTTPException(403, "Account is deactivated")
    │
    ├─> Calls: create_access_token(data={"sub": str(user.id), "role": user.role.value})
    │   │
    │   └─> create_access_token(data: dict)
    │       ├─> to_encode = data.copy()
    │       ├─> expire = datetime.utcnow() + timedelta(hours=24)
    │       ├─> to_encode.update({"exp": expire})
    │       └─> jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    │           │
    │           └─> python-jose (JWT library)
    │               ├─> Creates JWT header: {"alg": "HS256", "typ": "JWT"}
    │               ├─> Creates JWT payload: {"sub": "1", "role": "administrator", "exp": 1777693857}
    │               ├─> Signs with SECRET_KEY
    │               └─> Returns: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    │
    └─> Returns to main.py
    │
    ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. BACKEND - main.py (Response)                                 │
└─────────────────────────────────────────────────────────────────┘
    │
    └─> return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user  // Serialized by Pydantic
        }
        │
        ├─> FastAPI Response
        │   ├─> Status: 200 OK
        │   ├─> Headers: { Content-Type: application/json }
        │   └─> Body: JSON with token and user info
        │
        └─> HTTP Response sent back to frontend
    │
    ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. FRONTEND - api.js (Response Handling)                        │
└─────────────────────────────────────────────────────────────────┘
    │
    ├─> Axios Response Interceptor
    │   └─> Checks status code (200 = success)
    │
    └─> Returns response to AuthContext
    │
    ↓
┌─────────────────────────────────────────────────────────────────┐
│ 8. FRONTEND - AuthContext.js (Success Handler)                  │
└─────────────────────────────────────────────────────────────────┘
    │
    ├─> const { access_token, user: userData } = response.data
    │
    ├─> localStorage.setItem('token', access_token)
    │   └─> Stores JWT token in browser localStorage
    │
    ├─> localStorage.setItem('user', JSON.stringify(userData))
    │   └─> Stores user info in browser localStorage
    │
    ├─> setUser(userData)
    │   └─> Updates React state with user data
    │
    └─> return { success: true }
    │
    ↓
┌─────────────────────────────────────────────────────────────────┐
│ 9. FRONTEND - LoginPage.js (Success Handler)                    │
└─────────────────────────────────────────────────────────────────┘
    │
    ├─> if (result.success)
    │   └─> navigate('/dashboard')
    │       │
    │       └─> React Router
    │           └─> Redirects to Dashboard page
    │
    └─> setLoading(false)
    │
    ↓
┌─────────────────────────────────────────────────────────────────┐
│ 10. FRONTEND - DashboardPage.js (Loads)                         │
└─────────────────────────────────────────────────────────────────┘
    │
    ├─> useEffect(() => { loadStats() }, [])
    │   │
    │   └─> loadStats()
    │       └─> dashboardAPI.getStats()
    │           │
    │           └─> api.get('/dashboard/stats')
    │               │
    │               ├─> Axios Request Interceptor
    │               │   └─> Adds: Authorization: Bearer <token>
    │               │
    │               └─> HTTP GET Request to backend
    │
    └─> Dashboard displays with user data
```

---

## 📋 Detailed Component Breakdown

### Frontend Components Called

#### 1. **LoginPage.js**
```javascript
// Functions called:
- handleSubmit(e)
- setEmail(value)
- setPassword(value)
- setError(message)
- setLoading(boolean)
- login(email, password)  // from useAuth()
- navigate('/dashboard')  // from useNavigate()
```

#### 2. **AuthContext.js**
```javascript
// Functions called:
- login(email, password)
- setUser(userData)
- authAPI.login({ email, password })

// State updated:
- user: { id, email, name, role, is_active }
- loading: false

// localStorage operations:
- localStorage.setItem('token', access_token)
- localStorage.setItem('user', JSON.stringify(userData))
```

#### 3. **api.js (services)**
```javascript
// Functions called:
- authAPI.login(data)
- api.post('/auth/login', data)

// Interceptors triggered:
- Request Interceptor: Adds headers
- Response Interceptor: Handles errors
```

### Backend Components Called

#### 4. **main.py**
```python
# Endpoint:
@app.post("/api/auth/login")
async def login(credentials: UserLogin, db: Session = Depends(get_db))

# Functions called:
- db.query(User).filter(User.email == credentials.email).first()
- verify_password(credentials.password, user.password_hash)
- create_access_token(data={"sub": str(user.id), "role": user.role.value})

# Dependencies:
- get_db() from database.py
- UserLogin schema validation from schemas.py
```

#### 5. **auth.py**
```python
# Functions called:
- verify_password(plain_password, hashed_password)
  └─> pwd_context.verify(plain_password, hashed_password)

- create_access_token(data: dict, expires_delta: Optional[timedelta])
  └─> jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

# External libraries:
- passlib.context.CryptContext (bcrypt)
- jose.jwt (JWT encoding)
```

#### 6. **database.py**
```python
# Functions called:
- get_db()
  └─> Yields SQLAlchemy Session
  └─> Manages database connection lifecycle
```

#### 7. **models.py**
```python
# Classes used:
- User (SQLAlchemy model)
  └─> Represents users table
  └─> Includes relationships and enums

# Enums:
- UserRole.ADMINISTRATOR
```

#### 8. **config.py**
```python
# Settings accessed:
- settings.SECRET_KEY
- settings.ALGORITHM
- settings.ACCESS_TOKEN_EXPIRE_HOURS
```

---

## 🔍 Database Queries Executed

### Query 1: Find User by Email
```sql
SELECT 
    users.id,
    users.email,
    users.password_hash,
    users.name,
    users.phone,
    users.role,
    users.is_active,
    users.created_at,
    users.updated_at
FROM users
WHERE users.email = 'admin@school.edu'
LIMIT 1;
```

**Result**: Returns User object with all fields

---

## 🔐 Security Operations

### 1. Password Verification
```
Input: "Admin123!" (plain text)
Stored: "$2b$12$PmPu2pq8DUKOKUO4haDYUeP7o345DY8/3XyH1ioc.o98h.t6kv18i"

Process:
1. Extract salt from stored hash
2. Hash input password with same salt
3. Compare hashes
4. Return True if match
```

### 2. JWT Token Creation
```
Payload:
{
  "sub": "1",                    // User ID as string
  "role": "administrator",       // User role
  "exp": 1777693857             // Expiration timestamp
}

Signing:
1. Create header: {"alg": "HS256", "typ": "JWT"}
2. Base64 encode header
3. Base64 encode payload
4. Sign with HMAC-SHA256 using SECRET_KEY
5. Concatenate: header.payload.signature

Result:
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicm9sZSI6ImFkbWluaXN0cmF0b3IiLCJleHAiOjE3Nzc2OTM4NTd9.uB-6mj6A-pjfdqZvm5Z3b-Lpifta0Q7Ux2F_pJ4m_OI"
```

---

## 📦 Data Flow

### Request Data
```json
// From Frontend to Backend
{
  "email": "admin@school.edu",
  "password": "Admin123!"
}
```

### Response Data
```json
// From Backend to Frontend
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "admin@school.edu",
    "name": "System Administrator",
    "phone": null,
    "role": "administrator",
    "is_active": true,
    "created_at": "2026-05-01T08:18:54"
  }
}
```

### Stored in Browser
```javascript
// localStorage
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": "{\"id\":1,\"email\":\"admin@school.edu\",\"name\":\"System Administrator\",\"role\":\"administrator\"}"
}
```

---

## 🌐 HTTP Requests

### Request 1: Login
```http
POST http://localhost:8000/api/auth/login HTTP/1.1
Host: localhost:8000
Content-Type: application/json
Content-Length: 58

{
  "email": "admin@school.edu",
  "password": "Admin123!"
}
```

### Response 1: Login Success
```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 349

{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": { ... }
}
```

### Request 2: Dashboard Stats (After Login)
```http
GET http://localhost:8000/api/dashboard/stats HTTP/1.1
Host: localhost:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ⚡ React State Changes

### Before Login
```javascript
// AuthContext state
{
  user: null,
  loading: false
}

// LoginPage state
{
  email: "",
  password: "",
  error: "",
  loading: false
}
```

### During Login
```javascript
// LoginPage state
{
  email: "admin@school.edu",
  password: "Admin123!",
  error: "",
  loading: true  // ← Changed
}
```

### After Login Success
```javascript
// AuthContext state
{
  user: {
    id: 1,
    email: "admin@school.edu",
    name: "System Administrator",
    role: "administrator",
    is_active: true
  },
  loading: false
}

// LoginPage state (before navigation)
{
  email: "admin@school.edu",
  password: "Admin123!",
  error: "",
  loading: false  // ← Changed back
}

// Then navigates to /dashboard
```

---

## 🔄 Complete Call Stack

```
1. User clicks "Login" button
   └─> LoginPage.handleSubmit()
       └─> AuthContext.login()
           └─> api.js: authAPI.login()
               └─> axios.post()
                   └─> HTTP POST to backend
                       └─> FastAPI: @app.post("/api/auth/login")
                           └─> main.py: login()
                               ├─> database.py: get_db()
                               ├─> SQLAlchemy: db.query(User)
                               │   └─> MySQL: SELECT * FROM users
                               ├─> auth.py: verify_password()
                               │   └─> passlib: pwd_context.verify()
                               │       └─> bcrypt: compare hashes
                               └─> auth.py: create_access_token()
                                   └─> jose.jwt: jwt.encode()
                                       └─> HMAC-SHA256 signing
                           └─> Return JSON response
                       └─> HTTP 200 OK
                   └─> axios response
               └─> api.js returns response
           └─> AuthContext processes response
               ├─> localStorage.setItem('token')
               ├─> localStorage.setItem('user')
               └─> setUser(userData)
       └─> LoginPage receives success
           └─> navigate('/dashboard')
               └─> React Router navigation
                   └─> DashboardPage loads
                       └─> useEffect: loadStats()
                           └─> api.get('/dashboard/stats')
                               └─> Includes Authorization header
```

---

## 📊 Timing Breakdown (Approximate)

```
Total Login Time: ~200-500ms

Breakdown:
├─ Frontend form submission: ~1ms
├─ API call setup: ~5ms
├─ Network request: ~10-50ms
├─ Backend processing:
│  ├─ Database query: ~5-20ms
│  ├─ Password verification: ~50-100ms (bcrypt is intentionally slow)
│  ├─ JWT creation: ~5-10ms
│  └─ Response serialization: ~5ms
├─ Network response: ~10-50ms
├─ Frontend processing:
│  ├─ localStorage operations: ~5ms
│  ├─ State updates: ~10ms
│  └─ Navigation: ~20-50ms
└─ Dashboard load: ~50-100ms
```

---

## 🎯 Key Takeaways

### Components Involved
- **Frontend**: 3 main files (LoginPage, AuthContext, api.js)
- **Backend**: 5 main files (main.py, auth.py, database.py, models.py, config.py)
- **External Libraries**: 6 (React Router, Axios, FastAPI, SQLAlchemy, passlib, python-jose)
- **Database**: 1 query (SELECT user by email)

### Critical Operations
1. **Password Verification**: bcrypt comparison (~50-100ms)
2. **JWT Creation**: HMAC-SHA256 signing (~5-10ms)
3. **State Management**: React Context + localStorage
4. **Navigation**: React Router redirect

### Security Measures
1. Password hashing with bcrypt
2. JWT token with expiration
3. HTTPS recommended for production
4. Token stored in localStorage (consider httpOnly cookies for production)

---

This document provides a complete trace of every component, function, and operation that occurs during the login process.
