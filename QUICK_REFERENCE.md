# Quick Reference Guide

## 🚀 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔐 Default Credentials

- **Email**: admin@school.edu
- **Password**: Admin123!

## ⚡ Quick Start

### One-Command Start (Recommended)

**macOS/Linux:**
```bash
cd school-equipment-lending-portal
./start-local.sh
```

**Windows:**
```bash
cd school-equipment-lending-portal
start-local.bat
```

### Manual Start

**Terminal 1 - Backend:**
```bash
cd school-equipment-lending-portal/backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 - Frontend:**
```bash
cd school-equipment-lending-portal/frontend
npm start
```

## 🛑 Stop Services

- Press `Ctrl+C` in each terminal window
- Or close the terminal windows

## 📊 Database Commands

### View Users
```bash
mysql -u portal_user -pportal_password equipment_portal -e "SELECT id, email, name, role FROM users;"
```

### View Equipment
```bash
mysql -u portal_user -pportal_password equipment_portal -e "SELECT id, name, status, available_quantity FROM equipment_items;"
```

### View Borrow Requests
```bash
mysql -u portal_user -pportal_password equipment_portal -e "SELECT id, user_id, equipment_id, status, start_date, end_date FROM borrow_requests;"
```

### Reset Database
```bash
mysql -u root -e "DROP DATABASE equipment_portal; CREATE DATABASE equipment_portal;"
mysql -u root equipment_portal < backend/init.sql
```

## 🔧 Common Issues

### Backend won't start
- Check if port 8000 is in use: `lsof -i :8000`
- Verify MySQL is running: `mysql -u root -e "SELECT 1;"`
- Check database credentials in `backend/.env`

### Frontend won't start
- Check if port 3000 is in use
- Delete `node_modules` and run `npm install` again
- Clear npm cache: `npm cache clean --force`

### Login not working
- Clear browser cache and cookies
- Check browser console (F12) for errors
- Verify backend is running: `curl http://localhost:8000/health`

### Database connection error
- Ensure MySQL is running
- Verify database exists: `mysql -u root -e "SHOW DATABASES;"`
- Check credentials in `backend/.env`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Equipment
- `GET /api/equipment` - List all equipment
- `GET /api/equipment/{id}` - Get equipment details
- `POST /api/equipment` - Create equipment (admin only)
- `PUT /api/equipment/{id}` - Update equipment (admin only)
- `DELETE /api/equipment/{id}` - Delete equipment (admin only)

### Borrow Requests
- `GET /api/borrow-requests` - List requests
- `GET /api/borrow-requests/my-requests` - My requests
- `POST /api/borrow-requests` - Create request
- `PUT /api/borrow-requests/{id}/approve` - Approve (staff/admin)
- `PUT /api/borrow-requests/{id}/reject` - Reject (staff/admin)
- `PUT /api/borrow-requests/{id}/return` - Mark returned (staff/admin)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🎯 User Roles

### Student
- View equipment
- Create borrow requests
- View own requests

### Staff
- All student permissions
- Approve/reject requests
- Mark equipment as returned
- View all requests

### Administrator
- All staff permissions
- Add/edit/delete equipment
- Manage users
- Full system access

## 📚 Documentation

- **Full Setup Guide**: `LOCAL_DEPLOYMENT.md`
- **Database Setup**: `SETUP_DATABASE.md`
- **Project Summary**: `PROJECT_SUMMARY.md`
- **Quick Start**: `QUICK_START.md`

## 🔒 Security Notes

⚠️ **For Development Only**

The current setup is for development purposes. For production:

1. Change `SECRET_KEY` in `backend/.env`
2. Use strong database passwords
3. Enable HTTPS
4. Set up proper authentication
5. Configure firewall rules
6. Regular database backups
7. Use environment variables for secrets

## 💡 Tips

- Use the API documentation at http://localhost:8000/docs to test endpoints
- Check browser console (F12) for frontend errors
- Check terminal output for backend errors
- Use `mysql` command line to inspect database directly
- Backend auto-reloads on code changes (--reload flag)
- Frontend auto-reloads on code changes (React dev server)

## 📞 Need Help?

1. Check the error message in terminal
2. Look at browser console (F12)
3. Review the documentation files
4. Check database connection
5. Verify all services are running
