#!/bin/bash

echo "=========================================="
echo "Authentication Test Script"
echo "=========================================="
echo ""

# Test 1: Login with admin credentials
echo "Test 1: Admin Login"
echo "-------------------"
RESPONSE=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.edu","password":"Admin123!"}')

TOKEN=$(echo $RESPONSE | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('access_token', ''))" 2>/dev/null)

if [ -n "$TOKEN" ]; then
    echo "✅ Login successful"
    echo "Token: ${TOKEN:0:50}..."
else
    echo "❌ Login failed"
    echo "Response: $RESPONSE"
    exit 1
fi
echo ""

# Test 2: Access dashboard with token
echo "Test 2: Dashboard Access"
echo "------------------------"
DASHBOARD=$(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/dashboard/stats)

if echo "$DASHBOARD" | grep -q "total_equipment"; then
    echo "✅ Dashboard access successful"
    echo "$DASHBOARD" | python3 -c "import sys, json; print(json.dumps(json.load(sys.stdin), indent=2))"
else
    echo "❌ Dashboard access failed"
    echo "Response: $DASHBOARD"
    exit 1
fi
echo ""

# Test 3: Get current user info
echo "Test 3: Get Current User"
echo "------------------------"
USER_INFO=$(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/auth/me)

if echo "$USER_INFO" | grep -q "admin@school.edu"; then
    echo "✅ User info retrieved successfully"
    echo "$USER_INFO" | python3 -c "import sys, json; data=json.load(sys.stdin); print(f\"Name: {data['name']}\"); print(f\"Email: {data['email']}\"); print(f\"Role: {data['role']}\")"
else
    echo "❌ Failed to get user info"
    echo "Response: $USER_INFO"
    exit 1
fi
echo ""

# Test 4: List equipment
echo "Test 4: List Equipment"
echo "----------------------"
EQUIPMENT=$(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/equipment)

EQUIPMENT_COUNT=$(echo "$EQUIPMENT" | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)

if [ "$EQUIPMENT_COUNT" -gt 0 ]; then
    echo "✅ Equipment list retrieved successfully"
    echo "Total equipment items: $EQUIPMENT_COUNT"
else
    echo "❌ Failed to get equipment list"
    exit 1
fi
echo ""

# Test 5: List categories
echo "Test 5: List Categories"
echo "-----------------------"
CATEGORIES=$(curl -s http://localhost:8000/api/categories)

CATEGORY_COUNT=$(echo "$CATEGORIES" | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)

if [ "$CATEGORY_COUNT" -gt 0 ]; then
    echo "✅ Categories retrieved successfully"
    echo "Total categories: $CATEGORY_COUNT"
else
    echo "❌ Failed to get categories"
    exit 1
fi
echo ""

echo "=========================================="
echo "✅ All tests passed!"
echo "=========================================="
echo ""
echo "Your application is working correctly!"
echo ""
echo "Access the application at: http://localhost:3000"
echo "Login with: admin@school.edu / Admin123!"
echo ""
