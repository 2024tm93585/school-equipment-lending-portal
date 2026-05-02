@echo off
REM School Equipment Lending Portal - Local Startup Script (Windows)

echo ==========================================
echo School Equipment Lending Portal
echo Local Deployment Startup
echo ==========================================
echo.

echo Checking MySQL connection...
mysql -u root -e "SELECT 1;" >nul 2>&1
if errorlevel 1 (
    echo ERROR: Cannot connect to MySQL.
    echo Please ensure MySQL is running and you have access.
    echo.
    pause
    exit /b 1
)
echo MySQL is running
echo.

echo Checking if equipment_portal database exists...
mysql -u root -se "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME='equipment_portal';" >nul 2>&1
if errorlevel 1 (
    echo Database 'equipment_portal' does not exist.
    echo Creating database and initializing...
    
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS equipment_portal;" 2>nul
    mysql -u root -e "CREATE USER IF NOT EXISTS 'portal_user'@'localhost' IDENTIFIED BY 'portal_password';" 2>nul
    mysql -u root -e "GRANT ALL PRIVILEGES ON equipment_portal.* TO 'portal_user'@'localhost';" 2>nul
    mysql -u root -e "FLUSH PRIVILEGES;" 2>nul
    
    echo Running database initialization script...
    mysql -u root equipment_portal < backend\init.sql 2>nul
    
    echo Database initialized successfully
)
echo Database exists
echo.

echo ==========================================
echo Starting Backend Server...
echo ==========================================
cd backend

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
    echo Virtual environment created
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing Python dependencies...
pip install -q -r requirements.txt

REM Start backend in new window
echo Starting backend on http://localhost:8000
start "Backend Server" cmd /k "uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

cd ..

REM Wait for backend to start
echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo ==========================================
echo Starting Frontend Server...
echo ==========================================
cd frontend

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing Node.js dependencies...
    call npm install
    echo Dependencies installed
)

echo Starting frontend on http://localhost:3000
echo.
echo ==========================================
echo Application Starting!
echo ==========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Default Admin Credentials:
echo   Email:    admin@school.edu
echo   Password: Admin123!
echo.
echo Close the terminal windows to stop the services
echo ==========================================
echo.

REM Start frontend in new window
start "Frontend Server" cmd /k "npm start"

echo.
echo Both servers are starting in separate windows...
echo Close those windows to stop the services.
echo.
pause
