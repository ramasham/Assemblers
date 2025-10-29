#!/bin/bash

echo "🔍 Pre-Login Checklist"
echo "====================="
echo ""

# Check 1: Firebase credentials
if [ -f "/home/rsham/ass/backend/config/serviceAccountKey.json" ]; then
    echo "✅ Firebase credentials file exists"
else
    echo "❌ Firebase credentials file NOT found"
    echo "   Please download from Firebase Console and save as:"
    echo "   /home/rsham/ass/backend/config/serviceAccountKey.json"
    exit 1
fi

# Check 2: Backend running
if lsof -i :3001 2>/dev/null | grep -q LISTEN; then
    echo "✅ Backend server is running on port 3001"
else
    echo "❌ Backend server is NOT running"
    echo "   Start it with: cd /home/rsham/ass/backend && npm run dev"
    exit 1
fi

# Check 3: Frontend running
if lsof -i :3000 2>/dev/null | grep -q LISTEN; then
    echo "✅ Frontend server is running on port 3000"
else
    echo "❌ Frontend server is NOT running"
    echo "   Start it with: cd /home/rsham/ass/frontend && pnpm run dev"
    exit 1
fi

# Check 4: Backend API responding
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend API is responding"
else
    echo "⚠️  Backend API is not responding (but server is running)"
fi

echo ""
echo "🎉 All checks passed!"
echo ""
echo "🔑 Try logging in with:"
echo "   Email: planner@company.com"
echo "   Password: planner123"
echo ""
echo "🌐 Open: http://localhost:3000"
