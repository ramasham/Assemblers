#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🚀 Starting Technician Task Management System            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Clean up any existing processes
echo -e "${YELLOW}🧹 Cleaning up existing processes...${NC}"
pkill -f "node server.js" 2>/dev/null
pkill -f "next dev" 2>/dev/null
sleep 1
lsof -ti:5000 2>/dev/null | xargs kill -9 2>/dev/null
lsof -ti:3000 2>/dev/null | xargs kill -9 2>/dev/null
lsof -ti:3001 2>/dev/null | xargs kill -9 2>/dev/null
sleep 1
rm -rf ~/ass/frontend/.next/dev/lock 2>/dev/null
echo -e "${GREEN}✅ Cleanup complete - Ports 3000 and 5000 are now free${NC}"
echo ""

# Start backend
echo -e "${YELLOW}🔧 Starting Backend Server (Port 5000)...${NC}"
cd ~/ass/backend
nohup node server.js > ~/ass/logs/backend.log 2>&1 &
BACKEND_PID=$!
sleep 3

# Check if backend started successfully
if curl -s http://localhost:5000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend running on http://localhost:5000 (PID: $BACKEND_PID)${NC}"
else
    echo -e "${RED}❌ Backend failed to start. Check logs/backend.log${NC}"
    exit 1
fi
echo ""

# Start frontend
echo -e "${YELLOW}🎨 Starting Frontend Server (Port 3000)...${NC}"
cd ~/ass/frontend
nohup npm run dev > ~/ass/logs/frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 5

# Check if frontend started
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend running on http://localhost:3000 (PID: $FRONTEND_PID)${NC}"
else
    echo -e "${YELLOW}⏳ Frontend starting... (may take a few more seconds)${NC}"
fi
echo ""

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 Application Started Successfully!${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "📱 ${BLUE}Frontend:${NC} http://localhost:3000"
echo -e "🔧 ${BLUE}Backend:${NC}  http://localhost:5000"
echo ""
echo -e "${YELLOW}👤 Test Accounts:${NC}"
echo "   • planner@company.com / planner123"
echo "   • supervisor.production@company.com / super123"
echo "   • mike.davis@company.com / tech123"
echo ""
echo -e "${YELLOW}📋 Useful Commands:${NC}"
echo "   • View backend logs:  tail -f ~/ass/logs/backend.log"
echo "   • View frontend logs: tail -f ~/ass/logs/frontend.log"
echo "   • Stop all:           pkill -f 'node server.js'; pkill -f 'next dev'"
echo ""
echo -e "${GREEN}✨ Open your browser to http://localhost:3000 and login!${NC}"
echo ""
