#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "🧪 Testing All User Logins"
echo "=========================================="
echo ""

# Check if server is running
if ! curl -s http://localhost:5000/health > /dev/null 2>&1; then
    echo -e "${RED}❌ Backend server is not running on port 5000${NC}"
    echo ""
    echo "Please start the backend first:"
    echo "  cd ~/ass/backend"
    echo "  node server.js"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Backend server is running${NC}"
echo ""

# Test accounts
declare -a users=(
    "planner@company.com:planner123:Engineer Planner"
    "supervisor.production@company.com:super123:Production Supervisor"
    "supervisor.testing@company.com:super123:Testing Supervisor"
    "supervisor.quality@company.com:super123:Quality Supervisor"
    "mike.davis@company.com:tech123:Technician"
    "sarah.wilson@company.com:tech123:Technician"
)

passed=0
failed=0

# Test each user
for user_data in "${users[@]}"; do
    IFS=':' read -r email password role <<< "$user_data"
    
    response=$(curl -s -X POST http://localhost:5000/api/auth/login \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$email\",\"password\":\"$password\"}")
    
    if echo "$response" | grep -q '"success":true'; then
        echo -e "${GREEN}✅ $role${NC}: $email"
        ((passed++))
    else
        echo -e "${RED}❌ $role${NC}: $email"
        echo "   Error: $response"
        ((failed++))
    fi
done

echo ""
echo "=========================================="
echo -e "📊 Results: ${GREEN}$passed passed${NC}, ${RED}$failed failed${NC}"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}🎉 All logins working perfectly!${NC}"
    echo ""
    echo "You can now:"
    echo "  1. Start frontend: cd ~/ass/frontend && npm run dev"
    echo "  2. Open browser: http://localhost:3000"
    echo "  3. Login with any account above"
    echo ""
else
    echo -e "${YELLOW}⚠️  Some logins failed. Check the errors above.${NC}"
    echo ""
fi
