# 🚀 Quick Start Guide

## Deploy in 3 Steps!

### Step 1: Ensure Docker Desktop is Running

Make sure Docker Desktop is installed and running on your computer.

**Check Docker Status:**
```bash
docker --version
```

If you see a version number, you're good to go! ✅

### Step 2: Navigate to Project Directory

```bash
cd school-equipment-lending-portal
```

### Step 3: Start the Application

**On macOS/Linux:**
```bash
./start.sh
```

**On Windows:**
```bash
start.bat
```

**Or use Docker Compose directly:**
```bash
docker-compose up --build
```

---

## 🎉 That's It!

Wait 2-3 minutes for the first-time setup, then access:

### 🌐 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### 🔐 Default Login

```
Email: admin@school.edu
Password: Admin123!
```

---

## 📋 What You Can Do

### As Admin:
1. ✅ Browse all equipment
2. ✅ Add/Edit/Delete equipment
3. ✅ Approve/Reject borrow requests
4. ✅ Mark equipment as returned
5. ✅ View dashboard statistics

### As Student:
1. ✅ Register new account
2. ✅ Browse available equipment
3. ✅ Search and filter equipment
4. ✅ Submit borrow requests
5. ✅ Track request status

---

## 🛑 Stop the Application

```bash
docker-compose down
```

---

## 🔄 Restart the Application

```bash
docker-compose up
```

(No need for `--build` after the first time)

---

## 🧹 Reset Everything

```bash
docker-compose down -v
docker-compose up --build
```

This will:
- Delete all data
- Recreate the database
- Reload sample data

---

## 📊 Sample Data Included

### Equipment (10 items):
- MacBook Pro 16"
- MacBook Air 13"
- Dell XPS 15
- iPad Pro 12.9"
- iPad Air
- Epson Projector
- BenQ Projector
- Oscilloscope
- Multimeter
- Canon DSLR

### Categories (6):
- Laptops
- Tablets
- Projectors
- Lab Equipment
- Cameras
- Audio Equipment

---

## 🆘 Troubleshooting

### Port Already in Use?

**Change ports in `docker-compose.yml`:**
```yaml
frontend:
  ports:
    - "3001:3000"  # Change 3000 to 3001

backend:
  ports:
    - "8001:8000"  # Change 8000 to 8001
```

### Services Not Starting?

**Check logs:**
```bash
docker-compose logs -f
```

**Restart specific service:**
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Fresh Start:

```bash
docker-compose down -v
docker rmi $(docker images -q school-equipment-lending-portal*)
docker-compose up --build
```

---

## 📚 More Information

- **Full Documentation**: See `README.md`
- **Deployment Guide**: See `DEPLOYMENT.md`
- **Project Summary**: See `PROJECT_SUMMARY.md`

---

## ✨ Features Implemented

✅ User Authentication (JWT)
✅ Role-Based Access Control
✅ Equipment Management (CRUD)
✅ Borrow Request System
✅ Approval Workflow
✅ Search & Filter
✅ Dashboard Analytics
✅ Responsive UI
✅ RESTful API
✅ Docker Deployment

---

## 🎯 Next Steps

1. **Register a Student Account**: http://localhost:3000/register
2. **Browse Equipment**: http://localhost:3000/equipment
3. **Make a Borrow Request**: Click "Request to Borrow"
4. **Login as Admin**: Approve the request
5. **Mark as Returned**: Complete the workflow

---

## 💡 Tips

- Use the API documentation at http://localhost:8000/docs to test endpoints
- Check `docker-compose logs` if something isn't working
- The database persists between restarts (unless you use `-v` flag)
- All passwords are hashed with bcrypt for security
- JWT tokens expire after 24 hours

---

**Enjoy your Equipment Lending Portal! 🎓📚**
