#!/bin/bash

# Test script to demonstrate DEBUG logging during login flow
# This script will make login requests and show the debug logs

echo "=========================================="
echo "DEBUG LOGGING TEST - Login Flow"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Test 1: Successful Login${NC}"
echo "Email: admin@school.edu"
echo "Password: Admin123!"
echo ""
echo "Making request..."
echo ""

curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.edu","password":"Admin123!"}' \
  -s | jq '.'

echo ""
echo -e "${GREEN}✓ Check your backend terminal for detailed DEBUG logs${NC}"
echo ""
echo "=========================================="
echo ""

sleep 2

echo -e "${YELLOW}Test 2: Failed Login - Wrong Password${NC}"
echo "Email: admin@school.edu"
echo "Password: WrongPassword123"
echo ""
echo "Making request..."
echo ""

curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.edu","password":"WrongPassword123"}' \
  -s | jq '.'

echo ""
echo -e "${RED}✓ Check your backend terminal for password verification failure logs${NC}"
echo ""
echo "=========================================="
echo ""

sleep 2

echo -e "${YELLOW}Test 3: Failed Login - User Not Found${NC}"
echo "Email: nonexistent@school.edu"
echo "Password: SomePassword123"
echo ""
echo "Making request..."
echo ""

curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nonexistent@school.edu","password":"SomePassword123"}' \
  -s | jq '.'

echo ""
echo -e "${RED}✓ Check your backend terminal for user not found logs${NC}"
echo ""
echo "=========================================="
echo ""

sleep 2

echo -e "${YELLOW}Test 4: Token Validation - Dashboard Access${NC}"
echo "First, getting a valid token..."
echo ""

TOKEN=$(curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.edu","password":"Admin123!"}' \
  -s | jq -r '.access_token')

echo "Token obtained: ${TOKEN:0:30}..."
echo ""
echo "Now accessing dashboard with token..."
echo ""

curl -X GET http://localhost:8000/api/dashboard/stats \
  -H "Authorization: Bearer $TOKEN" \
  -s | jq '.'

echo ""
echo -e "${GREEN}✓ Check your backend terminal for token validation flow logs${NC}"
echo ""
echo "=========================================="
echo ""

echo -e "${GREEN}All tests completed!${NC}"
echo ""
echo "Summary of what to look for in backend logs:"
echo "  1. LOGIN FLOW STARTED/COMPLETED messages"
echo "  2. Step-by-step execution (Step 1, Step 2, etc.)"
echo "  3. SUCCESS/FAILED indicators"
echo "  4. User details (ID, email, role)"
echo "  5. Token creation details"
echo "  6. TOKEN VALIDATION FLOW for dashboard access"
echo ""
echo "To view backend logs in real-time:"
echo "  - If running in terminal: Check the terminal where uvicorn is running"
echo "  - If running as background process: Use 'tail -f' on the log file"
echo ""
