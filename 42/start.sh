#!/bin/bash

echo "Starting Technician Task Management System..."
echo ""

# Start backend
cd /home/rama/42/backend
echo "🚀 Starting Backend Server..."
npm run dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend
cd /home/rama/42/frontend
echo "🌐 Starting Frontend Server..."
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for servers to be ready
sleep 3

echo ""
echo "✅ Servers are starting..."
echo ""
echo "📍 Frontend: http://localhost:5173"
echo "📍 Backend:  http://localhost:5000"
echo ""
echo "Login credentials:"
echo "  Email:    admin@test.com"
echo "  Password: admin123"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Keep script running
wait
