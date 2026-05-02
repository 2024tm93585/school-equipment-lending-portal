#!/bin/bash

# School Equipment Lending Portal - Local Startup Script

echo "=========================================="
echo "School Equipment Lending Portal"
echo "Local Deployment Startup"
echo "=========================================="
echo ""

# Check if MySQL is running
echo "Checking MySQL connection..."
if ! mysql -u root -e "SELECT 1;" > /dev/null 2>&1; then
    echo "❌ ERROR: Cannot connect to MySQL."
    echo "Please ensure MySQL is running and you have access."
    echo ""
    echo "Try: mysql -u root -p -e 'SELECT 1;'"
    exit 1
fi
echo "✅ MySQL is running"
echo ""

# Check if database exists
echo "Checking if equipment_portal database exists..."
DB_EXISTS=$(mysql -u root -se "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME='equipment_portal';" 2>/dev/null)

if [ -z "$DB_EXISTS" ]; then
    echo "⚠️  Database 'equipment_portal' does not exist."
    echo "Creating database and initializing..."
    
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS equipment_portal;" 2>/dev/null
    mysql -u root -e "CREATE USER IF NOT EXISTS 'portal_user'@'localhost' IDENTIFIED BY 'portal_password';" 2>/dev/null
    mysql -u root -e "GRANT ALL PRIVILEGES ON equipment_portal.* TO 'portal_user'@'localhost';" 2>/dev/null
    mysql -u root -e "FLUSH PRIVILEGES;" 2>/dev/null
    
    echo "Running database initialization script..."
    mysql -u root equipment_portal < backend/init.sql 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ Database initialized successfully"
    else
        echo "❌ ERROR: Failed to initialize database"
        exit 1
    fi
else
    echo "✅ Database exists"
fi
echo ""

# Start Backend
echo "=========================================="
echo "Starting Backend Server..."
echo "=========================================="
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3.12 -m venv venv
    echo "✅ Virtual environment created"
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -q -r requirements.txt

# Start backend in background
echo "Starting backend on http://localhost:8000"
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
echo ""

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 3

# Check if backend is running
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend is running"
else
    echo "⚠️  Backend may still be starting..."
fi

cd ..

# Start Frontend
echo ""
echo "=========================================="
echo "Starting Frontend Server..."
echo "=========================================="
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
    echo "✅ Dependencies installed"
fi

# Start frontend
echo "Starting frontend on http://localhost:3000"
echo ""
echo "=========================================="
echo "🚀 Application Starting!"
echo "=========================================="
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Default Admin Credentials:"
echo "  Email:    admin@school.edu"
echo "  Password: Admin123!"
echo ""
echo "Press Ctrl+C to stop all services"
echo "=========================================="
echo ""

# Start frontend (this will block)
npm start

# Cleanup on exit
echo ""
echo "Stopping backend server..."
kill $BACKEND_PID 2>/dev/null
deactivate 2>/dev/null
echo "✅ All services stopped"
