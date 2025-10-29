#!/bin/bash

# Simple script to run both servers

echo "🚀 Starting Technician Task Management System..."
echo ""

# Kill existing processes more thoroughly
echo "🔪 Cleaning up existing processes..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "node server" 2>/dev/null || true
pkill -f "nodemon" 2>/dev/null || true
sleep 1
lsof -ti :3001 | xargs kill -9 2>/dev/null || true
lsof -ti :3000 | xargs kill -9 2>/dev/null || true
sleep 1
echo "✅ Ports cleared"
echo ""

# Start backend
echo "🔧 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend
sleep 3

# Check if backend started
if lsof -i :3001 >/dev/null 2>&1; then
    echo "✅ Backend is running on http://localhost:3001"
else
    echo "❌ Backend failed to start"
    exit 1
fi

echo ""

# Start frontend
echo "🎨 Starting frontend server..."
cd frontend
pnpm run dev &
FRONTEND_PID=$!
cd ..

# Wait for frontend
sleep 5

# Check if frontend started
if lsof -i :3000 >/dev/null 2>&1; then
    echo "✅ Frontend is running on http://localhost:3000"
else
    echo "❌ Frontend failed to start"
    exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ Application is running!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "🌐 Open your browser to: http://localhost:3000"
echo ""
echo "🔑 Login with:"
echo "   Email:    planner@company.com"
echo "   Password: planner123"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Press Ctrl+C to stop both servers..."
echo ""

# Wait for user interrupt
wait
