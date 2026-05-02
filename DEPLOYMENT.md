# Deployment Guide - School Equipment Lending Portal

## Quick Start with Docker Desktop

### Prerequisites

1. **Docker Desktop** installed and running
   - Download from: https://www.docker.com/products/docker-desktop
   - Ensure Docker Desktop is running before proceeding

2. **System Requirements**
   - 4GB RAM minimum (8GB recommended)
   - 10GB free disk space
   - macOS, Windows, or Linux

### Step-by-Step Deployment

#### 1. Navigate to Project Directory

```bash
cd school-equipment-lending-portal
```

#### 2. Start All Services

```bash
docker-compose up --build
```

This command will:
- Build the backend Docker image (Python FastAPI)
- Build the frontend Docker image (React)
- Pull MySQL 8.0 image
- Create and start all containers
- Initialize the database with sample data

**Expected Output:**
```
Creating network "school-equipment-lending-portal_equipment-network" with driver "bridge"
Creating volume "school-equipment-lending-portal_mysql_data" with default driver
Building backend...
Building frontend...
Creating equipment-portal-db ... done
Creating equipment-portal-backend ... done
Creating equipment-portal-frontend ... done
```

#### 3. Wait for Services to Start

The first time you run this, it will take 3-5 minutes to:
- Download base images
- Install dependencies
- Initialize the database
- Start all services

**Watch for these messages:**
- MySQL: `ready for connections`
- Backend: `Application startup complete`
- Frontend: `webpack compiled successfully`

#### 4. Access the Application

Once all services are running:

- **Frontend (React App)**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

#### 5. Login with Default Admin Account

```
Email: admin@school.edu
Password: Admin123!
```

### Stopping the Application

To stop all services:

```bash
docker-compose down
```

To stop and remove all data (including database):

```bash
docker-compose down -v
```

### Restarting the Application

If services are already built, simply run:

```bash
docker-compose up
```

(No need for `--build` unless you've made code changes)

## Troubleshooting

### Port Already in Use

If you see errors like "port is already allocated":

**Solution 1: Stop conflicting services**
```bash
# Check what's using the port
lsof -i :3000  # For frontend
lsof -i :8000  # For backend
lsof -i :3306  # For MySQL

# Kill the process
kill -9 <PID>
```

**Solution 2: Change ports in docker-compose.yml**
```yaml
services:
  frontend:
    ports:
      - "3001:3000"  # Change 3000 to 3001
  backend:
    ports:
      - "8001:8000"  # Change 8000 to 8001
```

### MySQL Container Fails to Start

**Error:** `MySQL container keeps restarting`

**Solution:**
```bash
# Remove old MySQL data
docker-compose down -v

# Restart
docker-compose up --build
```

### Backend Can't Connect to Database

**Error:** `Can't connect to MySQL server`

**Solution:** Wait longer for MySQL to fully initialize (can take 30-60 seconds on first run)

```bash
# Check MySQL logs
docker logs equipment-portal-db

# Wait for: "ready for connections"
```

### Frontend Shows "Cannot connect to backend"

**Solution:**
1. Check backend is running:
   ```bash
   curl http://localhost:8000/health
   ```

2. Check backend logs:
   ```bash
   docker logs equipment-portal-backend
   ```

3. Restart backend:
   ```bash
   docker-compose restart backend
   ```

### Permission Denied Errors

**On macOS/Linux:**
```bash
# Give execute permissions
chmod +x backend/init.sql
```

### Clear Everything and Start Fresh

```bash
# Stop all containers
docker-compose down -v

# Remove all images
docker rmi $(docker images -q school-equipment-lending-portal*)

# Rebuild and start
docker-compose up --build
```

## Viewing Logs

### All Services
```bash
docker-compose logs -f
```

### Specific Service
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Last 100 Lines
```bash
docker-compose logs --tail=100 backend
```

## Database Access

### Connect to MySQL

```bash
docker exec -it equipment-portal-db mysql -u portal_user -pportal_password equipment_portal
```

### View Tables
```sql
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM equipment_items;
SELECT * FROM borrow_requests;
```

### Reset Database
```bash
docker-compose down -v
docker-compose up --build
```

## Development Mode

### Backend Development (with hot reload)

The backend is already configured for hot reload in docker-compose.yml:
- Code changes in `backend/app/` are automatically detected
- No need to restart the container

### Frontend Development (with hot reload)

The frontend is also configured for hot reload:
- Code changes in `frontend/src/` trigger automatic rebuild
- Browser will refresh automatically

### Making Code Changes

1. Edit files in `backend/app/` or `frontend/src/`
2. Save the file
3. Changes will be reflected automatically (no restart needed)

## Production Deployment

For production deployment, see:
- `k8s/` directory for Kubernetes manifests
- `.github/workflows/` for CI/CD pipeline
- Backend and Frontend Dockerfiles are production-ready

## System Architecture

```
┌─────────────────┐
│   Web Browser   │
│  localhost:3000 │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  React Frontend │
│   (Container)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  FastAPI Backend│
│   (Container)   │
│  localhost:8000 │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  MySQL Database │
│   (Container)   │
│  localhost:3306 │
└─────────────────┘
```

## Default Sample Data

The system comes pre-loaded with:

### Users
- **Admin**: admin@school.edu / Admin123!

### Categories
- Laptops (7 day lending period)
- Tablets (7 day lending period)
- Projectors (3 day lending period)
- Lab Equipment (14 day lending period)
- Cameras (5 day lending period)
- Audio Equipment (3 day lending period)

### Equipment (10 items)
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

## Next Steps

1. **Create Additional Users**: Register as student/staff at http://localhost:3000/register
2. **Browse Equipment**: View available equipment at http://localhost:3000/equipment
3. **Make Borrow Requests**: Students can request equipment
4. **Approve Requests**: Admin/Staff can approve/reject requests
5. **Manage Equipment**: Admin can add/edit/delete equipment

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Docker logs: `docker-compose logs`
3. Ensure Docker Desktop is running and has sufficient resources
4. Try a fresh start: `docker-compose down -v && docker-compose up --build`
