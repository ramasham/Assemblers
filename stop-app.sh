#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${YELLOW}🛑 Stopping Assemblers Application...${NC}"
echo ""

# Stop backend
if pkill -f "node server.js" 2>/dev/null; then
    echo -e "${GREEN}✅ Backend server stopped${NC}"
else
    echo -e "${YELLOW}⚠️  No backend server running${NC}"
fi

# Stop frontend
if pkill -f "next dev" 2>/dev/null; then
    echo -e "${GREEN}✅ Frontend server stopped${NC}"
else
    echo -e "${YELLOW}⚠️  No frontend server running${NC}"
fi

echo ""
echo -e "${GREEN}✅ All processes stopped${NC}"
echo ""
