@echo off
echo =========================================
echo School Equipment Lending Portal
echo =========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo Docker is running
echo.

echo Starting services...
echo This may take a few minutes on first run...
echo.

REM Start services
docker-compose up --build -d

REM Wait for services to be ready
echo.
echo Waiting for services to start...
timeout /t 10 /nobreak >nul

echo.
echo =========================================
echo Application started successfully!
echo =========================================
echo.
echo Access the application at:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo.
echo Default admin login:
echo   Email: admin@school.edu
echo   Password: Admin123!
echo.
echo To view logs:
echo   docker-compose logs -f
echo.
echo To stop the application:
echo   docker-compose down
echo.
pause
