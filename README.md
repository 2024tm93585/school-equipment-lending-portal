# School Equipment Lending Portal

A full-stack web application for managing school equipment lending operations.

## Tech Stack

- **Frontend**: React 18
- **Backend**: Python FastAPI
- **Database**: MySQL 8.0
- **Containerization**: Docker & Docker Compose

## Core Features

1. **User Authentication & Roles**
   - Login/signup for students, staff, and admins
   - Role-based access control (student, staff, administrator)
   - Token-based authentication

2. **Equipment Management**
   - Add, edit, delete equipment items (admin only)
   - Track name, category, condition, quantity, availability

3. **Borrowing & Return Requests**
   - Students can request equipment
   - Staff/admin approve or reject requests
   - Mark as returned when complete
   - Prevent overlapping bookings

4. **Dashboard - Equipment Listing & Search**
   - List all available equipment
   - Search/filter by category or availability

5. **Responsive UI**
   - React frontend with clear navigation
   - Works on desktop, tablet, and mobile

## Quick Start with Docker Desktop

### Prerequisites

- Docker Desktop installed and running
- Git (optional, for cloning)

### Setup and Run

1. **Navigate to project directory**:
   ```bash
   cd school-equipment-lending-portal
   ```

2. **Start all services**:
   ```bash
   docker-compose up --build
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

4. **Default Admin Credentials**:
   - Email: admin@school.edu
   - Password: Admin123!

### Stop Services

```bash
docker-compose down
```

### Reset Database

```bash
docker-compose down -v
docker-compose up --build
```

## Project Structure

```
school-equipment-lending-portal/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── models/         # Database models
│   │   ├── routers/        # API endpoints
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── main.py         # Application entry point
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.js
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml     # Docker orchestration
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get token

### Equipment
- `GET /api/equipment` - List all equipment
- `POST /api/equipment` - Create equipment (admin)
- `PUT /api/equipment/{id}` - Update equipment (admin)
- `DELETE /api/equipment/{id}` - Delete equipment (admin)

### Borrow Requests
- `POST /api/borrow-requests` - Create borrow request
- `GET /api/borrow-requests` - List requests
- `PUT /api/borrow-requests/{id}/approve` - Approve request (admin)
- `PUT /api/borrow-requests/{id}/reject` - Reject request (admin)
- `PUT /api/borrow-requests/{id}/return` - Mark as returned (admin)

## Development

### Backend Development

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Development

```bash
cd frontend
npm install
npm start
```

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## License

MIT License
