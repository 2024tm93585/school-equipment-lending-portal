# Local Deployment Guide (Without Docker)

This guide will help you deploy the School Equipment Lending Portal locally using your existing MySQL database.

## Prerequisites

1. **Python 3.10+** installed
2. **Node.js 18+** and npm installed
3. **MySQL 8.0+** running locally
4. **Git** (optional, for version control)

## Step 1: Database Setup

### 1.1 Create Database and User

Connect to your local MySQL server and run:

```sql
CREATE DATABASE IF NOT EXISTS equipment_portal;
CREATE USER IF NOT EXISTS 'portal_user'@'localhost' IDENTIFIED BY 'portal_password';
GRANT ALL PRIVILEGES ON equipment_portal.* TO 'portal_user'@'localhost';
FLUSH PRIVILEGES;
```

### 1.2 Initialize Database Schema and Data

Run the initialization script:

```bash
mysql -u root -p equipment_portal < backend/init.sql
```

Or if you prefer to use the portal_user:

```bash
mysql -u portal_user -pportal_password equipment_portal < backend/init.sql
```

## Step 2: Backend Setup

### 2.1 Navigate to Backend Directory

```bash
cd backend
```

### 2.2 Create Python Virtual Environment

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

### 2.3 Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2.4 Create Environment Configuration

Create a `.env` file in the `backend` directory:

```bash
cat > .env << 'EOF'
# Database Configuration
DATABASE_URL=mysql+pymysql://portal_user:portal_password@localhost:3306/equipment_portal

# Security
SECRET_KEY=your-secret-key-change-in-production-make-it-long-and-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_HOURS=24

# Environment
ENVIRONMENT=development
EOF
```

**Note:** Update the database credentials if you're using different ones.

### 2.5 Start Backend Server

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The backend API will be available at: **http://localhost:8000**
API Documentation: **http://localhost:8000/docs**

## Step 3: Frontend Setup

### 3.1 Open New Terminal and Navigate to Frontend Directory

```bash
cd frontend
```

### 3.2 Install Node Dependencies

```bash
npm install
```

### 3.3 Create Environment Configuration

Create a `.env` file in the `frontend` directory:

```bash
cat > .env << 'EOF'
REACT_APP_API_URL=http://localhost:8000/api
EOF
```

### 3.4 Start Frontend Development Server

```bash
npm start
```

The frontend will be available at: **http://localhost:3000**

The browser should automatically open. If not, navigate to http://localhost:3000

## Step 4: Login and Test

### Default Admin Credentials

- **Email:** admin@school.edu
- **Password:** Admin123!

### Test the Application

1. Open http://localhost:3000 in your browser
2. Login with the admin credentials
3. Test the features:
   - View equipment list
   - Add/edit equipment (admin only)
   - Create borrow requests
   - Approve/reject requests (admin/staff only)

## Troubleshooting

### Backend Issues

**Problem:** `ModuleNotFoundError: No module named 'app'`
**Solution:** Make sure you're in the `backend` directory and the virtual environment is activated.

**Problem:** Database connection error
**Solution:** 
- Verify MySQL is running: `mysql -u root -p -e "SELECT 1;"`
- Check database credentials in `.env` file
- Ensure the database exists: `mysql -u root -p -e "SHOW DATABASES;"`

**Problem:** Port 8000 already in use
**Solution:** 
- Find and kill the process: `lsof -ti:8000 | xargs kill -9` (macOS/Linux)
- Or use a different port: `uvicorn app.main:app --port 8001`

### Frontend Issues

**Problem:** Port 3000 already in use
**Solution:** The terminal will ask if you want to use a different port. Type 'y' to use port 3001.

**Problem:** `npm install` fails
**Solution:** 
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

**Problem:** Cannot connect to backend
**Solution:**
- Verify backend is running on port 8000
- Check the `.env` file has the correct `REACT_APP_API_URL`
- Clear browser cache and reload

## Stopping the Application

### Stop Backend
Press `Ctrl+C` in the backend terminal

### Stop Frontend
Press `Ctrl+C` in the frontend terminal

### Deactivate Python Virtual Environment
```bash
deactivate
```

## Database Management

### View All Users
```bash
mysql -u portal_user -pportal_password equipment_portal -e "SELECT id, email, name, role FROM users;"
```

### View All Equipment
```bash
mysql -u portal_user -pportal_password equipment_portal -e "SELECT id, name, serial_number, status FROM equipment_items;"
```

### Reset Database
```bash
mysql -u portal_user -pportal_password equipment_portal -e "DROP DATABASE equipment_portal;"
mysql -u root -p -e "CREATE DATABASE equipment_portal;"
mysql -u portal_user -pportal_password equipment_portal < backend/init.sql
```

## Production Deployment Notes

For production deployment:

1. **Change SECRET_KEY** to a strong random string
2. **Use environment variables** for sensitive data
3. **Set ENVIRONMENT=production** in backend `.env`
4. **Build frontend for production**: `npm run build`
5. **Use a production WSGI server** like Gunicorn for backend
6. **Set up HTTPS** with SSL certificates
7. **Configure firewall** and security groups
8. **Set up database backups**
9. **Use a reverse proxy** like Nginx

## Quick Start Script

For convenience, you can use the provided scripts:

**macOS/Linux:**
```bash
./start-local.sh
```

**Windows:**
```bash
start-local.bat
```

These scripts will start both backend and frontend in separate terminal windows.
