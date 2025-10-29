#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     🚀 Assemblers Application - Quick Start Script        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Kill any existing processes
echo -e "${YELLOW}🧹 Cleaning up existing processes...${NC}"
pkill -f "node server.js" 2>/dev/null
pkill -f "next dev" 2>/dev/null
sleep 2

# Start Backend
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}📦 Starting Backend Server (Port 5000)...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd ~/ass/backend
nohup node server.js > /tmp/backend.log 2>&1 &
BACKEND_PID=$!

sleep 3

# Check if backend started
if curl -s http://localhost:5000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend server started successfully${NC}"
    echo -e "   URL: http://localhost:5000"
    echo -e "   PID: $BACKEND_PID"
else
    echo -e "${RED}❌ Backend failed to start${NC}"
    echo "Check logs: tail -f /tmp/backend.log"
    exit 1
fi

# Start Frontend
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎨 Starting Frontend Server (Port 3000)...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd ~/ass/frontend
nohup npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!

sleep 5

echo -e "${GREEN}✅ Frontend server starting...${NC}"
echo -e "   Check: http://localhost:3000 or http://localhost:3001"
echo -e "   PID: $FRONTEND_PID"

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Application Started Successfully!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "📍 ${YELLOW}Access your application:${NC}"
echo -e "   Frontend: ${GREEN}http://localhost:3000${NC} or ${GREEN}http://localhost:3001${NC}"
echo -e "   Backend:  ${GREEN}http://localhost:5000${NC}"
echo ""
echo -e "👤 ${YELLOW}Test Login Accounts:${NC}"
echo -e "   Planner:    ${BLUE}planner@company.com${NC} / ${BLUE}planner123${NC}"
echo -e "   Supervisor: ${BLUE}supervisor.production@company.com${NC} / ${BLUE}super123${NC}"
echo -e "   Technician: ${BLUE}mike.davis@company.com${NC} / ${BLUE}tech123${NC}"
echo ""
echo -e "📊 ${YELLOW}View Logs:${NC}"
echo -e "   Backend:  ${BLUE}tail -f /tmp/backend.log${NC}"
echo -e "   Frontend: ${BLUE}tail -f /tmp/frontend.log${NC}"
echo ""
echo -e "🛑 ${YELLOW}Stop Servers:${NC}"
echo -e "   Run: ${BLUE}~/ass/stop-app.sh${NC}"
echo -e "   Or:  ${BLUE}pkill -f 'node server.js' && pkill -f 'next dev'${NC}"
echo ""
echo -e "${GREEN}🎉 Ready to use! Open your browser now!${NC}"
echo ""
