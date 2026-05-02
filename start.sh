#!/bin/bash

echo "========================================="
echo "School Equipment Lending Portal"
echo "========================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    echo "Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Check if containers are already running
if docker-compose ps | grep -q "Up"; then
    echo "⚠️  Containers are already running"
    echo ""
    read -p "Do you want to restart? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Stopping existing containers..."
        docker-compose down
    else
        echo "Keeping existing containers running"
        echo ""
        echo "Access the application at:"
        echo "  Frontend: http://localhost:3000"
        echo "  Backend:  http://localhost:8000"
        echo "  API Docs: http://localhost:8000/docs"
        echo ""
        echo "Default admin login:"
        echo "  Email: admin@school.edu"
        echo "  Password: Admin123!"
        exit 0
    fi
fi

echo "Starting services..."
echo "This may take a few minutes on first run..."
echo ""

# Start services
docker-compose up --build -d

# Wait for services to be ready
echo ""
echo "Waiting for services to start..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "========================================="
    echo "✅ Application started successfully!"
    echo "========================================="
    echo ""
    echo "Access the application at:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend:  http://localhost:8000"
    echo "  API Docs: http://localhost:8000/docs"
    echo ""
    echo "Default admin login:"
    echo "  Email: admin@school.edu"
    echo "  Password: Admin123!"
    echo ""
    echo "To view logs:"
    echo "  docker-compose logs -f"
    echo ""
    echo "To stop the application:"
    echo "  docker-compose down"
    echo ""
else
    echo ""
    echo "❌ Error: Services failed to start"
    echo "Check logs with: docker-compose logs"
    exit 1
fi
